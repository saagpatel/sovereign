# Sovereign

## Overview
Sovereign is a client-side geopolitical simulation tool for the web. Users select a country and policy lever, trigger a 50-run Monte Carlo simulation, and explore cascading second and third-order effects across 18 countries/blocs on an interactive D3-geo world map. Built as a research and educational tool — shareable, self-hostable, no backend required.

## Tech Stack
- Next.js: 14.x (App Router, `output: 'export'` static build)
- React: 18.x (hooks only, no class components)
- TypeScript: 5.x (strict mode, zero `any`)
- Tailwind CSS: 3.x
- D3-geo: 7.x + TopoJSON 3.x — world map, choropleth, connection lines
- Zustand: 4.x — global state management
- Recharts: 2.x — confidence band charts
- Comlink: 4.x — type-safe Web Worker RPC

## Development Conventions
- TypeScript strict mode — no `any`, no `@ts-ignore`
- File naming: kebab-case for files, PascalCase for components
- Conventional commits: `feat:`, `fix:`, `chore:`, `data:` (for weight matrix changes)
- Unit tests required for all `src/sim/` modules before committing
- D3 code is client-only — always guard with `use client` and dynamic imports
- Web Worker is the simulation engine — never run Monte Carlo on the main thread

## Current Phase
**Phase 0: Foundation**
See IMPLEMENTATION-ROADMAP.md for full phase details and acceptance criteria.

## Key Decisions
| Decision | Choice | Why |
|---|---|---|
| Platform | Next.js static export | Broader reach, self-hostable, no backend infra |
| Sim engine location | Client-side Web Worker | No backend; Comlink for type safety |
| Uncertainty model | 50-run Monte Carlo, Gaussian noise σ=0.15× | Stable confidence bands, < 4s on M1 Air |
| Map library | D3-geo + TopoJSON | Full SVG control for choropleth + connection lines |
| State management | Zustand | Minimal boilerplate, Worker-message-friendly |
| Countries | 18 blocs (see ROADMAP) | Tractable influence graph, all major actors covered |
| Deployment | Self-hosted nginx static | No Vercel dependency; `out/` dir served directly |
| Baseline data | Hardcoded 2025 + optional WB refresh | Stable default, public API, no keys needed |

## Do NOT
- Do not run simulation logic on the main thread — all Monte Carlo runs go through `SimulationWorker.ts` via Comlink
- Do not add features outside the current phase in IMPLEMENTATION-ROADMAP.md
- Do not use `localStorage` or `sessionStorage` for simulation results — keep sim results in Zustand only (results are ephemeral)
- Do not expose or hardcode any API keys — World Bank and IMF APIs require no authentication
- Do not use class components or `React.Component` — hooks only
- Do not skip the `/calibration` debug route — it is the primary testing interface for weight matrix tuning
- Do not use `any` types in `src/sim/` — simulation types are fully specified in `src/types/index.ts`
