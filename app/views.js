// DataNusa — tampilan tiap halaman. Satu fungsi per halaman + pembantu bersama.
// Semua angka datang dari data.js; semua grafik dari charts.js.

import { YEARS, SERIES, JAWA_POP, AREA_KM2, AGE_2024, SECTORS_2024, PROVINCES, ASEAN_2024, RELEASES, KPI, SOURCES } from './data.js';
import { fmt, lineChart, barChart, hbarChart, donutChart } from './charts.js';

const DEC = { population: 1, gdpGrowth: 2, gdpNominal: 0, gdpPerCapita: 1, inflation: 2, poverty: 2, unemployment: 2, exports: 1, imports: 1, gini: 3, hdi: 2 };

export function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function sliceRange(values, labels, range) {
  if (range === '5') return { v: values.slice(-5), l: labels.slice(-5) };
  if (range === '10') return { v: values.slice(-10), l: labels.slice(-10) };
  return { v: values, l: labels };
}

function rangeOptions(range) {
  const opts = [['all', '2015–2025'], ['10', '10 tahun terakhir'], ['5', '5 tahun terakhir']];
  return opts.map(([v, t]) => `<option value="${v}"${range === v ? ' selected' : ''}>${t}</option>`).join('');
}

export function kpiCards() {
  return `<div class="kpi-grid">${KPI.map((k) => `
    <article class="card kpi"><div class="kpi-label">${esc(k.label)}</div>
    <div class="kpi-value">${esc(k.value)}</div><div class="kpi-note">${esc(k.note)}</div></article>`).join('')}</div>`;
}

export function seriesTable(key, opts = {}) {
  const s = SERIES[key];
  const range = opts.range || 'all';
  const { v, l } = sliceRange(s.values, YEARS, range);
  const rows = l.map((y, i) => `<tr><td>${y}</td><td>${v[i] === null ? 'belum rilis' : esc(fmt(v[i], DEC[key])) + (s.unit ? ' ' + esc(s.unit) : '')}</td></tr>`).join('');
  return `<table class="tbl"><thead><tr><th>Tahun</th><th>${esc(s.label)}${s.unit ? ' (' + esc(s.unit) + ')' : ''}</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function metricTabs(active) {
  const tabs = [
    ['gdpGrowth', 'Pertumbuhan PDB'],
    ['inflation', 'Inflasi'],
    ['poverty', 'Kemiskinan'],
    ['population', 'Penduduk'],
  ];
  return `<div class="tabs" role="tablist">${tabs.map(([k, t]) =>
    `<button type="button" class="pill${active === k ? ' active' : ''}" data-home-metric="${k}" role="tab" aria-selected="${active === k}">${t}</button>`).join('')}</div>`;
}

// ---------------- Beranda ----------------
export function homeView(ui) {
  const metric = ui.homeMetric || 'gdpGrowth';
  const range = ui.homeRange || 'all';
  const s = SERIES[metric];
  const { v, l } = sliceRange(s.values, YEARS, range);
  const top6 = [...PROVINCES].sort((a, b) => b.pop - a.pop).slice(0, 6);
  return `
  <section class="hero"><h1>Statistik Indonesia, <span>terbuka untuk semua.</span></h1>
  <p>Angka resmi penduduk, ekonomi, dan kesejahteraan 2015–2025 — lengkap dengan sumber dan tahunnya, bisa diunduh, bisa dicek ulang.</p></section>
  ${kpiCards()}
  <section class="card"><div class="card-head"><h2>Tren ${esc(s.label)}${s.unit ? ' (' + esc(s.unit) + ')' : ''}</h2>
  <label class="range-label">Rentang <select id="home-range" aria-label="Rentang tahun">${rangeOptions(range)}</select></label></div>
  ${metricTabs(metric)}
  ${lineChart(v, l, { height: 250, color: metric === 'inflation' ? '#d97b29' : metric === 'poverty' ? '#7a5fb5' : '#0b5fa5' })}
  <p class="src">Sumber: BPS — Berita Resmi Statistik &amp; Pendapatan Nasional Indonesia 2021–2025. Nilai terakhir: <strong>${esc(fmt(v[v.length - 1], DEC[metric]))}${s.unit ? ' ' + esc(s.unit) : ''}</strong> (${l[l.length - 1]}).</p></section>
  <div class="two-col">
  <section class="card"><h2>Pangsa lapangan usaha, 2024</h2>
  ${donutChart(SECTORS_2024, { size: 200 })}
  <p class="src">Sumber: BPS — Pendapatan Nasional Indonesia 2021–2025.</p></section>
  <section class="card"><h2>6 provinsi terpadat, 2024</h2>
  ${hbarChart(top6.map((p) => ({ label: p.name, value: p.pop })), { highlight: 'Jawa Barat' })}
  <p class="src">Penduduk dalam juta jiwa. Sumber: BPS — Proyeksi Penduduk.</p></section>
  </div>
  <section class="card"><h2>Rilis terbaru</h2>
  <table class="tbl"><thead><tr><th>Tanggal</th><th>Rilis</th><th>Sumber</th></tr></thead><tbody>
  ${RELEASES.map((r) => `<tr><td>${esc(r.date)}</td><td>${esc(r.text)}</td><td>${esc(r.source)}</td></tr>`).join('')}
  </tbody></table></section>
  <section><h2 class="section-title">Jelajahi data</h2><div class="explore-grid">
  <a class="card explore" href="#/ekonomi"><strong>Ekonomi</strong><span>PDB, inflasi, perdagangan &amp; ASEAN</span></a>
  <a class="card explore" href="#/penduduk"><strong>Penduduk</strong><span>Jumlah, umur &amp; sebaran provinsi</span></a>
  <a class="card explore" href="#/sosial"><strong>Sosial</strong><span>Kemiskinan, pengangguran, IPM &amp; Gini</span></a>
  <a class="card explore" href="#/provinsi"><strong>Provinsi</strong><span>20 provinsi terbesar, bisa dicari</span></a>
  </div></section>`;
}

// ---------------- Ekonomi ----------------
const ECON_TABS = [
  ['gdp', 'PDB & pertumbuhan'],
  ['inflation', 'Inflasi'],
  ['trade', 'Ekspor & impor'],
  ['capita', 'PDB per kapita'],
];

export function economyView(ui) {
  const tab = ui.econTab || 'gdp';
  const range = ui.econRange || 'all';
  let body = '';
  if (tab === 'gdp') {
    const { v, l } = sliceRange(SERIES.gdpGrowth.values, YEARS, range);
    body = `<h2>Pertumbuhan PDB, ${l[0]}–${l[l.length - 1]}</h2>
    ${barChart(v, l, { color: '#0b5fa5', negColor: '#d97b29' })}
    <p class="insight">Ekonomi tumbuh 5,11% pada 2025. Satu-satunya kontraksi dalam satu dekade terjadi 2020 (−2,07%) saat pandemi COVID-19 — batang oranye di atas, dengan angka putih di dalam batang.</p>
    <h3>PDB nominal (Rp triliun)</h3>${seriesTable('gdpNominal', { range })}`;
  } else if (tab === 'inflation') {
    const { v, l } = sliceRange(SERIES.inflation.values, YEARS, range);
    body = `<h2>Inflasi (Desember, y-on-y)</h2>
    ${lineChart(v, l, { color: '#d97b29' })}
    <p class="insight">Inflasi 2025 sebesar 2,92%, kembali ke dalam sasaran Bank Indonesia 2,5% ± 1%. Lonjakan 2022 (5,51%) mengikuti kenaikan harga BBM bersubsidi.</p>
    ${seriesTable('inflation', { range })}`;
  } else if (tab === 'trade') {
    const rows = YEARS.slice(0, 10).map((y, i) => {
      const sur = +(SERIES.exports.values[i] - SERIES.imports.values[i]).toFixed(1);
      return `<tr><td>${y}</td><td>${esc(fmt(SERIES.exports.values[i], 1))}</td><td>${esc(fmt(SERIES.imports.values[i], 1))}</td><td><strong>${sur >= 0 ? '+' : ''}${esc(fmt(sur, 1))}</strong></td></tr>`;
    }).join('');
    body = `<h2>Neraca perdagangan (US$ miliar)</h2>
    <table class="tbl"><thead><tr><th>Tahun</th><th>Ekspor</th><th>Impor</th><th>Surplus / defisit</th></tr></thead><tbody>${rows}</tbody></table>
    <p class="insight">Neraca perdagangan 2024 surplus 31,0 miliar dolar AS — ekspor 264,7 miliar dikurangi impor 233,7 miliar. Surplus bertahan setiap tahun sejak 2020, didorong harga komoditas dan hilirisasi nikel.</p>
    <p class="src">Sumber: BPS — Statistik Ekspor–Impor.</p>`;
  } else {
    const { v, l } = sliceRange(SERIES.gdpPerCapita.values, YEARS, range);
    body = `<h2>PDB per kapita (Rp juta)</h2>
    ${lineChart(v, l, { color: '#2e9e6b' })}
    <p class="insight">PDB per kapita 2025 mencapai Rp83,7 juta — naik hampir dua kali lipat dari Rp45,1 juta pada 2015. Dalam dolar AS, PDB per kapita 2024 sekitar US$4.940.</p>
    ${seriesTable('gdpPerCapita', { range })}`;
  }
  const aseanRows = [...ASEAN_2024].sort((a, b) => b.gdpCapitaUsd - a.gdpCapitaUsd).map((a) =>
    `<tr><td>${esc(a.country)}</td><td>${esc(fmt(a.gdpCapitaUsd, 0))}</td><td>${esc(fmt(a.growth, 1))}%</td></tr>`).join('');
  return `
  <section class="page-head"><h1>Ekonomi</h1><p>PDB, harga, dan perdagangan luar negeri Indonesia 2015–2025.</p></section>
  <section class="card"><div class="card-head"><div class="tabs" role="tablist">
  ${ECON_TABS.map(([k, t]) => `<button type="button" class="pill${tab === k ? ' active' : ''}" data-econ-tab="${k}" role="tab" aria-selected="${tab === k}">${t}</button>`).join('')}</div>
  <label class="range-label">Rentang <select id="econ-range" aria-label="Rentang tahun">${rangeOptions(range)}</select></label></div>
  ${body}
  <p class="src">Sumber: BPS — Berita Resmi Statistik &amp; Pendapatan Nasional Indonesia 2021–2025.</p></section>
  <section class="card"><h2>Perbandingan ASEAN, 2024</h2>
  ${hbarChart([...ASEAN_2024].sort((a, b) => b.gdpCapitaUsd - a.gdpCapitaUsd).map((a) => ({ label: a.country, value: a.gdpCapitaUsd })), { highlight: 'Indonesia' })}
  <table class="tbl"><thead><tr><th>Negara</th><th>PDB per kapita (US$)</th><th>Pertumbuhan (%)</th></tr></thead><tbody>${aseanRows}</tbody></table>
  <p class="insight">Indonesia punya PDB per kapita keempat di ASEAN (US$4.940) tetapi pertumbuhan 5,0% — lebih cepat dari Singapura, Malaysia, dan Thailand. Vietnam tumbuh paling cepat (7,1%).</p>
  <p class="src">Sumber: Bank Dunia — World Development Indicators 2024.</p></section>`;
}

// ---------------- Penduduk ----------------
export function populationView(ui) {
  const year = ui.popYear || 2024;
  const i = YEARS.indexOf(year);
  const pop = SERIES.population.values[i];
  const growth = i > 0 ? ((pop - SERIES.population.values[i - 1]) / SERIES.population.values[i - 1]) * 100 : null;
  const density = (pop * 1e6) / AREA_KM2;
  const jawaShare = (JAWA_POP[i] / pop) * 100;
  const yearOpts = YEARS.map((y) => `<option value="${y}"${y === year ? ' selected' : ''}>${y}</option>`).join('');
  return `
  <section class="page-head"><h1>Penduduk</h1><p>Jumlah, pertumbuhan, dan struktur penduduk Indonesia 2015–2025.</p></section>
  <section class="card"><h2>Jumlah penduduk 2015–2025 (juta jiwa)</h2>
  ${lineChart(SERIES.population.values, YEARS, { color: '#0b5fa5' })}
  <p class="src">Sumber: BPS — Proyeksi Penduduk &amp; Sensus Penduduk 2020.</p></section>
  <section class="card"><div class="card-head"><h2>Tahun sorotan</h2>
  <label class="range-label">Tahun <select id="pop-year" aria-label="Tahun sorotan">${yearOpts}</select></label></div>
  <div class="fact-grid">
  <div class="fact"><div class="fact-label">Penduduk ${year}</div><div class="fact-value">${esc(fmt(pop, 1))} juta jiwa</div></div>
  <div class="fact"><div class="fact-label">Pertumbuhan vs tahun lalu</div><div class="fact-value">${growth === null ? '—' : esc(fmt(growth, 2)) + '%'}</div></div>
  <div class="fact"><div class="fact-label">Kepadatan</div><div class="fact-value">${esc(fmt(density, 1))} jiwa/km²</div></div>
  <div class="fact"><div class="fact-label">Pangsa Pulau Jawa</div><div class="fact-value">${esc(fmt(jawaShare, 1))}%</div></div>
  </div>
  <p class="insight">Pada ${year}, Indonesia berpenduduk ${esc(fmt(pop, 1))} juta jiwa. Lebih dari separuhnya — ${esc(fmt(jawaShare, 1))}% — tinggal di Pulau Jawa, yang luasnya hanya sekitar 7% wilayah daratan.</p></section>
  <section class="card"><h2>Struktur umur, 2024</h2>
  ${donutChart(AGE_2024, { size: 200 })}
  <p class="insight">Indonesia masih menikmati bonus demografi: 68,7% penduduk berusia produktif (15–64 tahun). Rasio ketergantungan 2024 sekitar 45,6 per 100 penduduk usia kerja.</p></section>
  <section class="card"><h2>Fakta penduduk</h2><ul class="facts">
  <li>Indonesia negara berpenduduk terbesar keempat di dunia, setelah India, Tiongkok, dan Amerika Serikat.</li>
  <li>Pengguna internet mencapai 79,5% penduduk pada 2024 (APJII).</li>
  <li>Median usia penduduk Indonesia sekitar 30 tahun — populasi yang muda dan produktif.</li>
  <li>Urbanisasi terus berjalan: lebih dari separuh penduduk kini tinggal di perkotaan.</li>
  </ul><p class="src">Sumber: BPS — Proyeksi Penduduk; APJII 2024.</p></section>`;
}

// ---------------- Sosial ----------------
const SOCIAL_TABS = [
  ['poverty', 'Kemiskinan'],
  ['unemployment', 'Pengangguran'],
  ['hdi', 'IPM'],
  ['gini', 'Gini'],
];
const SOCIAL_NOTES = {
  poverty: 'Kemiskinan diukur BPS setiap Maret dan September dari garis kemiskinan — kebutuhan minimum makanan dan non-makanan per kapita per bulan. Maret 2025: 8,47% penduduk (24,06 juta jiwa), garis kemiskinan Rp609.160 per kapita per bulan.',
  unemployment: 'Tingkat pengangguran terbuka (TPT) diukur dari Sakernas setiap Februari dan Agustus. Agustus 2025: 4,85% — terendah sejak 2019. Lonjakan 2020 (7,07%) adalah dampak pandemi.',
  hdi: 'Indeks Pembangunan Manusia menggabungkan umur harapan hidup, harapan lama sekolah dan rata-rata lama sekolah, serta pengeluaran per kapita. IPM 2024 mencapai 75,02 — kategori "tinggi" menurut UNDP (70–80).',
  gini: 'Rasio Gini mengukur ketimpangan pengeluaran, dari 0 (sempurna merata) hingga 1. Gini Maret 2025 sebesar 0,375 — terendah dalam satu dekade, turun dari 0,408 pada 2015.',
};

export function socialView(ui) {
  const tab = ui.socialTab || 'poverty';
  const key = tab === 'hdi' ? 'hdi' : tab === 'gini' ? 'gini' : tab === 'unemployment' ? 'unemployment' : 'poverty';
  const s = SERIES[key];
  const pairs = YEARS.map((y, i) => ({ y, v: s.values[i] })).filter((p) => p.v !== null);
  const labels = pairs.map((p) => p.y);
  const values = pairs.map((p) => p.v);
  const colors = { poverty: '#7a5fb5', unemployment: '#d97b29', hdi: '#2e9e6b', gini: '#0b5fa5' };
  return `
  <section class="page-head"><h1>Sosial</h1><p>Kemiskinan, pekerjaan, pembangunan manusia, dan ketimpangan 2015–2025.</p></section>
  <section class="card"><div class="tabs" role="tablist">
  ${SOCIAL_TABS.map(([k, t]) => `<button type="button" class="pill${tab === k ? ' active' : ''}" data-social-tab="${k}" role="tab" aria-selected="${tab === k}">${t}</button>`).join('')}</div>
  <h2>${esc(s.label)}${s.unit ? ' (' + esc(s.unit) + ')' : ''}</h2>
  ${lineChart(values, labels, { color: colors[tab] })}
  ${seriesTable(key)}
  <p class="insight">${esc(SOCIAL_NOTES[tab])}</p>
  <p class="src">Sumber: BPS — Penghitungan &amp; Analisis Kemiskinan Makro 2025; Sakernas; IPM.</p></section>`;
}

// ---------------- Provinsi ----------------
export function provincesView(ui) {
  const q = (ui.provSearch || '').trim().toLowerCase();
  const island = ui.provIsland || 'Semua';
  const sortKey = ui.provSort || 'pop';
  const sortDir = ui.provSortDir || 'desc';
  let list = PROVINCES.filter((p) => (island === 'Semua' || p.island === island) &&
    (!q || p.name.toLowerCase().includes(q)));
  const cmp = {
    name: (a, b) => a.name.localeCompare(b.name, 'id'),
    island: (a, b) => a.island.localeCompare(b.island, 'id') || b.pop - a.pop,
    pop: (a, b) => a.pop - b.pop,
  }[sortKey];
  list = [...list].sort((a, b) => (sortDir === 'asc' ? cmp(a, b) : -cmp(a, b)));
  const islands = ['Semua', 'Jawa', 'Sumatera', 'Kalimantan', 'Sulawesi', 'Bali & Nusa Tenggara'];
  const arrow = (k) => (sortKey === k ? (sortDir === 'asc' ? ' ▲' : ' ▼') : '');
  const rows = list.map((p) => `<tr data-prov="${esc(p.name)}" tabindex="0"><td>${esc(p.name)}</td><td>${esc(p.island)}</td><td>${esc(fmt(p.pop, 2))}</td></tr>`).join('');
  const sel = PROVINCES.find((p) => p.name === ui.selectedProv);
  const detail = sel ? `<aside class="card detail" id="prov-detail"><h2>${esc(sel.name)}</h2>
    <dl><dt>Pulau</dt><dd>${esc(sel.island)}</dd>
    <dt>Penduduk 2024</dt><dd>${esc(fmt(sel.pop, 2))} juta jiwa</dd>
    <dt>Pangsa nasional</dt><dd>${esc(fmt((sel.pop / 284.4) * 100, 1))}% dari 284,4 juta jiwa</dd>
    <dt>Peringkat</dt><dd>#${PROVINCES.indexOf(sel) + 1} dari 20 provinsi terbesar</dd></dl>
    <p class="src">Sumber: BPS — Proyeksi Penduduk 2024.</p></aside>` : '';
  return `
  <section class="page-head"><h1>Provinsi</h1><p>Penduduk 20 provinsi terbesar di Indonesia, 2024. Klik baris untuk detail.</p></section>
  <section class="card">
  <div class="prov-tools">
  <label class="search-box">Cari provinsi <input id="prov-search" type="search" placeholder="mis. Jawa Barat" value="${esc(ui.provSearch || '')}" aria-label="Cari provinsi"></label>
  <div class="chips" role="group" aria-label="Saring pulau">
  ${islands.map((is) => `<button type="button" class="chip${island === is ? ' active' : ''}" data-prov-island="${esc(is)}">${esc(is)}</button>`).join('')}
  </div></div>
  <p class="count">${list.length} provinsi ditampilkan</p>
  <table class="tbl prov"><thead><tr>
  <th><button type="button" class="th-btn" data-prov-sort="name">Provinsi${arrow('name')}</button></th>
  <th><button type="button" class="th-btn" data-prov-sort="island">Pulau${arrow('island')}</button></th>
  <th><button type="button" class="th-btn" data-prov-sort="pop">Penduduk 2024 (jt)${arrow('pop')}</button></th>
  </tr></thead><tbody>${rows || '<tr><td colspan="3">Tidak ada provinsi yang cocok.</td></tr>'}</tbody></table>
  <p class="src">Sumber: BPS — Proyeksi Penduduk 2024. Daftar ini memuat 20 provinsi terbesar.</p></section>
  ${detail}`;
}

// ---------------- Tabel Data ----------------
export const DATA_INDICATORS = [
  ['population', 'Penduduk (juta jiwa)'],
  ['gdpGrowth', 'Pertumbuhan PDB (%)'],
  ['gdpNominal', 'PDB nominal (Rp triliun)'],
  ['gdpPerCapita', 'PDB per kapita (Rp juta)'],
  ['inflation', 'Inflasi Des y-on-y (%)'],
  ['poverty', 'Kemiskinan Mar (%)'],
  ['unemployment', 'Pengangguran Agu (%)'],
  ['exports', 'Ekspor (US$ miliar)'],
  ['imports', 'Impor (US$ miliar)'],
  ['gini', 'Gini Mar'],
  ['hdi', 'IPM'],
];

export function dataView(ui) {
  const chosen = ui.dataIndicators || ['population', 'gdpGrowth', 'inflation'];
  const year = ui.dataYear || 2025;
  const yearOpts = YEARS.map((y) => `<option value="${y}"${y === year ? ' selected' : ''}>${y}</option>`).join('');
  const rows = YEARS.filter((y) => y <= year).map((y) => {
    const i = YEARS.indexOf(y);
    const cells = chosen.map((k) => `<td>${SERIES[k].values[i] === null ? '—' : esc(fmt(SERIES[k].values[i], DEC[k]))}</td>`).join('');
    return `<tr><td>${y}</td>${cells}</tr>`;
  }).join('');
  return `
  <section class="page-head"><h1>Tabel Data</h1><p>Pilih indikator dan tahun, lalu unduh sebagai CSV — langsung dari browser, tanpa server.</p></section>
  <section class="card">
  <fieldset class="ind-pick"><legend>Pilih indikator</legend>
  ${DATA_INDICATORS.map(([k, t]) => `<label class="check"><input type="checkbox" name="ind" value="${k}"${chosen.includes(k) ? ' checked' : ''}> ${t}</label>`).join('')}
  </fieldset>
  <div class="data-tools"><label class="range-label">Sampai tahun <select id="data-year" aria-label="Sampai tahun">${yearOpts}</select></label>
  <button type="button" class="btn" id="data-csv">Unduh CSV</button>
  <span id="csv-status" role="status">${esc(ui.csvStatus || '')}</span></div>
  <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Tahun</th>${chosen.map((k) => `<th>${esc(SERIES[k].label)}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div>
  <p class="src">Sumber: BPS, Bank Dunia WDI 2024, APJII 2024. Nilai kosong (—) berarti data belum dirilis.</p></section>`;
}

// ---------------- Tentang ----------------
export function aboutView() {
  return `
  <section class="page-head"><h1>Tentang DataNusa</h1><p>Statistik Indonesia yang terbuka, bisa dicek ulang, dan gratis untuk semua.</p></section>
  <section class="card"><h2>Apa itu DataNusa?</h2>
  <p>DataNusa adalah situs statistik independen yang merangkum angka-angka utama Indonesia — penduduk, ekonomi, dan kesejahteraan — dari publikasi resmi, dalam satu tempat yang mudah dibaca di desktop maupun ponsel. Semua angka di situs ini disertai tahun dan sumbernya.</p>
  <p>DataNusa <strong>bukan situs resmi BPS</strong>. Situs ini independen dan tidak berafiliasi dengan Badan Pusat Statistik, Bank Dunia, atau APJII.</p></section>
  <section class="card"><h2>Sumber data</h2><ul class="facts">
  ${SOURCES.map((s) => `<li>${esc(s)}</li>`).join('')}
  </ul></section>
  <section class="card"><h2>Metodologi &amp; catatan</h2><ul class="facts">
  <li>Pertumbuhan PDB dan inflasi memakai tahun kalender; kemiskinan dan Gini memakai pengukuran Maret; pengangguran memakai Sakernas Agustus.</li>
  <li>Ekspor, impor, dan IPM 2025 belum dirilis saat situs ini dibuat — sel ditandai "belum rilis".</li>
  <li>Angka 2025 adalah angka resmi yang sudah diumumkan BPS per awal 2026; proyeksi penduduk memakai Proyeksi Penduduk BPS.</li>
  <li>Kepadatan penduduk dihitung dari luas daratan 1.904.569 km².</li>
  <li>Situs ini statis sepenuhnya: tidak ada pelacak, tidak ada permintaan jaringan, dan unduhan CSV dibuat langsung di browser Anda.</li>
  </ul></section>
  <section class="card"><h2>Cara mengutip</h2>
  <p>Kutip angka dari situs ini dengan menyebut sumber aslinya, contoh: "Badan Pusat Statistik, <em>Berita Resmi Statistik</em>, Februari 2026 (diakses melalui DataNusa)".</p></section>`;
}
