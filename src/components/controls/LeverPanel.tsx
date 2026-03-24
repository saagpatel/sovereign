"use client";

import { useSimStore } from "@/store/simStore";
import type { PolicyDomain } from "@/types";

const DOMAINS: PolicyDomain[] = [
	"trade",
	"energy",
	"military",
	"immigration",
	"monetary",
	"technology",
];

const DOMAIN_LABELS: Record<PolicyDomain, Record<string, string>> = {
	trade: {
		"-100": "Full embargo",
		"-50": "Major tariffs",
		"0": "Baseline",
		"50": "Trade deal",
		"100": "Deep integration",
	},
	energy: {
		"-100": "Full supply cutoff",
		"-50": "Major reduction",
		"0": "Baseline",
		"50": "Energy partnership",
		"100": "Full energy union",
	},
	military: {
		"-100": "Full withdrawal",
		"-50": "Major drawdown",
		"0": "Baseline",
		"50": "Enhanced cooperation",
		"100": "Full alliance upgrade",
	},
	immigration: {
		"-100": "Full closure",
		"-50": "Major restriction",
		"0": "Baseline",
		"50": "Open pathways",
		"100": "Free movement",
	},
	monetary: {
		"-100": "Major devaluation",
		"-50": "Moderate easing",
		"0": "Baseline",
		"50": "Moderate tightening",
		"100": "Major appreciation",
	},
	technology: {
		"-100": "Full export ban",
		"-50": "Major restrictions",
		"0": "Baseline",
		"50": "Tech sharing",
		"100": "Full tech union",
	},
};

function getClosestLabel(domain: PolicyDomain, magnitude: number): string {
	const labels = DOMAIN_LABELS[domain];
	const ticks = [-100, -50, 0, 50, 100];
	let closest = ticks[0];
	for (const t of ticks) {
		if (Math.abs(t - magnitude) < Math.abs(closest - magnitude)) {
			closest = t;
		}
	}
	return labels[String(closest)];
}

export default function LeverPanel() {
	const config = useSimStore((s) => s.config);
	const setConfig = useSimStore((s) => s.setConfig);

	const currentDomain = config?.lever.domain ?? "trade";
	const currentMagnitude = config?.lever.magnitude ?? 0;
	const labels = DOMAIN_LABELS[currentDomain];

	const updateConfig = (domain: PolicyDomain, magnitude: number) => {
		setConfig({
			lever: {
				domain,
				actingCountry: config?.lever.actingCountry ?? "USA",
				magnitude,
				label: getClosestLabel(domain, magnitude),
			},
			runs: 50,
			horizon: 60,
			noiseScale: 0.15,
		});
	};

	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center gap-4">
				<div>
					<label
						htmlFor="domain-select"
						className="block text-sm font-light text-zinc-400 mb-1"
					>
						Policy Domain
					</label>
					<select
						id="domain-select"
						value={currentDomain}
						onChange={(e) =>
							updateConfig(e.target.value as PolicyDomain, currentMagnitude)
						}
						className="bg-surface-800 border border-surface-700 rounded-lg px-3 py-2.5 text-zinc-100 focus:outline-none focus:border-accent transition-colors capitalize"
					>
						{DOMAINS.map((d) => (
							<option key={d} value={d} className="capitalize">
								{d}
							</option>
						))}
					</select>
				</div>

				<div className="flex-1">
					<div className="flex justify-between text-sm font-light text-zinc-400 mb-1">
						<span>Magnitude</span>
						<span className="font-bold text-zinc-200">
							{currentMagnitude > 0 ? "+" : ""}
							{currentMagnitude}
						</span>
					</div>
					<input
						type="range"
						min={-100}
						max={100}
						step={5}
						value={currentMagnitude}
						onChange={(e) =>
							updateConfig(currentDomain, Number(e.target.value))
						}
						className="w-full accent-accent"
					/>
					<div className="flex justify-between text-xs text-zinc-500 mt-1">
						<span>{labels["-100"]}</span>
						<span>{labels["0"]}</span>
						<span>{labels["100"]}</span>
					</div>
				</div>
			</div>
		</div>
	);
}
