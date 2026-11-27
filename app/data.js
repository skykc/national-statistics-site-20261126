// DataNusa — data saja. Semua angka nyata: BPS, Bank Dunia (WDI 2024), APJII 2024.
// Seri tahunan 2015-2025, ditulis persis dari sumber yang dicantumkan di halaman Tentang.
export const YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];

export const SERIES = {
  population: { label: 'Penduduk', unit: 'juta jiwa', src: 'BPS, Proyeksi Penduduk & Sensus 2020', values: [255.6, 258.7, 261.9, 265.0, 268.1, 270.2, 272.7, 275.8, 278.7, 281.6, 284.4] },
  gdpGrowth: { label: 'Pertumbuhan PDB', unit: '% y-on-y', src: 'BPS, Berita Resmi Statistik & Pendapatan Nasional 2021–2025', values: [4.88, 5.03, 5.07, 5.17, 5.02, -2.07, 3.70, 5.31, 5.05, 5.03, 5.11] },
  gdpNominal: { label: 'PDB nominal', unit: 'Rp triliun', src: 'BPS, Pendapatan Nasional Indonesia 2021–2025', values: [11526, 12407, 13588, 14838, 15834, 15444, 16977, 19588, 20892, 22139, 23821] },
  gdpPerCapita: { label: 'PDB per kapita', unit: 'Rp juta', src: 'BPS, Pendapatan Nasional Indonesia 2021–2025', values: [45.1, 48.0, 51.9, 56.0, 59.1, 57.3, 62.2, 71.0, 75.0, 78.6, 83.7] },
  inflation: { label: 'Inflasi (Desember, y-on-y)', unit: '%', src: 'BPS, Berita Resmi Statistik', values: [3.35, 3.02, 3.61, 3.13, 2.72, 1.68, 1.87, 5.51, 2.61, 1.57, 2.92] },
  poverty: { label: 'Kemiskinan (Maret)', unit: '% penduduk', src: 'BPS, Penghitungan & Analisis Kemiskinan Makro 2025', values: [11.22, 10.86, 10.64, 9.82, 9.41, 9.78, 10.14, 9.54, 9.36, 9.03, 8.47] },
  unemployment: { label: 'Pengangguran (Agustus)', unit: '% angkatan kerja', src: 'BPS, Sakernas', values: [6.18, 5.61, 5.50, 5.34, 5.28, 7.07, 6.49, 5.86, 5.32, 4.91, 4.85] },
  exports: { label: 'Ekspor', unit: 'US$ juta', src: 'BPS, Statistik Ekspor–Impor', values: [150.4, 145.2, 168.8, 180.2, 167.7, 163.2, 231.6, 291.9, 258.8, 264.7, null] },
  imports: { label: 'Impor', unit: 'US$ juta', src: 'BPS, Statistik Ekspor–Impor', values: [142.7, 135.7, 156.9, 188.7, 171.3, 141.6, 196.2, 237.4, 221.9, 233.7, null] },
  gini: { label: 'Rasio Gini (Maret)', unit: 'indeks 0–1', src: 'BPS, Berita Resmi Statistik', values: [0.408, 0.394, 0.391, 0.384, 0.380, 0.381, 0.381, 0.379, 0.379, 0.379, 0.375] },
  hdi: { label: 'Indeks Pembangunan Manusia', unit: 'indeks 0–100', src: 'BPS, Indeks Pembangunan Manusia', values: [69.55, 70.18, 70.81, 71.39, 71.92, 71.94, 72.29, 73.37, 74.39, 75.02, null] },
};

// Pangsa lapangan usaha terhadap PDB 2024 (%). Sumber: BPS, Pendapatan Nasional 2021–2025.
export const SECTORS_2024 = [
  { name: 'Industri pengolahan', value: 18.7 },
  { name: 'Perdagangan', value: 12.9 },
  { name: 'Pertanian', value: 11.9 },
  { name: 'Konstruksi', value: 10.4 },
  { name: 'Pertambangan', value: 7.9 },
  { name: 'Transportasi & pergudangan', value: 5.0 },
  { name: 'Informasi & komunikasi', value: 4.2 },
  { name: 'Keuangan', value: 4.1 },
  { name: 'Lainnya', value: 24.9 },
];

// Struktur umur 2024 (%). Sumber: BPS, Proyeksi Penduduk.
export const AGE_2024 = [
  { name: '0–14 tahun', value: 24.3 },
  { name: '15–64 tahun', value: 68.7 },
  { name: '65+ tahun', value: 7.0 },
];

// 20 provinsi terbesar 2024 (juta jiwa). Sumber: BPS, Proyeksi Penduduk.
export const PROVINCES = [
  { name: 'Jawa Barat', island: 'Jawa', pop: 50.35 },
  { name: 'Jawa Timur', island: 'Jawa', pop: 41.81 },
  { name: 'Jawa Tengah', island: 'Jawa', pop: 37.89 },
  { name: 'Sumatera Utara', island: 'Sumatera', pop: 15.59 },
  { name: 'Banten', island: 'Jawa', pop: 12.43 },
  { name: 'DKI Jakarta', island: 'Jawa', pop: 10.68 },
  { name: 'Sulawesi Selatan', island: 'Sulawesi', pop: 9.28 },
  { name: 'Lampung', island: 'Sumatera', pop: 9.17 },
  { name: 'Sumatera Selatan', island: 'Sumatera', pop: 9.01 },
  { name: 'Riau', island: 'Sumatera', pop: 6.87 },
  { name: 'Kalimantan Barat', island: 'Kalimantan', pop: 5.80 },
  { name: 'Sumatera Barat', island: 'Sumatera', pop: 5.76 },
  { name: 'Nusa Tenggara Timur', island: 'Bali & Nusa Tenggara', pop: 5.69 },
  { name: 'Aceh', island: 'Sumatera', pop: 5.56 },
  { name: 'Bali', island: 'Bali & Nusa Tenggara', pop: 4.41 },
  { name: 'Kalimantan Selatan', island: 'Kalimantan', pop: 4.25 },
  { name: 'Kalimantan Timur', island: 'Kalimantan', pop: 4.03 },
  { name: 'DI Yogyakarta', island: 'Jawa', pop: 3.80 },
  { name: 'Jambi', island: 'Sumatera', pop: 3.65 },
  { name: 'Sulawesi Utara', island: 'Sulawesi', pop: 2.73 },
];

// PDB per kapita ASEAN 2024 (US$) + pertumbuhan PDB (%). Sumber: Bank Dunia, WDI 2024.
export const ASEAN_2024 = [
  { name: 'Singapura', perCapita: 90700, growth: 4.4 },
  { name: 'Malaysia', perCapita: 13000, growth: 5.1 },
  { name: 'Thailand', perCapita: 7500, growth: 2.5 },
  { name: 'Indonesia', perCapita: 4940, growth: 5.0 },
  { name: 'Vietnam', perCapita: 4700, growth: 7.1 },
  { name: 'Filipina', perCapita: 3900, growth: 5.7 },
];

// Rilis terbaru (tanggal, judul, angka). Sumber: BPS.
export const RELEASES = [
  { date: '5 Feb 2026', text: 'Pertumbuhan ekonomi 2025 tercatat 5,11% (y-on-y).', src: 'BPS, Berita Resmi Statistik' },
  { date: 'Jan 2026', text: 'Inflasi 2025 sebesar 2,92% (Desember y-on-y).', src: 'BPS, Berita Resmi Statistik' },
  { date: 'Nov 2025', text: 'Tingkat pengangguran terbuka Agustus 2025 sebesar 4,85%.', src: 'BPS, Sakernas' },
  { date: '25 Jul 2025', text: 'Kemiskinan Maret 2025 sebesar 8,47% (garis kemiskinan Rp609.160/kapita/bulan).', src: 'BPS, Kemiskinan Makro 2025' },
  { date: 'Mei 2025', text: 'Indeks Pembangunan Manusia 2024 mencapai 75,02.', src: 'BPS, IPM' },
  { date: 'Jun 2026', text: 'Pendapatan Nasional Indonesia 2021–2025 diterbitkan.', src: 'BPS' },
];

// Kartu KPI beranda.
export const KPIS = [
  { label: 'Penduduk 2025', value: '284,4 jt', note: 'BPS, Proyeksi Penduduk' },
  { label: 'Pertumbuhan ekonomi 2025', value: '5,11%', note: 'BPS, Feb 2026' },
  { label: 'PDB nominal 2025', value: 'Rp23.821 T', note: 'BPS, Pendapatan Nasional' },
  { label: 'Inflasi 2025', value: '2,92%', note: 'BPS, Des y-on-y' },
  { label: 'Kemiskinan Sep 2025', value: '8,25%', note: 'BPS, Kemiskinan Makro' },
  { label: 'Pengangguran Nov 2025', value: '4,74%', note: 'BPS, Sakernas' },
];

// Perubahan 10 tahun (2015 → 2025) — dihitung dari seri di atas.
export const DECADE = [
  { label: 'Penduduk', change: '+28,8 jt', pct: '+11,3%', good: true },
  { label: 'PDB nominal', change: '+Rp12.295 T', pct: '+106,7%', good: true },
  { label: 'PDB per kapita', change: '+Rp38,6 jt', pct: '+85,6%', good: true },
  { label: 'Kemiskinan', change: '−2,75 poin', pct: '11,22% → 8,47%', good: true },
  { label: 'Pengangguran', change: '−1,33 poin', pct: '6,18% → 4,85%', good: true },
  { label: 'IPM (2015→2024)', change: '+5,47 poin', pct: '69,55 → 75,02', good: true },
];

export const INDICATORS = [
  { key: 'population', label: 'Penduduk (juta jiwa)' },
  { key: 'gdpGrowth', label: 'Pertumbuhan PDB (% y-on-y)' },
  { key: 'gdpNominal', label: 'PDB nominal (Rp triliun)' },
  { key: 'gdpPerCapita', label: 'PDB per kapita (Rp juta)' },
  { key: 'inflation', label: 'Inflasi Desember (% y-on-y)' },
  { key: 'poverty', label: 'Kemiskinan Maret (% penduduk)' },
  { key: 'unemployment', label: 'Pengangguran Agustus (% angkatan kerja)' },
  { key: 'gini', label: 'Rasio Gini Maret (0–1)' },
  { key: 'hdi', label: 'IPM (0–100)' },
];
