// DataNusa — grafik SVG murni. Tidak ada library, tidak ada canvas, tidak ada network.
// Setiap fungsi mengembalikan string <svg> siap disisipkan ke halaman.

const BLUE = '#0b5fa5';
const AMBER = '#e8a838';
const GREEN = '#2e9e6b';
const ORANGE = '#d97b29';
const GREY = '#8a97a5';

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Format angka gaya Indonesia: koma desimal, titik ribuan.
export function fmt(n, digits = 2) {
  if (n === null || n === undefined || Number.isNaN(n)) return '—';
  const parts = Number(n).toFixed(digits).split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return parts.join(',');
}

// Grafik garis: values sejajar dengan labels (tahun). Null dilewati (garis terputus).
export function lineChart(values, labels, opts = {}) {
  const w = opts.width || 760;
  const h = opts.height || 300;
  const color = opts.color || BLUE;
  const padL = 56, padR = 16, padT = 18, padB = 30;
  const pts = values.map((v, i) => ({ v, label: labels[i] })).filter((p) => p.v !== null && p.v !== undefined);
  const nums = pts.map((p) => p.v);
  let min = Math.min(...nums);
  let max = Math.max(...nums);
  if (min === max) { min -= 1; max += 1; }
  const span = max - min || 1;
  min -= span * 0.08;
  max += span * 0.08;
  const x = (i) => padL + (i * (w - padL - padR)) / (labels.length - 1);
  const y = (v) => padT + ((max - v) / (max - min)) * (h - padT - padB);
  const grid = [0, 0.25, 0.5, 0.75, 1].map((f) => {
    const gv = max - f * (max - min);
    const gy = padT + f * (h - padT - padB);
    return `<line x1="${padL}" y1="${gy.toFixed(1)}" x2="${w - padR}" y2="${gy.toFixed(1)}" stroke="#e3e8ef" stroke-width="1"/>` +
      `<text x="${padL - 8}" y="${(gy + 4).toFixed(1)}" text-anchor="end" font-size="11" fill="#5b6b7c">${esc(fmt(gv, 1))}</text>`;
  }).join('');
  let path = '';
  let last = null;
  for (let i = 0; i < values.length; i++) {
    if (values[i] === null || values[i] === undefined) { last = null; continue; }
    if (last === null) path += `M ${x(i).toFixed(1)} ${y(values[i]).toFixed(1)}`;
    else path += ` L ${x(i).toFixed(1)} ${y(values[i]).toFixed(1)}`;
    last = i;
  }
  const dots = pts.map((p) => {
    const i = labels.indexOf(p.label);
    return `<circle cx="${x(i).toFixed(1)}" cy="${y(p.v).toFixed(1)}" r="3.5" fill="${color}" stroke="#fff" stroke-width="1.5"/>`;
  }).join('');
  // Isian area tipis di bawah garis + label titik terendah (mis. kontraksi 2020).
  const firstIdx = values.findIndex((v) => v !== null && v !== undefined);
  let lastIdx = values.length - 1;
  while (lastIdx > 0 && (values[lastIdx] === null || values[lastIdx] === undefined)) lastIdx--;
  const baseY = y(min).toFixed(1);
  const area = `<path d="${path} L ${x(lastIdx).toFixed(1)} ${baseY} L ${x(firstIdx).toFixed(1)} ${baseY} Z" fill="${color}" opacity="0.08"/>`;
  const minPt = pts.reduce((a, b) => (b.v < a.v ? b : a), pts[0]);
  const minI = labels.indexOf(minPt.label);
  const minTag = minPt.v < 0
    ? `<text x="${x(minI).toFixed(1)}" y="${(y(minPt.v) + 18).toFixed(1)}" text-anchor="middle" font-size="12" font-weight="700" fill="${color}">${esc(fmt(minPt.v, 2))}</text>`
    : '';
  const xlabels = labels.map((lab, i) => `<text x="${x(i).toFixed(1)}" y="${h - 8}" text-anchor="middle" font-size="11" fill="#5b6b7c">${esc(lab)}</text>`).join('');
  const lastVal = pts[pts.length - 1];
  const lastI = labels.indexOf(lastVal.label);
  const valTag = `<text x="${x(lastI).toFixed(1)}" y="${(y(lastVal.v) - 10).toFixed(1)}" text-anchor="middle" font-size="12" font-weight="700" fill="${color}">${esc(fmt(lastVal.v, 2))}</text>`;
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" role="img" aria-label="Grafik garis">${grid}${area}<path d="${path}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>${dots}${minTag}${valTag}${xlabels}</svg>`;
}

// Grafik batang vertikal. Batang negatif memakai warna oranye dan labelnya putih DI DALAM batang.
export function barChart(values, labels, opts = {}) {
  const w = opts.width || 760;
  const h = opts.height || 300;
  const color = opts.color || BLUE;
  const negColor = opts.negColor || ORANGE;
  const padL = 56, padR = 16, padT = 24, padB = 30;
  const nums = values.filter((v) => v !== null && v !== undefined);
  let min = Math.min(0, ...nums);
  let max = Math.max(0, ...nums);
  if (min === max) { max = min + 1; }
  const span = max - min || 1;
  min -= span * 0.06;
  max += span * 0.06;
  const innerW = w - padL - padR;
  const innerH = h - padT - padB;
  const y = (v) => padT + ((max - v) / (max - min)) * innerH;
  const y0 = y(0);
  const slot = innerW / labels.length;
  const bw = Math.min(44, slot * 0.62);
  const grid = [0, 0.5, 1].map((f) => {
    const gv = max - f * (max - min);
    const gy = padT + f * innerH;
    return `<line x1="${padL}" y1="${gy.toFixed(1)}" x2="${w - padR}" y2="${gy.toFixed(1)}" stroke="#e3e8ef" stroke-width="1"/>` +
      `<text x="${padL - 8}" y="${(gy + 4).toFixed(1)}" text-anchor="end" font-size="11" fill="#5b6b7c">${esc(fmt(gv, 1))}</text>`;
  }).join('');
  const zeroLine = `<line x1="${padL}" y1="${y0.toFixed(1)}" x2="${w - padR}" y2="${y0.toFixed(1)}" stroke="#9aa7b5" stroke-width="1.5"/>`;
  const bars = values.map((v, i) => {
    if (v === null || v === undefined) return '';
    const cx = padL + i * slot + slot / 2;
    const top = Math.min(y(v), y0);
    const height = Math.abs(y(v) - y0);
    const fill = v < 0 ? negColor : color;
    const labelY = v < 0 ? y0 + 16 : y(v) - 8;
    const labelFill = v < 0 ? '#ffffff' : '#0b2a4a';
    const labelAnchor = 'middle';
    return `<rect x="${(cx - bw / 2).toFixed(1)}" y="${top.toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(height, 1).toFixed(1)}" rx="3" fill="${fill}"/>` +
      `<text x="${cx.toFixed(1)}" y="${labelY.toFixed(1)}" text-anchor="${labelAnchor}" font-size="12" font-weight="700" fill="${labelFill}">${esc(fmt(v, 2))}</text>` +
      `<text x="${cx.toFixed(1)}" y="${h - 8}" text-anchor="middle" font-size="11" fill="#5b6b7c">${esc(labels[i])}</text>`;
  }).join('');
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" role="img" aria-label="Grafik batang">${grid}${zeroLine}${bars}</svg>`;
}

// Grafik batang horizontal (untuk perbandingan, mis. ASEAN).
export function hbarChart(items, opts = {}) {
  const rowH = opts.rowHeight || 44;
  const w = opts.width || 760;
  const h = rowH * items.length + 16;
  const color = opts.color || BLUE;
  const highlight = opts.highlight || null;
  const max = Math.max(...items.map((d) => d.value));
  const labelW = 110;
  const rows = items.map((d, i) => {
    const y = 8 + i * rowH;
    const bw = ((w - labelW - 90) * d.value) / max;
    const fill = d.label === highlight ? AMBER : color;
    return `<text x="0" y="${y + 22}" font-size="12" font-weight="600" fill="#0b2a4a">${esc(d.label)}</text>` +
      `<rect x="${labelW}" y="${y + 6}" width="${Math.max(bw, 2).toFixed(1)}" height="20" rx="4" fill="${fill}"/>` +
      `<text x="${(labelW + bw + 8).toFixed(1)}" y="${y + 22}" font-size="12" font-weight="700" fill="#0b2a4a">${esc(fmt(d.value, 0))}</text>`;
  }).join('');
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" role="img" aria-label="Grafik batang horizontal">${rows}</svg>`;
}

// Donat: items {label, value}; legenda di samping.
export function donutChart(items, opts = {}) {
  const size = opts.size || 220;
  const colors = opts.colors || [BLUE, AMBER, GREEN, ORANGE, '#7a5fb5', '#c25e7a', '#3d8fa8', '#8a97a5', '#5b6b7c'];
  const total = items.reduce((s, d) => s + d.value, 0);
  const cx = size / 2, cy = size / 2, r = size / 2 - 14, ir = r * 0.58;
  let a0 = -Math.PI / 2;
  const segs = items.map((d, i) => {
    const frac = d.value / total;
    const a1 = a0 + frac * Math.PI * 2;
    const large = frac > 0.5 ? 1 : 0;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    const xi1 = cx + ir * Math.cos(a1), yi1 = cy + ir * Math.sin(a1);
    const xi0 = cx + ir * Math.cos(a0), yi0 = cy + ir * Math.sin(a0);
    const dAttr = `M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} L ${xi1.toFixed(1)} ${yi1.toFixed(1)} A ${ir} ${ir} 0 ${large} 0 ${xi0.toFixed(1)} ${yi0.toFixed(1)} Z`;
    a0 = a1;
    return `<path d="${dAttr}" fill="${colors[i % colors.length]}"/>`;
  }).join('');
  const center = `<text x="${cx}" y="${cy - 2}" text-anchor="middle" font-size="22" font-weight="800" fill="#0b2a4a">100%</text>` +
    `<text x="${cx}" y="${cy + 18}" text-anchor="middle" font-size="11" fill="#5b6b7c">total pangsa</text>`;
  const legend = items.map((d, i) =>
    `<span class="legend-item"><span class="legend-dot" style="background:${colors[i % colors.length]}"></span>${esc(d.label)} — <strong>${esc(fmt(d.value, 1))}%</strong></span>`
  ).join('');
  return `<div class="donut-wrap"><svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="Grafik donat">${segs}${center}</svg><div class="legend">${legend}</div></div>`;
}
