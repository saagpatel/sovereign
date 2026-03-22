"use client";

import { scaleDiverging } from "d3-scale";
import { useSimStore } from "@/store/simStore";

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

export interface CountryFeature {
	id: string;
	entityId: string | null;
	path: string;
}

interface ChoroplethLayerProps {
	features: CountryFeature[];
	selectedCountry: string | null;
	selectedNumericIds: Set<string> | null;
	onClickCountry: (entityId: string | null) => void;
}

export default function ChoroplethLayer({
	features,
	selectedCountry,
	selectedNumericIds,
	onClickCountry,
}: ChoroplethLayerProps) {
	const result = useSimStore((s) => s.result);
	const baseline = useSimStore((s) => s.baseline);
	const scrubPosition = useSimStore((s) => s.scrubPosition);

	const hasResult = result !== null && baseline !== null;

	return (
		<>
			{features.map((f) => {
				const isSelected =
					selectedCountry !== null &&
					(f.entityId === selectedCountry ||
						(selectedNumericIds !== null && selectedNumericIds.has(f.id)));

				const isModeled = f.entityId !== null;

				let fill: string;
				if (isSelected) {
					fill = "#3b82f6";
				} else if (hasResult && isModeled && f.entityId) {
					const band = result.confidenceBands[f.entityId];
					if (band && band.monthly[scrubPosition]) {
						const p50 = band.monthly[scrubPosition].variables.gdpGrowthRate.p50;
						const base = baseline[f.entityId]?.gdpGrowthRate ?? 0;
						const delta = p50 - base;
						fill = colorScale(delta);
					} else {
						fill = "#1c1c26";
					}
				} else if (isModeled) {
					fill = "#1c1c26";
				} else {
					fill = "#111118";
				}

				return (
					<path
						key={f.id}
						d={f.path}
						fill={fill}
						stroke="#2a2a3a"
						strokeWidth={0.5}
						className={
							isModeled
								? "cursor-pointer transition-colors duration-150 hover:brightness-125"
								: ""
						}
						onClick={() => onClickCountry(f.entityId)}
					/>
				);
			})}
		</>
	);
}
