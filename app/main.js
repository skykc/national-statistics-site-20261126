// DataNusa — router hash + state + semua event listener + unduh CSV + pencarian global.
import { YEARS, SERIES, INDICATORS } from './data.js';
import { viewHome, viewEconomy, viewPopulation, viewSocial, viewProvinces, viewData, viewAbout } from './views.js';

const app = document.getElementById('app');
const ui = {
  homeMetric: 'growth', homeRange: 'all',
  ecoTab: 'gdp', socialTab: 'poverty', popYear: 2024,
  provQ: '', provIsland: 'Semua', provSort: { key: 'pop', dir: -1 }, provDetail: null,
  dataSel: ['population', 'gdpGrowth', 'poverty'], dataYear: 2025,
};

const SEARCH_INDEX = [
  { label: 'Pertumbuhan PDB', href: '#/ekonomi?tab=gdp', keys: 'pdb pertumbuhan ekonomi gdp' },
  { label: 'Inflasi', href: '#/ekonomi?tab=inflation', keys: 'inflasi harga desember' },
  { label: 'Ekspor & impor', href: '#/ekonomi?tab=trade', keys: 'ekspor impor neraca perdagangan surplus' },
  { label: 'PDB per kapita', href: '#/ekonomi?tab=percapita', keys: 'pdb per kapita pendapatan' },
  { label: 'Penduduk', href: '#/penduduk', keys: 'penduduk jumlah jiwa sensus' },
  { label: 'Kemiskinan', href: '#/sosial?tab=poverty', keys: 'kemiskinan miskin garis' },
  { label: 'Pengangguran', href: '#/sosial?tab=unemployment', keys: 'pengangguran tpt sakernas kerja' },
  { label: 'IPM — Indeks Pembangunan Manusia', href: '#/sosial?tab=hdi', keys: 'ipm pembangunan manusia hdi' },
  { label: 'Rasio Gini', href: '#/sosial?tab=gini', keys: 'gini ketimpangan' },
  { label: 'Provinsi', href: '#/provinsi', keys: 'provinsi jawa sumatera daerah' },
  { label: 'Tabel Data & unduh CSV', href: '#/data', keys: 'tabel data csv unduh indikator' },
  { label: 'Perbandingan ASEAN', href: '#/ekonomi', keys: 'asean singapura malaysia vietnam' },
  { label: 'Tentang & sumber data', href: '#/tentang', keys: 'tentang sumber metodologi bps' },
];

function route() {
  const raw = location.hash.replace(/^#\/?/, '');
  const [pathPart, queryPart] = raw.split('?');
  const params = new URLSearchParams(queryPart || '');
  const path = pathPart || '';
  if (params.get('tab')) {
    if (path === 'ekonomi') ui.ecoTab = params.get('tab');
    if (path === 'sosial') ui.socialTab = params.get('tab');
  }
  let html = '';
  let nav = 'home';
  if (path === 'ekonomi') { html = viewEconomy(ui); nav = 'ekonomi'; }
  else if (path === 'penduduk') { html = viewPopulation(ui); nav = 'penduduk'; }
  else if (path === 'sosial') { html = viewSocial(ui); nav = 'sosial'; }
  else if (path === 'provinsi') { html = viewProvinces(ui); nav = 'provinsi'; }
  else if (path === 'data') { html = viewData(ui); nav = 'data'; }
  else if (path === 'tentang') { html = viewAbout(); nav = 'tentang'; }
  else { html = viewHome(ui); nav = 'home'; }
  app.innerHTML = html;
  document.querySelectorAll('[data-nav]').forEach((a) => a.classList.toggle('active', a.dataset.nav === nav));
  document.getElementById('main-nav').classList.remove('open');
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

function bindGlobal() {
  document.getElementById('menu-btn').addEventListener('click', () => {
    document.getElementById('main-nav').classList.toggle('open');
  });
  const input = document.getElementById('global-search');
  const box = document.getElementById('search-results');
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (!q) { box.hidden = true; box.innerHTML = ''; return; }
    const hits = SEARCH_INDEX.filter((e) => (e.label + ' ' + e.keys).toLowerCase().includes(q)).slice(0, 6);
    if (!hits.length) { box.hidden = true; box.innerHTML = ''; return; }
    box.innerHTML = hits.map((h) => `<a href="${h.href}">${h.label}</a>`).join('');
    box.hidden = false;
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const first = box.querySelector('a');
      if (first) { location.hash = first.getAttribute('href'); box.hidden = true; }
    }
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-box')) { box.hidden = true; }
  });
}

function bindPage() {
  app.addEventListener('click', (e) => {
    const hm = e.target.closest('[data-home-metric]');
    if (hm) { ui.homeMetric = hm.dataset.homeMetric; route(); return; }
    const eco = e.target.closest('[data-eco-tab]');
    if (eco) { ui.ecoTab = eco.dataset.ecoTab; history.replaceState(null, '', `#/ekonomi?tab=${ui.ecoTab}`); route(); return; }
    const soc = e.target.closest('[data-social-tab]');
    if (soc) { ui.socialTab = soc.dataset.socialTab; history.replaceState(null, '', `#/sosial?tab=${ui.socialTab}`); route(); return; }
    const chip = e.target.closest('[data-prov-island]');
    if (chip) { ui.provIsland = chip.dataset.provIsland; ui.provDetail = null; route(); return; }
    const sort = e.target.closest('[data-prov-sort]');
    if (sort) {
      const k = sort.dataset.provSort;
      ui.provSort = ui.provSort.key === k ? { key: k, dir: -ui.provSort.dir } : { key: k, dir: k === 'name' || k === 'island' ? 1 : -1 };
      route(); return;
    }
    const row = e.target.closest('tbody tr[data-prov]');
    if (row) { ui.provDetail = row.dataset.prov; route(); return; }
    if (e.target.id === 'data-csv') { downloadCSV(); }
  });
  app.addEventListener('change', (e) => {
    if (e.target.id === 'home-range') { ui.homeRange = e.target.value; route(); }
    if (e.target.id === 'pop-year') { ui.popYear = Number(e.target.value); route(); }
    if (e.target.id === 'data-year') { ui.dataYear = Number(e.target.value); route(); }
    if (e.target.matches('[data-ind]')) {
      const k = e.target.dataset.ind;
      ui.dataSel = e.target.checked ? [...ui.dataSel, k] : ui.dataSel.filter((x) => x !== k);
      if (!ui.dataSel.length) { ui.dataSel = [k]; e.target.checked = true; }
      route();
    }
  });
  app.addEventListener('input', (e) => {
    if (e.target.id === 'prov-search') { ui.provQ = e.target.value; ui.provDetail = null; route(); restoreProvFocus(); }
  });
}

function restoreProvFocus() {
  const inp = document.getElementById('prov-search');
  if (inp) { inp.focus(); inp.setSelectionRange(inp.value.length, inp.value.length); }
}

function downloadCSV() {
  const head = ['Tahun', ...ui.dataSel.map((k) => SERIES[k].label + ' (' + SERIES[k].unit + ')')];
  const lines = [head.join(',')];
  for (const y of YEARS) {
    const cells = ui.dataSel.map((k) => {
      const v = SERIES[k].values[YEARS.indexOf(y)];
      return v === null || v === undefined ? '' : String(v).replace('.', ',');
    });
    lines.push([y, ...cells].join(','));
  }
  const blob = new Blob(['\uFEFF' + lines.join('\n')], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'datanusa-data.csv';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  const st = document.getElementById('csv-status');
  if (st) st.textContent = `CSV diunduh: ${ui.dataSel.length} indikator, ${YEARS.length} tahun (2015–2025).`;
}

window.addEventListener('hashchange', route);
bindGlobal();
bindPage();
route();
