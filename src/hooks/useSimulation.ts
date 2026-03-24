"use client";

import { proxy, type Remote, wrap } from "comlink";
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

		const onProgress = proxy((event: { runsCompleted: number }) => {
			const pct = Math.round((event.runsCompleted / (config.runs || 50)) * 100);
			setProgress(pct);
		});

		try {
			const result = await api.runSim(config, baseline, onProgress);
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
	const progress = useSimStore((s) => s.progress);

	return { run, isRunning, progress };
}
