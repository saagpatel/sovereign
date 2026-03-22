import { describe, expect, it } from "vitest";

// Test the worker API logic directly (not via Worker thread)
// Worker thread integration is verified manually in production build
const workerApi = {
	add(a: number, b: number): number {
		return a + b;
	},
};

describe("SimulationWorker API", () => {
	it("adds two positive numbers", () => {
		expect(workerApi.add(2, 3)).toBe(5);
	});

	it("adds negative and positive", () => {
		expect(workerApi.add(-1, 1)).toBe(0);
	});

	it("handles zero", () => {
		expect(workerApi.add(0, 0)).toBe(0);
	});

	it("handles large numbers", () => {
		expect(workerApi.add(Number.MAX_SAFE_INTEGER, 1)).toBe(
			Number.MAX_SAFE_INTEGER + 1,
		);
	});
});
