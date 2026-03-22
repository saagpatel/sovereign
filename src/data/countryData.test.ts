import { describe, expect, it } from "vitest";
import countryData from "../../public/data/countryData.json";
import { COUNTRIES } from "./countries";

const VALID_IDS = COUNTRIES.map((c) => c.id);
const MAJOR_IDS = ["USA", "CHN", "EUR", "RUS", "IND"];

describe("countryData.json", () => {
	it("has exactly 18 entries", () => {
		expect(countryData).toHaveLength(18);
	});

	it("every entry has an id matching one of the 18 COUNTRIES", () => {
		for (const entry of countryData) {
			expect(VALID_IDS).toContain(entry.id);
		}
	});

	it("all ids are unique", () => {
		const ids = countryData.map((c) => c.id);
		expect(new Set(ids).size).toBe(18);
	});

	const scalarFields = [
		"gdpGrowthRate",
		"tradeOpenness",
		"militarySpendingPct",
		"domesticStability",
		"energyIndependence",
		"techSelfSufficiency",
		"immigrationRate",
		"foreignReserves",
		"debtToGdp",
		"inflationRate",
	] as const;

	it("all scalar fields are numbers (no nulls or strings)", () => {
		for (const entry of countryData) {
			for (const field of scalarFields) {
				expect(typeof entry[field]).toBe("number");
			}
		}
	});

	const ranges: Record<string, [number, number]> = {
		gdpGrowthRate: [-15, 15],
		tradeOpenness: [0, 100],
		militarySpendingPct: [0, 15],
		domesticStability: [0, 100],
		energyIndependence: [0, 100],
		techSelfSufficiency: [0, 100],
		immigrationRate: [-20, 20],
		foreignReserves: [0, 36],
		debtToGdp: [0, 300],
		inflationRate: [-2, 50],
	};

	for (const [field, [lo, hi]] of Object.entries(ranges)) {
		it(`${field} is within [${lo}, ${hi}] for all entries`, () => {
			for (const entry of countryData) {
				const val = entry[field as keyof typeof entry] as number;
				expect(val).toBeGreaterThanOrEqual(lo);
				expect(val).toBeLessThanOrEqual(hi);
			}
		});
	}

	it("major countries have >= 5 entries in allianceStrength", () => {
		for (const id of MAJOR_IDS) {
			const entry = countryData.find((c) => c.id === id);
			expect(entry).toBeDefined();
			expect(
				Object.keys(entry!.allianceStrength).length,
			).toBeGreaterThanOrEqual(5);
		}
	});

	it("major countries have >= 5 entries in tradeVolume", () => {
		for (const id of MAJOR_IDS) {
			const entry = countryData.find((c) => c.id === id);
			expect(entry).toBeDefined();
			expect(Object.keys(entry!.tradeVolume).length).toBeGreaterThanOrEqual(5);
		}
	});

	it("all partner IDs in allianceStrength are valid country IDs", () => {
		for (const entry of countryData) {
			for (const pid of Object.keys(entry.allianceStrength)) {
				expect(VALID_IDS).toContain(pid);
			}
		}
	});

	it("all partner IDs in tradeVolume are valid country IDs", () => {
		for (const entry of countryData) {
			for (const pid of Object.keys(entry.tradeVolume)) {
				expect(VALID_IDS).toContain(pid);
			}
		}
	});

	it("allianceStrength values are between 0 and 100", () => {
		for (const entry of countryData) {
			for (const val of Object.values(entry.allianceStrength)) {
				expect(val).toBeGreaterThanOrEqual(0);
				expect(val).toBeLessThanOrEqual(100);
			}
		}
	});

	it("tradeVolume values are between 0 and 100", () => {
		for (const entry of countryData) {
			for (const val of Object.values(entry.tradeVolume)) {
				expect(val).toBeGreaterThanOrEqual(0);
				expect(val).toBeLessThanOrEqual(100);
			}
		}
	});
});
