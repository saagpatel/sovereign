import * as Comlink from "comlink";

const workerApi = {
	add(a: number, b: number): number {
		return a + b;
	},
};

export type SimulationWorkerApi = typeof workerApi;

Comlink.expose(workerApi);
