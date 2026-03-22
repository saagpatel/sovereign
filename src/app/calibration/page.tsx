"use client";

import { useEffect, useState } from "react";
import { COUNTRIES } from "@/data/countries";
import { useSimulation } from "@/hooks/useSimulation";
import { useSimStore } from "@/store/simStore";
import type { CountryState, PolicyDomain, ScalarVariable } from "@/types";
import countryDataJson from "../../../public/data/countryData.json";

const DOMAINS: PolicyDomain[] = [
	"trade",
	"energy",
	"military",
	"immigration",
	"monetary",
	"technology",
];

const SCALAR_VARS: ScalarVariable[] = [
	"gdpGrowthRate",
	"tradeOpenness",
	"militarySpendingPct",
	"domesticStability",
	"energyIndependence",
	"techSelfSufficiency",
	"immigrationRate",
	"foreignReserves",
	"debtToGdp",
	"inflationRate",
];

const VAR_SHORT_NAMES: Record<ScalarVariable, string> = {
	gdpGrowthRate: "GDP%",
	tradeOpenness: "Trade",
	militarySpendingPct: "Mil%",
	domesticStability: "Stab",
	energyIndependence: "Energy",
	techSelfSufficiency: "Tech",
	immigrationRate: "Immig",
	foreignReserves: "Resv",
	debtToGdp: "Debt",
	inflationRate: "Infl%",
};

function getCellColor(
	delta: number,
	baseline: number,
	variable: ScalarVariable,
): string {
	const useAbsoluteThreshold =
		variable === "gdpGrowthRate" || variable === "immigrationRate";

	const isSignificant = useAbsoluteThreshold
		? Math.abs(delta) > 0.5
		: Math.abs(baseline) > 0.01 && Math.abs(delta / baseline) > 0.05;

	if (!isSignificant) return "";
	return delta < 0 ? "bg-red-500/20" : "bg-green-500/20";
}

export default function CalibrationPage() {
	const { run, isRunning } = useSimulation();
	const setBaseline = useSimStore((s) => s.setBaseline);
	const setConfig = useSimStore((s) => s.setConfig);
	const baseline = useSimStore((s) => s.baseline);
	const result = useSimStore((s) => s.result);

	const [actingCountry, setActingCountry] = useState("USA");
	const [domain, setDomain] = useState<PolicyDomain>("trade");
	const [magnitude, setMagnitude] = useState(0);
	const [month, setMonth] = useState(59);

	useEffect(() => {
		const baselineMap: Record<string, CountryState> = {};
		for (const entry of countryDataJson) {
			baselineMap[entry.id] = entry as unknown as CountryState;
		}
		setBaseline(baselineMap);
	}, [setBaseline]);

	const handleRun = () => {
		setConfig({
			lever: {
				domain,
				actingCountry,
				magnitude,
				label: `${domain} ${magnitude > 0 ? "+" : ""}${magnitude}`,
			},
			runs: 1,
			horizon: 60,
			noiseScale: 0,
		});
		setTimeout(() => run(), 0);
	};

	return (
		<main className="min-h-screen p-6 max-w-[1400px] mx-auto">
			<header className="mb-6">
				<h1 className="text-3xl font-bold tracking-tight mb-1">
					Calibration Console
				</h1>
				<p className="text-sm font-light text-zinc-400">
					Weight matrix tuning — run scenarios and inspect per-country variable
					deltas
				</p>
			</header>

			{/* Controls */}
			<section className="flex items-end gap-4 mb-6 flex-wrap">
				<div>
					<label className="block text-xs text-zinc-500 mb-1">Country</label>
					<select
						value={actingCountry}
						onChange={(e) => setActingCountry(e.target.value)}
						className="bg-surface-800 border border-surface-700 rounded px-2 py-1.5 text-sm text-zinc-100"
					>
						{COUNTRIES.map((c) => (
							<option key={c.id} value={c.id}>
								{c.name}
							</option>
						))}
					</select>
				</div>

				<div>
					<label className="block text-xs text-zinc-500 mb-1">Domain</label>
					<select
						value={domain}
						onChange={(e) => setDomain(e.target.value as PolicyDomain)}
						className="bg-surface-800 border border-surface-700 rounded px-2 py-1.5 text-sm text-zinc-100 capitalize"
					>
						{DOMAINS.map((d) => (
							<option key={d} value={d}>
								{d}
							</option>
						))}
					</select>
				</div>

				<div className="flex-1 max-w-xs">
					<label className="block text-xs text-zinc-500 mb-1">
						Magnitude: {magnitude > 0 ? "+" : ""}
						{magnitude}
					</label>
					<input
						type="range"
						min={-100}
						max={100}
						step={5}
						value={magnitude}
						onChange={(e) => setMagnitude(Number(e.target.value))}
						className="w-full accent-accent"
					/>
				</div>

				<button
					onClick={handleRun}
					disabled={isRunning}
					className="px-4 py-1.5 bg-accent hover:bg-accent-dim text-white font-bold text-sm rounded transition-colors disabled:opacity-50"
				>
					{isRunning ? "Running..." : "Run"}
				</button>

				{result && (
					<span className="text-xs text-zinc-500">
						{result.runDurationMs.toFixed(0)}ms
					</span>
				)}
			</section>

			{/* Month scrubber */}
			{result && (
				<section className="mb-4">
					<label className="block text-xs text-zinc-500 mb-1">
						Month: {month}
					</label>
					<input
						type="range"
						min={0}
						max={59}
						value={month}
						onChange={(e) => setMonth(Number(e.target.value))}
						className="w-full accent-accent"
					/>
				</section>
			)}

			{/* Data table */}
			<section className="overflow-x-auto">
				<table className="w-full text-xs border-collapse">
					<thead>
						<tr className="border-b border-surface-700">
							<th className="text-left py-2 px-2 text-zinc-400 font-light sticky left-0 bg-surface-950">
								Country
							</th>
							{SCALAR_VARS.map((v) => (
								<th
									key={v}
									className="text-right py-2 px-2 text-zinc-400 font-light"
								>
									{VAR_SHORT_NAMES[v]}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{COUNTRIES.map((c) => {
							const base = baseline?.[c.id];
							const band = result?.confidenceBands[c.id];
							const monthData = band?.monthly[month];

							return (
								<tr
									key={c.id}
									className="border-b border-surface-800 hover:bg-surface-900"
								>
									<td className="py-1.5 px-2 font-bold text-zinc-300 sticky left-0 bg-surface-950">
										{c.id}
									</td>
									{SCALAR_VARS.map((v) => {
										const baseVal = base?.[v] ?? 0;
										const p50 = monthData?.variables[v]?.p50;
										const delta =
											p50 !== undefined ? p50 - (baseVal as number) : 0;
										const cellColor = result
											? getCellColor(delta, baseVal as number, v)
											: "";

										return (
											<td
												key={v}
												className={`text-right py-1.5 px-2 tabular-nums ${cellColor}`}
												title={
													result
														? `Base: ${(baseVal as number).toFixed(1)}, Delta: ${delta > 0 ? "+" : ""}${delta.toFixed(2)}`
														: `Base: ${(baseVal as number).toFixed(1)}`
												}
											>
												{p50 !== undefined
													? p50.toFixed(1)
													: (baseVal as number).toFixed(1)}
											</td>
										);
									})}
								</tr>
							);
						})}
					</tbody>
				</table>
			</section>
		</main>
	);
}
