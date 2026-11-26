// DataNusa — router hash, state UI, dan semua event listener.
// Satu-satunya titik masuk halaman: index.html memuat modul ini.

import { YEARS, SERIES, SEARCH_INDEX } from './data.js';
import { homeView, economyView, populationView, socialView, provincesView, dataView, aboutView } from './views.js';

export const ui = {
  homeMetric: 'gdpGrowth',
  homeRange: 'all',
  econTab: 'gdp',
  econRange: 'all',
  socialTab: 'poverty',
  popYear: 2024,
  provSearch: '',
  provIsland: 'Semua',
  provSort: 'pop',
  provSortDir: 'desc',
  selectedProv: null,
  dataIndicators: ['population', 'gdpGrowth', 'inflation'],
  dataYear: 2025,
  csvStatus: '',
};

const app = document.getElementById('app');
const DEC = { population: 1, gdpGrowth: 2, gdpNominal: 0, gdpPerCapita: 1, inflation: 2, poverty: 2, unemployment: 2, exports: 1, imports: 1, gini: 3, hdi: 2 };

function fmtCsv(n, digits) {
  if (n === null || n === undefined) return '';
  return Number(n).toFixed(digits).replace('.', ',');
}

function parseHash() {
  const raw = location.hash.replace(/^#/, '') || '/';
  const [pathPart, queryPart] = raw.split('?');
  const params = new URLSearchParams(queryPart || '');
  return { path: pathPart || '/', params };
}

function render() {
  const { path, params } = parseHash();
  if (params.get('tab')) {
    if (path === '/ekonomi') ui.econTab = params.get('tab');
    if (path === '/sosial') ui.socialTab = params.get('tab');
  }
  let html = '';
  if (path === '/' || path === '') html = homeView(ui);
  else if (path === '/ekonomi') html = economyView(ui);
  else if (path === '/penduduk') html = populationView(ui);
  else if (path === '/sosial') html = socialView(ui);
  else if (path === '/provinsi') html = provincesView(ui);
  else if (path === '/data') html = dataView(ui);
  else if (path === '/tentang') html = aboutView();
  else html = homeView(ui);
  app.innerHTML = html;
  document.querySelectorAll('.nav-link').forEach((a) => {
    const href = a.getAttribute('href') || '';
    a.classList.toggle('active', href === '#' + (path === '/' ? '/' : path) || (path === '/' && href === '#/'));
  });
  window.__shotReady = true;
  // Kembalikan fokus pencarian provinsi bila sedang mengetik.
  const ps = document.getElementById('prov-search');
  if (ps && document.activeElement !== ps && ui.provSearch) { ps.focus(); ps.setSelectionRange(ps.value.length, ps.value.length); }
}

function downloadCsv() {
  const chosen = ui.dataIndicators.length ? ui.dataIndicators : ['population'];
  const header = ['Tahun', ...chosen.map((k) => SERIES[k].label)].join(';');
  const lines = [header];
  for (const y of YEARS) {
    if (y > ui.dataYear) break;
    const i = YEARS.indexOf(y);
    lines.push([y, ...chosen.map((k) => fmtCsv(SERIES[k].values[i], DEC[k]))].join(';'));
  }
  const blob = new Blob(['\ufeff' + lines.join('\n')], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `datanusa-${ui.dataYear}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  ui.csvStatus = `CSV diunduh: datanusa-${ui.dataYear}.csv (${chosen.length} indikator, ${YEARS.filter((y) => y <= ui.dataYear).length} baris).`;
  const st = document.getElementById('csv-status');
  if (st) st.textContent = ui.csvStatus;
}

// ---- Pencarian global di header ----
const searchInput = document.getElementById('global-search');
const searchResults = document.getElementById('search-results');

function runSearch(q) {
  const query = q.trim().toLowerCase();
  if (!query) { searchResults.hidden = true; searchResults.innerHTML = ''; return []; }
  const hits = SEARCH_INDEX.filter((e) => e.term.toLowerCase().includes(query) || e.desc.toLowerCase().includes(query));
  if (!hits.length) {
    searchResults.innerHTML = '<div class="search-empty">Tidak ada hasil untuk "' + q.replace(/</g, '&lt;') + '".</div>';
  } else {
    searchResults.innerHTML = hits.map((h, i) =>
      `<a href="${h.route}" class="search-hit" data-hit="${i}"><strong>${h.term}</strong><span>${h.desc}</span></a>`).join('');
  }
  searchResults.hidden = false;
  return hits;
}

let lastHits = [];
if (searchInput) {
  searchInput.addEventListener('input', () => { lastHits = runSearch(searchInput.value); });
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const hits = lastHits.length ? lastHits : runSearch(searchInput.value);
      if (hits.length) {
        searchResults.hidden = true;
        location.hash = hits[0].route.replace(/^#/, '');
      }
    } else if (e.key === 'Escape') {
      searchResults.hidden = true;
      searchInput.blur();
    }
  });
  searchInput.addEventListener('blur', () => setTimeout(() => { searchResults.hidden = true; }, 200));
}
document.addEventListener('click', (e) => {
  if (searchResults && !searchResults.hidden && !e.target.closest('.search-wrap')) searchResults.hidden = true;
});

// ---- Menu hamburger HP ----
const burger = document.getElementById('nav-toggle');
if (burger) {
  burger.addEventListener('click', () => {
    const nav = document.getElementById('main-nav');
    const open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
  });
}

// ---- Delegasi klik & perubahan di #app ----
app.addEventListener('click', (e) => {
  const metricBtn = e.target.closest('[data-home-metric]');
  if (metricBtn) { ui.homeMetric = metricBtn.getAttribute('data-home-metric'); render(); return; }
  const econBtn = e.target.closest('[data-econ-tab]');
  if (econBtn) { ui.econTab = econBtn.getAttribute('data-econ-tab'); render(); return; }
  const socialBtn = e.target.closest('[data-social-tab]');
  if (socialBtn) { ui.socialTab = socialBtn.getAttribute('data-social-tab'); render(); return; }
  const chip = e.target.closest('[data-prov-island]');
  if (chip) { ui.provIsland = chip.getAttribute('data-prov-island'); render(); return; }
  const sortBtn = e.target.closest('[data-prov-sort]');
  if (sortBtn) {
    const key = sortBtn.getAttribute('data-prov-sort');
    if (ui.provSort === key) ui.provSortDir = ui.provSortDir === 'asc' ? 'desc' : 'asc';
    else { ui.provSort = key; ui.provSortDir = 'asc'; }
    render();
    return;
  }
  const row = e.target.closest('tr[data-prov]');
  if (row) { ui.selectedProv = row.getAttribute('data-prov'); render(); return; }
  if (e.target.closest('#data-csv')) { downloadCsv(); return; }
});

app.addEventListener('input', (e) => {
  if (e.target.id === 'prov-search') { ui.provSearch = e.target.value; render(); }
});

app.addEventListener('change', (e) => {
  if (e.target.id === 'home-range') { ui.homeRange = e.target.value; render(); }
  else if (e.target.id === 'econ-range') { ui.econRange = e.target.value; render(); }
  else if (e.target.id === 'pop-year') { ui.popYear = Number(e.target.value); render(); }
  else if (e.target.id === 'data-year') { ui.dataYear = Number(e.target.value); ui.csvStatus = ''; render(); }
  else if (e.target.name === 'ind') {
    const box = e.target;
    if (box.checked && !ui.dataIndicators.includes(box.value)) ui.dataIndicators.push(box.value);
    if (!box.checked) ui.dataIndicators = ui.dataIndicators.filter((k) => k !== box.value);
    render();
  }
});

app.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && e.target.matches('tr[data-prov]')) {
    ui.selectedProv = e.target.getAttribute('data-prov');
    render();
  }
});

window.addEventListener('hashchange', render);
render();
