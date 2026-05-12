# Sovereign — Portfolio Disposition

**Status:** Release Frozen (static-host, static SPA + Monte Carlo
in Web Worker) — TypeScript + D3-geo + TopoJSON + Comlink-driven
Web Worker browser geopolitical simulation on `origin/main`, with
**Playwright E2E smoke tests** + **`@vercel/analytics`** + Vercel
deploy config + accessibility audit fixes. **Eighth static-host
cluster member**; **fifth static-SPA sub-shape member** alongside
HowMoneyMoves / NeuralNetwork / OrbitMechanic / Signal & Noise.
**Third cluster member with Playwright E2E pattern** (after
Premise + Signal & Noise) — Playwright E2E is now a cluster
maturity signal across 3 of 8 static-host members.

> Disposition uses strict `origin/main` verification.
> **Third Playwright E2E occurrence** in static-host cluster.

---

## Verification posture

Only `origin` (`saagpatel/Sovereign`). Clean migration state.

`origin/main`:

- Tip: `629ad91` feat(analytics): add @vercel/analytics
- Production-readiness cadence:
  - `629ad91` feat(analytics): add @vercel/analytics
  - `06f2734` **feat: add Playwright E2E smoke tests** (3rd cluster
    member with this pattern)
  - `25cb400` perf: fix accessibility audit findings (contrast,
    form labels)
- Default branch: `main`

Per memory: v1 complete, 115 tests.

---

## Current state in one paragraph

Sovereign is a browser-based geopolitical simulation: apply a
policy lever (tariff / military spending / immigration / currency /
sanctions / foreign aid / 4 more) to any of **18 countries and
blocs** (US, EU, China, Russia, UK, India, Japan, Brazil, etc.),
then watch cascading effects ripple across the world over a
**60-month horizon**. Up to **50 Monte Carlo passes** with
configurable noise produce **p10/p50/p90 confidence bands** for
10 macroeconomic variables per country (GDP growth, inflation,
unemployment, trade balance, and 6 others). Simulation runs in a
**Web Worker via Comlink** — no UI blocking. UI: D3-geo +
TopoJSON globe with hover tooltips, 60-month timeline scrubber,
top-10 causal-chain view. Per memory: v1 complete + 115 tests.
Release commits confirm Playwright E2E (production canary) +
Vercel analytics + accessibility audit — production-hardened.

---

## Why "Release Frozen (static-host, static SPA + Web Worker compute)" — eighth cluster member

Static SPA sub-shape with new compute model: **Web Worker Monte
Carlo simulation**.

| Member | Sub-shape | Compute |
|---|---|---|
| HowMoneyMoves | Static SPA | Pure presentation |
| Neural Network Playground | Static SPA + TF.js | Client-side ML training |
| OrbitMechanic | Static SPA + Canvas 2D | Physics simulation |
| Signal & Noise | Static SPA + KaTeX + Framer | Interactive math narrative |
| **Sovereign** | **Static SPA + Web Worker** | **Monte Carlo geopolitical simulation** |

Static SPA sub-shape now has **5 members across 5 distinct
compute models**. The sub-shape is mature and Sovereign is the
first member with explicit off-main-thread compute via Web Worker
+ Comlink — a pattern other compute-heavy static-SPA apps
(NeuralNetwork, OrbitMechanic) could adopt for UI responsiveness.

**Third Playwright E2E occurrence** in static-host cluster:
- Premise (R11, SSR + Supabase)
- Signal & Noise (R16, Static SPA + Bayesian essay)
- **Sovereign (Static SPA + Monte Carlo simulation)**

This recurrence pattern is now well-established as cluster maturity
signal (3 of 8 = 37.5% adoption).

---

## Cluster taxonomy update

| Cluster | Count | Sub-shapes |
|---|---|---|
| **Static-host (web)** | **8** | PWA / static SPA (5) / SSR+Supabase / Next.js+SQLite |
| (others unchanged) | | |

Static SPA: 5 members. Playwright E2E pattern: 3 of 8 cluster
members.

---

## Unblock trigger (operator)

Production-deployable (Vercel config + analytics + Playwright in
place). Operational concerns:

1. **Vercel deploy verification + URL.**
2. **Run Playwright E2E against production URL** before announce.
3. **`@vercel/analytics` privacy posture** — Vercel Analytics is
   cookieless and GDPR-compliant by default; verify no extra
   tracking pixels.
4. **Monte Carlo simulation perf budget** — 50 passes × 60 months ×
   18 countries × 10 variables = ~540,000 data points per run.
   Verify Web Worker doesn't OOM on lower-memory devices (e.g.,
   older iPhones, low-end Chromebooks).
5. **TopoJSON country boundary data** — verify boundary file is
   current (geopolitical boundaries shift; sanctions / annexation
   changes affect display).
6. **Causal-chain view explainability** — top-10 ranked links;
   verify ranking algorithm matches operator intent for v1.
7. **115 tests run cleanly** before announce.

Estimated operator time to deploy: ~1-2 hours.

---

## Portfolio operating system instructions

| Aspect | Posture |
|---|---|
| Portfolio status | `Release Frozen (static-host, static SPA + Web Worker Monte Carlo)` |
| Distribution channel | **Vercel** (config + analytics in place) |
| Review cadence | Suspend overdue counting |
| Resurface conditions | (a) Vercel deploy verification, (b) TopoJSON boundary data refresh (geopolitical changes), (c) Monte Carlo perf budget regression, (d) v1.1 (more countries, more policy levers) |
| Co-batch with | Static-host cluster — **now 8 repos** |
| Sub-shape | **Static SPA + Web Worker Monte Carlo simulation** |
| Special concern | **Playwright E2E recurrence** — 3rd cluster member with this pattern. Cluster maturity signal. |
| Special concern | **TopoJSON boundary data freshness.** Geopolitical boundaries are not static. |
| Special concern | **Monte Carlo perf on low-end devices.** 540K data points / run is significant. |
| Special concern | **`@vercel/analytics` is GDPR-cookieless** — verify no additional tracking layers. |

---

## Reactivation procedure

1. Verify branch tracking.
2. Review stash `r17-sovereign-stash` (untracked `.claude/` only).
3. Run Playwright E2E locally.
4. Run 115-test suite.
5. Verify TopoJSON boundaries are current (compare to recent
   geopolitical events).
6. Deploy to Vercel + verify Web Worker behavior in production.

---

## Last known reference

| Field | Value |
|---|---|
| `origin/main` tip | `629ad91` feat(analytics): add @vercel/analytics |
| Default branch | `main` |
| Build system | TypeScript + D3-geo + TopoJSON + Comlink (Web Worker) + Vercel + Playwright |
| Phases shipped | v1 per memory; 115 tests |
| Distribution channel | **Vercel** (config in place + analytics) |
| Compute model | **Web Worker Monte Carlo** (50 passes × 60 months × 18 countries × 10 vars) |
| Distinguishing tech | Off-main-thread Monte Carlo via Comlink + p10/p50/p90 confidence bands + causal-chain top-10 view + 60-month timeline scrubber |
| Migration state | No `legacy-origin` remote |
| Distinguishing feature | **Eighth static-host cluster member; fifth static-SPA sub-shape member; third cluster member with Playwright E2E pattern.** First with Web Worker off-main-thread compute model. |
