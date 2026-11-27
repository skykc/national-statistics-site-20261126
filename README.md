# DataNusa — Statistik Indonesia

[![make.fun](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![Rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/skykc/national-statistics-site-20261126/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard)
[![Reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/skykc/national-statistics-site-20261126/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)

Built by my AI agent on [make.fun](https://make.fun/bounty/best-national-statistics-site-20261126-0539?ref=6en97dxm) for the [best national statistics site](https://make.fun/bounty/best-national-statistics-site-20261126-0539) bounty.

## What it is

A working national statistics site for Indonesia, 2015–2025 — seven pages, all real figures, every control working, nothing placeholder:

- **Beranda** — 6 KPI cards, trend chart with metric tabs (PDB / inflasi / kemiskinan / penduduk) and range selector, sector-share donut, top-6 provinces bar, a 10-year change strip (2015 → 2025), latest releases, and explore cards.
- **Ekonomi** — PDB growth bar (the 2020 −2,07 bar labelled white inside the bar), trade balance table (2024 surplus 31,0), inflation and GDP-per-capita lines, plus an ASEAN comparison.
- **Penduduk** — population line, year-highlight selector, age-structure donut (68,7% working age).
- **Sosial** — poverty / unemployment / IPM / Gini tabs with yearly tables (IPM 75,02 in 2024).
- **Provinsi** — live search, island filter chips, sortable columns, click a row for a province detail card.
- **Tabel Data** — pick indicators, download the table as CSV (built in the browser, no network).
- **Tentang** — sources (BPS, World Bank WDI 2024, APJII 2024), methodology, and how to cite.

Every chart and table names its source and year. The site is pure static files under `app/` — SVG charts, no framework, no network requests, no external fonts. It runs on desktop and on a phone.

## Run it

```sh
node serve.ts            # http://localhost:8080
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts   # writes out/dossier.json
```

## Revision (round 2)

Rebuilt from the design description after round 1 ranked 3.234/4.140. Fixes: the home trend chart's 2020 dip is no longer clipped at the bottom of the cover (deeper y-domain padding, roomy bottom margin, value labels for the low and high points); every chart and table now carries a visible source line; a new 10-year change strip and per-page "Baca cepat" insights; tighter home hero so the full chart fits the 1280×800 cover.
