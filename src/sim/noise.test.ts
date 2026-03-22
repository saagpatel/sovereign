import { describe, expect, it } from "vitest";
import { createLCG, gaussianNoise } from "./noise";

describe("createLCG", () => {
	it("produces deterministic sequence from same seed", () => {
		const rng1 = createLCG(42);
		const rng2 = createLCG(42);
		const seq1 = Array.from({ length: 10 }, () => rng1());
		const seq2 = Array.from({ length: 10 }, () => rng2());
		expect(seq1).toEqual(seq2);
	});

	it("produces values in [0, 1)", () => {
		const rng = createLCG(123);
		for (let i = 0; i < 1000; i++) {
			const v = rng();
			expect(v).toBeGreaterThanOrEqual(0);
			expect(v).toBeLessThan(1);
		}
	});

	it("different seeds produce different sequences", () => {
		const rng1 = createLCG(1);
		const rng2 = createLCG(2);
		const seq1 = Array.from({ length: 5 }, () => rng1());
		const seq2 = Array.from({ length: 5 }, () => rng2());
		expect(seq1).not.toEqual(seq2);
	});
});

describe("gaussianNoise", () => {
	it("10000 samples have mean within ±0.05 of 0.0", () => {
		const rng = createLCG(42);
		const samples = Array.from({ length: 10000 }, () =>
			gaussianNoise(0, 1, rng),
		);
		const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
		expect(Math.abs(mean)).toBeLessThan(0.05);
	});

	it("10000 samples have std within ±0.05 of 1.0", () => {
		const rng = createLCG(42);
		const samples = Array.from({ length: 10000 }, () =>
			gaussianNoise(0, 1, rng),
		);
		const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
		const variance =
			samples.reduce((a, b) => a + (b - mean) ** 2, 0) / samples.length;
		const std = Math.sqrt(variance);
		expect(Math.abs(std - 1.0)).toBeLessThan(0.05);
	});

	it("seeded calls produce identical values", () => {
		const rng1 = createLCG(99);
		const rng2 = createLCG(99);
		const v1 = gaussianNoise(5, 2, rng1);
		const v2 = gaussianNoise(5, 2, rng2);
		expect(v1).toBe(v2);
	});

	it("respects mean parameter", () => {
		const rng = createLCG(42);
		const samples = Array.from({ length: 10000 }, () =>
			gaussianNoise(10, 1, rng),
		);
		const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
		expect(Math.abs(mean - 10)).toBeLessThan(0.05);
	});

	it("respects sigma parameter", () => {
		const rng = createLCG(42);
		const samples = Array.from({ length: 10000 }, () =>
			gaussianNoise(0, 3, rng),
		);
		const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
		const variance =
			samples.reduce((a, b) => a + (b - mean) ** 2, 0) / samples.length;
		const std = Math.sqrt(variance);
		expect(Math.abs(std - 3.0)).toBeLessThan(0.15);
	});
});
