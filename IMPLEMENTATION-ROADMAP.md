# Sovereign — Implementation Roadmap

## Architecture

### System Overview
```
[User: country select + lever set]
        ↓
[Zustand simStore: SimConfig]
        ↓
[SimulationWorker.ts — Web Worker via Comlink]
  ├── loads countryData.json + weights.ts
  ├── runs 50 Monte Carlo passes
  │     └── each pass: 60 monthly propagation steps
  │           └── influence graph traversal per country
  │                 └── Gaussian noise injected per influence edge
  └── posts progress events every 10 runs + final SimResult
        ↓
[Zustand simStore: SimResult — p10/p50/p90 bands per country per month]
        ↓
[React Components]
  ├── WorldMap (D3-geo SVG container, geoNaturalEarth1 projection)
  │     ├── ChoroplethLayer (country fills from p50 at scrub position)
  │     └── ConnectionLayer (SVG lines, stroke-width from tradeVolume/allianceStrength delta)
  ├── TimelineScrubber (month 0–60 slider, 16ms debounce on map re-render)
  ├── MetricPanel (Recharts ComposedChart, p10/p50/p90 confidence bands)
  ├── LeverPanel (domain selector + −100→+100 policy slider with labeled positions)
  └── ScenarioLibrary (8 prebuilt scenario cards + freeform toggle)

[Data Refresh Flow — optional]
  └── "Refresh baseline data" button
        → fetch World Bank API (7 indicators, 18 countries)
        → merge valid responses into countryData shape
        → store in localStorage key: sovereign-baseline-cache (TTL: 30 days)
        → Zustand hydrates from cache on load if present and fresh
```

### File Structure
```
sovereign/
├── public/
│   └── data/
│       ├── world-110m.json           # TopoJSON world map (from world-atlas npm package)
│       └── countryData.json          # Hardcoded 2025 baseline state vectors (18 countries)
├── src/
│   ├── app/
│   │   ├── layout.tsx                # Root layout, Tailwind base, dark theme
│   │   ├── page.tsx                  # Main simulation interface
│   │   └── calibration/
│   │       └── page.tsx              # Hidden debug route — historical scenario runner
│   ├── components/
│   │   ├── map/
│   │   │   ├── WorldMap.tsx          # D3-geo SVG container, handles projection + zoom
│   │   │   ├── ChoroplethLayer.tsx   # Country path fills, d3.scaleDiverging color scale
│   │   │   └── ConnectionLayer.tsx   # Relationship lines, stroke-width from weight deltas
│   │   ├── controls/
│   │   │   ├── LeverPanel.tsx        # Domain selector + policy slider (−100 to +100)
│   │   │   ├── CountrySelector.tsx   # Dropdown: acting country selection
│   │   │   └── ScenarioLibrary.tsx   # 8 prebuilt scenarios + freeform toggle
│   │   ├── output/
│   │   │   ├── MetricPanel.tsx       # Per-country recharts confidence band charts
│   │   │   ├── TimelineScrubber.tsx  # Month 0–60 slider, keyboard arrow support
│   │   │   └── CausalChain.tsx       # Top 10 highest-magnitude causal events panel
│   │   └── ui/
│   │       ├── Tooltip.tsx
│   │       ├── Badge.tsx
│   │       └── LoadingOverlay.tsx    # Progress % during sim run
│   ├── sim/
│   │   ├── SimulationWorker.ts       # Web Worker entry — Monte Carlo orchestrator
│   │   ├── propagation.ts            # Monthly step function, influence graph traversal
│   │   ├── noise.ts                  # Box-Muller Gaussian generator, seed-able
│   │   └── types.ts                  # Simulation-internal types (imported by Worker)
│   ├── data/
│   │   ├── countries.ts              # 18 country/bloc definitions + ISO codes
│   │   ├── weights.ts                # Influence weight matrices (all 6 domains)
│   │   ├── scenarios.ts              # 8 curated scenario configs
│   │   └── worldBankMapping.ts       # WB indicator codes → state vector field names
│   ├── hooks/
│   │   ├── useSimulation.ts          # Triggers Worker run, subscribes to progress events
│   │   ├── useTimeline.ts            # Scrub position state + keyboard shortcuts
│   │   └── useBaselineRefresh.ts     # World Bank API fetch + localStorage cache logic
│   ├── store/
│   │   └── simStore.ts               # Zustand store: SimConfig + SimResult + UI state
│   └── types/
│       └── index.ts                  # All shared TypeScript interfaces
├── next.config.js                    # output: 'export', trailingSlash: true
├── tailwind.config.js
├── tsconfig.json                     # strict: true
├── DEPLOYMENT.md
└── CLAUDE.md
```

### TypeScript Interfaces
All shared types live in `src/types/index.ts`. Simulation-internal types that are only used inside the Worker live in `src/sim/types.ts`.

```typescript
// src/types/index.ts

export interface CountryState {
  id: string;                           // ISO 3166-1 alpha-3 (e.g., "USA", "CHN")
  name: string;
  gdpGrowthRate: number;               // % annual, clamped: −15 to +15
  tradeOpenness: number;               // 0–100 index
  militarySpendingPct: number;         // % of GDP, clamped: 0–15
  domesticStability: number;           // 0–100 index (higher = more stable)
  energyIndependence: number;          // 0–100 (100 = fully self-sufficient)
  techSelfSufficiency: number;         // 0–100 (semiconductor/AI capability proxy)
  immigrationRate: number;             // net migrants per 1000 pop, clamped: −20 to +20
  foreignReserves: number;             // months of import cover, clamped: 0–36
  debtToGdp: number;                   // %, clamped: 0–300
  inflationRate: number;               // % annual, clamped: −2 to +50
  allianceStrength: Record<string, number>;  // partner ISO → 0–100
  tradeVolume: Record<string, number>;       // partner ISO → relative volume 0–100
}

export interface CountryBaseline extends CountryState {
  region: string;
  notes: string;                       // Source citations for baseline values
  lastRefreshed?: string;              // ISO date string of last World Bank refresh
}

export type PolicyDomain =
  | 'trade'
  | 'energy'
  | 'military'
  | 'immigration'
  | 'monetary'
  | 'technology';

export interface PolicyLever {
  domain: PolicyDomain;
  actingCountry: string;               // ISO code
  magnitude: number;                   // −100 to +100
  label: string;                       // e.g., "Raise semiconductor tariffs +25%"
}

export interface SimConfig {
  lever: PolicyLever;
  runs: number;                        // Default: 50
  horizon: number;                     // Default: 60 (months)
  noiseScale: number;                  // Default: 0.15
}

export interface CausalEvent {
  month: number;
  sourceCountry: string;               // ISO code
  targetCountry: string;               // ISO code
  variable: keyof Omit<CountryState, 'id' | 'name' | 'allianceStrength' | 'tradeVolume'>;
  delta: number;
  mechanism: string;                   // e.g., "Trade volume shock → GDP growth drag"
}

export interface VariableBand {
  p10: number;
  p50: number;
  p90: number;
}

export interface MonthlyBand {
  month: number;
  variables: Record<
    keyof Omit<CountryState, 'id' | 'name' | 'allianceStrength' | 'tradeVolume'>,
    VariableBand
  >;
}

export interface CountryBand {
  countryId: string;
  monthly: MonthlyBand[];              // length = horizon (60)
}

export interface SimResult {
  config: SimConfig;
  confidenceBands: Record<string, CountryBand>;  // ISO → bands
  causalChain: CausalEvent[];          // Top 10 by |delta| across all runs
  runDurationMs: number;
}

export interface WorkerProgressEvent {
  runsCompleted: number;               // 0–50
  partialBands?: Record<string, CountryBand>;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  lever: PolicyLever;
  tags: string[];
  historicalAnalog?: string;
}

export interface InfluenceEdge {
  weight: number;                      // −1.0 to +1.0
  delayMonths: number;                 // 0–12
  mechanism: string;
}

// domain → actingISO → affectedISO → affectedVariable → edge
export type WeightMatrix = Record<
  PolicyDomain,
  Record<string, Record<string, Record<string, InfluenceEdge>>>
>;
```

### 18 Countries/Blocs
```typescript
// src/data/countries.ts
export const COUNTRIES = [
  { id: 'USA', name: 'United States',  region: 'North America' },
  { id: 'CHN', name: 'China',          region: 'East Asia' },
  { id: 'EUR', name: 'European Union', region: 'Europe' },        // Bloc
  { id: 'RUS', name: 'Russia',         region: 'Eurasia' },
  { id: 'IND', name: 'India',          region: 'South Asia' },
  { id: 'JPN', name: 'Japan',          region: 'East Asia' },
  { id: 'KOR', name: 'South Korea',    region: 'East Asia' },
  { id: 'ASN', name: 'ASEAN',          region: 'Southeast Asia' }, // Bloc
  { id: 'BRA', name: 'Brazil',         region: 'South America' },
  { id: 'SAU', name: 'Gulf States',    region: 'Middle East' },    // Bloc: Saudi/UAE/Qatar
  { id: 'TUR', name: 'Turkey',         region: 'Middle East/Europe' },
  { id: 'GBR', name: 'United Kingdom', region: 'Europe' },
  { id: 'AUS', name: 'Australia',      region: 'Pacific' },
  { id: 'MEX', name: 'Mexico',         region: 'North America' },
  { id: 'NGA', name: 'Nigeria',        region: 'Africa' },
  { id: 'IRN', name: 'Iran',           region: 'Middle East' },
  { id: 'ISR', name: 'Israel',         region: 'Middle East' },
  { id: 'PAK', name: 'Pakistan',       region: 'South Asia' },
] as const;
```

### 8 Curated Scenarios
```typescript
// src/data/scenarios.ts — full Scenario objects with PolicyLever embedded
export const SCENARIOS: Scenario[] = [
  {
    id: 'us-china-semis',
    title: 'US Semiconductor Export Controls on China',
    description: 'The US expands export controls on advanced semiconductors and chip manufacturing equipment to China, restricting access to sub-7nm technology.',
    lever: { domain: 'technology', actingCountry: 'USA', magnitude: -85, label: 'Broad semiconductor export ban' },
    tags: ['technology', 'trade', 'US-China'],
    historicalAnalog: '2022–2023 BIS export control expansions',
  },
  {
    id: 'russia-energy-cutoff',
    title: 'Russia Cuts European Energy Supply',
    description: 'Russia halts natural gas pipeline flows to Europe, forcing emergency substitution from LNG and alternative suppliers.',
    lever: { domain: 'energy', actingCountry: 'RUS', magnitude: -90, label: 'Full pipeline gas cutoff to Europe' },
    tags: ['energy', 'Russia', 'Europe'],
    historicalAnalog: '2022 Nord Stream suspension',
  },
  {
    id: 'china-taiwan-blockade',
    title: 'China Naval Blockade of Taiwan Strait',
    description: 'China establishes a naval exclusion zone around Taiwan, disrupting maritime trade routes and triggering alliance responses.',
    lever: { domain: 'military', actingCountry: 'CHN', magnitude: 80, label: 'Naval exclusion zone — Taiwan Strait' },
    tags: ['military', 'China', 'Asia-Pacific'],
  },
  {
    id: 'us-nato-withdrawal',
    title: 'US Reduces NATO Commitment',
    description: 'The US signals a significant reduction in Article 5 guarantees and begins withdrawing forward-deployed forces from Europe.',
    lever: { domain: 'military', actingCountry: 'USA', magnitude: -60, label: 'Major NATO commitment drawdown' },
    tags: ['military', 'NATO', 'Europe'],
  },
  {
    id: 'india-skilled-immigration',
    title: 'India Opens Skilled Worker Pathways',
    description: 'India launches a bilateral skilled worker program with major economies, accelerating outbound talent flows in tech and healthcare.',
    lever: { domain: 'immigration', actingCountry: 'IND', magnitude: 70, label: 'Major skilled emigration liberalization' },
    tags: ['immigration', 'India', 'labor'],
  },
  {
    id: 'eu-carbon-tariff',
    title: 'EU Carbon Border Adjustment Mechanism (CBAM)',
    description: 'The EU imposes full carbon tariffs on imports from high-emission economies, reshaping trade flows for steel, cement, and aluminum.',
    lever: { domain: 'trade', actingCountry: 'EUR', magnitude: 65, label: 'Full CBAM implementation' },
    tags: ['trade', 'climate', 'Europe'],
    historicalAnalog: '2023 CBAM regulation adoption',
  },
  {
    id: 'china-yuan-devaluation',
    title: 'China Major Yuan Devaluation',
    description: 'China allows a significant managed devaluation of the yuan to boost export competitiveness amid economic slowdown.',
    lever: { domain: 'monetary', actingCountry: 'CHN', magnitude: -75, label: 'Major managed yuan devaluation' },
    tags: ['monetary', 'China', 'trade'],
    historicalAnalog: '2015 yuan devaluation shock',
  },
  {
    id: 'gulf-oil-production-cut',
    title: 'Gulf States OPEC+ Output Cut',
    description: 'Gulf states lead a major coordinated OPEC+ production cut, sharply reducing global oil supply and spiking energy prices.',
    lever: { domain: 'energy', actingCountry: 'SAU', magnitude: -70, label: 'Major coordinated OPEC+ output cut' },
    tags: ['energy', 'Gulf', 'oil'],
  },
];
```

### World Bank API Mapping
```typescript
// src/data/worldBankMapping.ts
export const WB_INDICATORS: Record<string, keyof CountryState> = {
  'NY.GDP.MKTP.KD.ZG': 'gdpGrowthRate',
  'NE.TRD.GNFS.ZS':    'tradeOpenness',
  'MS.MIL.XPND.GD.ZS': 'militarySpendingPct',
  'SM.POP.NETM':        'immigrationRate',
  'DT.DOD.DECT.GD.ZS': 'debtToGdp',
  'NY.GDP.DEFL.KD.ZG': 'inflationRate',
  'FI.RES.TOTL.MO':    'foreignReserves',
};
// NOTE: energyIndependence, techSelfSufficiency, domesticStability,
// allianceStrength, tradeVolume — hardcoded only, not refreshable via WB API.

export const WB_API_BASE = 'https://api.worldbank.org/v2';
// Pattern: /country/{iso2}/indicator/{code}?format=json&mrv=1
// No API key required. Rate limit: ~100 req/min (plenty for 18 countries × 7 indicators = 126 req).
// ISO-2 codes required (World Bank uses ISO-2, not ISO-3). Map in countries.ts.
```

### External APIs
| Service | Endpoint Pattern | Method | Auth | Rate Limit | Purpose |
|---|---|---|---|---|---|
| World Bank | `https://api.worldbank.org/v2/country/{iso2}/indicator/{code}?format=json&mrv=1` | GET | None | ~100/min | Refresh 7 state vector fields |

### Dependencies
```bash
# Core
npm install next@14 react@18 react-dom@18 typescript@5
npm install zustand@4
npm install d3-geo@3 d3-scale@4 d3-selection@3 topojson-client@3
npm install world-atlas@2
npm install recharts@2
npm install comlink@4
npm install tailwindcss@3 postcss autoprefixer

# Dev / types
npm install -D @types/react @types/react-dom
npm install -D @types/d3-geo @types/topojson-client
npm install -D @types/node
npm install -D eslint eslint-config-next

# Fetch world-atlas TopoJSON to public/data/
node -e "
  const https = require('https');
  const fs = require('fs');
  https.get('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json', r => {
    r.pipe(fs.createWriteStream('public/data/world-110m.json'));
  });
"
```

### next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  // If serving from a subdirectory, set basePath: '/sovereign'
};
module.exports = nextConfig;
```

---

## Scope Boundaries

**In scope (v1):**
- 18 countries/blocs with hardcoded 2025 baseline state vectors
- 6 policy domains, each with a fully calibrated weight matrix
- 50-run Monte Carlo simulation in a Web Worker via Comlink
- D3-geo world map with choropleth fills + connection lines
- p10/p50/p90 confidence band charts (Recharts)
- Timeline scrubber (month 0–60)
- 8 curated scenarios + freeform mode
- Causal chain top-10 event panel
- World Bank hybrid data refresh (7 indicators, optional, cached 30 days)
- `/calibration` debug route for weight matrix tuning
- Self-hosted static deployment (nginx)

**Out of scope (v1):**
- User accounts, authentication, data persistence across sessions
- Simulation result saving/sharing (results are ephemeral Zustand state)
- Multi-lever mode (changing more than one policy simultaneously)
- AI narrator (LLM-generated narrative of simulation events)
- Real-time news API integration
- Historical replay mode (seeding from past data + known policy events)
- Community scenario sharing

**Deferred to v2:**
- AI narrator — Phase post-v1, requires LLM integration
- Multi-lever mode — compounds model complexity significantly
- Historical replay — requires policy event database
- Community scenarios — requires backend

---

## Security & Credentials
- No credentials required — World Bank API is fully public, no key needed
- No data leaves the user's machine — simulation is 100% client-side; World Bank fetch is a direct browser→WB API call
- localStorage cache contains only public economic data — no encryption needed
- Model weights ship as plain TypeScript — inspectable and forkable by design (educational mission)
- No telemetry, no analytics, no user tracking

---

## Phase 0: Foundation (Week 1)

**Objective:** Scaffolded Next.js project with static export verified, Web Worker + Comlink wiring validated, D3-geo world map rendering with country click, and all 18 country baseline vectors authored.

**Tasks:**

1. Scaffold Next.js 14 project with TypeScript 5 + Tailwind 3. Configure `next.config.js` with `output: 'export'` and `trailingSlash: true`. Initialize Tailwind with dark mode base (`bg-gray-900` root). — **Acceptance:** `npm run build && npx serve out` — app loads at localhost:3000, no 404s, no console errors.

2. Validate Web Worker + Comlink in static export context. Create `src/sim/SimulationWorker.ts` as a trivial Comlink worker that accepts two numbers and returns their sum. Add a test button to `page.tsx` that calls the worker and displays the result. — **Acceptance:** Button click returns correct sum within 200ms in both `npm run dev` and production `out/` build. No "cannot find worker" errors.

3. Fetch `world-atlas` TopoJSON and save to `public/data/world-110m.json`. Implement `WorldMap.tsx` with D3-geo `geoNaturalEarth1` projection. Countries are SVG paths, clickable, selected country highlights in accent color. Console logs ISO-3 code on click. — **Acceptance:** Map renders, clicking USA logs "USA", clicking CHN logs "CHN". Blocs (EUR, ASN, SAU) highlight their representative centroid region.

4. Author `public/data/countryData.json` for all 18 countries/blocs. Research each field from World Bank 2023 data (most recent complete year) + SIPRI for military spending. Blocs use population-weighted averages with source notes in the `notes` field. — **Acceptance:** 18 entries, all 12 scalar fields populated (no nulls), `allianceStrength` and `tradeVolume` objects have ≥ 5 partner entries each for major countries.

5. Define all TypeScript interfaces from `src/types/index.ts` (as specified in this roadmap). Run TypeScript compiler. — **Acceptance:** `npx tsc --noEmit` exits 0 with zero errors.

6. Create Zustand `simStore.ts` with initial state: `{ config: null, result: null, selectedCountry: null, scrubPosition: 0, isRunning: false, progress: 0 }`. — **Acceptance:** Store imports without errors, state accessible in React DevTools Zustand panel.

**Verification checklist:**
- [ ] `npm run build` — exits 0
- [ ] `npx serve out` — map renders at localhost:3000
- [ ] Web Worker test button — returns correct sum in production build
- [ ] Clicking 5 different countries on map — correct ISO codes logged
- [ ] `npx tsc --noEmit` — zero errors
- [ ] `countryData.json` — 18 entries, no null values

**Risks:**
- Comlink + Next.js static export Worker path resolution: Worker URL must use `new URL('./SimulationWorker.ts', import.meta.url)` — this is the correct pattern for Next.js + Webpack 5. If it fails, fallback: use `workerize-loader` or inline the Worker as a Blob URL.
- D3-geo is ESM-only in v7 — import as `import * as d3geo from 'd3-geo'` inside a `'use client'` component with `next/dynamic` and `ssr: false`. If tree-shaking causes issues, pin to d3-geo@3.1.0.

---

## Phase 1: Core Simulation Engine + Trade Domain (Weeks 2–3)

**Objective:** Trade domain fully implemented in propagation engine. Single deterministic run (no Monte Carlo yet). Map updates choropleth by GDP growth delta at month 60. Lever panel and country selector functional. `/calibration` debug route operational.

**Tasks:**

1. Implement `src/sim/propagation.ts` — the monthly step function.
   - Input: `WorldState` (Record<ISO, CountryState>), `PolicyLever`, `WeightMatrix`, `month: number`
   - Output: `{ nextState: WorldState, events: CausalEvent[] }`
   - Logic: On month 0, apply lever as a shock to acting country's domain-relevant variable(s). Each subsequent month: for each country, iterate all connected countries' influence edges where `delayMonths <= month`; sum `connectedCountry.variable × edge.weight`; apply to target variable; clamp to valid range. Record a `CausalEvent` for any delta > 0.1 (avoid noise events).
   - **Acceptance:** Running 60 steps from 2025 USA baseline with trade lever at +80 produces: (a) positive impact on USA `inflationRate` by month 3, (b) negative impact on CHN `gdpGrowthRate` by month 6, (c) positive impact on MEX `tradeOpenness` by month 9 (supply chain shift). Verify in calibration route.

2. Author trade domain weight matrix in `src/data/weights.ts` for all 18 countries. Start with the 6 highest-volume bilateral relationships: USA↔CHN, EUR↔CHN, USA↔EUR, JPN↔KOR, USA↔MEX, CHN↔ASN. Fill remaining with lower weights (0.05–0.15). Each edge specifies `weight`, `delayMonths`, and `mechanism` string. — **Acceptance:** Matrix has ≥ 50 non-zero `InfluenceEdge` objects for the trade domain. TypeScript compiles clean.

3. Build `/calibration` debug route at `src/app/calibration/page.tsx`. Interface: country selector, domain selector, lever slider, "Run" button, month slider (0–60), and a data table showing all 18 countries × 12 scalar variables at the selected month. Color-code cells that deviate from baseline by > ±5%. — **Acceptance:** Running USA trade embargo (magnitude +100) shows red cells on CHN `gdpGrowthRate` and `tradeOpenness` by month 12. Table updates instantly when month slider moves.

4. Wire `SimulationWorker.ts` to run a single deterministic propagation pass (50 runs comes in Phase 2). Worker receives `SimConfig`, runs 60 steps of `propagation.ts`, returns `MonthlySnapshot[]`. Use Comlink `wrap()` on the main thread. — **Acceptance:** Worker completes 60-step trade domain run in < 500ms (measured via `performance.now()`). Returns typed `MonthlySnapshot[]` with 60 entries.

5. Implement `LeverPanel.tsx`. Domain dropdown (6 options). Slider −100 to +100 with 5 labeled tick marks per domain. Domain-specific labels:
   - Trade: −100="Full embargo", −50="Major tariffs", 0="Baseline", +50="Trade deal", +100="Deep integration"
   - Energy: −100="Full supply cutoff", −50="Major supply reduction", 0="Baseline", +50="Energy partnership", +100="Full energy union"
   - Military: −100="Full withdrawal", −50="Major drawdown", 0="Baseline", +50="Enhanced cooperation", +100="Full alliance upgrade"
   - Immigration: −100="Full closure", −50="Major restriction", 0="Baseline", +50="Open pathways", +100="Free movement"
   - Monetary: −100="Major devaluation", −50="Moderate easing", 0="Baseline", +50="Moderate tightening", +100="Major appreciation"
   - Technology: −100="Full export ban", −50="Major restrictions", 0="Baseline", +50="Tech sharing", +100="Full tech union"
   - **Acceptance:** Changing domain updates labels. Moving slider updates Zustand `simStore.config.lever.magnitude`. Visible in React DevTools.

6. Implement `CountrySelector.tsx`. Dropdown of 18 countries. Updates Zustand `simStore.config.lever.actingCountry`. — **Acceptance:** Selecting CHN and running sim produces different cascade than selecting USA with same lever.

7. Wire `ChoroplethLayer.tsx` to read `gdpGrowthRate` delta (result p50 vs baseline) at month 60. Use `d3.scaleDiverging(d3.interpolateRdYlGn)` with domain [−8, 0, +8]. Baseline (no sim run) = all countries white/neutral. — **Acceptance:** Running USA trade embargo at +100 renders CHN map fill red, MEX slightly green, USA slightly yellow within 2 seconds of run completion.

**Verification checklist:**
- [ ] Calibration route: USA trade embargo → CHN GDP negative by month 6 ✓
- [ ] Calibration route: MEX tradeOpenness positive by month 9 ✓ (supply chain shift)
- [ ] Worker: 60-step run completes in < 500ms (console logged)
- [ ] Map: choropleth updates after run, CHN is red for USA embargo scenario
- [ ] `npx tsc --noEmit` — zero errors

**Risks:**
- Influence weight calibration is iterative — the first pass will produce wrong magnitudes. Use the calibration route aggressively; plan 4–6 hours of pure tuning after initial weight authoring.
- Clamp logic: ensure all 12 scalar variables are clamped to their valid ranges after every propagation step, or values will drift to nonsensical extremes within 20 months.

---

## Phase 2: Monte Carlo + Timeline + Confidence Bands (Weeks 4–5)

**Objective:** 50-run Monte Carlo in Web Worker with Gaussian noise. Progress events driving LoadingOverlay. Timeline scrubber synced to map and charts. MetricPanel showing p10/p50/p90 bands.

**Tasks:**

1. Implement `src/sim/noise.ts` — Box-Muller Gaussian generator.
   ```typescript
   export function gaussianNoise(mean: number, sigma: number, seed?: number): number
   // Returns a single Gaussian sample. If seed provided, use a seeded LCG for reproducibility.
   ```
   — **Acceptance:** 10,000 samples from `gaussianNoise(0, 1)` have mean within ±0.05 of 0.0 and std within ±0.05 of 1.0. Seeded calls with same seed return identical values.

2. Upgrade `SimulationWorker.ts` to run 50 passes. Each pass: inject Gaussian noise `σ = config.noiseScale × |baseInfluence|` on each influence edge output before applying to target variable. Post `WorkerProgressEvent` every 10 completed runs. After all 50 runs, aggregate p10/p50/p90 across runs per country per month per variable. Return `SimResult`. — **Acceptance:** Worker posts exactly 5 progress events (at 10, 20, 30, 40, 50 runs) plus one final result event. `runDurationMs` < 4000 on M1 MacBook Air.

3. Update `useSimulation.ts` hook to subscribe to Worker progress events via Comlink's `proxy()` callback. Update Zustand `progress` (0–100) on each event. Set `isRunning: false` and store `SimResult` on completion. — **Acceptance:** `LoadingOverlay` shows "Running simulation… 40%" mid-run. Disappears on completion.

4. Implement `TimelineScrubber.tsx`. HTML `<input type="range" min={0} max={60}>`. Arrow key support (±1 month). Debounce map re-render callback to 16ms (one frame). Updates Zustand `scrubPosition`. — **Acceptance:** Dragging scrubber from 0 to 60 while viewing a completed sim — no visible frame drops on M1 Air (Chrome DevTools Performance tab shows no frames > 32ms).

5. Implement confidence band aggregation in Worker. After 50 runs, for each `(country, month, variable)` triple: collect 50 values, sort, take index 5 (p10), 25 (p50), 45 (p90). Store in `CountryBand.monthly[month].variables[variable]`. — **Acceptance:** For a neutral lever (magnitude = 0), all bands are within ±0.5% of baseline for `gdpGrowthRate` (noise only, no signal).

6. Implement `MetricPanel.tsx`. User clicks a country on the map → panel shows 4 Recharts `ComposedChart` instances: `gdpGrowthRate`, `domesticStability`, `tradeOpenness`, and one domain-specific variable (trade→`tradeVolume` to top partner, energy→`energyIndependence`, military→`militarySpendingPct`, immigration→`immigrationRate`, monetary→`inflationRate`, technology→`techSelfSufficiency`). Each chart: p10/p90 as `Area` (shaded, low opacity), p50 as `Line`. X-axis: months 0–60. Y-axis: auto-scaled to band range. — **Acceptance:** Clicking CHN after running USA semiconductor export ban → `techSelfSufficiency` chart shows declining p50 with widening confidence bands past month 18.

7. Update `ChoroplethLayer.tsx` to read p50 value at `scrubPosition` month (not fixed month 60). Update `ConnectionLayer.tsx` to render lines between countries with non-zero `tradeVolume` or `allianceStrength` edges; `stroke-width` = 0.5 + (3.5 × normalized delta from baseline). Lines fade to 0.2 opacity for countries not connected to selected country. — **Acceptance:** Scrubbing timeline from month 0→60 on trade embargo scenario shows USA↔CHN connection line thinning progressively. Line fully visible on hover.

**Verification checklist:**
- [ ] 50-run sim completes in < 4000ms (console: `runDurationMs`)
- [ ] Exactly 5 progress events fire during run (check React DevTools)
- [ ] Neutral lever: p10/p50/p90 spread < ±0.5% for GDP growth
- [ ] MetricPanel: p10 < p50 < p90 for every data point (no band inversions)
- [ ] Timeline scrub: Chrome DevTools Performance — no frames > 32ms
- [ ] Connection lines: USA↔CHN line visibly thinner at month 60 vs month 0 for embargo scenario

**Risks:**
- Web Worker 4-second budget: if 50 × 60 steps × 18 countries is too slow, optimization path is: (1) pre-compute delay gates as a lookup array instead of evaluating per step, (2) use Float32Array instead of plain objects for state vectors in the hot loop, (3) reduce to 30 runs with a note in UI.
- Recharts `Area` confidence bands require `dataKey` pointing to computed upper/lower values — precompute `{ month, p10, p50, p90 }` arrays per variable before passing to chart components.

---

## Phase 3: Remaining 5 Domains + Weight Matrices (Weeks 6–8)

**Objective:** All 6 domains calibrated. All 3 historical scenarios produce directionally correct cascades. `/calibration` route extended with historical comparison panel.

**Tasks:**

1. Author weight matrices for energy, military, immigration, monetary, technology domains using the same `InfluenceEdge` structure. Priority relationships per domain:
   - Energy: RUS→EUR (gas), SAU→global (oil price), USA→global (LNG), IRN→SAU (regional competition)
   - Military: USA→NATO members, CHN→ASN/PAK/IRN, RUS→Eastern Europe bloc
   - Immigration: IND→USA/GBR/AUS/EUR (skilled), MEX→USA (mixed), PAK→SAU/GBR
   - Monetary: USA (Fed rate) → all (reserve currency effect), CHN (yuan) → ASN/trade partners
   - Technology: USA→CHN (export controls), KOR/JPN→global (semiconductor supply), EUR→global (regulation)
   - **Acceptance:** Each domain has ≥ 40 non-zero `InfluenceEdge` objects. `npx tsc --noEmit` clean.

2. Implement domain-specific variable shock mapping. When a lever fires, which state vector variable(s) does it directly shock?
   - Trade: `tradeOpenness` ± (magnitude × 0.3), `tradeVolume` to partners ± (magnitude × 0.4)
   - Energy: `energyIndependence` ± (magnitude × 0.2), `tradeVolume` to energy partners ± (magnitude × 0.5)
   - Military: `militarySpendingPct` ± (magnitude × 0.04), `allianceStrength` to partners ± (magnitude × 0.3)
   - Immigration: `immigrationRate` ± (magnitude × 0.1)
   - Monetary: `inflationRate` ∓ (magnitude × 0.1), `tradeOpenness` ± (magnitude × 0.1)
   - Technology: `techSelfSufficiency` ∓ (magnitude × 0.3 for target), `tradeVolume` ± (magnitude × 0.2)
   - **Acceptance:** Each domain's direct shock produces visible map color change on acting country within month 1.

3. Calibrate energy domain against 2022 Russia energy cutoff. Historical targets: EUR `gdpGrowthRate` −2% to −4% by month 6; EUR `inflationRate` +3–6% by month 6; SAU/IRN `tradeVolume` with EUR increases. Run `RUS energy lever −90` in calibration route. Tune weights until targets are hit. — **Acceptance:** Historical comparison panel shows EUR primary variables within 2× of historical targets.

4. Calibrate military domain against 2021 AUKUS formation. Historical targets: AUS `militarySpendingPct` +0.3–0.5% GDP; CHN `domesticStability` slight negative; ASN `allianceStrength` shifts toward USA. Run `USA military lever +70` targeting AUS. Tune weights. — **Acceptance:** Directionally correct in calibration route.

5. Extend `/calibration` route with a "Historical Comparison" tab. Shows a 2-column table per scenario: "Model p50 output" vs "Historical record" (hardcoded `HISTORICAL_TARGETS` object in the calibration route). Cells with delta > 2× are highlighted red. — **Acceptance:** All 3 scenarios show no red cells on primary affected country's primary variable after calibration.

6. Add `CausalChain.tsx` panel. Collapsible sidebar. Shows top 10 `CausalEvent` objects from `simResult.causalChain`, sorted by `|delta|` descending. Each row: `Month {N}: {sourceCountry} → {targetCountry}: {variable} {delta:+.1f} via "{mechanism}"`. — **Acceptance:** Running USA semiconductor scenario shows at minimum: (1) USA→CHN techSelfSufficiency event within month 3, (2) CHN→ASN gdpGrowthRate event within month 9.

**Verification checklist:**
- [ ] All 6 domains: lever at ±80 produces visible choropleth change on acting country
- [ ] Energy calibration: EUR GDP delta negative by month 6, within 2× of historical
- [ ] Military calibration: AUS military spending up, directionally correct
- [ ] Historical comparison panel: zero red cells on primary variables for all 3 scenarios
- [ ] CausalChain: ≥ 5 events populated for every scenario run
- [ ] `npx tsc --noEmit` — zero errors

**Risks:**
- Calibration is time-intensive — budget 2 full sessions (4–6 hours each) for weight tuning across 5 domains. Treat red cells in the historical comparison panel as failing tests; don't move to Phase 4 until they're green.
- Monetary domain is the hardest to calibrate — Fed rate changes have diffuse global effects on all countries via reserve currency dynamics. Start with lower weights (0.05–0.1) and tune up rather than starting high and dampening.

---

## Phase 4: Scenario Library + Polish + Deployment (Weeks 9–10)

**Objective:** 8 curated scenarios selectable from UI. World Bank hybrid data refresh working. Static build deployed to nginx. All performance targets verified.

**Tasks:**

1. Implement `ScenarioLibrary.tsx`. Grid of 8 scenario cards. Each card: title, acting country name + flag emoji, domain badge (color-coded by domain), tags, and optional `historicalAnalog` label. Clicking a card: loads `scenario.lever` into Zustand `simStore.config`, sets `actingCountry`, auto-triggers simulation run. "Freeform" toggle button returns to manual lever mode. — **Acceptance:** Clicking any scenario card triggers a sim run within 200ms. MetricPanel populates with scenario-specific results. Active scenario card highlighted.

2. Implement `useBaselineRefresh.ts`. On button click:
   - Fetch `WB_API_BASE/country/{iso2}/indicator/{code}?format=json&mrv=1&per_page=1` for each of 7 indicators × 18 countries (126 requests, run in batches of 20 with `Promise.allSettled`)
   - For fulfilled responses with valid numeric data, update the in-memory baseline
   - For rejected/invalid responses, silently retain hardcoded value
   - Serialize merged baseline to `localStorage.setItem('sovereign-baseline-cache', JSON.stringify({ data, refreshedAt: Date.now() }))`
   - On app load: check `sovereign-baseline-cache`; if `refreshedAt > Date.now() - 30 * 24 * 60 * 60 * 1000`, hydrate from cache
   - **Acceptance:** Refresh completes for ≥ 14/18 countries. Failed countries produce no console errors (silent fallback). Refreshed data survives `localStorage` → page reload. "Last updated: [date]" shown in UI.

3. Performance audit. Run `npm run build && npx serve out`. Open Chrome DevTools Lighthouse on desktop. If Performance < 80:
   - Lazy-load `ScenarioLibrary` with `const ScenarioLibrary = dynamic(() => import(...), { ssr: false })`
   - Lazy-load `MetricPanel` similarly
   - Ensure all D3 imports are inside `'use client'` components with `dynamic` + `ssr: false`
   - Check bundle with `ANALYZE=true npm run build` (add `@next/bundle-analyzer`)
   - **Acceptance:** Lighthouse Performance ≥ 80 on desktop. Initial page load < 3s (simulated fast 3G in DevTools).

4. Write `DEPLOYMENT.md` with complete self-hosting instructions:
   ```nginx
   # nginx config block
   server {
     listen 80;
     server_name your-domain.com;
     root /var/www/sovereign/out;
     index index.html;
     location / {
       try_files $uri $uri/ $uri.html =404;
     }
     # Correct MIME types
     types {
       application/javascript js mjs;
       text/css css;
     }
   }
   ```
   Include: `npm run build`, rsync/scp `out/` to server, nginx config, reload command. — **Acceptance:** Following DEPLOYMENT.md from scratch results in a working deployment from `out/` served by nginx.

5. Final end-to-end QA pass. Run all 8 scenarios manually. Verify: (a) non-empty CausalChain for all 8, (b) MetricPanel populates for all 8, (c) confidence bands never invert (p10 < p50 < p90), (d) map renders correct choropleth for all 8, (e) timeline scrub works smoothly for all 8. — **Acceptance:** Zero regressions across all 8 scenarios.

**Verification checklist:**
- [ ] All 8 scenario cards load and trigger sim runs
- [ ] World Bank refresh: ≥ 14 countries updated, cache survives reload
- [ ] Lighthouse Performance ≥ 80 (desktop)
- [ ] Page load < 3s (fast 3G simulation)
- [ ] nginx deployment: app loads from `out/`, no 404s on Worker or asset paths
- [ ] All 8 scenarios: non-empty CausalChain, no band inversions

---

## Calibration Reference

### Historical Scenarios (used in `/calibration` comparison panel)

```typescript
// src/app/calibration/page.tsx — HISTORICAL_TARGETS
const HISTORICAL_TARGETS = {
  'us-china-trade-war-2018': {
    scenario: { domain: 'trade', actingCountry: 'USA', magnitude: 65 },
    targets: [
      { country: 'CHN', variable: 'gdpGrowthRate', deltaRange: [-1.5, -0.3], byMonth: 12 },
      { country: 'USA', variable: 'inflationRate', deltaRange: [0.2, 0.8], byMonth: 12 },
      { country: 'VNM', note: 'Not in model — use ASN as proxy', country: 'ASN', variable: 'tradeOpenness', deltaRange: [1.0, 4.0], byMonth: 18 },
    ],
  },
  'russia-energy-cutoff-2022': {
    scenario: { domain: 'energy', actingCountry: 'RUS', magnitude: -90 },
    targets: [
      { country: 'EUR', variable: 'gdpGrowthRate', deltaRange: [-4.0, -1.5], byMonth: 6 },
      { country: 'EUR', variable: 'inflationRate', deltaRange: [3.0, 6.0], byMonth: 6 },
      { country: 'SAU', variable: 'tradeVolume', note: 'Increase in SAU energy exports to EU', deltaRange: [2.0, 8.0], byMonth: 9 },
    ],
  },
  'aukus-2021': {
    scenario: { domain: 'military', actingCountry: 'USA', magnitude: 70 },
    targets: [
      { country: 'AUS', variable: 'militarySpendingPct', deltaRange: [0.2, 0.6], byMonth: 24 },
      { country: 'CHN', variable: 'domesticStability', deltaRange: [-3.0, -0.5], byMonth: 12 },
    ],
  },
};
```

---

## v2 Backlog (Do Not Build in v1)
- **AI narrator** — local LLM watches simulation, generates month-by-month narrative summaries
- **Multi-lever mode** — change multiple policies simultaneously
- **Historical replay** — seed with past data, apply known historical events, compare model to reality
- **Community scenarios** — backend + user accounts required
- **Real-time news anchoring** — news API + NLP event classification as shocks
