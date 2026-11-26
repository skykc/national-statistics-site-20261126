# DataNusa — Statistik Indonesia

[![make.fun](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/skykc/national-statistics-site-20261126/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/skykc/national-statistics-site-20261126/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)

Situs statistik nasional Indonesia yang statis dan bekerja tanpa jaringan: penduduk, ekonomi, dan kesejahteraan 2015–2025, lengkap dengan sumber dan tahunnya. Dibangun untuk kompetisi [Make the best national statistics site](https://make.fun/bounty/best-national-statistics-site-20261126-0539) di [make.fun](https://make.fun).

## Isi situs

- **Beranda** — 6 kartu KPI, grafik tren (tab metrik + rentang 5/10 tahun), donat pangsa lapangan usaha, bar 6 provinsi terpadat, tabel rilis terbaru.
- **Ekonomi** — tab PDB & pertumbuhan, Inflasi, Ekspor & impor (neraca perdagangan + surplus), PDB per kapita, plus perbandingan ASEAN.
- **Penduduk** — grafik garis 2015–2025, pemilih tahun sorotan (angka, pertumbuhan, kepadatan, pangsa Jawa), donat struktur umur.
- **Sosial** — tab Kemiskinan, Pengangguran, IPM, dan Gini, lengkap dengan tabel tahunan dan catatan penjelasan.
- **Provinsi** — cari provinsi, saring per pulau, urutkan kolom, klik baris untuk kartu detail.
- **Tabel Data** — pilih indikator dan tahun, unduh CSV langsung dari browser.
- **Tentang** — sumber, metodologi, dan cara mengutip.

Semua angka berasal dari BPS (Berita Resmi Statistik, Pendapatan Nasional Indonesia 2021–2025, Sakernas, IPM), Bank Dunia (WDI 2024), dan APJII 2024. DataNusa adalah situs independen, bukan situs resmi BPS.

## Menjalankan

```sh
node serve.ts
```

Lalu buka http://localhost:8080 — situs statis murni: tanpa build step, tanpa CDN, tanpa font eksternal, grafik SVG murni, dan tanpa satu pun permintaan jaringan.

## Struktur

- `app/index.html` — kerangka halaman (header, pencarian global, footer)
- `app/style.css` — seluruh gaya situs
- `app/data.js` — semua seri data 2015–2025
- `app/charts.js` — grafik SVG murni (`lineChart`, `barChart`, `hbarChart`, `donutChart`)
- `app/views.js` — satu fungsi per halaman + `seriesTable` + `kpiCards`
- `app/main.js` — router hash, state UI, dan semua event listener
- `main.ts` — program penyerahan (menyalin `app/` + `screenshots/` ke `/output` dan menulis `dossier.json`)
- `screenshots/` — 4 tangkapan layar situs (beranda, ekonomi, provinsi, beranda di ponsel)

Dibangun dengan bantuan agen AI di [make.fun](https://make.fun) — template kit: [make.fun](https://make.fun/c/best-national-statistics-site-20261126-0539/kit).
