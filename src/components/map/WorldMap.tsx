"use client";

import { geoNaturalEarth1, geoPath } from "d3-geo";
import type { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import { useCallback, useEffect, useState } from "react";
import { feature } from "topojson-client";
import type { Topology } from "topojson-specification";
import { BLOC_MEMBERS, isBloc, NUMERIC_TO_ENTITY } from "@/data/countries";
import { useSimStore } from "@/store/simStore";

type BlocId = keyof typeof BLOC_MEMBERS;

interface CountryFeature {
	id: string;
	entityId: string | null;
	path: string;
}

const projection = geoNaturalEarth1().scale(153).translate([480, 250]);
const pathGenerator = geoPath(projection);

function resolveEntityId(numericId: string): string | null {
	return NUMERIC_TO_ENTITY[numericId] ?? null;
}

function getBlocNumericIds(entityId: string): Set<string> {
	if (!isBloc(entityId)) return new Set();
	return new Set(BLOC_MEMBERS[entityId as BlocId]);
}

export default function WorldMap() {
	const [features, setFeatures] = useState<CountryFeature[]>([]);
	const selectedCountry = useSimStore((s) => s.selectedCountry);
	const selectCountry = useSimStore((s) => s.selectCountry);

	useEffect(() => {
		fetch("/data/world-110m.json")
			.then((res) => res.json())
			.then((topology: Topology) => {
				const countries = feature(
					topology,
					topology.objects.countries as Parameters<typeof feature>[1],
				) as FeatureCollection<Geometry, GeoJsonProperties>;

				const mapped = countries.features.map((f) => {
					const numericId = String(f.id);
					return {
						id: numericId,
						entityId: resolveEntityId(numericId),
						path: pathGenerator(f) ?? "",
					};
				});

				setFeatures(mapped);
			});
	}, []);

	const handleClick = useCallback(
		(entityId: string | null) => {
			if (!entityId) return;
			selectCountry(entityId);
			console.log(entityId);
		},
		[selectCountry],
	);

	const selectedNumericIds =
		selectedCountry && isBloc(selectedCountry)
			? getBlocNumericIds(selectedCountry)
			: null;

	return (
		<svg
			viewBox="0 0 960 500"
			className="w-full h-auto"
			role="img"
			aria-label="World map showing 18 countries and blocs"
		>
			{/* Background */}
			<rect width="960" height="500" fill="#0a0a0f" />

			{features.map((f) => {
				const isSelected =
					selectedCountry !== null &&
					(f.entityId === selectedCountry ||
						(selectedNumericIds !== null && selectedNumericIds.has(f.id)));

				const isModeled = f.entityId !== null;

				let fill: string;
				if (isSelected) {
					fill = "#3b82f6";
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
						onClick={() => handleClick(f.entityId)}
					/>
				);
			})}
		</svg>
	);
}
