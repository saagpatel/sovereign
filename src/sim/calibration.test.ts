import { describe, expect, it } from "vitest";
import { WEIGHT_MATRIX } from "@/data/weights";
import type { CountryState } from "@/types";
import countryDataJson from "../../public/data/countryData.json";
import { runSimulation } from "./propagation";
import type { WorldState } from "./types";

function buildBaseline(): WorldState {
	const baseline: Record<string, CountryState> = {};
	for (const entry of countryDataJson) {
		baseline[entry.id] = entry as unknown as CountryState;
	}
	return baseline;
}

describe("Historical calibration targets", () => {
	const baseline = buildBaseline();

	// US-China Trade War 2018 (trade, USA, +65)
	describe("US-China Trade War 2018", () => {
		const { snapshots } = runSimulation(
			baseline,
			{
				domain: "trade",
				actingCountry: "USA",
				magnitude: 65,
				label: "test",
			},
			WEIGHT_MATRIX,
			60,
		);

		it("CHN GDP delta in [-1.5, -0.3] at month 12", () => {
			const delta = snapshots[11].deltas["CHN"]["gdpGrowthRate"];
			expect(delta).toBeGreaterThanOrEqual(-1.5);
			expect(delta).toBeLessThanOrEqual(-0.3);
		});

		it("USA inflation delta in [0.2, 0.8] at month 12", () => {
			const delta = snapshots[11].deltas["USA"]["inflationRate"];
			expect(delta).toBeGreaterThanOrEqual(0.2);
			expect(delta).toBeLessThanOrEqual(0.8);
		});

		it("ASN tradeOpenness delta in [1, 4] at month 18", () => {
			const delta = snapshots[17].deltas["ASN"]["tradeOpenness"];
			expect(delta).toBeGreaterThanOrEqual(1.0);
			expect(delta).toBeLessThanOrEqual(4.0);
		});
	});

	// Russia Energy Cutoff 2022 (energy, RUS, -90)
	describe("Russia Energy Cutoff 2022", () => {
		const { snapshots } = runSimulation(
			baseline,
			{
				domain: "energy",
				actingCountry: "RUS",
				magnitude: -90,
				label: "test",
			},
			WEIGHT_MATRIX,
			60,
		);

		it("EUR GDP delta in [-4.0, -1.5] at month 6", () => {
			const delta = snapshots[5].deltas["EUR"]["gdpGrowthRate"];
			expect(delta).toBeGreaterThanOrEqual(-4.0);
			expect(delta).toBeLessThanOrEqual(-1.5);
		});

		it("EUR inflation delta in [3.0, 6.0] at month 6", () => {
			const delta = snapshots[5].deltas["EUR"]["inflationRate"];
			expect(delta).toBeGreaterThanOrEqual(3.0);
			expect(delta).toBeLessThanOrEqual(6.0);
		});
	});

	// AUKUS 2021 (military, USA, +70)
	describe("AUKUS 2021", () => {
		const { snapshots } = runSimulation(
			baseline,
			{
				domain: "military",
				actingCountry: "USA",
				magnitude: 70,
				label: "test",
			},
			WEIGHT_MATRIX,
			60,
		);

		it("AUS milSpending delta in [0.2, 0.6] at month 24", () => {
			const delta = snapshots[23].deltas["AUS"]["militarySpendingPct"];
			expect(delta).toBeGreaterThanOrEqual(0.2);
			expect(delta).toBeLessThanOrEqual(0.6);
		});

		it("CHN stability delta in [-3.0, -0.5] at month 12", () => {
			const delta = snapshots[11].deltas["CHN"]["domesticStability"];
			expect(delta).toBeGreaterThanOrEqual(-3.0);
			expect(delta).toBeLessThanOrEqual(-0.5);
		});
	});
});
