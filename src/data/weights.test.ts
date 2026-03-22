import { describe, expect, it } from "vitest";
import type { PolicyDomain, ScalarVariable } from "@/types";
import { COUNTRIES } from "./countries";
import { WEIGHT_MATRIX } from "./weights";

const VALID_COUNTRY_IDS: Set<string> = new Set(COUNTRIES.map((c) => c.id));

const VALID_SCALAR_VARIABLES = new Set<ScalarVariable>([
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
]);

const ALL_DOMAINS: PolicyDomain[] = [
	"trade",
	"energy",
	"military",
	"immigration",
	"monetary",
	"technology",
];

const NON_TRADE_DOMAINS: PolicyDomain[] = [
	"energy",
	"military",
	"immigration",
	"monetary",
	"technology",
];

/** Traverse trade domain and collect all InfluenceEdge entries */
function collectTradeEdges() {
	const edges: Array<{
		sourceISO: string;
		targetISO: string;
		variable: string;
		weight: number;
		delayMonths: number;
		mechanism: string;
	}> = [];

	const tradeDomain = WEIGHT_MATRIX.trade;
	for (const sourceISO of Object.keys(tradeDomain)) {
		const targetMap = tradeDomain[sourceISO];
		if (targetMap === undefined) continue;
		for (const targetISO of Object.keys(targetMap)) {
			const variableMap = targetMap[targetISO];
			if (variableMap === undefined) continue;
			for (const variable of Object.keys(variableMap)) {
				const edge = variableMap[variable];
				if (edge === undefined) continue;
				edges.push({ sourceISO, targetISO, variable, ...edge });
			}
		}
	}

	return edges;
}

describe("WEIGHT_MATRIX — trade domain", () => {
	const tradeEdges = collectTradeEdges();

	it("has >= 50 non-zero InfluenceEdge entries in the trade domain", () => {
		const nonZeroCount = tradeEdges.filter((e) => e.weight !== 0).length;
		expect(nonZeroCount).toBeGreaterThanOrEqual(50);
	});

	it("all weights are in the range [-1.0, +1.0]", () => {
		for (const edge of tradeEdges) {
			expect(edge.weight).toBeGreaterThanOrEqual(-1.0);
			expect(edge.weight).toBeLessThanOrEqual(1.0);
		}
	});

	it("all delayMonths are integers in [0, 12]", () => {
		for (const edge of tradeEdges) {
			expect(edge.delayMonths).toBeGreaterThanOrEqual(0);
			expect(edge.delayMonths).toBeLessThanOrEqual(12);
			expect(Number.isInteger(edge.delayMonths)).toBe(true);
		}
	});

	it("all mechanism strings are non-empty", () => {
		for (const edge of tradeEdges) {
			expect(typeof edge.mechanism).toBe("string");
			expect(edge.mechanism.trim().length).toBeGreaterThan(0);
		}
	});

	it("no self-referencing edges (sourceISO !== targetISO)", () => {
		for (const edge of tradeEdges) {
			expect(edge.sourceISO).not.toBe(edge.targetISO);
		}
	});

	it("all ISO codes are valid COUNTRIES ids", () => {
		for (const edge of tradeEdges) {
			expect(VALID_COUNTRY_IDS.has(edge.sourceISO)).toBe(true);
			expect(VALID_COUNTRY_IDS.has(edge.targetISO)).toBe(true);
		}
	});

	it("all target variable names are valid ScalarVariable names", () => {
		for (const edge of tradeEdges) {
			expect(VALID_SCALAR_VARIABLES.has(edge.variable as ScalarVariable)).toBe(
				true,
			);
		}
	});
});

describe("WEIGHT_MATRIX — structure", () => {
	it("all 6 domain keys exist", () => {
		for (const domain of ALL_DOMAINS) {
			expect(WEIGHT_MATRIX).toHaveProperty(domain);
		}
	});

	it("non-trade domains are empty objects", () => {
		for (const domain of NON_TRADE_DOMAINS) {
			expect(WEIGHT_MATRIX[domain]).toEqual({});
		}
	});
});

describe("WEIGHT_MATRIX — specific edge checks", () => {
	it("USA→CHN gdpGrowthRate has a negative weight", () => {
		const edge = WEIGHT_MATRIX.trade["USA"]?.["CHN"]?.["gdpGrowthRate"];
		expect(edge).toBeDefined();
		expect(edge!.weight).toBeLessThan(0);
	});

	it("CHN→ASN gdpGrowthRate edge exists", () => {
		const edge = WEIGHT_MATRIX.trade["CHN"]?.["ASN"]?.["gdpGrowthRate"];
		expect(edge).toBeDefined();
	});
});
