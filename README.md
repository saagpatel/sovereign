# Sovereign

[![TypeScript](https://img.shields.io/badge/TypeScript-3178c6?style=flat-square&logo=typescript)](#) [![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](#)

> What happens to the global economy if one country raises tariffs by 20%?

Sovereign is a browser-based geopolitical simulation tool. Apply a policy lever — trade tariff, military spending shift, immigration change, or currency devaluation — to any of 18 countries and blocs, then watch cascading effects ripple across the world over a 60-month horizon. Up to 50 Monte Carlo passes with configurable noise produce p10/p50/p90 confidence bands for 10 macroeconomic variables per country.

## Features

- **18 countries and blocs** — US, EU, China, Russia, UK, India, Japan, Brazil, and more, each with calibrated baseline economic parameters
- **10 policy levers** — trade tariffs, military spending, immigration, currency, sanctions, foreign aid, and others
- **Monte Carlo engine** — up to 50 simulation passes in a Web Worker via Comlink; no UI blocking
- **Confidence bands** — p10/p50/p90 bands across GDP growth, inflation, unemployment, trade balance, and 6 other variables
- **Interactive world map** — D3-geo + TopoJSON globe with country selection and hover tooltips
- **Timeline scrubber** — step through any of the 60 months to see the state at that moment
- **Causal chain view** — top-10 ranked causal links explaining how your policy propagated

## Quick Start

### Prerequisites
- Node.js 18+

### Installation
```bash
npm install
```

### Usage
```bash
# Development server
npm run dev

# Run tests
npm test

# Type-check
npm run typecheck
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
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