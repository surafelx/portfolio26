/**
 * Places the life map's nodes with a small force simulation, at build time, so the page arrives already drawn.
 * Threads are pulled to the middle and everything else drifts toward the threads it's linked to.
 * Seeded, so the map looks the same on every build until the data changes.
 */
import { links, nodes, type MapLink, type MapNode } from "./map";

export type Placed = MapNode & { x: number; y: number; r: number; degree: number; left: boolean };
export type Layout = { width: number; height: number; nodes: Placed[] };

function rng(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

/** `namedOnly`: only threads carry labels (the home page's small map), so only theirs need room. */
export function layout(width: number, height: number, pad = 70, namedOnly = false): Layout {
  const rand = rng(26);
  const degree = new Map<string, number>(nodes.map((n) => [n.id, 0]));
  links.forEach((l) => {
    degree.set(l.a, degree.get(l.a)! + 1);
    degree.set(l.b, degree.get(l.b)! + 1);
  });

  const threads = nodes.filter((n) => n.kind === "thread");
  const cx = width / 2;
  const cy = height / 2;
  const pos = new Map<string, { x: number; y: number; vx: number; vy: number }>();
  nodes.forEach((n) => {
    if (n.kind === "thread") {
      // Threads start on a ring around the middle
      const i = threads.indexOf(n);
      const a = (i / threads.length) * Math.PI * 2 - Math.PI / 2;
      pos.set(n.id, { x: cx + Math.cos(a) * width * 0.16, y: cy + Math.sin(a) * height * 0.16, vx: 0, vy: 0 });
    } else {
      pos.set(n.id, { x: cx + (rand() - 0.5) * width * 0.8, y: cy + (rand() - 0.5) * height * 0.8, vx: 0, vy: 0 });
    }
  });

  const aspect = width / height;
  const ideal = Math.min(width, height) * 0.17;
  for (let step = 0; step < 600; step++) {
    const heat = 1 - step / 600;
    // Every pair pushes apart
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const p = pos.get(nodes[i].id)!;
        const q = pos.get(nodes[j].id)!;
        let dx = p.x - q.x;
        let dy = (p.y - q.y) * aspect;
        const d2 = Math.max(dx * dx + dy * dy, 25);
        const f = (ideal * ideal) / d2;
        dx = (dx / Math.sqrt(d2)) * f;
        dy = (dy / Math.sqrt(d2)) * f;
        p.vx += dx; p.vy += dy;
        q.vx -= dx; q.vy -= dy;
      }
    }
    // Links pull together
    links.forEach((l: MapLink) => {
      const p = pos.get(l.a)!;
      const q = pos.get(l.b)!;
      const dx = q.x - p.x;
      const dy = q.y - p.y;
      const d = Math.max(Math.hypot(dx, dy), 1);
      const f = (d - ideal) * 0.04;
      p.vx += (dx / d) * f; p.vy += (dy / d) * f;
      q.vx -= (dx / d) * f; q.vy -= (dy / d) * f;
    });
    // Threads hold the middle, everything stays on the page
    nodes.forEach((n) => {
      const p = pos.get(n.id)!;
      const pull = n.kind === "thread" ? 0.03 : 0.006;
      p.vx += (cx - p.x) * pull;
      p.vy += (cy - p.y) * pull;
      const cap = 18 * heat + 0.5;
      p.x += Math.max(-cap, Math.min(cap, p.vx * 0.5));
      p.y += Math.max(-cap, Math.min(cap, p.vy * 0.5));
      p.vx *= 0.6;
      p.vy *= 0.6;
    });
  }

  // Fit to the page, leaving room for labels
  const xs = [...pos.values()].map((p) => p.x);
  const ys = [...pos.values()].map((p) => p.y);
  const [minX, maxX, minY, maxY] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const sx = (width - pad * 2) / Math.max(maxX - minX, 1);
  const sy = (height - pad * 2) / Math.max(maxY - minY, 1);

  const placed: Placed[] = nodes.map((n) => {
    const p = pos.get(n.id)!;
    const deg = degree.get(n.id)!;
    return {
      ...n,
      x: pad + (p.x - minX) * sx,
      y: pad + (p.y - minY) * sy,
      r: n.kind === "thread" ? 13 : Math.min(5 + deg * 1.3, 11),
      degree: deg,
      left: false,
    };
  });

  separateLabels(placed, width, height, namedOnly);
  placed.forEach((n) => {
    n.x = Math.round(n.x);
    n.y = Math.round(n.y);
    n.left = labelBox(n, width).left;
  });
  return { width, height, nodes: placed };
}

/** Where a node's label sits: to the right, unless it would run off the page. LifeMap draws it from `left`. */
function labelBox(n: Placed, width: number, namedOnly = false) {
  const w = namedOnly && n.kind !== "thread" ? n.r * 2 + 6 : n.label.length * (n.kind === "thread" ? 9 : 7.6) + n.r + 10;
  const left = n.x + w > width - 8;
  return { left, x1: left ? n.x - w : n.x - n.r - 2, x2: left ? n.x + n.r + 2 : n.x + w, y1: n.y - 13, y2: n.y + 13 };
}

/** Nudge nodes apart until no two labels overlap, mostly up and down so the shape of the map survives. */
function separateLabels(list: Placed[], width: number, height: number, namedOnly: boolean) {
  for (let pass = 0; pass < 300; pass++) {
    let moved = false;
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const a = labelBox(list[i], width, namedOnly);
        const b = labelBox(list[j], width, namedOnly);
        const ox = Math.min(a.x2, b.x2) - Math.max(a.x1, b.x1);
        const oy = Math.min(a.y2, b.y2) - Math.max(a.y1, b.y1);
        if (ox <= 0 || oy <= 0) continue;
        moved = true;
        const up = list[i].y <= list[j].y ? -1 : 1;
        const push = Math.min(oy, 8) / 2 + 0.5;
        list[i].y += up * push;
        list[j].y -= up * push;
        if (ox < oy) {
          const left = list[i].x <= list[j].x ? -1 : 1;
          list[i].x += left * 1.5;
          list[j].x -= left * 1.5;
        }
      }
    }
    list.forEach((n) => {
      n.x = Math.max(24, Math.min(width - 24, n.x));
      n.y = Math.max(36, Math.min(height - 24, n.y));
    });
    if (!moved) break;
  }
}
