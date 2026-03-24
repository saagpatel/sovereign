import { scaleDiverging } from "d3-scale";
import { describe, expect, it } from "vitest";

// Replicate the interpolation function from ChoroplethLayer
function interpolateRdYlGn(t: number): string {
	if (t <= 0.5) {
		const s = t * 2;
		const r = Math.round(239 + (234 - 239) * s);
		const g = Math.round(68 + (179 - 68) * s);
		const b = Math.round(68 + (8 - 68) * s);
		return `rgb(${r},${g},${b})`;
	}
	const s = (t - 0.5) * 2;
	const r = Math.round(234 + (34 - 234) * s);
	const g = Math.round(179 + (197 - 179) * s);
	const b = Math.round(8 + (94 - 8) * s);
	return `rgb(${r},${g},${b})`;
}

const colorScale = scaleDiverging(interpolateRdYlGn).domain([-8, 0, 8]);

describe("ChoroplethLayer color scale", () => {
	it("interpolateRdYlGn returns red-ish at t=0", () => {
		const color = interpolateRdYlGn(0);
		expect(color).toBe("rgb(239,68,68)");
	});

	it("interpolateRdYlGn returns yellow-ish at t=0.5", () => {
		const color = interpolateRdYlGn(0.5);
		expect(color).toBe("rgb(234,179,8)");
	});

	it("interpolateRdYlGn returns green-ish at t=1", () => {
		const color = interpolateRdYlGn(1);
		expect(color).toBe("rgb(34,197,94)");
	});

	it("colorScale maps -8 to red", () => {
		const color = colorScale(-8);
		expect(color).toBe("rgb(239,68,68)");
	});

	it("colorScale maps 0 to yellow", () => {
		const color = colorScale(0);
		expect(color).toBe("rgb(234,179,8)");
	});

	it("colorScale maps +8 to green", () => {
		const color = colorScale(8);
		expect(color).toBe("rgb(34,197,94)");
	});
});
