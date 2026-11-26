// DataNusa — data statistik Indonesia 2015-2025.
// Semua angka berasal dari publikasi BPS, Bank Dunia (WDI 2024) dan APJII 2024.
// File ini hanya data: tidak ada logika tampilan di sini.

export const YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];

// Seri tahunan, urutan 2015-2025. Ekspor/impor/IPM berakhir 2024 (data 2025 belum rilis).
export const SERIES = {
  population: { label: 'Penduduk', unit: 'juta jiwa', values: [255.6, 258.7, 261.9, 265.0, 268.1, 270.2, 272.7, 275.8, 278.7, 281.6, 284.4] },
  gdpGrowth: { label: 'Pertumbuhan PDB', unit: '%', values: [4.88, 5.03, 5.07, 5.17, 5.02, -2.07, 3.70, 5.31, 5.05, 5.03, 5.11] },
  gdpNominal: { label: 'PDB nominal', unit: 'Rp triliun', values: [11526, 12407, 13588, 14838, 15834, 15444, 16977, 19588, 20892, 22139, 23821] },
  gdpPerCapita: { label: 'PDB per kapita', unit: 'Rp juta', values: [45.1, 48.0, 51.9, 56.0, 59.1, 57.3, 62.2, 71.0, 75.0, 78.6, 83.7] },
  inflation: { label: 'Inflasi (Desember, y-on-y)', unit: '%', values: [3.35, 3.02, 3.61, 3.13, 2.72, 1.68, 1.87, 5.51, 2.61, 1.57, 2.92] },
  poverty: { label: 'Kemiskinan (Maret)', unit: '%', values: [11.22, 10.86, 10.64, 9.82, 9.41, 9.78, 10.14, 9.54, 9.36, 9.03, 8.47] },
  unemployment: { label: 'Pengangguran (Agustus)', unit: '%', values: [6.18, 5.61, 5.50, 5.34, 5.28, 7.07, 6.49, 5.86, 5.32, 4.91, 4.85] },
  exports: { label: 'Ekspor', unit: 'US$ miliar', values: [150.4, 145.2, 168.8, 180.2, 167.7, 163.2, 231.6, 291.9, 258.8, 264.7, null] },
  imports: { label: 'Impor', unit: 'US$ miliar', values: [142.7, 135.7, 156.9, 188.7, 171.3, 141.6, 196.2, 237.4, 221.9, 233.7, null] },
  gini: { label: 'Gini (Maret)', unit: '', values: [0.408, 0.394, 0.391, 0.384, 0.380, 0.381, 0.381, 0.379, 0.379, 0.379, 0.375] },
  hdi: { label: 'IPM', unit: '', values: [69.55, 70.18, 70.81, 71.39, 71.92, 71.94, 72.29, 73.37, 74.39, 75.02, null] },
};

// Penduduk Pulau Jawa (juta jiwa) — untuk pangsa Jawa di halaman Penduduk.
export const JAWA_POP = [141.9, 143.4, 145.0, 146.6, 148.3, 149.6, 151.0, 152.4, 153.9, 155.4, 156.96];
export const AREA_KM2 = 1904569;

// Struktur umur 2024 (%).
export const AGE_2024 = [
  { label: '0-14 tahun', value: 24.3 },
  { label: '15-64 tahun', value: 68.7 },
  { label: '65+ tahun', value: 7.0 },
];

// Pangsa lapangan usaha terhadap PDB 2024 (%).
export const SECTORS_2024 = [
  { label: 'Industri pengolahan', value: 18.7 },
  { label: 'Perdagangan', value: 12.9 },
  { label: 'Pertanian', value: 11.9 },
  { label: 'Konstruksi', value: 10.4 },
  { label: 'Pertambangan', value: 7.9 },
  { label: 'Transportasi', value: 5.0 },
  { label: 'Infokom', value: 4.2 },
  { label: 'Keuangan', value: 4.1 },
  { label: 'Lainnya', value: 24.9 },
];

// 20 provinsi terbesar, penduduk 2024 (juta jiwa) + pulau.
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

// Perbandingan ASEAN 2024: PDB per kapita (US$) dan pertumbuhan (%).
export const ASEAN_2024 = [
  { country: 'Singapura', gdpCapitaUsd: 90700, growth: 4.4 },
  { country: 'Malaysia', gdpCapitaUsd: 13000, growth: 5.1 },
  { country: 'Thailand', gdpCapitaUsd: 7500, growth: 2.5 },
  { country: 'Indonesia', gdpCapitaUsd: 4940, growth: 5.0 },
  { country: 'Vietnam', gdpCapitaUsd: 4700, growth: 7.1 },
  { country: 'Filipina', gdpCapitaUsd: 3900, growth: 5.7 },
];

// Rilis terbaru (tanggal, judul, sumber).
export const RELEASES = [
  { date: '5 Feb 2026', text: 'Pertumbuhan ekonomi 2025 mencapai 5,11% (y-on-y).', source: 'BPS — Berita Resmi Statistik' },
  { date: 'Jan 2026', text: 'Inflasi Desember 2025 sebesar 2,92% (y-on-y).', source: 'BPS — Berita Resmi Statistik' },
  { date: 'Nov 2025', text: 'Tingkat pengangguran terbuka Agustus 2025 turun ke 4,85%.', source: 'BPS — Sakernas' },
  { date: '25 Jul 2025', text: 'Kemiskinan Maret 2025 turun ke 8,47%; garis kemiskinan Rp609.160 per kapita per bulan.', source: 'BPS — Penghitungan & Analisis Kemiskinan Makro 2025' },
  { date: 'Mei 2025', text: 'Indeks Pembangunan Manusia 2024 mencapai 75,02.', source: 'BPS — IPM' },
  { date: 'Jun 2026', text: 'Pendapatan Nasional Indonesia 2021–2025 diterbitkan.', source: 'BPS — Pendapatan Nasional' },
];

// Kartu KPI beranda.
export const KPI = [
  { label: 'Penduduk (2025)', value: '284,4 jt', note: 'Proyeksi BPS, naik 1,0% dari 2024' },
  { label: 'Pertumbuhan ekonomi (2025)', value: '5,11%', note: 'PDB tumbuh 5,11% y-on-y' },
  { label: 'PDB nominal (2025)', value: 'Rp23.821 T', note: 'Harga berlaku, BPS' },
  { label: 'Inflasi (Des 2025, y-on-y)', value: '2,92%', note: 'Dalam sasaran 2,5% ± 1%' },
  { label: 'Kemiskinan (Sep 2025)', value: '8,25%', note: 'Turun dari 8,47% (Mar 2025)' },
  { label: 'Pengangguran (Nov 2025)', value: '4,74%', note: 'TPT terendah sejak 2019' },
];

// Daftar sumber.
export const SOURCES = [
  'BPS — Berita Resmi Statistik (pertumbuhan ekonomi, inflasi, kemiskinan, pengangguran)',
  'BPS — Pendapatan Nasional Indonesia 2021–2025',
  'BPS — Penghitungan & Analisis Kemiskinan Makro 2025',
  'BPS — Survei Angkatan Kerja Nasional (Sakernas)',
  'BPS — Statistik Ekspor–Impor',
  'BPS — Indeks Pembangunan Manusia (IPM)',
  'BPS — Proyeksi Penduduk & Sensus Penduduk 2020',
  'Bank Dunia — World Development Indicators (WDI) 2024',
  'APJII — Survei Penetrasi Internet Indonesia 2024 (pengguna internet 79,5%)',
];

// Indeks pencarian global: 13 entri.
export const SEARCH_INDEX = [
  { term: 'Pertumbuhan PDB', desc: 'Laju pertumbuhan ekonomi 2015–2025', route: '#/ekonomi?tab=gdp' },
  { term: 'PDB nominal', desc: 'Nilai PDB harga berlaku 2015–2025', route: '#/ekonomi?tab=gdp' },
  { term: 'PDB per kapita', desc: 'PDB per kapita 2015–2025', route: '#/ekonomi?tab=capita' },
  { term: 'Inflasi', desc: 'Inflasi Desember y-on-y 2015–2025', route: '#/ekonomi?tab=inflation' },
  { term: 'Ekspor', desc: 'Nilai ekspor 2015–2024', route: '#/ekonomi?tab=trade' },
  { term: 'Impor', desc: 'Nilai impor 2015–2024', route: '#/ekonomi?tab=trade' },
  { term: 'Neraca perdagangan', desc: 'Surplus perdagangan 2015–2024', route: '#/ekonomi?tab=trade' },
  { term: 'Penduduk', desc: 'Jumlah penduduk 2015–2025', route: '#/penduduk' },
  { term: 'Kemiskinan', desc: 'Tingkat kemiskinan Maret 2015–2025', route: '#/sosial?tab=poverty' },
  { term: 'Pengangguran', desc: 'Tingkat pengangguran terbuka 2015–2025', route: '#/sosial?tab=unemployment' },
  { term: 'IPM', desc: 'Indeks Pembangunan Manusia 2015–2024', route: '#/sosial?tab=hdi' },
  { term: 'Gini', desc: 'Rasio Gini Maret 2015–2025', route: '#/sosial?tab=gini' },
  { term: 'Provinsi', desc: 'Penduduk 20 provinsi terbesar 2024', route: '#/provinsi' },
];
