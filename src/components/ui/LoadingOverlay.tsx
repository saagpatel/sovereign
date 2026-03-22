"use client";

import { useSimStore } from "@/store/simStore";

export default function LoadingOverlay() {
	const isRunning = useSimStore((s) => s.isRunning);
	const progress = useSimStore((s) => s.progress);

	if (!isRunning) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-950/80 backdrop-blur-sm">
			<div className="flex flex-col items-center gap-4">
				<div className="text-xl font-bold text-zinc-100">
					Running simulation&hellip;
				</div>
				<div className="w-64 h-2 bg-surface-800 rounded-full overflow-hidden">
					<div
						className="h-full bg-accent rounded-full transition-all duration-200"
						style={{ width: `${progress}%` }}
					/>
				</div>
				<div className="text-sm text-zinc-400">{progress}%</div>
			</div>
		</div>
	);
}
