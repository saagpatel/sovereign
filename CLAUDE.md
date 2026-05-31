# Sovereign

Client-side geopolitical simulation: select a country + policy lever, run a 50-run Monte Carlo simulation, explore cascading effects across 18 countries/blocs on a D3-geo world map. Research/educational tool — no backend, fully static.

## Stack

- Next.js 15.x — App Router, `output: 'export'` static build
- React 18.x — hooks only
- TypeScript 5.x — strict mode, zero `any`
- Tailwind CSS 3.x
- D3-geo 7.x + TopoJSON 3.x — choropleth + connection lines
- Zustand 4.x — global state
- Recharts 2.x — confidence band charts
- Comlink 4.x — type-safe Web Worker RPC

## Build / Test / Run

```bash
pnpm dev          # dev server
pnpm build        # Next.js static export
pnpm typecheck    # tsc --noEmit
pnpm test         # vitest (watch)
pnpm test:run     # vitest run (CI)
pnpm lint         # next lint
```

Deployment: Vercel (`vercel.json` + `@vercel/analytics`); self-hosting via nginx documented in DEPLOYMENT.md.

## Conventions

- TypeScript strict — type with `unknown` + narrowing; `src/types/index.ts` is the source of truth for sim types
- File naming: kebab-case files, PascalCase components
- Conventional commits: `feat:`, `fix:`, `chore:`, `data:` (for weight matrix changes)
- Tests required for all `src/sim/` modules; use `vitest run` before committing sim changes
- D3 code is client-only — guard with `use client` and dynamic imports

## Architecture Gates

- **Simulation on worker only** — all Monte Carlo runs go through `SimulationWorker.ts` via Comlink; running on the main thread blocks the UI
- **Sim results stay in Zustand** — results are ephemeral; `localStorage`/`sessionStorage` are out of scope
- **No API keys** — World Bank and IMF APIs require no authentication; expose nothing
- **`/calibration` route** — primary testing interface for weight matrix tuning; keep it working

## Key Decisions

| Decision | Choice | Why |
|---|---|---|
| Platform | Next.js static export | Self-hostable, no backend infra |
| Sim engine | Client-side Web Worker | No backend; Comlink for type safety |
| Uncertainty model | 50-run Monte Carlo, Gaussian noise σ=0.15× | Stable confidence bands, < 4s on M1 Air |
| Map library | D3-geo + TopoJSON | SVG control for choropleth + connection lines |
| State management | Zustand | Minimal boilerplate, Worker-message-friendly |
| Countries | 18 blocs (see ROADMAP) | Tractable influence graph, all major actors covered |
| Deployment | Vercel static export | `vercel.json` in place; nginx self-hosting in DEPLOYMENT.md |
| Baseline data | Hardcoded 2025 + optional WB refresh | Stable default, public API, no keys needed |

Phase history: IMPLEMENTATION-ROADMAP.md. Deployment status: docs/PORTFOLIO-DISPOSITION.md.

<!-- portfolio-context:start -->
# Portfolio Context

## What This Project Is

Sovereign is a client-side geopolitical simulation tool for the web. Users select a country and policy lever, trigger a 50-run Monte Carlo simulation, and explore cascading second and third-order effects across 18 countries/blocs on an interactive D3-geo world map. Built as a research and educational tool — shareable, self-hostable, no backend required.

## Current State

**v1 Complete (all 4 phases shipped)**
See IMPLEMENTATION-ROADMAP.md for full phase history. See docs/PORTFOLIO-DISPOSITION.md for deployment status.

## Stack

- Next.js: 15.x (App Router, `output: 'export'` static build)
- React: 18.x (hooks only, no class components)
- TypeScript: 5.x (strict mode, zero `any`)
- Tailwind CSS: 3.x
- D3-geo: 7.x + TopoJSON 3.x — world map, choropleth, connection lines
- Zustand: 4.x — global state management
- Recharts: 2.x — confidence band charts
- Comlink: 4.x — type-safe Web Worker RPC

## How To Run

- TypeScript strict mode — no `any`, no `@ts-ignore`
- File naming: kebab-case for files, PascalCase for components
- Conventional commits: `feat:`, `fix:`, `chore:`, `data:` (for weight matrix changes)
- Unit tests required for all `src/sim/` modules before committing
- D3 code is client-only — always guard with `use client` and dynamic imports
- Web Worker is the simulation engine — never run Monte Carlo on the main thread

## Known Risks

- Do not run simulation logic on the main thread — all Monte Carlo runs go through `SimulationWorker.ts` via Comlink
- Do not add features outside the current phase in IMPLEMENTATION-ROADMAP.md
- Do not use `localStorage` or `sessionStorage` for simulation results — keep sim results in Zustand only (results are ephemeral)
- Do not expose or hardcode any API keys — World Bank and IMF APIs require no authentication
- Do not use class components or `React.Component` — hooks only
- Do not skip the `/calibration` debug route — it is the primary testing interface for weight matrix tuning
- Do not use `any` types in `src/sim/` — simulation types are fully specified in `src/types/index.ts`

## Next Recommended Move

Use this context plus the README and supporting docs to resume the next active task, then promote the repo beyond minimum-viable by capturing a dedicated handoff, roadmap, or discovery artifact.

<!-- portfolio-context:end -->
