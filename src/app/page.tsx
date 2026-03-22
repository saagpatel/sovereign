"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import CountrySelector from "@/components/controls/CountrySelector";
import LeverPanel from "@/components/controls/LeverPanel";
import TimelineScrubber from "@/components/output/TimelineScrubber";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import { useSimulation } from "@/hooks/useSimulation";
import { useSimStore } from "@/store/simStore";
import type { CountryState } from "@/types";
import countryDataJson from "../../public/data/countryData.json";

const WorldMap = dynamic(() => import("@/components/map/WorldMap"), {
	ssr: false,
	loading: () => (
		<div className="h-[500px] bg-surface-900 animate-pulse rounded-lg" />
	),
});

const MetricPanel = dynamic(() => import("@/components/output/MetricPanel"), {
	ssr: false,
});

export default function Home() {
	const { run, isRunning } = useSimulation();
	const setBaseline = useSimStore((s) => s.setBaseline);
	const config = useSimStore((s) => s.config);
	const result = useSimStore((s) => s.result);
	const selectedCountry = useSimStore((s) => s.selectedCountry);

	useEffect(() => {
		const baselineMap: Record<string, CountryState> = {};
		for (const entry of countryDataJson) {
			baselineMap[entry.id] = entry as unknown as CountryState;
		}
		setBaseline(baselineMap);
	}, [setBaseline]);

	return (
		<main className="min-h-screen p-6 max-w-7xl mx-auto">
			<LoadingOverlay />

			<header className="mb-8">
				<h1 className="text-5xl font-bold tracking-tight mb-2">Sovereign</h1>
				<p className="text-lg font-light text-zinc-400 max-w-prose">
					Explore cascading geopolitical effects of policy decisions across 18
					countries and blocs
				</p>
			</header>

			<section className="grid grid-cols-[240px_1fr_auto] gap-6 mb-6 items-end">
				<CountrySelector />
				<LeverPanel />
				<button
					onClick={run}
					disabled={isRunning || !config}
					className="px-6 py-2.5 bg-accent hover:bg-accent-dim text-white font-bold rounded-lg transition-colors duration-150 disabled:opacity-50 h-[42px]"
				>
					{isRunning ? "Running..." : "Run Simulation"}
				</button>
			</section>

			<section className="mb-4">
				<WorldMap />
			</section>

			<section className="mb-6">
				<TimelineScrubber />
			</section>

			{result && (
				<p className="text-xs text-zinc-500 mb-6">
					{config?.runs ?? 1} runs completed in{" "}
					{result.runDurationMs.toFixed(0)}
					ms
				</p>
			)}

			{result && selectedCountry && (
				<section className="mb-8">
					<MetricPanel />
				</section>
			)}
		</main>
	);
}
