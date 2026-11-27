// DataNusa — satu fungsi per halaman + kpiCards + seriesTable.
// Semua angka dari app/data.js; setiap grafik/tabel mencantumkan sumber + tahun.
import { YEARS, SERIES, SECTORS_2024, AGE_2024, PROVINCES, ASEAN_2024, RELEASES, KPIS, DECADE, INDICATORS } from './data.js';
import { lineChart, barChart, hbarChart, donutChart, fmtID } from './charts.js';

function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

export function kpiCards() {
  return `<div class="kpis">${KPIS.map((k) => `<div class="kpi"><div class="k-label">${esc(k.label)}</div><div class="k-value">${esc(k.value)}</div><div class="k-note">${esc(k.note)}</div></div>`).join('')}</div>`;
}

export function seriesTable(key, years, values) {
  const s = SERIES[key];
  const rows = years.map((y, i) => `<tr><td>${y}</td><td class="num">${values[i] === null || values[i] === undefined ? '—' : fmtID(values[i])}</td></tr>`).join('');
  return `<table class="data"><thead><tr><th>Tahun</th><th class="num">${esc(s.label)} (${esc(s.unit)})</th></tr></thead><tbody>${rows}</tbody></table><p class="src">${esc(s.src)}.</p>`;
}

function srcLine(s) { return `<p class="src">${esc(s)}</p>`; }

function homeChartBlock(state) {
  const metric = state.homeMetric || 'growth';
  const keyMap = { growth: 'gdpGrowth', inflation: 'inflation', poverty: 'poverty', population: 'population' };
  const key = keyMap[metric];
  const s = SERIES[key];
  const range = state.homeRange || 'all';
  let years = YEARS, values = s.values;
  if (range === '10') { years = YEARS.slice(-10); values = s.values.slice(-10); }
  if (range === '5') { years = YEARS.slice(-5); values = s.values.slice(-5); }
  const tabs = [['growth', 'Pertumbuhan PDB'], ['inflation', 'Inflasi'], ['poverty', 'Kemiskinan'], ['population', 'Penduduk']]
    .map(([k, label]) => `<button class="pill${metric === k ? ' active' : ''}" data-home-metric="${k}">${label}</button>`).join('');
  const wrap = document.createElement('div');
  // Grafik dipadatkan (225px) supaya sumbu-x dan label titik terendah muat
  // penuh di dalam cover 1280x800 bersama hero + KPI di atasnya.
  wrap.appendChild(lineChart(years, values, { height: 225, label: s.label, color: metric === 'growth' ? '#0b5fa5' : metric === 'inflation' ? '#d96c1e' : metric === 'poverty' ? '#2e9e6b' : '#7c5cbf' }));
  return `<div class="card"><h2>Tren ${esc(s.label)}</h2><p class="sub">${esc(s.label)} Indonesia, ${years[0]}–${years[years.length - 1]} (${esc(s.unit)}).</p>
    <div class="pills">${tabs}</div>
    <label class="field" for="home-range">Rentang</label>
    <select id="home-range"><option value="all"${range === 'all' ? ' selected' : ''}>2015–2025</option><option value="10"${range === '10' ? ' selected' : ''}>10 tahun terakhir</option><option value="5"${range === '5' ? ' selected' : ''}>5 tahun terakhir</option></select>
    ${wrap.innerHTML}${srcLine(s.src + ', ' + years[0] + '–' + years[years.length - 1])}
    <div class="insight"><b>Yang menonjol:</b> ${metric === 'growth' ? 'ekonomi terkontraksi −2,07% pada 2020 (pandemi), lalu pulih ke 5,11% pada 2025.' : metric === 'inflation' ? 'inflasi tertinggi 5,51% pada 2022, lalu turun ke 2,92% pada 2025.' : metric === 'poverty' ? 'kemiskinan turun dari 11,22% (2015) menjadi 8,47% (Maret 2025).' : 'penduduk tumbuh dari 255,6 juta (2015) menjadi 284,4 juta (2025).'}</div></div>`;
}

export function viewHome(state) {
  const top6 = [...PROVINCES].sort((a, b) => b.pop - a.pop).slice(0, 6);
  const barWrap = document.createElement('div');
  barWrap.appendChild(barChart(top6.map((p) => p.name.replace('Jawa ', 'J. ').replace('Sumatera ', 'Sum. ')), top6.map((p) => p.pop), { label: 'Provinsi terpadat', height: 230 }));
  const donutWrap = document.createElement('div');
  donutWrap.appendChild(donutChart(SECTORS_2024, { center: '18,7%', centerSub: 'Industri' }));
  const colors = ['#0b5fa5', '#e8a838', '#2e9e6b', '#7c5cbf', '#d96c1e', '#2a9d8f', '#e76f51', '#6c757d', '#b08968'];
  return `
  <section class="hero"><h1>Statistik Indonesia, lengkap dan mudah dicari</h1>
  <p>DataNusa menyajikan angka resmi Indonesia 2015–2025 — ekonomi, penduduk, sosial, dan provinsi — dengan sumber yang jelas di setiap angka.</p>
  <p class="updated">Terakhir diperbarui: Februari 2026 · Data: BPS, Bank Dunia, APJII</p></section>
  ${kpiCards()}
  ${homeChartBlock(state)}
  <div class="grid-2">
    <div class="card"><h2>Pangsa lapangan usaha, 2024</h2><p class="sub">Persentase terhadap PDB.</p>
      <div class="donut-wrap">${donutWrap.innerHTML}<ul class="legend">${SECTORS_2024.map((d, i) => `<li><span><span class="sw" style="background:${colors[i % colors.length]}"></span>${esc(d.name)}</span><b>${fmtID(d.value, 1)}%</b></li>`).join('')}</ul></div>
      ${srcLine('BPS, Pendapatan Nasional Indonesia 2021–2025.')}
      <div class="insight"><b>Baca cepat:</b> industri pengolahan tetap penyumbang terbesar PDB (18,7%), diikuti perdagangan (12,9%) dan pertanian (11,9%).</div></div>
    <div class="card"><h2>6 provinsi terpadat, 2024</h2><p class="sub">Penduduk (juta jiwa).</p>
      ${barWrap.innerHTML}${srcLine('BPS, Proyeksi Penduduk.')}
      <div class="insight"><b>Baca cepat:</b> tiga provinsi di Jawa — Jawa Barat, Jawa Timur, Jawa Tengah — menampung 130 juta jiwa, hampir separuh penduduk Indonesia.</div></div>
  </div>
  <div class="card"><h2>Sepuluh tahun perubahan, 2015 → 2025</h2><p class="sub">Perbandingan langsung dari seri data di situs ini.</p>
    <div class="decade">${DECADE.map((d) => `<div class="d-item"><div class="d-label">${esc(d.label)}</div><div class="d-change">${esc(d.change)}</div><div class="d-pct">${esc(d.pct)}</div></div>`).join('')}</div>
    ${srcLine('Dihitung dari seri BPS 2015–2025 di halaman Ekonomi, Penduduk, dan Sosial.')}</div>
  <div class="card"><h2>Rilis terbaru</h2><p class="sub">Pengumuman resmi terbaru dari BPS.</p>
    <table class="data"><thead><tr><th>Tanggal</th><th>Rilis</th><th>Sumber</th></tr></thead><tbody>
    ${RELEASES.map((r) => `<tr><td>${esc(r.date)}</td><td>${esc(r.text)}</td><td>${esc(r.src)}</td></tr>`).join('')}</tbody></table></div>
  <div class="explore">
    <a href="#/ekonomi"><b>Ekonomi →</b><span>PDB, inflasi, perdagangan, dan perbandingan ASEAN.</span></a>
    <a href="#/penduduk"><b>Penduduk →</b><span>Jumlah, struktur umur, dan sorotan per tahun.</span></a>
    <a href="#/sosial"><b>Sosial →</b><span>Kemiskinan, pengangguran, IPM, dan Gini.</span></a>
    <a href="#/provinsi"><b>Provinsi →</b><span>Cari dan bandingkan 20 provinsi terbesar.</span></a>
  </div>`;
}

export function viewEconomy(state) {
  const tab = state.ecoTab || 'gdp';
  const pills = [['gdp', 'PDB & pertumbuhan'], ['trade', 'Ekspor & impor'], ['inflation', 'Inflasi'], ['percapita', 'PDB per kapita']]
    .map(([k, label]) => `<button class="pill${tab === k ? ' active' : ''}" data-eco-tab="${k}">${label}</button>`).join('');
  let body = '';
  if (tab === 'gdp') {
    const w = document.createElement('div');
    w.appendChild(barChart(YEARS.map(String), SERIES.gdpGrowth.values, { label: 'Pertumbuhan PDB', height: 280 }));
    body = `<h2>Pertumbuhan PDB, 2015–2025</h2><p class="sub">Persen per tahun (y-on-y). Batang 2020 berwarna oranye dengan label −2,07 di dalam batang.</p>${w.innerHTML}
      ${srcLine('BPS, Berita Resmi Statistik & Pendapatan Nasional 2021–2025.')}
      <div class="insight"><b>Baca cepat:</b> satu-satunya kontraksi dalam satu dekade terjadi pada 2020 (−2,07%) saat pandemi; pemulihan tercepat pada 2022 (5,31%).</div>
      <h3 style="margin-top:18px">Tabel tahunan</h3>${seriesTable('gdpGrowth', YEARS, SERIES.gdpGrowth.values)}`;
  } else if (tab === 'trade') {
    const rows = YEARS.slice(0, 10).map((y, i) => {
      const sur = SERIES.exports.values[i] - SERIES.imports.values[i];
      return `<tr><td>${y}</td><td class="num">${fmtID(SERIES.exports.values[i], 1)}</td><td class="num">${fmtID(SERIES.imports.values[i], 1)}</td><td class="num ${sur >= 0 ? 'pos' : 'neg'}">${sur >= 0 ? '+' : ''}${fmtID(sur, 1)}</td></tr>`;
    }).join('');
    body = `<h2>Neraca perdagangan, 2015–2024</h2><p class="sub">Ekspor dan impor barang (US$ juta). Surplus 2024 sebesar 31,0.</p>
      <table class="data"><thead><tr><th>Tahun</th><th class="num">Ekspor</th><th class="num">Impor</th><th class="num">Surplus / defisit</th></tr></thead><tbody>${rows}</tbody></table>
      ${srcLine('BPS, Statistik Ekspor–Impor.')}
      <div class="insight"><b>Baca cepat:</b> neraca berbalik surplus sejak 2020; surplus terbesar 54,5 pada 2022 saat harga komoditas melambung, lalu 31,0 pada 2024.</div>`;
  } else if (tab === 'inflation') {
    const w = document.createElement('div');
    w.appendChild(lineChart(YEARS, SERIES.inflation.values, { label: 'Inflasi', color: '#d96c1e' }));
    body = `<h2>Inflasi (Desember, y-on-y), 2015–2025</h2><p class="sub">Persen per tahun.</p>${w.innerHTML}
      ${srcLine('BPS, Berita Resmi Statistik.')}
      <div class="insight"><b>Baca cepat:</b> inflasi memuncak 5,51% pada 2022, lalu kembali ke kisaran 2–3% pada 2023–2025.</div>
      ${seriesTable('inflation', YEARS, SERIES.inflation.values)}`;
  } else {
    const w = document.createElement('div');
    w.appendChild(lineChart(YEARS, SERIES.gdpPerCapita.values, { label: 'PDB per kapita', color: '#2e9e6b' }));
    body = `<h2>PDB per kapita, 2015–2025</h2><p class="sub">Rupiah juta per orang per tahun.</p>${w.innerHTML}
      ${srcLine('BPS, Pendapatan Nasional Indonesia 2021–2025.')}
      <div class="insight"><b>Baca cepat:</b> PDB per kapita hampir dua kali lipat dalam 10 tahun — Rp45,1 juta (2015) menjadi Rp83,7 juta (2025).</div>
      ${seriesTable('gdpPerCapita', YEARS, SERIES.gdpPerCapita.values)}`;
  }
  const aseanWrap = document.createElement('div');
  aseanWrap.appendChild(hbarChart(ASEAN_2024.map((a) => ({ name: a.name, value: a.perCapita, highlight: a.name === 'Indonesia' })), { label: 'PDB per kapita ASEAN', format: (v) => 'US$' + v.toLocaleString('en-US') }));
  return `<div class="page-head"><h1>Ekonomi</h1><p>PDB, inflasi, perdagangan, dan posisi Indonesia di ASEAN — semua angka bersumber dan bertahun.</p></div>
  <div class="pills">${pills}</div><div class="card">${body}</div>
  <div class="card"><h2>Perbandingan ASEAN, 2024</h2><p class="sub">PDB per kapita (US$) dan pertumbuhan PDB (%).</p>
    ${aseanWrap.innerHTML}
    <table class="data" style="margin-top:12px"><thead><tr><th>Negara</th><th class="num">PDB/kapita (US$)</th><th class="num">Tumbuh (%)</th></tr></thead><tbody>
    ${ASEAN_2024.map((a) => `<tr><td>${esc(a.name)}</td><td class="num">${a.perCapita.toLocaleString('en-US')}</td><td class="num">${fmtID(a.growth, 1)}</td></tr>`).join('')}</tbody></table>
    ${srcLine('Bank Dunia, World Development Indicators 2024.')}
    <div class="insight"><b>Baca cepat:</b> PDB per kapita Indonesia (US$4.940) masih di bawah Singapura dan Malaysia, tapi pertumbuhannya 5,0% termasuk yang tertinggi di kawasan.</div></div>`;
}

export function viewPopulation(state) {
  const year = state.popYear || 2024;
  const idx = YEARS.indexOf(year);
  const pop = SERIES.population.values[idx];
  const growth = idx > 0 ? ((pop - SERIES.population.values[idx - 1]) / SERIES.population.values[idx - 1]) * 100 : null;
  const w = document.createElement('div');
  w.appendChild(lineChart(YEARS, SERIES.population.values, { label: 'Penduduk', color: '#7c5cbf' }));
  const d = document.createElement('div');
  d.appendChild(donutChart(AGE_2024, { center: '68,7%', centerSub: 'usia kerja' }));
  const colors = ['#0b5fa5', '#e8a838', '#2e9e6b'];
  return `<div class="page-head"><h1>Penduduk</h1><p>Jumlah, pertumbuhan, dan struktur umur penduduk Indonesia 2015–2025.</p></div>
  <div class="card"><h2>Jumlah penduduk, 2015–2025</h2><p class="sub">Juta jiwa.</p>${w.innerHTML}
    ${srcLine('BPS, Proyeksi Penduduk & Sensus 2020.')}
    <div class="insight"><b>Baca cepat:</b> penduduk bertambah sekitar 3 juta jiwa per tahun; pada 2025 mencapai 284,4 juta jiwa.</div></div>
  <div class="grid-2">
    <div class="card"><h2>Sorotan tahun</h2><p class="sub">Pilih tahun untuk melihat angkanya.</p>
      <label class="field" for="pop-year">Tahun</label>
      <select id="pop-year">${YEARS.map((y) => `<option value="${y}"${y === year ? ' selected' : ''}>${y}</option>`).join('')}</select>
      <table class="data" style="margin-top:12px"><tbody>
        <tr><td>Penduduk ${year}</td><td class="num"><b>${fmtID(pop, 1)} juta</b></td></tr>
        <tr><td>Pertumbuhan vs tahun lalu</td><td class="num"><b>${growth === null ? '—' : '+' + fmtID(growth) + '%'}</b></td></tr>
        <tr><td>Pangsa penduduk Jawa</td><td class="num"><b>±56%</b></td></tr>
      </tbody></table>
      ${srcLine('BPS, Proyeksi Penduduk & Sensus 2020.')}</div>
    <div class="card"><h2>Struktur umur, 2024</h2><p class="sub">Persen penduduk per kelompok umur.</p>
      <div class="donut-wrap">${d.innerHTML}<ul class="legend">${AGE_2024.map((a, i) => `<li><span><span class="sw" style="background:${colors[i]}"></span>${esc(a.name)}</span><b>${fmtID(a.value, 1)}%</b></li>`).join('')}</ul></div>
      ${srcLine('BPS, Proyeksi Penduduk.')}
      <div class="insight"><b>Baca cepat:</b> 68,7% penduduk berada di usia kerja (15–64 tahun) — bonus demografi yang puncaknya diperkirakan sebelum 2030.</div></div>
  </div>`;
}

export function viewSocial(state) {
  const tab = state.socialTab || 'poverty';
  const pills = [['poverty', 'Kemiskinan'], ['unemployment', 'Pengangguran'], ['hdi', 'IPM'], ['gini', 'Gini']]
    .map(([k, label]) => `<button class="pill${tab === k ? ' active' : ''}" data-social-tab="${k}">${label}</button>`).join('');
  const keyMap = { poverty: 'poverty', unemployment: 'unemployment', hdi: 'hdi', gini: 'gini' };
  const key = keyMap[tab];
  const s = SERIES[key];
  const w = document.createElement('div');
  w.appendChild(lineChart(YEARS, s.values, { label: s.label, color: tab === 'poverty' ? '#2e9e6b' : tab === 'unemployment' ? '#d96c1e' : tab === 'hdi' ? '#0b5fa5' : '#7c5cbf' }));
  const notes = {
    poverty: 'Kemiskinan turun dari 11,22% (2015) menjadi 8,47% (Maret 2025); garis kemiskinan Maret 2025 sebesar Rp609.160 per kapita per bulan.',
    unemployment: 'Pengangguran melonjak ke 7,07% pada Agustus 2020, lalu turun bertahap ke 4,85% pada Agustus 2025.',
    hdi: 'IPM naik dari 69,55 (2015) menjadi 75,02 (2024) — kategori tinggi sejak 2022.',
    gini: 'Ketimpangan (Gini) menyempit dari 0,408 (2015) menjadi 0,375 (Maret 2025).',
  };
  return `<div class="page-head"><h1>Sosial</h1><p>Kemiskinan, pengangguran, pembangunan manusia, dan ketimpangan — angka resmi BPS.</p></div>
  <div class="pills">${pills}</div>
  <div class="card"><h2>${esc(s.label)}, ${tab === 'hdi' ? '2015–2024' : '2015–2025'}</h2><p class="sub">${esc(s.unit)}.</p>${w.innerHTML}
    ${srcLine(s.src + '.')}
    <div class="insight"><b>Baca cepat:</b> ${notes[tab]}</div>
    ${seriesTable(key, YEARS, s.values)}</div>`;
}

export function viewProvinces(state) {
  const q = (state.provQ || '').toLowerCase();
  const island = state.provIsland || 'Semua';
  const sort = state.provSort || { key: 'pop', dir: -1 };
  let list = PROVINCES.filter((p) => (!q || p.name.toLowerCase().includes(q)) && (island === 'Semua' || p.island === island));
  list = [...list].sort((a, b) => {
    if (sort.key === 'name') return sort.dir * a.name.localeCompare(b.name, 'id');
    if (sort.key === 'island') return sort.dir * a.island.localeCompare(b.island, 'id');
    return sort.dir * (a.pop - b.pop);
  });
  const islands = ['Semua', 'Jawa', 'Sumatera', 'Kalimantan', 'Sulawesi', 'Bali & Nusa Tenggara'];
  const chips = islands.map((is) => `<button class="pill${island === is ? ' active' : ''}" data-prov-island="${is}">${is}</button>`).join('');
  const arrow = (k) => (sort.key === k ? (sort.dir === 1 ? ' ▲' : ' ▼') : '');
  const rows = list.map((p) => `<tr class="clickable" data-prov="${esc(p.name)}"><td>${esc(p.name)}</td><td>${esc(p.island)}</td><td class="num">${fmtID(p.pop)}</td></tr>`).join('');
  const detail = state.provDetail ? (() => {
    const p = PROVINCES.find((x) => x.name === state.provDetail);
    if (!p) return '';
    const share = ((p.pop / 284.4) * 100).toFixed(1).replace('.', ',');
    return `<div class="prov-detail" id="prov-detail"><h3>${esc(p.name)}</h3><p>Penduduk 2024: <b>${fmtID(p.pop)} juta jiwa</b> (±${share}% penduduk Indonesia). Pulau: ${esc(p.island)}.</p><p class="src">BPS, Proyeksi Penduduk 2024.</p></div>`;
  })() : '';
  return `<div class="page-head"><h1>Provinsi</h1><p>20 provinsi terbesar berdasarkan jumlah penduduk 2024. Cari, saring per pulau, urutkan, lalu klik baris untuk detail.</p></div>
  <div class="card">
    <label class="field" for="prov-search">Cari provinsi</label>
    <input type="text" id="prov-search" placeholder="mis. Jawa Barat" value="${esc(state.provQ || '')}">
    <div class="pills" style="margin-top:12px">${chips}</div>
    <p class="sub">${list.length} provinsi ditampilkan</p>
    <table class="data"><thead><tr>
      <th class="sortable" data-prov-sort="name">Provinsi${arrow('name')}</th>
      <th class="sortable" data-prov-sort="island">Pulau${arrow('island')}</th>
      <th class="num sortable" data-prov-sort="pop">Penduduk (jt)${arrow('pop')}</th>
    </tr></thead><tbody>${rows || '<tr><td colspan="3">Tidak ada provinsi yang cocok.</td></tr>'}</tbody></table>
    ${detail}${srcLine('BPS, Proyeksi Penduduk 2024.')}</div>`;
}

export function viewData(state) {
  const sel = state.dataSel || ['population', 'gdpGrowth', 'poverty'];
  const year = state.dataYear || 2025;
  const rows = YEARS.map((y) => {
    const cells = sel.map((k) => {
      const v = SERIES[k].values[YEARS.indexOf(y)];
      return `<td class="num">${v === null || v === undefined ? '—' : fmtID(v)}</td>`;
    }).join('');
    return `<tr><td>${y}</td>${cells}</tr>`;
  }).join('');
  return `<div class="page-head"><h1>Tabel Data</h1><p>Pilih indikator, lihat tabel tahunannya, lalu unduh sebagai CSV — tanpa jaringan, file dibuat di peramban Anda.</p></div>
  <div class="card"><h2>Pilih indikator</h2>
    <div class="checks">${INDICATORS.map((ind) => `<label><input type="checkbox" data-ind="${ind.key}"${sel.includes(ind.key) ? ' checked' : ''}> ${esc(ind.label)}</label>`).join('')}</div>
    <label class="field" for="data-year">Tahun sorotan</label>
    <select id="data-year">${YEARS.map((y) => `<option value="${y}"${y === year ? ' selected' : ''}>${y}</option>`).join('')}</select>
    <table class="data" style="margin-top:14px"><thead><tr><th>Tahun</th>${sel.map((k) => `<th class="num">${esc(SERIES[k].label)}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table>
    <p style="margin-top:12px"><button class="btn" id="data-csv">Unduh CSV</button></p>
    <p class="status" id="csv-status"></p>
    ${srcLine('BPS (Berita Resmi Statistik, Pendapatan Nasional, Sakernas, Kemiskinan Makro, IPM) & Bank Dunia WDI 2024.')}</div>`;
}

export function viewAbout() {
  return `<div class="page-head"><h1>Tentang DataNusa</h1><p>Situs independen yang menyajikan statistik Indonesia dari sumber resmi.</p></div>
  <div class="card"><h2>Sumber data</h2>
    <ul>
      <li><b>BPS — Badan Pusat Statistik:</b> Berita Resmi Statistik; Pendapatan Nasional Indonesia 2021–2025; Penghitungan &amp; Analisis Kemiskinan Makro 2025; Sakernas; Statistik Ekspor–Impor; Indeks Pembangunan Manusia; Proyeksi Penduduk &amp; Sensus 2020.</li>
      <li><b>Bank Dunia:</b> World Development Indicators 2024 (perbandingan ASEAN).</li>
      <li><b>APJII:</b> Survei Penetrasi Internet Indonesia 2024 — penetrasi internet 79,5%.</li>
    </ul>
    ${srcLine('Semua angka di situs ini dikutip dari publikasi di atas; tahun rujukan dicantumkan di setiap grafik dan tabel.')}</div>
  <div class="card"><h2>Metodologi &amp; catatan</h2>
    <ul>
      <li>Seri tahunan 2015–2025; sel kosong (—) berarti data belum diterbitkan untuk tahun itu (mis. ekspor–impor 2025, IPM 2025).</li>
      <li>Kemiskinan diukur Maret setiap tahun; pengangguran diukur Agustus; inflasi memakai Desember y-on-y.</li>
      <li>Perubahan 10 tahun dihitung langsung dari seri yang ditampilkan, tanpa pembulatan tersembunyi.</li>
      <li>Situs ini statis: tidak ada permintaan jaringan, tidak ada pelacak, semua grafik digambar sebagai SVG dari data di dalam situs.</li>
    </ul></div>
  <div class="card"><h2>Cara mengutip</h2>
    <p>Contoh: “DataNusa — Statistik Indonesia, diakses November 2026, sumber data BPS.” Situs ini independen dan <b>bukan situs resmi BPS</b>.</p></div>`;
}
