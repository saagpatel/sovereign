// All shared TypeScript interfaces for Sovereign
// Simulation-internal types live in src/sim/types.ts

export interface CountryState {
	id: string; // ISO 3166-1 alpha-3 (e.g., "USA", "CHN")
	name: string;
	gdpGrowthRate: number; // % annual, clamped: −15 to +15
	tradeOpenness: number; // 0–100 index
	militarySpendingPct: number; // % of GDP, clamped: 0–15
	domesticStability: number; // 0–100 index (higher = more stable)
	energyIndependence: number; // 0–100 (100 = fully self-sufficient)
	techSelfSufficiency: number; // 0–100 (semiconductor/AI capability proxy)
	immigrationRate: number; // net migrants per 1000 pop, clamped: −20 to +20
	foreignReserves: number; // months of import cover, clamped: 0–36
	debtToGdp: number; // %, clamped: 0–300
	inflationRate: number; // % annual, clamped: −2 to +50
	allianceStrength: Record<string, number>; // partner ISO → 0–100
	tradeVolume: Record<string, number>; // partner ISO → relative volume 0–100
}

export interface CountryBaseline extends CountryState {
	region: string;
	notes: string; // Source citations for baseline values
	lastRefreshed?: string; // ISO date string of last World Bank refresh
}

export type PolicyDomain =
	| "trade"
	| "energy"
	| "military"
	| "immigration"
	| "monetary"
	| "technology";

export interface PolicyLever {
	domain: PolicyDomain;
	actingCountry: string; // ISO code
	magnitude: number; // −100 to +100
	label: string; // e.g., "Raise semiconductor tariffs +25%"
}

export interface SimConfig {
	lever: PolicyLever;
	runs: number; // Default: 50
	horizon: number; // Default: 60 (months)
	noiseScale: number; // Default: 0.15
}

/** Utility type for scalar (numeric) variables on CountryState */
export type ScalarVariable = keyof Omit<
	CountryState,
	"id" | "name" | "allianceStrength" | "tradeVolume"
>;

export interface CausalEvent {
	month: number;
	sourceCountry: string; // ISO code
	targetCountry: string; // ISO code
	variable: ScalarVariable;
	delta: number;
	mechanism: string; // e.g., "Trade volume shock → GDP growth drag"
}

export interface VariableBand {
	p10: number;
	p50: number;
	p90: number;
}

export interface MonthlyBand {
	month: number;
	variables: Record<ScalarVariable, VariableBand>;
}

export interface CountryBand {
	countryId: string;
	monthly: MonthlyBand[]; // length = horizon (60)
}

export interface SimResult {
	config: SimConfig;
	confidenceBands: Record<string, CountryBand>; // ISO → bands
	causalChain: CausalEvent[]; // Top 10 by |delta| across all runs
	runDurationMs: number;
}

export interface WorkerProgressEvent {
	runsCompleted: number; // 0–50
	partialBands?: Record<string, CountryBand>;
}

export interface Scenario {
	id: string;
	title: string;
	description: string;
	lever: PolicyLever;
	tags: string[];
	historicalAnalog?: string;
}

export interface InfluenceEdge {
	weight: number; // −1.0 to +1.0
	delayMonths: number; // 0–12
	mechanism: string;
}

// domain → actingISO → affectedISO → affectedVariable → edge
export type WeightMatrix = Record<
	PolicyDomain,
	Record<string, Record<string, Record<string, InfluenceEdge>>>
>;
