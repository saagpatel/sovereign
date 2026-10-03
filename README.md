# Sovereign

[![TypeScript](https://img.shields.io/badge/TypeScript-3178c6?style=flat-square&logo=typescript)](#) [![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](#)

> What happens to the global economy if one country raises tariffs by 20%?

Sovereign is a browser-based geopolitical simulation tool. Apply a policy lever — trade tariff, military spending shift, immigration change, or currency devaluation — to any of 18 countries and blocs, then watch cascading effects ripple across the world over a 60-month horizon. Up to 50 Monte Carlo passes with configurable noise produce p10/p50/p90 confidence bands for 10 macroeconomic variables per country.

## Features

- **18 countries and blocs** — US, EU, China, Russia, UK, India, Japan, Brazil, and more, each with calibrated baseline economic parameters
- **6 policy domains** — trade, energy, military, immigration, monetary, and technology
- **Monte Carlo engine** — up to 50 simulation passes in a Web Worker via Comlink; no UI blocking
- **Confidence bands** — p10/p50/p90 bands across GDP growth, inflation, trade openness, debt-to-GDP, foreign reserves, and 5 other variables
- **Interactive world map** — D3-geo + TopoJSON globe with country selection and hover tooltips
- **Timeline scrubber** — step through any of the 60 months to see the state at that moment
- **Causal chain view** — top-10 ranked causal links explaining how your policy propagated

## Quick Start

### Prerequisites
- Node.js 22.22.2+ in the Node 22 line (the locked jsdom 30 test environment requires it)
- pnpm 11.5.2, as pinned by `packageManager` in `package.json`

### Installation
```bash
pnpm install --frozen-lockfile
```

### Usage
```bash
# Development server
pnpm dev

# Run tests once (pnpm test is watch mode outside CI)
pnpm test:run

# Type-check
pnpm typecheck
```

## Verification

Run commands from the root using the committed `pnpm-lock.yaml` and the pinned
pnpm version. There is no npm lockfile for `npm ci`. A focused deterministic
store check is:

```bash
pnpm test:run src/store/simStore.test.ts
```

[`.codex/verify.commands`](.codex/verify.commands) is the authoritative routine
lane: frozen install, one-shot tests, typecheck, and static build. Run the listed
commands from the root. CI additionally runs `pnpm audit --audit-level high`;
a vulnerability/publication failure is a separate blocking gate, even when the
local tests/build pass. Do not lower that threshold to deliver documentation.

The current `lint` script invokes `next lint`, which Next 16 does not provide;
the checked-in legacy ESLint config is not a functioning ESLint 10 lane. No
formatter command is configured. Report this tooling limitation rather than
counting `pnpm lint` as successful or inventing a replacement gate.

For changes to map selection, simulation controls, calibration, confidence bands,
or responsiveness, start `pnpm dev` on a disposable local port and use synthetic
scenarios for browser/Playwright checks. Keep external data connectors unused
unless that capability is specifically being tested. Pure documentation changes
need no simulation session or browser run.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5.7 |
| Simulation | Web Worker via Comlink |
| State | Zustand |
| Geo visualization | D3-geo + TopoJSON |
| Charts | Recharts |
| Styling | Tailwind CSS 3 |
| Testing | Vitest + Testing Library |

## Architecture

The simulation engine runs entirely in a Web Worker, keeping the UI responsive during heavy Monte Carlo passes. Comlink provides a transparent async proxy so the React layer calls `await worker.simulate(params)` like a regular function. Results — p10/p50/p90 bands for all 10 variables across all 18 entities — are streamed back to Zustand stores that drive the D3 map and Recharts panels simultaneously.

## License

MIT