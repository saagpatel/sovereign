![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss) ![Vitest](https://img.shields.io/badge/tested%20with-Vitest-6e9f18?logo=vitest) ![License: MIT](https://img.shields.io/badge/License-MIT-yellow)

# Sovereign

Sovereign is a browser-based geopolitical simulation tool that lets you apply a policy lever — a trade tariff, military spending shift, immigration change, and more — to any of 18 countries and blocs, then watch the cascading effects ripple across the world over a 60-month horizon.

Each simulation runs up to 50 Monte Carlo passes with configurable noise, producing p10/p50/p90 confidence bands for 10 macroeconomic variables per country. An interactive world map, timeline scrubber, per-country metric panel, and top-10 causal chain view make the results explorable at a glance.

<!-- TODO: Add screenshot -->

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5.7 |
| Simulation engine | Web Worker via Comlink |
| State management | Zustand |
| Geo visualisation | D3-geo + TopoJSON |
| Charts | Recharts |
| Styling | Tailwind CSS 3 |
| Testing | Vitest + Testing Library |

## Prerequisites

- Node.js 18+
- npm (bundled with Node)

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Other scripts

| Command | Purpose |
|---|---|
| `npm run build` | Production build |
| `npm start` | Serve production build |
| `npm run typecheck` | TypeScript check (no emit) |
| `npm test` | Vitest watch mode |
| `npm run test:run` | Vitest single run (CI) |
| `npm run lint` | ESLint |

## Project Structure

```
sovereign/
├── public/
│   └── data/
│       ├── countryData.json      # Baseline metrics for 18 countries/blocs
│       └── world-110m.json       # TopoJSON world map geometry
└── src/
    ├── app/                      # Next.js App Router (layout, page, globals)
    ├── components/
    │   ├── controls/             # CountrySelector, LeverPanel, ScenarioLibrary
    │   ├── map/                  # WorldMap (D3 choropleth)
    │   ├── output/               # MetricPanel, TimelineScrubber, CausalChain
    │   └── ui/                   # LoadingOverlay and shared primitives
    ├── data/                     # scenarios.ts, weights.ts, countries.ts
    ├── hooks/                    # useSimulation, useBaselineRefresh
    ├── sim/                      # Monte Carlo engine, noise, propagation (Web Worker)
    ├── store/                    # Zustand simStore
    └── types/                    # Shared TypeScript interfaces
```

## How It Works

1. **Select a country** and choose a policy domain (trade, energy, military, immigration, monetary, or technology).
2. **Set lever magnitude** (−100 to +100) and run the simulation.
3. The simulation engine runs inside a **Web Worker** (Comlink) to keep the UI responsive, executing up to 50 stochastic runs over the configured horizon.
4. Results surface as **confidence bands** (p10/p50/p90) on the world map and metric charts, plus a ranked causal chain showing the top-10 cross-country knock-on effects.
5. **Preset scenarios** (e.g. US–China semiconductor tariffs) are available from the scenario library for quick exploration.

Baseline country data is refreshable from the World Bank API — the app caches the last fetch in `localStorage`.

## License

MIT © 2026 Saag Patel
