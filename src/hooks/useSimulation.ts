"use client";

import { type Remote, wrap } from "comlink";
import { useCallback, useRef } from "react";
import type { SimulationWorkerApi } from "@/sim/SimulationWorker";
import { useSimStore } from "@/store/simStore";

export function useSimulation() {
	const workerRef = useRef<Worker | null>(null);

	const run = useCallback(async () => {
		const { config, baseline, setRunning, setProgress, setResult } =
			useSimStore.getState();
		if (!config || !baseline) return;

		setRunning(true);
		setProgress(0);

		if (workerRef.current) {
			workerRef.current.terminate();
		}

		const worker = new Worker(
			new URL("../sim/SimulationWorker.ts", import.meta.url),
		);
		workerRef.current = worker;
		const api: Remote<SimulationWorkerApi> = wrap(worker);

		try {
			setProgress(10);
			const result = await api.runSim(config, baseline);
			setResult(result);
		} catch (err) {
			console.error("Simulation failed:", err);
			setRunning(false);
		} finally {
			worker.terminate();
			workerRef.current = null;
		}
	}, []);

	const isRunning = useSimStore((s) => s.isRunning);

	return { run, isRunning };
}
