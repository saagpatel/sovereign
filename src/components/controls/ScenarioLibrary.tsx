"use client";

import { COUNTRIES } from "@/data/countries";
import { SCENARIOS } from "@/data/scenarios";
import { useSimulation } from "@/hooks/useSimulation";
import { useSimStore } from "@/store/simStore";
import type { PolicyDomain } from "@/types";

const DOMAIN_COLORS: Record<PolicyDomain, string> = {
	trade: "bg-amber-500/20 text-amber-400",
	energy: "bg-orange-500/20 text-orange-400",
	military: "bg-red-500/20 text-red-400",
	immigration: "bg-emerald-500/20 text-emerald-400",
	monetary: "bg-blue-500/20 text-blue-400",
	technology: "bg-violet-500/20 text-violet-400",
};

const countryName = (iso: string): string =>
	COUNTRIES.find((c) => c.id === iso)?.name ?? iso;

export default function ScenarioLibrary() {
	const config = useSimStore((s) => s.config);
	const setConfig = useSimStore((s) => s.setConfig);
	const { run } = useSimulation();

	const activeScenarioId = SCENARIOS.find(
		(s) =>
			config?.lever.domain === s.lever.domain &&
			config?.lever.actingCountry === s.lever.actingCountry &&
			config?.lever.magnitude === s.lever.magnitude,
	)?.id;

	const handleScenarioClick = (scenarioId: string) => {
		if (useSimStore.getState().isRunning) return;
		const scenario = SCENARIOS.find((s) => s.id === scenarioId);
		if (!scenario) return;

		setConfig({
			lever: scenario.lever,
			runs: 50,
			horizon: 60,
			noiseScale: 0.15,
		});

		setTimeout(() => run(), 0);
	};

	return (
		<div>
			<h2 className="text-lg font-bold text-zinc-200 mb-3">Scenarios</h2>
			<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
				{SCENARIOS.map((scenario) => {
					const isActive = activeScenarioId === scenario.id;
					return (
						<button
							key={scenario.id}
							onClick={() => handleScenarioClick(scenario.id)}
							className={`text-left p-3 rounded-lg border transition-colors ${
								isActive
									? "border-accent bg-accent/10"
									: "border-surface-700 bg-surface-900 hover:bg-surface-800"
							}`}
						>
							<div className="flex items-center gap-2 mb-1.5">
								<span
									className={`text-xs px-1.5 py-0.5 rounded ${DOMAIN_COLORS[scenario.lever.domain]}`}
								>
									{scenario.lever.domain}
								</span>
							</div>
							<div className="text-sm font-bold text-zinc-200 mb-1 line-clamp-2">
								{scenario.title}
							</div>
							<div className="text-xs text-zinc-400 mb-1.5">
								{countryName(scenario.lever.actingCountry)}
							</div>
							{scenario.historicalAnalog && (
								<div className="text-xs text-zinc-400 italic">
									{scenario.historicalAnalog}
								</div>
							)}
						</button>
					);
				})}
			</div>
		</div>
	);
}
