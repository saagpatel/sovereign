import { create } from "zustand";
import type { SimConfig, SimResult } from "@/types";

interface SimStore {
	config: SimConfig | null;
	result: SimResult | null;
	selectedCountry: string | null;
	scrubPosition: number;
	isRunning: boolean;
	progress: number;

	setConfig: (config: SimConfig) => void;
	setResult: (result: SimResult) => void;
	selectCountry: (id: string | null) => void;
	setScrubPosition: (month: number) => void;
	setRunning: (running: boolean) => void;
	setProgress: (pct: number) => void;
	reset: () => void;
}

const initialState = {
	config: null,
	result: null,
	selectedCountry: null,
	scrubPosition: 0,
	isRunning: false,
	progress: 0,
};

export const useSimStore = create<SimStore>()((set) => ({
	...initialState,

	setConfig: (config) => set({ config }),
	setResult: (result) => set({ result, isRunning: false, progress: 100 }),
	selectCountry: (id) => set({ selectedCountry: id }),
	setScrubPosition: (month) => set({ scrubPosition: month }),
	setRunning: (running) => set({ isRunning: running }),
	setProgress: (pct) => set({ progress: Math.max(0, Math.min(100, pct)) }),
	reset: () => set(initialState),
}));
