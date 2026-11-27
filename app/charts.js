// DataNusa — grafik SVG murni (tanpa library, tanpa network).
// Perbaikan ronde 2: setiap grafik memberi ruang bawah yang lapang sehingga
// titik terendah (mis. -2,07 pada 2020) dan label sumbu-x tidak pernah terpotong.
const NS = 'http://www.w3.org/2000/svg';
const BLUE = '#0b5fa5';
const AMBER = '#e8a838';
const GREEN = '#2e9e6b';
const ORANGE = '#d96c1e';
const GREY = '#8a94a6';

export function fmtID(n, dec = 2) {
  return n.toLocaleString('id-ID', { minimumFractionDigits: dec, maximumFractionDigits: dec });
}

function svgEl(tag, attrs, text) {
  const el = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  if (text !== undefined) el.textContent = text;
  return el;
}

function niceTicks(min, max, count = 4) {
  const span = max - min || 1;
  const step = span / count;
  const mag = 10 ** Math.floor(Math.log10(step));
  const norm = step / mag;
  const nice = norm < 1.5 ? 1 : norm < 3.5 ? 2 : norm < 7.5 ? 5 : 10;
  const s = nice * mag;
  const start = Math.floor(min / s) * s;
  const out = [];
  for (let v = start; v <= max + 1e-9; v += s) out.push(v);
  return out;
}

// Grafik garis dengan area fill. Domain-y dipadatkan di bawah nilai minimum
// (ruang 25% rentang) + padding bawah 34px untuk label tahun — jurang 2020
// selalu terlihat penuh, tidak terpotong di tepi bawah.
export function lineChart(years, values, opts = {}) {
  const W = opts.width || 760, H = opts.height || 250;
  const padL = 52, padR = 14, padT = 26, padB = 34;
  const pts = years.map((y, i) => ({ y, v: values[i] })).filter((p) => p.v !== null && p.v !== undefined);
  const vs = pts.map((p) => p.v);
  let lo = Math.min(...vs), hi = Math.max(...vs);
  const span = (hi - lo) || 1;
  lo -= span * 0.25; hi += span * 0.18;
  const X = (i) => padL + (i * (W - padL - padR)) / (years.length - 1);
  const Y = (v) => padT + ((hi - v) / (hi - lo)) * (H - padT - padB);
  const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, width: '100%', role: 'img', 'aria-label': opts.label || 'Grafik garis' });
  for (const t of niceTicks(lo, hi)) {
    const y = Y(t);
    svg.appendChild(svgEl('line', { x1: padL, x2: W - padR, y1: y, y2: y, stroke: '#e3e8ef', 'stroke-width': 1 }));
    svg.appendChild(svgEl('text', { x: padL - 8, y: y + 4, 'text-anchor': 'end', 'font-size': 11, fill: GREY }, fmtID(t, t % 1 ? 1 : 0)));
  }
  if (lo < 0 && hi > 0) {
    svg.appendChild(svgEl('line', { x1: padL, x2: W - padR, y1: Y(0), y2: Y(0), stroke: '#c8cfdb', 'stroke-width': 1, 'stroke-dasharray': '4 3' }));
  }
  const linePts = pts.map((p) => `${X(years.indexOf(p.y))},${Y(p.v)}`).join(' ');
  const area = `${padL},${Y(lo)} ${linePts} ${X(years.indexOf(pts[pts.length - 1].y))},${Y(lo)}`;
  svg.appendChild(svgEl('polygon', { points: area, fill: BLUE, opacity: 0.08 }));
  svg.appendChild(svgEl('polyline', { points: linePts, fill: 'none', stroke: opts.color || BLUE, 'stroke-width': 2.5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }));
  for (const p of pts) {
    const cx = X(years.indexOf(p.y)), cy = Y(p.v);
    svg.appendChild(svgEl('circle', { cx, cy, r: 3.5, fill: '#fff', stroke: opts.color || BLUE, 'stroke-width': 2 }));
  }
  const minP = pts.reduce((a, b) => (a.v <= b.v ? a : b));
  const maxP = pts.reduce((a, b) => (a.v >= b.v ? a : b));
  const minX = X(years.indexOf(minP.y));
  // Label titik terendah diletakkan DI ATAS titiknya (bukan di bawah): bila
  // titik berada di dekat tepi bawah grafik, label tetap terlihat penuh.
  svg.appendChild(svgEl('text', { x: minX, y: Y(minP.v) - 10, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 700, fill: ORANGE }, fmtID(minP.v)));
  svg.appendChild(svgEl('text', { x: X(years.indexOf(maxP.y)), y: Y(maxP.v) - 10, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 700, fill: GREEN }, fmtID(maxP.v)));
  for (let i = 0; i < years.length; i += 2) {
    svg.appendChild(svgEl('text', { x: X(i), y: H - 10, 'text-anchor': 'middle', 'font-size': 11, fill: GREY }, String(years[i])));
  }
  return svg;
}

// Grafik batang vertikal. Label batang negatif ditulis PUTIH DI DALAM batang
// (bukan di bawah sumbu) sehingga tidak pernah terpotong.
export function barChart(labels, values, opts = {}) {
  const W = opts.width || 760, H = opts.height || 260;
  const padL = 52, padR = 10, padT = 26, padB = 34;
  const lo = Math.min(0, ...values) * 1.15, hi = Math.max(...values) * 1.12;
  const X = (i) => padL + (i * (W - padL - padR)) / values.length;
  const bw = ((W - padL - padR) / values.length) * 0.62;
  const Y = (v) => padT + ((hi - v) / (hi - lo)) * (H - padT - padB);
  const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, width: '100%', role: 'img', 'aria-label': opts.label || 'Grafik batang' });
  for (const t of niceTicks(lo, hi)) {
    const y = Y(t);
    svg.appendChild(svgEl('line', { x1: padL, x2: W - padR, y1: y, y2: y, stroke: '#e3e8ef', 'stroke-width': 1 }));
    svg.appendChild(svgEl('text', { x: padL - 8, y: y + 4, 'text-anchor': 'end', 'font-size': 11, fill: GREY }, fmtID(t, 0)));
  }
  svg.appendChild(svgEl('line', { x1: padL, x2: W - padR, y1: Y(0), y2: Y(0), stroke: '#c8cfdb', 'stroke-width': 1 }));
  values.forEach((v, i) => {
    const x = X(i) + (((W - padL - padR) / values.length) - bw) / 2;
    const yTop = Y(Math.max(v, 0)), yBot = Y(Math.min(v, 0));
    const color = v < 0 ? ORANGE : (opts.color || BLUE);
    svg.appendChild(svgEl('rect', { x, y: yTop, width: bw, height: Math.max(1, yBot - yTop), rx: 3, fill: color }));
    if (v < 0) {
      svg.appendChild(svgEl('text', { x: x + bw / 2, y: yBot - 7, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 700, fill: '#fff' }, fmtID(v)));
    } else {
      svg.appendChild(svgEl('text', { x: x + bw / 2, y: yTop - 7, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 700, fill: '#33415c' }, fmtID(v, v % 1 ? 2 : 0)));
    }
    svg.appendChild(svgEl('text', { x: x + bw / 2, y: H - 10, 'text-anchor': 'middle', 'font-size': 11, fill: GREY }, String(labels[i])));
  });
  return svg;
}

// Grafik batang horizontal (untuk perbandingan antarnegara / provinsi).
export function hbarChart(items, opts = {}) {
  const W = opts.width || 760, rowH = 34, padL = 150, padR = 90, padT = 10, padB = 8;
  const H = padT + padB + items.length * rowH;
  const max = Math.max(...items.map((d) => d.value));
  const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, width: '100%', role: 'img', 'aria-label': opts.label || 'Grafik batang horizontal' });
  items.forEach((d, i) => {
    const y = padT + i * rowH;
    const w = ((W - padL - padR) * d.value) / max;
    svg.appendChild(svgEl('text', { x: padL - 10, y: y + 17, 'text-anchor': 'end', 'font-size': 12, fill: '#33415c' }, d.name));
    svg.appendChild(svgEl('rect', { x: padL, y: y + 4, width: Math.max(2, w), height: 20, rx: 3, fill: d.highlight ? AMBER : BLUE }));
    svg.appendChild(svgEl('text', { x: padL + Math.max(2, w) + 8, y: y + 19, 'font-size': 12, 'font-weight': 700, fill: '#33415c' }, opts.format ? opts.format(d.value) : fmtID(d.value)));
  });
  return svg;
}

// Donat pangsa dengan legenda.
export function donutChart(items, opts = {}) {
  const S = opts.size || 240, cx = S / 2, cy = S / 2, r = S / 2 - 14, ir = r * 0.58;
  const total = items.reduce((a, d) => a + d.value, 0);
  const colors = [BLUE, AMBER, GREEN, '#7c5cbf', ORANGE, '#2a9d8f', '#e76f51', '#6c757d', '#b08968'];
  const svg = svgEl('svg', { viewBox: `0 0 ${S} ${S}`, width: S, height: S, role: 'img', 'aria-label': opts.label || 'Donat pangsa' });
  let a0 = -Math.PI / 2;
  items.forEach((d, i) => {
    const a1 = a0 + (d.value / total) * Math.PI * 2;
    const large = (a1 - a0) > Math.PI ? 1 : 0;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    const x2 = cx + ir * Math.cos(a1), y2 = cy + ir * Math.sin(a1);
    const x3 = cx + ir * Math.cos(a0), y3 = cy + ir * Math.sin(a0);
    svg.appendChild(svgEl('path', { d: `M ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} L ${x2} ${y2} A ${ir} ${ir} 0 ${large} 0 ${x3} ${y3} Z`, fill: colors[i % colors.length] }));
    a0 = a1;
  });
  const mid = svgEl('text', { x: cx, y: cy - 4, 'text-anchor': 'middle', 'font-size': 22, 'font-weight': 800, fill: '#0b2a4a' }, opts.center || '');
  svg.appendChild(mid);
  svg.appendChild(svgEl('text', { x: cx, y: cy + 16, 'text-anchor': 'middle', 'font-size': 11, fill: GREY }, opts.centerSub || ''));
  return svg;
}
