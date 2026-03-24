/**
 * Seeded LCG (linear congruential generator) for reproducible random numbers.
 * Returns a function that produces values in [0, 1).
 */
export function createLCG(seed: number): () => number {
	let state = seed;
	return () => {
		// Numerical Recipes LCG parameters
		state = (state * 1664525 + 1013904223) >>> 0;
		return state / 4294967296;
	};
}

/**
 * Box-Muller transform: generates Gaussian-distributed samples.
 * If seed is provided, uses a seeded LCG for reproducibility.
 * Without seed, uses Math.random().
 */
export function gaussianNoise(
	mean: number,
	sigma: number,
	rng?: () => number,
): number {
	const random = rng ?? Math.random;
	let u1 = random();
	const u2 = random();
	// Avoid log(0)
	while (u1 === 0) u1 = random();
	const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
	return mean + sigma * z0;
}
