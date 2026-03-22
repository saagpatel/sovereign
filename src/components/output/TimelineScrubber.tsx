"use client";

import { useCallback, useRef } from "react";
import { useSimStore } from "@/store/simStore";

export default function TimelineScrubber() {
	const scrubPosition = useSimStore((s) => s.scrubPosition);
	const setScrubPosition = useSimStore((s) => s.setScrubPosition);
	const result = useSimStore((s) => s.result);
	const rafRef = useRef<number | null>(null);

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const value = Number(e.target.value);
			// Debounce to 16ms (one frame) via requestAnimationFrame
			if (rafRef.current !== null) {
				cancelAnimationFrame(rafRef.current);
			}
			rafRef.current = requestAnimationFrame(() => {
				setScrubPosition(value);
				rafRef.current = null;
			});
		},
		[setScrubPosition],
	);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === "ArrowLeft") {
				e.preventDefault();
				setScrubPosition(Math.max(0, scrubPosition - 1));
			} else if (e.key === "ArrowRight") {
				e.preventDefault();
				setScrubPosition(Math.min(59, scrubPosition + 1));
			}
		},
		[scrubPosition, setScrubPosition],
	);

	if (!result) return null;

	return (
		<div className="flex items-center gap-4">
			<label
				htmlFor="timeline-scrubber"
				className="text-sm font-light text-zinc-400 whitespace-nowrap"
			>
				Month {scrubPosition}
			</label>
			<input
				id="timeline-scrubber"
				type="range"
				min={0}
				max={59}
				value={scrubPosition}
				onChange={handleChange}
				onKeyDown={handleKeyDown}
				className="flex-1 accent-accent"
				aria-label={`Timeline scrubber, month ${scrubPosition}`}
			/>
		</div>
	);
}
