import type {
	CausalEvent,
	PolicyDomain,
	PolicyLever,
	ScalarVariable,
	WeightMatrix,
} from "@/types";
import { gaussianNoise } from "./noise";
import type {
	MonthlySnapshot,
	SimulationRun,
	WorldDelta,
	WorldState,
} from "./types";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const DECAY_FACTOR = 0.3;
export const CAUSAL_EVENT_THRESHOLD = 0.1;

export const VARIABLE_RANGES: Record<ScalarVariable, [number, number]> = {
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

export const SCALAR_VARIABLES: ScalarVariable[] = [
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
];

export const DOMAIN_SIGNAL_VARIABLE: Record<PolicyDomain, ScalarVariable> = {
	trade: "tradeOpenness",
	energy: "energyIndependence",
	military: "militarySpendingPct",
	immigration: "immigrationRate",
	monetary: "inflationRate",
	technology: "techSelfSufficiency",
};

// ---------------------------------------------------------------------------
// Pure helpers
// ---------------------------------------------------------------------------

/** Clamps value to the canonical [min, max] range for a scalar variable. */
export function clampVariable(variable: ScalarVariable, value: number): number {
	const [min, max] = VARIABLE_RANGES[variable];
	return Math.max(min, Math.min(max, value));
}

/** Builds a WorldDelta initialised to zero for every scalar variable. */
export function createEmptyDeltas(countryIds: string[]): WorldDelta {
	const delta: WorldDelta = {};
	for (const id of countryIds) {
		const row = {} as Record<ScalarVariable, number>;
		for (const v of SCALAR_VARIABLES) {
			row[v] = 0;
		}
		delta[id] = row;
	}
	return delta;
}

/** Returns the direct shock(s) applied to the acting country on month 0. */
export function getShockMapping(
	domain: PolicyDomain,
	magnitude: number,
): Array<{ variable: ScalarVariable; delta: number }> {
	switch (domain) {
		case "trade":
			return [{ variable: "tradeOpenness", delta: magnitude * 0.15 }];
		case "energy":
			return [{ variable: "energyIndependence", delta: magnitude * 0.1 }];
		case "military":
			return [{ variable: "militarySpendingPct", delta: magnitude * 0.02 }];
		case "immigration":
			return [{ variable: "immigrationRate", delta: magnitude * 0.05 }];
		case "monetary":
			return [
				{ variable: "inflationRate", delta: magnitude * -0.05 },
				{ variable: "tradeOpenness", delta: magnitude * 0.05 },
			];
		case "technology":
			return [{ variable: "techSelfSufficiency", delta: magnitude * 0.08 }];
	}
}

// ---------------------------------------------------------------------------
// Deep clone helper (no JSON round-trip overhead for numeric maps)
// ---------------------------------------------------------------------------

function cloneWorldDelta(delta: WorldDelta): WorldDelta {
	const copy: WorldDelta = {};
	for (const iso of Object.keys(delta)) {
		copy[iso] = { ...delta[iso] } as Record<ScalarVariable, number>;
	}
	return copy;
}

// ---------------------------------------------------------------------------
// Monthly step
// ---------------------------------------------------------------------------

/**
 * Advances the simulation by one month.
 *
 * month === 0: applies direct policy shocks to the acting country only.
 * month  >  0: propagates accumulated signal from all source countries through
 *              the weight matrix edges whose delayMonths <= month.
 */
export function propagateMonth(
	baseline: WorldState,
	currentDeltas: WorldDelta,
	lever: PolicyLever,
	weights: WeightMatrix,
	month: number,
	noiseScale = 0,
	noiseRng?: () => number,
): { nextDeltas: WorldDelta; events: CausalEvent[] } {
	const nextDeltas = cloneWorldDelta(currentDeltas);
	const events: CausalEvent[] = [];

	if (month === 0) {
		// --- Direct shock on acting country ---
		const shocks = getShockMapping(lever.domain, lever.magnitude);
		const actingISO = lever.actingCountry;

		if (nextDeltas[actingISO] === undefined) {
			// Acting country not in baseline — nothing to do
			return { nextDeltas, events };
		}

		for (const { variable, delta } of shocks) {
			const baselineVal = (baseline[actingISO]?.[variable] ?? 0) as number;
			const current = nextDeltas[actingISO][variable] + delta;
			const clamped =
				clampVariable(variable, baselineVal + current) - baselineVal;
			nextDeltas[actingISO][variable] = clamped;

			if (Math.abs(clamped) > CAUSAL_EVENT_THRESHOLD) {
				events.push({
					month,
					sourceCountry: actingISO,
					targetCountry: actingISO,
					variable,
					delta: clamped,
					mechanism: `Direct policy shock: ${lever.label}`,
				});
			}
		}
	} else {
		// --- Influence propagation via weight matrix ---
		const domainEdges = weights[lever.domain];
		if (!domainEdges) return { nextDeltas, events };

		const signalVar = DOMAIN_SIGNAL_VARIABLE[lever.domain];

		for (const sourceISO of Object.keys(domainEdges)) {
			const sourceDelta = currentDeltas[sourceISO]?.[signalVar] ?? 0;
			if (sourceDelta === 0) continue;

			const targetMap = domainEdges[sourceISO];
			if (!targetMap) continue;

			for (const targetISO of Object.keys(targetMap)) {
				if (nextDeltas[targetISO] === undefined) continue;

				const varMap = targetMap[targetISO];
				if (!varMap) continue;

				// Track the largest contributing source for the event mechanism.
				// We accumulate contributions per target variable separately.
				const contributions: Partial<
					Record<ScalarVariable, { contribution: number; mechanism: string }>
				> = {};

				for (const varKey of Object.keys(varMap)) {
					const variable = varKey as ScalarVariable;
					const edge = varMap[varKey];
					if (!edge) continue;
					if (edge.delayMonths > month) continue;

					let contribution = sourceDelta * edge.weight * DECAY_FACTOR;
					// Inject Gaussian noise: σ = noiseScale × |baseInfluence|
					if (noiseScale > 0 && noiseRng) {
						const sigma = noiseScale * Math.abs(contribution);
						contribution += gaussianNoise(0, sigma, noiseRng);
					}
					const prior = contributions[variable];
					if (
						prior === undefined ||
						Math.abs(contribution) > Math.abs(prior.contribution)
					) {
						contributions[variable] = {
							contribution,
							mechanism: edge.mechanism,
						};
					}
				}

				for (const varKey of Object.keys(contributions)) {
					const variable = varKey as ScalarVariable;
					const entry = contributions[variable];
					if (!entry) continue;

					const baseVal = (baseline[targetISO]?.[variable] ?? 0) as number;
					const current = nextDeltas[targetISO][variable] + entry.contribution;
					const clamped = clampVariable(variable, baseVal + current) - baseVal;
					nextDeltas[targetISO][variable] = clamped;

					const actual = clamped - currentDeltas[targetISO][variable];
					if (Math.abs(actual) > CAUSAL_EVENT_THRESHOLD) {
						events.push({
							month,
							sourceCountry: sourceISO,
							targetCountry: targetISO,
							variable,
							delta: actual,
							mechanism: entry.mechanism,
						});
					}
				}
			}
		}
	}

	return { nextDeltas, events };
}

// ---------------------------------------------------------------------------
// Simulation orchestrator
// ---------------------------------------------------------------------------

/**
 * Runs a single simulation pass over `horizon` months.
 * Pass noiseScale > 0 and noiseRng for Monte Carlo noise injection.
 */
export function runSimulation(
	baseline: WorldState,
	lever: PolicyLever,
	weights: WeightMatrix,
	horizon: number,
	noiseScale = 0,
	noiseRng?: () => number,
): SimulationRun {
	const countryIds = Object.keys(baseline);
	let currentDeltas = createEmptyDeltas(countryIds);

	const snapshots: MonthlySnapshot[] = [];
	const allEvents: CausalEvent[] = [];

	for (let month = 0; month < horizon; month++) {
		const { nextDeltas, events } = propagateMonth(
			baseline,
			currentDeltas,
			lever,
			weights,
			month,
			noiseScale,
			noiseRng,
		);
		currentDeltas = nextDeltas;
		snapshots.push({ month, deltas: cloneWorldDelta(currentDeltas) });
		allEvents.push(...events);
	}

	return { snapshots, events: allEvents };
}
