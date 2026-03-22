import { beforeEach, describe, expect, it } from "vitest";
import { useSimStore } from "./simStore";

describe("simStore", () => {
	beforeEach(() => {
		useSimStore.getState().reset();
	});

	it("has correct initial state", () => {
		const state = useSimStore.getState();
		expect(state.config).toBeNull();
		expect(state.result).toBeNull();
		expect(state.selectedCountry).toBeNull();
		expect(state.scrubPosition).toBe(0);
		expect(state.isRunning).toBe(false);
		expect(state.progress).toBe(0);
	});

	it("selectCountry sets selectedCountry", () => {
		useSimStore.getState().selectCountry("USA");
		expect(useSimStore.getState().selectedCountry).toBe("USA");
	});

	it("selectCountry(null) clears selectedCountry", () => {
		useSimStore.getState().selectCountry("USA");
		useSimStore.getState().selectCountry(null);
		expect(useSimStore.getState().selectedCountry).toBeNull();
	});

	it("setProgress sets progress", () => {
		useSimStore.getState().setProgress(50);
		expect(useSimStore.getState().progress).toBe(50);
	});

	it("setProgress clamps to 100", () => {
		useSimStore.getState().setProgress(150);
		expect(useSimStore.getState().progress).toBe(100);
	});

	it("setProgress clamps to 0", () => {
		useSimStore.getState().setProgress(-10);
		expect(useSimStore.getState().progress).toBe(0);
	});

	it("setScrubPosition sets scrubPosition", () => {
		useSimStore.getState().setScrubPosition(30);
		expect(useSimStore.getState().scrubPosition).toBe(30);
	});

	it("setRunning sets isRunning", () => {
		useSimStore.getState().setRunning(true);
		expect(useSimStore.getState().isRunning).toBe(true);
	});

	it("reset returns all values to initial state", () => {
		useSimStore.getState().selectCountry("CHN");
		useSimStore.getState().setProgress(75);
		useSimStore.getState().setScrubPosition(45);
		useSimStore.getState().setRunning(true);
		useSimStore.getState().reset();

		const state = useSimStore.getState();
		expect(state.selectedCountry).toBeNull();
		expect(state.progress).toBe(0);
		expect(state.scrubPosition).toBe(0);
		expect(state.isRunning).toBe(false);
	});
});
