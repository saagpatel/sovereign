# Sovereign

## Communication Contract

- Follow `/Users/d/.codex/policies/communication/BigPictureReportingV1.md` for user-facing updates.
- Keep ordinary in-flight updates conversational, warm, PM-readable, operator-grade, and low-noise.
- Keep technical details in internal artifacts unless explicitly requested by the user or required by failure, risk, or verification.

## Project Goal

Sovereign is a client-side geopolitical simulation tool with a Web Worker Monte Carlo engine, D3-geo map, Recharts panels, and static Next.js export. Keep simulation work off the main thread and keep assumptions explainable.

## First Read

- `README.md` for product scope and local commands.
- `CLAUDE.md` for portfolio context, phase constraints, and project rules.
- `IMPLEMENTATION-ROADMAP.md` before changing scope or phase claims.
- `package.json`, `src/sim/`, `src/types/`, map components, and worker code before simulation, data, or UI changes.

## Core Rules

- Do not run Monte Carlo simulation logic on the main thread.
- Do not introduce backend dependencies unless explicitly requested.
- Do not hard-code API keys; World Bank and IMF-style public data paths must remain keyless or explicit.
- Keep simulation result state ephemeral in Zustand unless the user asks for persistence.
- Keep `src/sim/` strongly typed and test-backed.

## Codex App Usage

- Use Codex App Projects for repo-local implementation, review, and verification.
- Use a Worktree for dependency upgrades, worker contracts, simulation math, baseline data, or map rendering changes.
- Use browser or Playwright evidence for map selection, simulation controls, calibration views, confidence bands, and responsive UI.
- Use artifacts for scenario samples, calibration notes, release packets, and handoff summaries.
- Keep connectors read-first and task-scoped. Do not pull external data unless explicitly requested.

## Verification

- Use `.codex/verify.commands` as the canonical verifier for routine Codex work.
- Current canonical verifier:
  - `pnpm install --frozen-lockfile`
  - `pnpm test:run`
  - `pnpm typecheck`
  - `pnpm build`
- Current caveat: Vitest reports that `vite-tsconfig-paths` can be replaced by Vite's native `resolve.tsconfigPaths` option; this is warning-level cleanup.
- Add targeted browser or Playwright checks when simulation UI behavior changes.

## Done Criteria

- The requested change is implemented.
- Relevant checks were run, or the exact reason they were not run is stated.
- Simulation changes include deterministic test or sample scenario evidence.
- UI/map behavior changes include browser or Playwright evidence.
- Assumptions, risks, and next steps are summarized before closeout.
