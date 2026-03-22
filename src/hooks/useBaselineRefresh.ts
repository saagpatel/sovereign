"use client";

import { useCallback, useState } from "react";
import { COUNTRIES, ISO3_TO_ISO2 } from "@/data/countries";
import { WB_API_BASE, WB_INDICATORS } from "@/data/worldBankMapping";
import { useSimStore } from "@/store/simStore";
import type { CountryState } from "@/types";

const CACHE_KEY = "sovereign-baseline-cache";
const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const BATCH_SIZE = 20;

interface CacheEntry {
	data: Record<string, Partial<CountryState>>;
	refreshedAt: number;
}

function loadCache(): CacheEntry | null {
	try {
		const raw = localStorage.getItem(CACHE_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw) as CacheEntry;
		if (Date.now() - parsed.refreshedAt > CACHE_TTL_MS) return null;
		return parsed;
	} catch {
		return null;
	}
}

async function fetchIndicator(
	iso2: string,
	indicatorCode: string,
): Promise<number | null> {
	try {
		const url = `${WB_API_BASE}/country/${iso2}/indicator/${indicatorCode}?format=json&mrv=1&per_page=1`;
		const res = await fetch(url);
		if (!res.ok) return null;
		const json = await res.json();
		// WB API returns [metadata, data[]]
		if (!Array.isArray(json) || json.length < 2) return null;
		const records = json[1];
		if (!Array.isArray(records) || records.length === 0) return null;
		const value = records[0]?.value;
		return typeof value === "number" ? value : null;
	} catch {
		return null;
	}
}

export function useBaselineRefresh() {
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [lastRefreshed, setLastRefreshed] = useState<string | null>(() => {
		const cache = loadCache();
		return cache ? new Date(cache.refreshedAt).toLocaleDateString() : null;
	});
	const baseline = useSimStore((s) => s.baseline);
	const setBaseline = useSimStore((s) => s.setBaseline);

	const hydrate = useCallback(() => {
		if (!baseline) return;
		const cache = loadCache();
		if (!cache) return;

		const merged = { ...baseline };
		for (const [iso, partial] of Object.entries(cache.data)) {
			if (merged[iso]) {
				merged[iso] = { ...merged[iso], ...partial };
			}
		}
		setBaseline(merged);
		setLastRefreshed(new Date(cache.refreshedAt).toLocaleDateString());
	}, [baseline, setBaseline]);

	const refresh = useCallback(async () => {
		if (!baseline) return;
		setIsRefreshing(true);

		const updates: Record<string, Partial<CountryState>> = {};
		const indicatorCodes = Object.keys(WB_INDICATORS);

		// Build all fetch tasks
		const tasks: Array<{
			iso3: string;
			iso2: string;
			code: string;
			variable: string;
		}> = [];
		for (const country of COUNTRIES) {
			const iso2 = ISO3_TO_ISO2[country.id];
			if (!iso2) continue;
			for (const code of indicatorCodes) {
				tasks.push({
					iso3: country.id,
					iso2,
					code,
					variable: WB_INDICATORS[code],
				});
			}
		}

		// Process in batches
		for (let i = 0; i < tasks.length; i += BATCH_SIZE) {
			const batch = tasks.slice(i, i + BATCH_SIZE);
			const results = await Promise.allSettled(
				batch.map(async (task) => {
					const value = await fetchIndicator(task.iso2, task.code);
					return { ...task, value };
				}),
			);

			for (const result of results) {
				if (result.status === "fulfilled" && result.value.value !== null) {
					const { iso3, variable, value } = result.value;
					if (!updates[iso3]) updates[iso3] = {};
					(updates[iso3] as Record<string, number>)[variable] = value;
				}
			}
		}

		// Merge updates into baseline
		const merged = { ...baseline };
		for (const [iso, partial] of Object.entries(updates)) {
			if (merged[iso]) {
				merged[iso] = { ...merged[iso], ...partial };
			}
		}

		// Cache
		const cacheEntry: CacheEntry = {
			data: updates,
			refreshedAt: Date.now(),
		};
		try {
			localStorage.setItem(CACHE_KEY, JSON.stringify(cacheEntry));
		} catch {
			// localStorage full — silently skip
		}

		setBaseline(merged);
		setLastRefreshed(new Date().toLocaleDateString());
		setIsRefreshing(false);
	}, [baseline, setBaseline]);

	return { refresh, hydrate, isRefreshing, lastRefreshed };
}
