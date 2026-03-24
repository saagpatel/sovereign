"use client";

import { COUNTRIES } from "@/data/countries";
import { useSimStore } from "@/store/simStore";

export default function CountrySelector() {
	const config = useSimStore((s) => s.config);
	const setConfig = useSimStore((s) => s.setConfig);

	const currentCountry = config?.lever.actingCountry ?? "USA";

	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setConfig({
			lever: {
				domain: config?.lever.domain ?? "trade",
				actingCountry: e.target.value,
				magnitude: config?.lever.magnitude ?? 0,
				label: "",
			},
			runs: 50,
			horizon: 60,
			noiseScale: 0.15,
		});
	};

	return (
		<div>
			<label
				htmlFor="country-select"
				className="block text-sm font-light text-zinc-400 mb-1"
			>
				Acting Country
			</label>
			<select
				id="country-select"
				value={currentCountry}
				onChange={handleChange}
				className="w-full bg-surface-800 border border-surface-700 rounded-lg px-3 py-2.5 text-zinc-100 focus:outline-none focus:border-accent transition-colors"
			>
				{COUNTRIES.map((c) => (
					<option key={c.id} value={c.id}>
						{c.name}
					</option>
				))}
			</select>
		</div>
	);
}
