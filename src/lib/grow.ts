// a seeded ink-and-watercolour plant. one seed, one plant, every time.

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashString(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

type Rand = () => number;
type Pt = [number, number];

type LeafShape = "almond" | "round" | "needle" | "frond";
type Bloom = "none" | "bud" | "umbel" | "star" | "pod";

type Species = {
  stems: number;
  height: number;
  curl: number;
  lean: number;
  tropism: number;
  branchChance: number;
  spread: number;
  leafShape: LeafShape;
  leafSize: number;
  leafEvery: number;
  leafAngle: number;
  opposite: boolean;
  bloom: Bloom;
  bloomTone: "pollen" | "dusk";
  maxDepth: number;
};

type Mark =
  | { kind: "stem"; t: number; a: Pt; b: Pt; w: number }
  | { kind: "leaf"; t: number; at: Pt; angle: number; len: number; shape: LeafShape; layer: number; seed: number }
  | { kind: "bloom"; t: number; at: Pt; angle: number; size: number; type: Bloom; tone: "pollen" | "dusk"; seed: number }
  | { kind: "ground"; t: number; a: Pt; b: Pt };

const GENUS_START = ["cal", "ver", "sol", "lu", "mor", "an", "thal", "sem", "or", "vel", "pen", "ras", "ky", "nim"];
const GENUS_MID = ["i", "a", "o", "e", "ae", "ri", "li", "mi", "ra"];
const GENUS_END = ["a", "is", "um", "ia", "ella", "ops"];
const EPITHETS = [
  "seminalis", "nocturna", "recursiva", "lucida", "vagans", "minima", "ludens", "cantans",
  "errans", "silvestris", "hyperbolica", "procedura", "fractalis", "somnians", "tenuis", "radians",
];

function pick<T>(r: Rand, xs: readonly T[]): T {
  return xs[Math.floor(r() * xs.length)];
}

export function speciesName(seed: number) {
  const r = mulberry32(seed ^ 0x9e3779b9);
  const genus = pick(r, GENUS_START) + (r() < 0.6 ? pick(r, GENUS_MID) : "") + pick(r, GENUS_END);
  return `${genus} ${pick(r, EPITHETS)}`;
}

function makeSpecies(r: Rand): Species {
  const leafShape = pick(r, ["almond", "almond", "round", "needle", "frond"] as const);
  return {
    stems: 1 + Math.floor(r() * r() * 3),
    height: 0.62 + r() * 0.26,
    curl: 0.03 + r() * 0.09,
    lean: (r() - 0.5) * 0.5,
    tropism: 0.02 + r() * 0.05,
    branchChance: 0.06 + r() * 0.14,
    spread: 0.35 + r() * 0.55,
    leafShape,
    leafSize: leafShape === "needle" ? 0.06 + r() * 0.03 : leafShape === "frond" ? 0.11 + r() * 0.05 : 0.065 + r() * 0.05,
    leafEvery: 2 + Math.floor(r() * 4),
    leafAngle: 0.55 + r() * 0.6,
    opposite: r() < 0.4,
    bloom: pick(r, ["none", "bud", "umbel", "star", "star", "pod"] as const),
    bloomTone: r() < 0.55 ? "pollen" : "dusk",
    maxDepth: 2 + Math.floor(r() * 2),
  };
}

// generate in unit space: x in [0,1] across, y in [0,1] down, ground at y = 0.94
function generate(seed: number) {
  const r = mulberry32(seed);
  const sp = makeSpecies(r);
  const marks: Mark[] = [];
  const step = 0.012;
  let maxDist = 0;

  const grow = (start: Pt, angle: number, length: number, width: number, depth: number, dist0: number) => {
    let [x, y] = start;
    let a = angle;
    const steps = Math.max(3, Math.floor(length / step));
    let side = r() < 0.5 ? 1 : -1;
    for (let i = 0; i < steps; i++) {
      const u = i / steps;
      a += (r() - 0.5) * sp.curl * 2 + Math.sin(i * 0.35 + seed) * sp.curl * 0.3;
      // tropism pulls the heading back toward straight up (-pi/2)
      a += (-Math.PI / 2 - a) * sp.tropism;
      const nx = x + Math.cos(a) * step;
      const ny = y + Math.sin(a) * step;
      const dist = dist0 + i * step;
      const w = width * (1 - u * 0.85);
      marks.push({ kind: "stem", t: dist, a: [x, y], b: [nx, ny], w });
      maxDist = Math.max(maxDist, dist);

      const isNode = i > 2 && i % sp.leafEvery === 0 && u < 0.97;
      if (isNode) {
        const sides = sp.opposite ? [1, -1] : [side];
        side = -side;
        for (const s of sides) {
          const len = sp.leafSize * (0.7 + r() * 0.5) * (1 - u * 0.45) * (depth === 0 ? 1 : 0.8);
          marks.push({
            kind: "leaf",
            t: dist + 0.02,
            at: [nx, ny],
            angle: a + s * sp.leafAngle * (0.8 + r() * 0.4),
            len,
            shape: sp.leafShape,
            layer: depth,
            seed: Math.floor(r() * 1e9),
          });
        }
        if (depth < sp.maxDepth && u < 0.8 && r() < sp.branchChance * (depth === 0 ? 1.6 : 1)) {
          const s = r() < 0.5 ? 1 : -1;
          grow([nx, ny], a + s * sp.spread * (0.7 + r() * 0.6), length * (0.35 + r() * 0.3) * (1 - u), w * 0.7, depth + 1, dist);
        }
      }
      x = nx;
      y = ny;
    }
    if (sp.bloom !== "none" && (depth === 0 || r() < 0.55)) {
      marks.push({
        kind: "bloom",
        t: dist0 + steps * step + 0.03,
        at: [x, y],
        angle: a,
        size: (depth === 0 ? 0.055 : 0.035) * (0.8 + r() * 0.5),
        type: sp.bloom,
        tone: sp.bloomTone,
        seed: Math.floor(r() * 1e9),
      });
    }
  };

  const ground: Pt = [0.5 + (r() - 0.5) * 0.06, 0.94];
  for (let i = 0; i < 3; i++) {
    const x0 = 0.5 + (r() - 0.5) * 0.5;
    const len = 0.08 + r() * 0.2;
    marks.push({ kind: "ground", t: 0, a: [x0 - len / 2, 0.94 + i * 0.012 + r() * 0.006], b: [x0 + len / 2, 0.94 + i * 0.012] });
  }
  for (let s = 0; s < sp.stems; s++) {
    const spread = sp.stems === 1 ? 0 : (s / (sp.stems - 1) - 0.5) * 0.7;
    const len = sp.height * (s === 0 ? 1 : 0.55 + r() * 0.3);
    grow([ground[0] + spread * 0.04, ground[1]], -Math.PI / 2 + sp.lean * 0.3 + spread, len, 0.011 * (s === 0 ? 1 : 0.8), 0, 0);
  }

  const total = maxDist + 0.08;
  for (const m of marks) m.t = Math.min(1, m.t / total);
  marks.sort((p, q) => p.t - q.t || (p.kind === "stem" ? -1 : 1));
  return marks;
}

export type Palette = { ink: string; leaf: string; pollen: string; dusk: string; night: boolean };

export function readPalette(el: Element): Palette {
  const cs = getComputedStyle(el);
  const v = (n: string) => cs.getPropertyValue(n).trim();
  return { ink: v("--ink"), leaf: v("--moss"), pollen: v("--pollen"), dusk: v("--dusk"), night: v("--night") === "1" };
}

// watercolour: a polygon deformed recursively, stacked many times at low alpha
function deform(r: Rand, pts: Pt[], amount: number, rounds: number): Pt[] {
  let out = pts;
  for (let k = 0; k < rounds; k++) {
    const next: Pt[] = [];
    for (let i = 0; i < out.length; i++) {
      const a = out[i];
      const b = out[(i + 1) % out.length];
      next.push(a);
      const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
      const g = (r() + r() + r() - 1.5) * amount * len;
      const nx = -(b[1] - a[1]) / (len || 1);
      const ny = (b[0] - a[0]) / (len || 1);
      next.push([(a[0] + b[0]) / 2 + nx * g, (a[1] + b[1]) / 2 + ny * g]);
    }
    out = next;
  }
  return out;
}

function fillPoly(ctx: CanvasRenderingContext2D, pts: Pt[]) {
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.closePath();
  ctx.fill();
}

function wash(ctx: CanvasRenderingContext2D, r: Rand, base: Pt[], color: string, layers: number, alpha: number) {
  // shift the wash off the pen line a little, like a hand-tinted print
  let minX = Infinity, maxX = -Infinity;
  for (const [x] of base) { minX = Math.min(minX, x); maxX = Math.max(maxX, x); }
  const slip = (maxX - minX) * 0.06;
  const dx = (r() - 0.5) * slip;
  const dy = (r() - 0.5) * slip;
  const shape = deform(r, base.map(([x, y]) => [x + dx, y + dy] as Pt), 0.8, 2);
  ctx.fillStyle = color;
  ctx.globalAlpha = alpha * 0.75;
  for (let i = 0; i < Math.round(layers * 1.4); i++) fillPoly(ctx, deform(r, shape, 0.55, 2));
  ctx.globalAlpha = 1;
}

// a loose pool of colour behind the plant, laid down before any ink
function backdrop(ctx: CanvasRenderingContext2D, seed: number, S: number, pal: Palette) {
  const r = mulberry32(seed ^ 0x51ed27);
  const blobs: [number, number, number, string][] = [
    [0.5 + (r() - 0.5) * 0.15, 0.58, 0.3, pal.leaf],
    [0.5 + (r() - 0.5) * 0.3, 0.3 + r() * 0.15, 0.16, r() < 0.5 ? pal.pollen : pal.dusk],
  ];
  for (const [cx, cy, rad, color] of blobs) {
    const pts: Pt[] = [];
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      const k = rad * S * (0.8 + r() * 0.4);
      pts.push([cx * S + Math.cos(a) * k, cy * S + Math.sin(a) * k * 1.2]);
    }
    const shape = deform(r, pts, 0.9, 2);
    ctx.fillStyle = color;
    ctx.globalAlpha = pal.night ? 0.009 : 0.013;
    for (let i = 0; i < 16; i++) fillPoly(ctx, deform(r, shape, 0.7, 3));
  }
  ctx.globalAlpha = 1;
}

function leafOutline(shape: LeafShape, len: number, n = 14): Pt[] {
  const width = shape === "round" ? 0.62 : shape === "needle" ? 0.08 : 0.34;
  const pw = shape === "round" ? 0.55 : 0.9;
  const left: Pt[] = [];
  const right: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    const w = Math.pow(Math.sin(Math.PI * Math.pow(u, 0.85)), pw) * width * len * 0.5;
    left.push([u * len, -w]);
    right.push([u * len, w]);
  }
  return [...left, ...right.reverse()];
}

function transform(pts: Pt[], at: Pt, angle: number): Pt[] {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return pts.map(([x, y]) => [at[0] + x * c - y * s, at[1] + x * s + y * c]);
}

function inkLine(ctx: CanvasRenderingContext2D, r: Rand, a: Pt, b: Pt, w: number, color: string) {
  ctx.strokeStyle = color;
  ctx.lineWidth = w;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(a[0], a[1]);
  const mx = (a[0] + b[0]) / 2 + (r() - 0.5) * w * 0.6;
  const my = (a[1] + b[1]) / 2 + (r() - 0.5) * w * 0.6;
  ctx.quadraticCurveTo(mx, my, b[0], b[1]);
  ctx.stroke();
}

function drawLeaf(ctx: CanvasRenderingContext2D, m: Extract<Mark, { kind: "leaf" }>, S: number, pal: Palette, detail: number) {
  const r = mulberry32(m.seed);
  const at: Pt = [m.at[0] * S, m.at[1] * S];
  const len = m.len * S;
  const inkW = Math.max(0.6, S * 0.0016);

  if (m.shape === "frond") {
    // a little compound leaf: a rachis with paired leaflets
    const tip = transform([[len, 0]], at, m.angle)[0];
    inkLine(ctx, r, at, tip, inkW, pal.ink);
    const n = 5 + Math.floor(r() * 4);
    for (let i = 1; i <= n; i++) {
      const u = i / (n + 1);
      const p = transform([[u * len, 0]], at, m.angle)[0];
      const l = len * 0.32 * (1 - u * 0.6);
      for (const s of [1, -1]) {
        const base = transform(leafOutline("almond", l, 8), p, m.angle + s * 1.0);
        wash(ctx, r, base, pal.leaf, Math.round(5 * detail), 0.09);
      }
    }
    return;
  }

  const base = transform(leafOutline(m.shape, len), at, m.angle);
  if (m.shape !== "needle") wash(ctx, r, base, pal.leaf, Math.round(9 * detail), 0.075);
  // small specimens read better as colour alone; pen contours clot at that size
  if (detail < 1 && m.shape !== "needle") return;
  // ink contour, drawn slightly off the wash like a quick pen pass
  ctx.strokeStyle = pal.ink;
  ctx.lineWidth = inkW;
  ctx.globalAlpha = 0.85;
  const contour = deform(r, base, 0.12, 1);
  ctx.beginPath();
  const start = Math.floor(r() * 3);
  ctx.moveTo(contour[start][0], contour[start][1]);
  for (let i = start + 1; i < contour.length - Math.floor(r() * 4); i++) ctx.lineTo(contour[i][0], contour[i][1]);
  ctx.stroke();
  // midrib
  const rib = transform([[0, 0], [len * 0.85, 0]], at, m.angle);
  ctx.globalAlpha = 0.6;
  inkLine(ctx, r, rib[0], rib[1], inkW * 0.8, pal.ink);
  ctx.globalAlpha = 1;
}

function drawBloom(ctx: CanvasRenderingContext2D, m: Extract<Mark, { kind: "bloom" }>, S: number, pal: Palette, detail: number) {
  const r = mulberry32(m.seed);
  const at: Pt = [m.at[0] * S, m.at[1] * S];
  const size = m.size * S;
  const tone = m.tone === "pollen" ? pal.pollen : pal.dusk;
  const inkW = Math.max(0.6, S * 0.0015);

  if (m.type === "star") {
    const n = 5 + Math.floor(r() * 3);
    const rot = r() * Math.PI;
    for (let i = 0; i < n; i++) {
      const a = rot + (i / n) * Math.PI * 2;
      wash(ctx, r, transform(leafOutline("round", size, 10), at, a), tone, Math.round(8 * detail), 0.08);
    }
    ctx.fillStyle = pal.ink;
    for (let i = 0; i < 9; i++) {
      const a = r() * Math.PI * 2;
      const d = r() * size * 0.18;
      ctx.beginPath();
      ctx.arc(at[0] + Math.cos(a) * d, at[1] + Math.sin(a) * d, inkW * 0.9, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (m.type === "umbel") {
    const n = 7 + Math.floor(r() * 7);
    for (let i = 0; i < n; i++) {
      const a = m.angle + (r() - 0.5) * 2.2;
      const d = size * (0.6 + r() * 0.5);
      const p: Pt = [at[0] + Math.cos(a) * d, at[1] + Math.sin(a) * d];
      ctx.globalAlpha = 0.7;
      inkLine(ctx, r, at, p, inkW * 0.7, pal.ink);
      ctx.globalAlpha = 1;
      const dot = transform(leafOutline("round", size * 0.28, 8), [p[0] - size * 0.14, p[1]], 0);
      wash(ctx, r, dot, tone, Math.round(6 * detail), 0.13);
    }
  } else if (m.type === "pod" || m.type === "bud") {
    const l = m.type === "pod" ? size * 1.3 : size * 0.8;
    const base = transform(leafOutline("almond", l), at, m.angle);
    wash(ctx, r, base, tone, Math.round(10 * detail), 0.1);
    ctx.strokeStyle = pal.ink;
    ctx.lineWidth = inkW * 0.7;
    ctx.globalAlpha = 0.55;
    // hatching across the pod
    for (let i = 1; i < 6; i++) {
      const u = i / 6;
      const p = transform([[u * l, -l * 0.12], [u * l + l * 0.05, l * 0.12]], at, m.angle);
      ctx.beginPath();
      ctx.moveTo(p[0][0], p[0][1]);
      ctx.lineTo(p[1][0], p[1][1]);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
}

function drawMark(ctx: CanvasRenderingContext2D, m: Mark, S: number, pal: Palette, detail: number) {
  if (m.kind === "stem") {
    const r = mulberry32(Math.floor(m.a[0] * 1e6) ^ Math.floor(m.a[1] * 1e6));
    inkLine(ctx, r, [m.a[0] * S, m.a[1] * S], [m.b[0] * S, m.b[1] * S], Math.max(0.7, m.w * S * 0.28), pal.ink);
  } else if (m.kind === "ground") {
    const r = mulberry32(Math.floor(m.a[0] * 1e6));
    ctx.globalAlpha = 0.5;
    inkLine(ctx, r, [m.a[0] * S, m.a[1] * S], [m.b[0] * S, m.b[1] * S], Math.max(0.6, S * 0.0014), pal.ink);
    ctx.globalAlpha = 1;
  } else if (m.kind === "leaf") {
    drawLeaf(ctx, m, S, pal, detail);
  } else {
    drawBloom(ctx, m, S, pal, detail);
  }
}

export type Plant = { cancel: () => void };

// draws into a square region of side S (css px) centred horizontally in the canvas
export function drawPlant(
  canvas: HTMLCanvasElement,
  seed: number,
  pal: Palette,
  opts: { animate?: boolean; duration?: number; detail?: number; onDone?: () => void } = {},
): Plant {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  const ctx = canvas.getContext("2d")!;
  const S = Math.min(w, h);
  ctx.setTransform(dpr, 0, 0, dpr, (w - S) / 2 * dpr, (h - S) * dpr);
  ctx.clearRect(-w, -h, w * 3, h * 3);
  ctx.globalCompositeOperation = pal.night ? "lighter" : "multiply";

  const marks = generate(seed);
  const detail = opts.detail ?? 1;
  if (detail >= 1) backdrop(ctx, seed, S, pal);
  const draw = (m: Mark) => {
    // ink always sits on top of the washes, so paint it with source-over
    ctx.globalCompositeOperation = m.kind === "stem" || m.kind === "ground" ? "source-over" : pal.night ? "lighter" : "multiply";
    drawMark(ctx, m, S, pal, detail);
  };

  if (!opts.animate) {
    marks.forEach(draw);
    opts.onDone?.();
    return { cancel() {} };
  }

  const duration = opts.duration ?? 2600;
  let i = 0;
  let raf = 0;
  const t0 = performance.now();
  const tick = (now: number) => {
    const p = Math.min(1, (now - t0) / duration);
    const eased = 1 - Math.pow(1 - p, 2.2);
    while (i < marks.length && marks[i].t <= eased) draw(marks[i++]);
    if (p < 1) raf = requestAnimationFrame(tick);
    else {
      while (i < marks.length) draw(marks[i++]);
      opts.onDone?.();
    }
  };
  raf = requestAnimationFrame(tick);
  return { cancel: () => cancelAnimationFrame(raf) };
}
