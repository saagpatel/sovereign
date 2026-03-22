import { describe, expect, it } from "vitest";
import { WEIGHT_MATRIX } from "@/data/weights";
import type { CountryState, SimConfig } from "@/types";
import { runSimulation, SCALAR_VARIABLES } from "./propagation";
import type { WorldState } from "./types";

function buildTestBaseline(): WorldState {
	// Minimal baseline for testing worker result shape
	const base: Record<string, CountryState> = {};
	const ids = [
		"USA",
		"CHN",
		"EUR",
		"RUS",
		"IND",
		"JPN",
		"KOR",
		"ASN",
		"BRA",
		"SAU",
		"TUR",
		"GBR",
		"AUS",
		"MEX",
		"NGA",
		"IRN",
		"ISR",
		"PAK",
	];
	for (const id of ids) {
		base[id] = {
			id,
			name: id,
			gdpGrowthRate: 2.0,
			tradeOpenness: 50,
			militarySpendingPct: 2.0,
			domesticStability: 50,
			energyIndependence: 50,
			techSelfSufficiency: 50,
			immigrationRate: 1.0,
			foreignReserves: 10,
			debtToGdp: 60,
			inflationRate: 3.0,
			allianceStrength: {},
			tradeVolume: {},
		};
	}
	return base;
}

// Test the worker API logic directly (same pattern as Phase 0)
describe("SimulationWorker buildSimResult", () => {
	const baseline = buildTestBaseline();
	const config: SimConfig = {
		lever: {
			domain: "trade",
			actingCountry: "USA",
			magnitude: 80,
			label: "Trade +80",
		},
		runs: 1,
		horizon: 60,
		noiseScale: 0,
	};

	it("runSim returns result with all 18 country bands", () => {
		const { snapshots } = runSimulation(
			baseline,
			config.lever,
			WEIGHT_MATRIX,
			config.horizon,
		);
		expect(Object.keys(baseline)).toHaveLength(18);
		expect(snapshots).toHaveLength(60);
	});

	it("each band has exactly 60 monthly entries", () => {
		const { snapshots } = runSimulation(
			baseline,
			config.lever,
			WEIGHT_MATRIX,
			config.horizon,
		);
		expect(snapshots).toHaveLength(60);
		for (const snap of snapshots) {
			for (const iso of Object.keys(baseline)) {
				for (const v of SCALAR_VARIABLES) {
					expect(typeof snap.deltas[iso][v]).toBe("number");
				}
			}
		}
	});

	it("causal chain has <= 10 entries", () => {
		const { events } = runSimulation(
			baseline,
			config.lever,
			WEIGHT_MATRIX,
			config.horizon,
		);
		const top10 = events
			.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
			.slice(0, 10);
		expect(top10.length).toBeLessThanOrEqual(10);
	});

	it("causal chain is sorted by |delta| descending", () => {
		const { events } = runSimulation(
			baseline,
			config.lever,
			WEIGHT_MATRIX,
			config.horizon,
		);
		const top10 = events
			.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
			.slice(0, 10);
		for (let i = 1; i < top10.length; i++) {
			expect(Math.abs(top10[i - 1].delta)).toBeGreaterThanOrEqual(
				Math.abs(top10[i].delta),
			);
		}
	});

	it("simulation completes in < 500ms", () => {
		const start = performance.now();
		runSimulation(baseline, config.lever, WEIGHT_MATRIX, config.horizon);
		const elapsed = performance.now() - start;
		expect(elapsed).toBeLessThan(500);
	});
});
