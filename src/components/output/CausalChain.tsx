"use client";

import { useState } from "react";
import { COUNTRIES } from "@/data/countries";
import { useSimStore } from "@/store/simStore";

const countryName = (iso: string): string =>
	COUNTRIES.find((c) => c.id === iso)?.name ?? iso;

export default function CausalChain() {
	const result = useSimStore((s) => s.result);
	const [expanded, setExpanded] = useState(true);

	if (!result || result.causalChain.length === 0) return null;

	return (
		<div className="border border-surface-700 rounded-lg overflow-hidden">
			<button
				onClick={() => setExpanded(!expanded)}
				className="w-full flex items-center justify-between px-4 py-3 bg-surface-900 hover:bg-surface-800 transition-colors"
			>
				<span className="text-sm font-bold text-zinc-200">
					Causal Chain — Top {result.causalChain.length} Events
				</span>
				<span className="text-zinc-500 text-xs">
					{expanded ? "collapse" : "expand"}
				</span>
			</button>

			{expanded && (
				<div className="divide-y divide-surface-800">
					{result.causalChain.map((event, i) => {
						const isPositive = event.delta > 0;
						return (
							<div
								key={`${event.month}-${event.sourceCountry}-${event.targetCountry}-${event.variable}-${i}`}
								className="px-4 py-2.5 text-sm"
							>
								<div className="flex items-center gap-2 mb-1">
									<span className="text-xs text-zinc-500 tabular-nums w-16">
										Month {event.month}
									</span>
									<span className="text-zinc-300 font-bold">
										{countryName(event.sourceCountry)}
									</span>
									<span className="text-zinc-500">&rarr;</span>
									<span className="text-zinc-300 font-bold">
										{countryName(event.targetCountry)}
									</span>
									<span className="text-zinc-400">:</span>
									<span className="text-zinc-200">{event.variable}</span>
									<span
										className={`font-bold tabular-nums ${isPositive ? "text-positive" : "text-negative"}`}
									>
										{isPositive ? "+" : ""}
										{event.delta.toFixed(1)}
									</span>
								</div>
								<div className="text-xs text-zinc-500 ml-16">
									{event.mechanism}
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
