"use client";

import { geoCentroid, geoNaturalEarth1 } from "d3-geo";
import type { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import { useEffect, useState } from "react";
import { feature } from "topojson-client";
import type { Topology } from "topojson-specification";
import { NUMERIC_TO_ENTITY } from "@/data/countries";
import { useSimStore } from "@/store/simStore";

const projection = geoNaturalEarth1().scale(153).translate([480, 250]);

const CONNECTION_COLOR = "#60a5fa";

interface CountryCentroid {
	entityId: string;
	x: number;
	y: number;
}

export default function ConnectionLayer() {
	const [centroids, setCentroids] = useState<Record<string, CountryCentroid>>(
		{},
	);
	const result = useSimStore((s) => s.result);
	const baseline = useSimStore((s) => s.baseline);
	const selectedCountry = useSimStore((s) => s.selectedCountry);
	const scrubPosition = useSimStore((s) => s.scrubPosition);

	useEffect(() => {
		fetch("/data/world-110m.json")
			.then((res) => res.json())
			.then((topology: Topology) => {
				const countries = feature(
					topology,
					topology.objects.countries as Parameters<typeof feature>[1],
				) as FeatureCollection<Geometry, GeoJsonProperties>;

				const centrMap: Record<string, CountryCentroid> = {};

				for (const f of countries.features) {
					const numericId = String(f.id);
					const entityId = NUMERIC_TO_ENTITY[numericId];
					if (!entityId || centrMap[entityId]) continue;

					const centroid = geoCentroid(f);
					const projected = projection(centroid);
					if (!projected) continue;

					centrMap[entityId] = {
						entityId,
						x: projected[0],
						y: projected[1],
					};
				}

				setCentroids(centrMap);
			})
			.catch((err: unknown) => {
				console.error("Failed to load world topology for connections:", err);
			});
	}, []);

	if (!result || !baseline || Object.keys(centroids).length === 0) return null;

	// Build connection lines from tradeVolume relationships in baseline
	const lines: Array<{
		from: string;
		to: string;
		baselineWeight: number;
		currentWeight: number;
	}> = [];

	const countryIds = Object.keys(baseline);
	for (const fromId of countryIds) {
		const tradeVol = baseline[fromId].tradeVolume;
		for (const toId of Object.keys(tradeVol)) {
			// Avoid duplicates (A→B and B→A)
			if (fromId >= toId) continue;
			if (!centroids[fromId] || !centroids[toId]) continue;

			const baseWeight =
				(tradeVol[toId] + (baseline[toId]?.tradeVolume[fromId] ?? 0)) / 2;
			if (baseWeight <= 0) continue;

			// Get current tradeOpenness delta as proxy for connection strength change
			const fromBand = result.confidenceBands[fromId];
			const toBand = result.confidenceBands[toId];
			const fromDelta =
				fromBand?.monthly[scrubPosition]?.variables.tradeOpenness.p50 ??
				baseline[fromId].tradeOpenness;
			const toDelta =
				toBand?.monthly[scrubPosition]?.variables.tradeOpenness.p50 ??
				baseline[toId].tradeOpenness;
			const avgOpenness = (fromDelta + toDelta) / 2;
			const baseAvgOpenness =
				(baseline[fromId].tradeOpenness + baseline[toId].tradeOpenness) / 2;
			const ratio = baseAvgOpenness > 0 ? avgOpenness / baseAvgOpenness : 1;

			lines.push({
				from: fromId,
				to: toId,
				baselineWeight: baseWeight,
				currentWeight: baseWeight * ratio,
			});
		}
	}

	// Normalize stroke widths
	const maxWeight = Math.max(...lines.map((l) => l.currentWeight), 1);

	return (
		<g>
			{lines.map((line) => {
				const from = centroids[line.from];
				const to = centroids[line.to];
				if (!from || !to) return null;

				const normalizedWeight = line.currentWeight / maxWeight;
				const strokeWidth = 0.5 + 3.5 * normalizedWeight;

				const isConnectedToSelected =
					selectedCountry === line.from || selectedCountry === line.to;
				const opacity = selectedCountry
					? isConnectedToSelected
						? 0.6
						: 0.1
					: 0.3;

				return (
					<line
						key={`${line.from}-${line.to}`}
						x1={from.x}
						y1={from.y}
						x2={to.x}
						y2={to.y}
						stroke={CONNECTION_COLOR}
						strokeWidth={strokeWidth}
						opacity={opacity}
						strokeLinecap="round"
					/>
				);
			})}
		</g>
	);
}
