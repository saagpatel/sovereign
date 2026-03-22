import { describe, expect, it } from "vitest";
import type { WeightMatrix } from "@/types";
import {
	CAUSAL_EVENT_THRESHOLD,
	clampVariable,
	createEmptyDeltas,
	DECAY_FACTOR,
	getShockMapping,
	propagateMonth,
	runSimulation,
	SCALAR_VARIABLES,
} from "./propagation";
import type { WorldState } from "./types";

// ---------------------------------------------------------------------------
// Test fixtures
// ---------------------------------------------------------------------------

const testBaseline: WorldState = {
	USA: {
		id: "USA",
		name: "United States",
		gdpGrowthRate: 2.5,
		tradeOpenness: 56,
		militarySpendingPct: 3.4,
		domesticStability: 58,
		energyIndependence: 88,
		techSelfSufficiency: 92,
		immigrationRate: 4.0,
		foreignReserves: 3.2,
		debtToGdp: 123,
		inflationRate: 4.1,
		allianceStrength: {},
		tradeVolume: {},
	},
	CHN: {
		id: "CHN",
		name: "China",
		gdpGrowthRate: 5.2,
		tradeOpenness: 63,
		militarySpendingPct: 1.7,
		domesticStability: 62,
		energyIndependence: 72,
		techSelfSufficiency: 68,
		immigrationRate: -0.1,
		foreignReserves: 18.0,
		debtToGdp: 83,
		inflationRate: 0.2,
		allianceStrength: {},
		tradeVolume: {},
	},
	MEX: {
		id: "MEX",
		name: "Mexico",
		gdpGrowthRate: 3.2,
		tradeOpenness: 72,
		militarySpendingPct: 0.8,
		domesticStability: 38,
		energyIndependence: 74,
		techSelfSufficiency: 22,
		immigrationRate: 1.2,
		foreignReserves: 5.5,
		debtToGdp: 54,
		inflationRate: 5.5,
		allianceStrength: {},
		tradeVolume: {},
	},
	ASN: {
		id: "ASN",
		name: "ASEAN",
		gdpGrowthRate: 4.5,
		tradeOpenness: 82,
		militarySpendingPct: 1.9,
		domesticStability: 52,
		energyIndependence: 55,
		techSelfSufficiency: 38,
		immigrationRate: 1.2,
		foreignReserves: 8.5,
		debtToGdp: 58,
		inflationRate: 4.2,
		allianceStrength: {},
		tradeVolume: {},
	},
};

const testWeights: WeightMatrix = {
	trade: {
		USA: {
			CHN: {
				gdpGrowthRate: {
					weight: -0.35,
					delayMonths: 3,
					mechanism: "Trade shock → GDP drag",
				},
				tradeOpenness: {
					weight: -0.4,
					delayMonths: 1,
					mechanism: "Trade restriction → reduced openness",
				},
			},
			MEX: {
				tradeOpenness: {
					weight: 0.3,
					delayMonths: 2,
					mechanism: "Supply chain redirect",
				},
				gdpGrowthRate: {
					weight: 0.2,
					delayMonths: 4,
					mechanism: "Near-shoring boost",
				},
			},
		},
		CHN: {
			ASN: {
				gdpGrowthRate: {
					weight: -0.25,
					delayMonths: 3,
					mechanism: "Regional trade slowdown",
				},
			},
		},
	},
	energy: {},
	military: {},
	immigration: {},
	monetary: {},
	technology: {},
};

const tradeLeverUSA = {
	domain: "trade" as const,
	actingCountry: "USA",
	magnitude: 80,
	label: "Raise tariffs +25%",
};

// ---------------------------------------------------------------------------
// clampVariable
// ---------------------------------------------------------------------------

describe("clampVariable", () => {
	it("clamps gdpGrowthRate above 15 to 15", () => {
		expect(clampVariable("gdpGrowthRate", 20)).toBe(15);
	});

	it("clamps gdpGrowthRate below -15 to -15", () => {
		expect(clampVariable("gdpGrowthRate", -20)).toBe(-15);
	});

	it("does not clamp values within range", () => {
		expect(clampVariable("gdpGrowthRate", 3)).toBe(3);
	});

	it("clamps tradeOpenness to [0, 100]", () => {
		expect(clampVariable("tradeOpenness", -5)).toBe(0);
		expect(clampVariable("tradeOpenness", 150)).toBe(100);
		expect(clampVariable("tradeOpenness", 55)).toBe(55);
	});
});

// ---------------------------------------------------------------------------
// createEmptyDeltas
// ---------------------------------------------------------------------------

describe("createEmptyDeltas", () => {
	it("creates zero deltas for all scalar variables", () => {
		const deltas = createEmptyDeltas(["USA", "CHN"]);
		for (const iso of ["USA", "CHN"]) {
			for (const v of SCALAR_VARIABLES) {
				expect(deltas[iso][v]).toBe(0);
			}
		}
	});

	it("works with an empty country list", () => {
		const deltas = createEmptyDeltas([]);
		expect(Object.keys(deltas)).toHaveLength(0);
	});
});

// ---------------------------------------------------------------------------
// getShockMapping
// ---------------------------------------------------------------------------

describe("getShockMapping", () => {
	it("trade domain returns tradeOpenness shock", () => {
		const shocks = getShockMapping("trade", 100);
		expect(shocks.some((s) => s.variable === "tradeOpenness")).toBe(true);
	});

	it("energy domain returns energyIndependence shock", () => {
		const shocks = getShockMapping("energy", 100);
		expect(shocks.some((s) => s.variable === "energyIndependence")).toBe(true);
	});

	it("military domain returns militarySpendingPct shock", () => {
		const shocks = getShockMapping("military", 100);
		expect(shocks.some((s) => s.variable === "militarySpendingPct")).toBe(true);
	});

	it("monetary domain returns TWO shocks", () => {
		const shocks = getShockMapping("monetary", 50);
		expect(shocks).toHaveLength(2);
		expect(shocks.some((s) => s.variable === "inflationRate")).toBe(true);
		expect(shocks.some((s) => s.variable === "tradeOpenness")).toBe(true);
	});

	it("all 6 domains return non-empty arrays", () => {
		const domains = [
			"trade",
			"energy",
			"military",
			"immigration",
			"monetary",
			"technology",
		] as const;
		for (const domain of domains) {
			expect(getShockMapping(domain, 50).length).toBeGreaterThan(0);
		}
	});
});

// ---------------------------------------------------------------------------
// propagateMonth — month 0
// ---------------------------------------------------------------------------

describe("propagateMonth - month 0", () => {
	it("applies shock only to acting country", () => {
		const deltas = createEmptyDeltas(["USA", "CHN", "MEX", "ASN"]);
		const { nextDeltas } = propagateMonth(
			testBaseline,
			deltas,
			tradeLeverUSA,
			testWeights,
			0,
		);
		// USA should have a non-zero tradeOpenness delta
		expect(nextDeltas["USA"]["tradeOpenness"]).not.toBe(0);
	});

	it("other countries have zero deltas after month 0", () => {
		const deltas = createEmptyDeltas(["USA", "CHN", "MEX", "ASN"]);
		const { nextDeltas } = propagateMonth(
			testBaseline,
			deltas,
			tradeLeverUSA,
			testWeights,
			0,
		);
		for (const iso of ["CHN", "MEX", "ASN"]) {
			for (const v of SCALAR_VARIABLES) {
				expect(nextDeltas[iso][v]).toBe(0);
			}
		}
	});

	it("clamps shocked values to valid ranges", () => {
		const deltas = createEmptyDeltas(["USA"]);
		// Extreme positive magnitude — tradeOpenness should not exceed 100 relative to baseline
		const extremeLever = { ...tradeLeverUSA, magnitude: 10000 };
		const { nextDeltas } = propagateMonth(
			testBaseline,
			deltas,
			extremeLever,
			testWeights,
			0,
		);
		const raw =
			testBaseline["USA"]["tradeOpenness"] + nextDeltas["USA"]["tradeOpenness"];
		expect(raw).toBeLessThanOrEqual(100);
	});

	it("records CausalEvent for large shocks", () => {
		const deltas = createEmptyDeltas(["USA"]);
		const { events } = propagateMonth(
			testBaseline,
			deltas,
			tradeLeverUSA,
			testWeights,
			0,
		);
		expect(events.length).toBeGreaterThan(0);
	});

	it("does not record CausalEvent for tiny shocks", () => {
		const deltas = createEmptyDeltas(["USA"]);
		const tinyLever = { ...tradeLeverUSA, magnitude: 0.001 };
		const { events } = propagateMonth(
			testBaseline,
			deltas,
			tinyLever,
			testWeights,
			0,
		);
		// delta = 0.001 * 0.3 = 0.0003, well below CAUSAL_EVENT_THRESHOLD
		expect(events).toHaveLength(0);
	});
});

// ---------------------------------------------------------------------------
// propagateMonth — month 1+
// ---------------------------------------------------------------------------

describe("propagateMonth - month 1+", () => {
	/** Helper: run month 0 then return deltas with signal on USA tradeOpenness */
	function runMonth0(): ReturnType<typeof propagateMonth>["nextDeltas"] {
		const deltas = createEmptyDeltas(["USA", "CHN", "MEX", "ASN"]);
		return propagateMonth(testBaseline, deltas, tradeLeverUSA, testWeights, 0)
			.nextDeltas;
	}

	it("applies influence when delay <= month", () => {
		const deltasAfter0 = runMonth0();
		// CHN.tradeOpenness edge has delayMonths=1 — should fire at month 1
		const { nextDeltas } = propagateMonth(
			testBaseline,
			deltasAfter0,
			tradeLeverUSA,
			testWeights,
			1,
		);
		expect(nextDeltas["CHN"]["tradeOpenness"]).not.toBe(0);
	});

	it("does NOT apply influence when delay > month", () => {
		const deltasAfter0 = runMonth0();
		// CHN.gdpGrowthRate edge has delayMonths=3 — should NOT fire at month 1
		const { nextDeltas } = propagateMonth(
			testBaseline,
			deltasAfter0,
			tradeLeverUSA,
			testWeights,
			1,
		);
		expect(nextDeltas["CHN"]["gdpGrowthRate"]).toBe(0);
	});

	it("multiplies by DECAY_FACTOR", () => {
		const deltasAfter0 = runMonth0();
		const usaSignal = deltasAfter0["USA"]["tradeOpenness"];
		const { nextDeltas } = propagateMonth(
			testBaseline,
			deltasAfter0,
			tradeLeverUSA,
			testWeights,
			1,
		);

		// CHN tradeOpenness edge: weight=-0.40, delayMonths=1
		const expected = usaSignal * -0.4 * DECAY_FACTOR;
		// Delta should equal expected (clamping won't bite at these magnitudes)
		expect(nextDeltas["CHN"]["tradeOpenness"]).toBeCloseTo(expected, 5);
	});
});

// ---------------------------------------------------------------------------
// runSimulation
// ---------------------------------------------------------------------------

describe("runSimulation", () => {
	it("returns correct number of snapshots (= horizon)", () => {
		const result = runSimulation(testBaseline, tradeLeverUSA, testWeights, 12);
		expect(result.snapshots).toHaveLength(12);
	});

	it("zero magnitude: all deltas remain zero", () => {
		const zeroLever = { ...tradeLeverUSA, magnitude: 0 };
		const result = runSimulation(testBaseline, zeroLever, testWeights, 12);
		for (const snapshot of result.snapshots) {
			for (const iso of Object.keys(snapshot.deltas)) {
				for (const v of SCALAR_VARIABLES) {
					expect(snapshot.deltas[iso][v]).toBe(0);
				}
			}
		}
	});

	it("USA trade +80: CHN gdpGrowthRate delta negative by month 6", () => {
		const result = runSimulation(testBaseline, tradeLeverUSA, testWeights, 12);
		// CHN gdpGrowthRate edge has delayMonths=3, weight=-0.35
		const snap6 = result.snapshots[6];
		expect(snap6).toBeDefined();
		expect(snap6.deltas["CHN"]["gdpGrowthRate"]).toBeLessThan(0);
	});

	it("USA trade +80: MEX tradeOpenness delta positive by month 4", () => {
		const result = runSimulation(testBaseline, tradeLeverUSA, testWeights, 12);
		// MEX tradeOpenness edge has delayMonths=2, weight=+0.30
		const snap4 = result.snapshots[4];
		expect(snap4).toBeDefined();
		expect(snap4.deltas["MEX"]["tradeOpenness"]).toBeGreaterThan(0);
	});

	it("all variables stay within clamp bounds across all months", () => {
		const result = runSimulation(testBaseline, tradeLeverUSA, testWeights, 60);
		for (const snapshot of result.snapshots) {
			for (const iso of Object.keys(snapshot.deltas)) {
				for (const v of SCALAR_VARIABLES) {
					const absVal = testBaseline[iso][v] + snapshot.deltas[iso][v];
					const [min, max] = [
						clampVariable(v, -Infinity),
						clampVariable(v, Infinity),
					];
					// Use the actual clamp range directly
					expect(absVal).toBeGreaterThanOrEqual(
						v === "gdpGrowthRate"
							? -15
							: v === "immigrationRate"
								? -20
								: v === "inflationRate"
									? -2
									: 0,
					);
					expect(absVal).toBeLessThanOrEqual(
						v === "gdpGrowthRate"
							? 15
							: v === "tradeOpenness"
								? 100
								: v === "militarySpendingPct"
									? 15
									: v === "domesticStability"
										? 100
										: v === "energyIndependence"
											? 100
											: v === "techSelfSufficiency"
												? 100
												: v === "immigrationRate"
													? 20
													: v === "foreignReserves"
														? 36
														: v === "debtToGdp"
															? 300
															: 50, // inflationRate
					);
					void min;
					void max;
				}
			}
		}
	});

	it("events array is non-empty for magnitude 80", () => {
		const result = runSimulation(testBaseline, tradeLeverUSA, testWeights, 12);
		expect(result.events.length).toBeGreaterThan(0);
	});

	it("completes in < 100ms (performance check)", () => {
		const start = performance.now();
		runSimulation(testBaseline, tradeLeverUSA, testWeights, 60);
		const elapsed = performance.now() - start;
		expect(elapsed).toBeLessThan(100);
	});

	it("each event carries month, source/target countries, variable, delta, mechanism", () => {
		const result = runSimulation(testBaseline, tradeLeverUSA, testWeights, 12);
		for (const ev of result.events) {
			expect(typeof ev.month).toBe("number");
			expect(typeof ev.sourceCountry).toBe("string");
			expect(typeof ev.targetCountry).toBe("string");
			expect(SCALAR_VARIABLES).toContain(ev.variable);
			expect(typeof ev.delta).toBe("number");
			expect(typeof ev.mechanism).toBe("string");
			expect(ev.mechanism.length).toBeGreaterThan(0);
		}
	});

	it("all deltas at threshold violation are above CAUSAL_EVENT_THRESHOLD", () => {
		const result = runSimulation(testBaseline, tradeLeverUSA, testWeights, 12);
		for (const ev of result.events) {
			expect(Math.abs(ev.delta)).toBeGreaterThan(CAUSAL_EVENT_THRESHOLD);
		}
	});
});
