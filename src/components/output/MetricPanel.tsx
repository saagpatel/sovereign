"use client";

import {
	Area,
	CartesianGrid,
	ComposedChart,
	Line,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { COUNTRIES } from "@/data/countries";
import { useSimStore } from "@/store/simStore";
import type { PolicyDomain, ScalarVariable } from "@/types";

// ─── Chart color tokens ───────────────────────────────────────────────────────

const CHART_COLORS = {
	accent: "#3b82f6",
	gridLine: "#2a2a3a",
	tick: "#71717a",
	tooltipBg: "#1c1c26",
	tooltipBorder: "#2a2a3a",
	tooltipText: "#a1a1aa",
	tooltipLabel: "#e4e4e7",
	bandFill: "#1c1c26",
} as const;

// ─── Display names ───────────────────────────────────────────────────────────

const VAR_DISPLAY_NAMES: Record<ScalarVariable, string> = {
	gdpGrowthRate: "GDP Growth Rate (%)",
	tradeOpenness: "Trade Openness",
	militarySpendingPct: "Military Spending (% GDP)",
	domesticStability: "Domestic Stability",
	energyIndependence: "Energy Independence",
	techSelfSufficiency: "Tech Self-Sufficiency",
	immigrationRate: "Immigration Rate",
	foreignReserves: "Foreign Reserves (months)",
	debtToGdp: "Debt to GDP (%)",
	inflationRate: "Inflation Rate (%)",
};

// ─── Domain → 4th chart variable ─────────────────────────────────────────────

const DOMAIN_VARIABLE: Record<PolicyDomain, ScalarVariable> = {
	trade: "inflationRate",
	energy: "energyIndependence",
	military: "militarySpendingPct",
	immigration: "immigrationRate",
	monetary: "inflationRate",
	technology: "techSelfSufficiency",
};

// ─── Chart data shape ─────────────────────────────────────────────────────────

interface ChartPoint {
	month: number;
	p10: number;
	p50: number;
	p90: number;
}

// ─── Single chart ─────────────────────────────────────────────────────────────

interface MetricChartProps {
	title: string;
	data: ChartPoint[];
}

function MetricChart({ title, data }: MetricChartProps) {
	return (
		<div className="flex flex-col gap-2">
			<p className="text-xs font-light text-zinc-400 tracking-wide">{title}</p>
			<ResponsiveContainer width="100%" height={200}>
				<ComposedChart
					data={data}
					margin={{ top: 4, right: 8, bottom: 4, left: 0 }}
				>
					<CartesianGrid
						stroke={CHART_COLORS.gridLine}
						strokeDasharray="3 3"
						vertical={false}
					/>
					<XAxis
						dataKey="month"
						tick={{ fill: CHART_COLORS.tick, fontSize: 10 }}
						tickLine={false}
						axisLine={false}
						label={{
							value: "Month",
							position: "insideBottom",
							offset: -2,
							fill: CHART_COLORS.tick,
							fontSize: 10,
						}}
						height={28}
					/>
					<YAxis
						tick={{ fill: CHART_COLORS.tick, fontSize: 10 }}
						tickLine={false}
						axisLine={false}
						width={40}
					/>
					<Tooltip
						contentStyle={{
							backgroundColor: CHART_COLORS.tooltipBg,
							border: `1px solid ${CHART_COLORS.tooltipBorder}`,
							borderRadius: "6px",
							fontSize: 11,
							color: CHART_COLORS.tooltipText,
						}}
						itemStyle={{ color: CHART_COLORS.tooltipText }}
						labelStyle={{ color: CHART_COLORS.tooltipLabel }}
						formatter={(value: number, name: string) => [
							value.toFixed(2),
							name === "p50" ? "Median" : name === "p10" ? "P10" : "P90",
						]}
					/>
					{/* Confidence band: area between p10 and p90 */}
					<Area
						type="monotone"
						dataKey="p90"
						stroke="transparent"
						fill={CHART_COLORS.accent}
						fillOpacity={0.15}
						legendType="none"
						activeDot={false}
						isAnimationActive={false}
					/>
					<Area
						type="monotone"
						dataKey="p10"
						stroke="transparent"
						fill={CHART_COLORS.bandFill}
						fillOpacity={1}
						legendType="none"
						activeDot={false}
						isAnimationActive={false}
					/>
					{/* Median line */}
					<Line
						type="monotone"
						dataKey="p50"
						stroke={CHART_COLORS.accent}
						strokeWidth={1.5}
						dot={false}
						activeDot={{ r: 3, fill: CHART_COLORS.accent }}
						isAnimationActive={false}
					/>
				</ComposedChart>
			</ResponsiveContainer>
		</div>
	);
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function MetricPanel() {
	const result = useSimStore((s) => s.result);
	const selectedCountry = useSimStore((s) => s.selectedCountry);
	const config = useSimStore((s) => s.config);

	if (!selectedCountry || !result) {
		return (
			<div className="flex items-center justify-center h-40 text-zinc-600 text-sm font-light select-none">
				Select a country to view metrics
			</div>
		);
	}

	const band = result.confidenceBands[selectedCountry];
	if (!band) {
		return (
			<div className="flex items-center justify-center h-40 text-zinc-600 text-sm font-light select-none">
				No simulation data for this country
			</div>
		);
	}

	const countryName =
		COUNTRIES.find((c) => c.id === selectedCountry)?.name ?? selectedCountry;

	const domain = config?.lever.domain ?? "trade";
	const domainVar = DOMAIN_VARIABLE[domain];

	// The four variables to chart — slot 3 is always tradeOpenness, but if
	// the domain variable happens to be tradeOpenness we swap to inflationRate
	// (already handled by DOMAIN_VARIABLE["trade"] = "inflationRate").
	const variables: [
		ScalarVariable,
		ScalarVariable,
		ScalarVariable,
		ScalarVariable,
	] = ["gdpGrowthRate", "domesticStability", "tradeOpenness", domainVar];

	const buildChartData = (variable: ScalarVariable): ChartPoint[] =>
		band.monthly.map((m) => ({
			month: m.month,
			p10: m.variables[variable].p10,
			p50: m.variables[variable].p50,
			p90: m.variables[variable].p90,
		}));

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-baseline gap-2">
				<h2 className="text-base font-bold text-zinc-200">{countryName}</h2>
				<span className="text-xs font-light text-zinc-500">
					60-month confidence bands · 50 runs
				</span>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
				{variables.map((variable) => (
					<MetricChart
						key={variable}
						title={VAR_DISPLAY_NAMES[variable]}
						data={buildChartData(variable)}
					/>
				))}
			</div>
		</div>
	);
}
