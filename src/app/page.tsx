"use client";

import { wrap } from "comlink";
import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import type { SimulationWorkerApi } from "@/sim/SimulationWorker";

const WorldMap = dynamic(() => import("@/components/map/WorldMap"), {
	ssr: false,
	loading: () => (
		<div className="h-[500px] bg-surface-900 animate-pulse rounded-lg" />
	),
});

export default function Home() {
	const [workerResult, setWorkerResult] = useState<number | null>(null);
	const [workerLoading, setWorkerLoading] = useState(false);

	const testWorker = useCallback(async () => {
		setWorkerLoading(true);
		try {
			const worker = new Worker(
				new URL("../sim/SimulationWorker.ts", import.meta.url),
			);
			const api = wrap<SimulationWorkerApi>(worker);
			const result = await api.add(17, 25);
			setWorkerResult(result);
			worker.terminate();
		} catch (err) {
			console.error("Worker failed:", err);
		} finally {
			setWorkerLoading(false);
		}
	}, []);

	return (
		<main className="min-h-screen p-6 max-w-7xl mx-auto">
			<header className="mb-8">
				<h1 className="text-5xl font-bold tracking-tight mb-2">Sovereign</h1>
				<p className="text-lg font-light text-zinc-400 max-w-prose">
					Explore cascading geopolitical effects of policy decisions across 18
					countries and blocs
				</p>
			</header>

			<section className="mb-8">
				<WorldMap />
			</section>

			<section className="flex items-center gap-4">
				<button
					onClick={testWorker}
					disabled={workerLoading}
					className="px-4 py-2.5 bg-accent hover:bg-accent-dim text-white font-bold rounded-lg transition-colors duration-150 disabled:opacity-50"
				>
					{workerLoading ? "Running..." : "Test Worker (17 + 25)"}
				</button>
				{workerResult !== null && (
					<span className="text-zinc-300 font-light">
						Result:{" "}
						<span className="font-bold text-positive">{workerResult}</span>
					</span>
				)}
			</section>
		</main>
	);
}
