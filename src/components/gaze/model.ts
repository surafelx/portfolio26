/**
 * The maths behind eye mode, a small port of Dimtse's tracker (dimtse.happyluckychacho.org/gaze/).
 * Lessons carried over from Dimtse, each learned there from a failure on real data:
 *   - Pointing with the head is measured far more precisely than eye direction, so "head" is the default
 *     and "eyes" adds the eye-within-head terms on top of the head's.
 *   - The two screen axes are fitted separately, each with its own ridge penalty chosen by leaving one
 *     calibration target out at a time: horizontal is easy to read from a webcam, vertical is weak.
 *   - Inputs are clipped to the range calibration covered, because a linear model asked to extrapolate
 *     sends the pointer off the screen.
 * Pure functions, no browser APIs, so this file can be checked on its own.
 */

export type Mode = "head" | "eyes";

export type Point = { x: number; y: number };
type Landmark = { x: number; y: number; z?: number };

// ---------------------------------------------------------------- features

/** Head turn, nod and tilt in degrees, and position, from MediaPipe's column-major 4x4. */
export function headPose(m: ArrayLike<number>) {
  const at = (r: number, c: number) => m[c * 4 + r];
  const sy = Math.hypot(at(0, 0), at(1, 0));
  const deg = (v: number) => (v * 180) / Math.PI;
  const yaw = Math.atan2(-at(2, 0), sy);
  const pitch = sy < 1e-6 ? Math.atan2(-at(1, 2), at(1, 1)) : Math.atan2(at(2, 1), at(2, 2));
  const roll = sy < 1e-6 ? 0 : Math.atan2(at(1, 0), at(0, 0));
  return [deg(yaw), deg(pitch), deg(roll), at(0, 3), at(1, 3), at(2, 3)];
}

// (outer corner, inner corner, upper lid, lower lid, iris centre)
const EYE_A = [33, 133, 159, 145, 468];
const EYE_B = [362, 263, 386, 374, 473];

/** The iris's sideways offset in its socket, scaled by eye width (which doesn't collapse in a blink). */
function irisX(pts: Landmark[], spec: number[]) {
  const [outer, inner, , , iris] = spec.map((i) => pts[i]);
  const width = Math.abs(inner.x - outer.x) || 1e-6;
  return (iris.x - (outer.x + inner.x) / 2) / width;
}

/** Eye direction within the head from the blendshape scores, both eyes combined with the right signs. */
function eyeLook(blend: Record<string, number>) {
  const g = (k: string) => blend[k] || 0;
  const h = (g("eyeLookOutLeft") - g("eyeLookInLeft") + (g("eyeLookInRight") - g("eyeLookOutRight"))) / 2;
  const v = (g("eyeLookUpLeft") - g("eyeLookDownLeft") + (g("eyeLookUpRight") - g("eyeLookDownRight"))) / 2;
  return [h, v];
}

export function features(mode: Mode, pose: number[], landmarks: Landmark[], blend: Record<string, number>) {
  if (mode === "head") return pose;
  return [irisX(landmarks, EYE_A), irisX(landmarks, EYE_B), ...eyeLook(blend), ...pose];
}

// ---------------------------------------------------------------- the fit

/** Solve (A + diag(ridge)) x = b by Cholesky; A is X'X so it's symmetric. */
function solve(A: number[][], b: number[], ridge: number[]) {
  const d = b.length;
  const L = A.map(() => new Array<number>(d).fill(0));
  for (let i = 0; i < d; i++) {
    for (let j = 0; j <= i; j++) {
      let s = A[i][j] + (i === j ? ridge[i] : 0);
      for (let k = 0; k < j; k++) s -= L[i][k] * L[j][k];
      if (i === j) {
        if (s <= 1e-12) return null;
        L[i][i] = Math.sqrt(s);
      } else L[i][j] = s / L[j][j];
    }
  }
  const z = new Array<number>(d).fill(0);
  for (let i = 0; i < d; i++) {
    let s = b[i];
    for (let k = 0; k < i; k++) s -= L[i][k] * z[k];
    z[i] = s / L[i][i];
  }
  const x = new Array<number>(d).fill(0);
  for (let i = d - 1; i >= 0; i--) {
    let s = z[i];
    for (let k = i + 1; k < d; k++) s -= L[k][i] * x[k];
    x[i] = s / L[i][i];
  }
  return x;
}

function sums(rows: number[][], y: number[]) {
  const d = rows[0].length;
  const A = Array.from({ length: d }, () => new Array<number>(d).fill(0));
  const b = new Array<number>(d).fill(0);
  rows.forEach((r, k) => {
    for (let i = 0; i < d; i++) {
      b[i] += r[i] * y[k];
      for (let j = 0; j < d; j++) A[i][j] += r[i] * r[j];
    }
  });
  return { A, b };
}

const ALPHAS = Array.from({ length: 15 }, (_, i) => Math.pow(10, -3 + (5 * i) / 14));

export type Model = {
  mode: Mode;
  mean: number[];
  scale: number[];
  lo: number[];
  hi: number[];
  wx: number[];
  wy: number[];
  /** Typical error on held-out targets, in pixels: how much to trust it. */
  errorPx: number;
};

/**
 * Fit features → screen. `group` says which calibration target each sample was taken at, so the
 * penalty is chosen on targets the fit hasn't seen.
 */
export function fit(mode: Mode, x: number[][], screen: Point[], group: number[]): Model | null {
  const n = x.length;
  if (n < 12) return null;
  const d = x[0].length;
  const mean = Array.from({ length: d }, (_, j) => x.reduce((s, r) => s + r[j], 0) / n);
  const scale = Array.from({ length: d }, (_, j) => Math.sqrt(x.reduce((s, r) => s + (r[j] - mean[j]) ** 2, 0) / n) || 1);
  const z = x.map((r) => [1, ...r.map((v, j) => (v - mean[j]) / scale[j])]);
  const lo = Array.from({ length: d }, (_, j) => Math.min(...x.map((r) => r[j])));
  const hi = Array.from({ length: d }, (_, j) => Math.max(...x.map((r) => r[j])));
  const targets = [...new Set(group)];

  const fitAxis = (y: number[]) => {
    let best = { alpha: 1, err: Infinity };
    for (const alpha of ALPHAS) {
      const ridge = [0, ...new Array(d).fill(alpha * n)];
      let err = 0;
      let count = 0;
      for (const t of targets) {
        const held = sums(
          z.filter((_, i) => group[i] !== t),
          y.filter((_, i) => group[i] !== t),
        );
        const w = solve(held.A, held.b, ridge);
        if (!w) {
          err = Infinity;
          break;
        }
        z.forEach((r, i) => {
          if (group[i] !== t) return;
          err += Math.abs(r.reduce((s, v, k) => s + v * w[k], 0) - y[i]);
          count++;
        });
      }
      if (count && err / count < best.err) best = { alpha, err: err / count };
    }
    const { A, b } = sums(z, y);
    return { w: solve(A, b, [0, ...new Array(d).fill(best.alpha * n)]), err: best.err };
  };

  const fx = fitAxis(screen.map((p) => p.x));
  const fy = fitAxis(screen.map((p) => p.y));
  if (!fx.w || !fy.w) return null;
  return { mode, mean, scale, lo, hi, wx: fx.w, wy: fy.w, errorPx: Math.hypot(fx.err, fy.err) };
}

export function predict(m: Model, f: number[]): Point {
  const z = [
    1,
    ...f.map((v, j) => {
      const span = m.hi[j] - m.lo[j];
      const clipped = Math.max(m.lo[j] - span * 0.15, Math.min(m.hi[j] + span * 0.15, v));
      return (clipped - m.mean[j]) / m.scale[j];
    }),
  ];
  return { x: z.reduce((s, v, k) => s + v * m.wx[k], 0), y: z.reduce((s, v, k) => s + v * m.wy[k], 0) };
}

// ---------------------------------------------------------------- smoothing

/** One Euro filter: steady when still, quick when moving. */
export class OneEuro {
  private x: number | null = null;
  private dx = 0;
  private t = 0;
  constructor(private minCutoff = 0.9, private beta = 0.015) {}
  reset() {
    this.x = null;
  }
  apply(v: number, t: number) {
    if (this.x === null) {
      this.x = v;
      this.t = t;
      return v;
    }
    const dt = Math.max((t - this.t) / 1000, 1e-3);
    this.t = t;
    const a = (cutoff: number) => 1 / (1 + 1 / (2 * Math.PI * cutoff * dt));
    this.dx += a(1) * ((v - this.x) / dt - this.dx);
    this.x += a(this.minCutoff + this.beta * Math.abs(this.dx)) * (v - this.x);
    return this.x;
  }
}
