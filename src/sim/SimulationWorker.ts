import * as Comlink from "comlink";
import { WEIGHT_MATRIX } from "@/data/weights";
import type {
	CountryBand,
	MonthlyBand,
	ScalarVariable,
	SimConfig,
	SimResult,
	VariableBand,
} from "@/types";
import { createLCG } from "./noise";
import { runSimulation, SCALAR_VARIABLES } from "./propagation";
import type { WorldState } from "./types";

type ProgressCallback = (event: { runsCompleted: number }) => void;

function aggregateBands(
	allSnapshots: Array<
		Array<{
			month: number;
			deltas: Record<string, Record<ScalarVariable, number>>;
		}>
	>,
	baseline: WorldState,
	countryIds: string[],
): Record<string, CountryBand> {
	const numRuns = allSnapshots.length;
	const horizon = allSnapshots[0].length;
	const confidenceBands: Record<string, CountryBand> = {};

	for (const iso of countryIds) {
		const monthly: MonthlyBand[] = [];

		for (let m = 0; m < horizon; m++) {
			const variables = {} as Record<ScalarVariable, VariableBand>;

			for (const v of SCALAR_VARIABLES) {
				// Collect this variable's absolute value across all runs at this month
				const values: number[] = [];
				for (let r = 0; r < numRuns; r++) {
					const delta = allSnapshots[r][m].deltas[iso][v];
					values.push((baseline[iso][v] as number) + delta);
				}
				values.sort((a, b) => a - b);

				// p10 = index 5, p50 = index 25, p90 = index 45 (for 50 runs)
				const p10Idx = Math.floor(numRuns * 0.1);
				const p50Idx = Math.floor(numRuns * 0.5);
				const p90Idx = Math.floor(numRuns * 0.9);

				variables[v] = {
					p10: values[p10Idx],
					p50: values[p50Idx],
					p90: values[p90Idx],
				};
			}

			monthly.push({ month: m, variables });
		}

		confidenceBands[iso] = { countryId: iso, monthly };
	}

	return confidenceBands;
}

function buildSimResult(
	config: SimConfig,
	baseline: WorldState,
	onProgress?: ProgressCallback,
): SimResult {
	const start = performance.now();
	const countryIds = Object.keys(baseline);
	const numRuns = config.runs;
	const allSnapshots: Array<
		Array<{
			month: number;
			deltas: Record<string, Record<ScalarVariable, number>>;
		}>
	> = [];
	const allEvents: Array<{
		delta: number;
		month: number;
		sourceCountry: string;
		targetCountry: string;
		variable: ScalarVariable;
		mechanism: string;
	}> = [];

	for (let run = 0; run < numRuns; run++) {
		const rng = numRuns > 1 ? createLCG(run * 7919 + 42) : undefined;
		const noiseScale = numRuns > 1 ? config.noiseScale : 0;

		const { snapshots, events } = runSimulation(
			baseline,
			config.lever,
			WEIGHT_MATRIX,
			config.horizon,
			noiseScale,
			rng,
		);

		allSnapshots.push(snapshots);
		allEvents.push(...events);

		// Post progress every 10 runs
		if (onProgress && (run + 1) % 10 === 0) {
			onProgress({ runsCompleted: run + 1 });
		}
	}

	const runDurationMs = performance.now() - start;

	const confidenceBands = aggregateBands(allSnapshots, baseline, countryIds);

	// Top 10 causal events by |delta|
	const causalChain = allEvents
		.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
		.slice(0, 10);

	return { config, confidenceBands, causalChain, runDurationMs };
}

const workerApi = {
	runSim(
		config: SimConfig,
		baseline: WorldState,
		onProgress?: ProgressCallback,
	): SimResult {
		return buildSimResult(config, baseline, onProgress);
	},
};

export type SimulationWorkerApi = typeof workerApi;

Comlink.expose(workerApi);
