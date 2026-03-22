import type { CausalEvent, CountryState, ScalarVariable } from "@/types";

export type WorldState = Record<string, CountryState>;
export type WorldDelta = Record<string, Record<ScalarVariable, number>>;

export interface MonthlySnapshot {
	month: number;
	deltas: WorldDelta;
}

export interface SimulationRun {
	snapshots: MonthlySnapshot[];
	events: CausalEvent[];
}
