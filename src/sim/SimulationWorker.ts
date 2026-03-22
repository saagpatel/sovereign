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
import { runSimulation, SCALAR_VARIABLES } from "./propagation";
import type { WorldState } from "./types";

function buildSimResult(config: SimConfig, baseline: WorldState): SimResult {
	const start = performance.now();
	const { snapshots, events } = runSimulation(
		baseline,
		config.lever,
		WEIGHT_MATRIX,
		config.horizon,
	);
	const runDurationMs = performance.now() - start;

	const confidenceBands: Record<string, CountryBand> = {};
	const countryIds = Object.keys(baseline);

	for (const iso of countryIds) {
		const monthly: MonthlyBand[] = snapshots.map((snap) => {
			const variables = {} as Record<ScalarVariable, VariableBand>;
			for (const v of SCALAR_VARIABLES) {
				const absolute = (baseline[iso][v] as number) + snap.deltas[iso][v];
				variables[v] = { p10: absolute, p50: absolute, p90: absolute };
			}
			return { month: snap.month, variables };
		});
		confidenceBands[iso] = { countryId: iso, monthly };
	}

	const causalChain = events
		.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
		.slice(0, 10);

	return { config, confidenceBands, causalChain, runDurationMs };
}

const workerApi = {
	runSim(config: SimConfig, baseline: WorldState): SimResult {
		return buildSimResult(config, baseline);
	},
};

export type SimulationWorkerApi = typeof workerApi;

Comlink.expose(workerApi);
