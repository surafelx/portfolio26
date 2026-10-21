"use client";

import { useEffect, useRef } from "react";
import type { MapLink } from "@/content/map";
import type { Layout } from "@/content/map-layout";

const KIND_VAR: Record<string, string> = {
  thread: "--ink",
  work: "--k-work",
  music: "--k-music",
  art: "--k-art",
  writing: "--k-writing",
  cause: "--k-cause",
};

/**
 * The life map's own shape, drawn faintly behind every page. Each star drifts on its own slow orbit and the
 * lines follow, so the picture breathes without ever losing its shape. A canvas, because redrawing
 * forty lines is cheaper there than moving SVG; it sleeps when the tab is hidden and holds still for
 * anyone who has asked their device for less motion.
 */
export function BackdropMap({ layout, links }: { layout: Layout; links: MapLink[] }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvas.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    const index = new Map(layout.nodes.map((n, i) => [n.id, i]));
    const pairs = links.map((l) => [index.get(l.a)!, index.get(l.b)!] as const);
    // Each star gets its own slow orbit: a different speed, size and starting point
    const orbit = layout.nodes.map((_, i) => ({
      rx: 10 + ((i * 37) % 14),
      ry: 8 + ((i * 53) % 12),
      speed: 0.00009 + ((i * 29) % 11) * 0.00001,
      phase: (i * 2.39996) % (Math.PI * 2),
    }));

    let w = 0;
    let h = 0;
    let scale = 1;
    let ox = 0;
    let oy = 0;
    const colours: Record<string, string> = {};

    // The theme's colours are colour-mix expressions; a hidden probe lets the browser resolve them to rgb
    const probe = document.createElement("span");
    probe.style.display = "none";
    document.body.appendChild(probe);
    const resolve = (v: string) => {
      probe.style.color = `var(${v})`;
      return getComputedStyle(probe).color || "#888";
    };
    const readColours = () => {
      for (const [k, v] of Object.entries(KIND_VAR)) colours[k] = resolve(v);
      colours.line = colours.thread;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      c.width = Math.round(w * dpr);
      c.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Cover the window, a little oversized so the drift never shows an edge
      scale = Math.max(w / layout.width, h / layout.height) * 1.08;
      ox = (w - layout.width * scale) / 2;
      oy = (h - layout.height * scale) / 2;
    };

    let raf = 0;
    let last = 0;
    const draw = (t: number) => {
      // About 30 frames a second is plenty for something this slow
      if (t - last < 33 && !still.matches) {
        raf = requestAnimationFrame(draw);
        return;
      }
      last = t;
      const time = still.matches ? 0 : t;
      const sway = Math.sin(time * 0.00004) * 18;
      const pts = layout.nodes.map((n, i) => {
        const o = orbit[i];
        const a = o.phase + time * o.speed;
        return {
          x: ox + n.x * scale + Math.cos(a) * o.rx + sway,
          y: oy + n.y * scale + Math.sin(a) * o.ry - window.scrollY * 0.04,
        };
      });

      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1.1;
      ctx.lineCap = "round";
      ctx.strokeStyle = colours.line;
      ctx.globalAlpha = 0.09;
      pairs.forEach(([a, b], i) => {
        const p = pts[a];
        const q = pts[b];
        const mx = (p.x + q.x) / 2;
        const my = (p.y + q.y) / 2;
        const len = Math.hypot(q.x - p.x, q.y - p.y) || 1;
        const bow = ((i % 5) - 2) * 0.05 * len + 6;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.quadraticCurveTo(mx - ((q.y - p.y) / len) * bow, my + ((q.x - p.x) / len) * bow, q.x, q.y);
        ctx.stroke();
      });

      layout.nodes.forEach((n, i) => {
        const p = pts[i];
        const r = (n.kind === "thread" ? 9 : Math.max(n.r * 0.8, 3.5)) * Math.min(scale, 1.4);
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        if (n.kind === "thread") {
          ctx.globalAlpha = 0.16;
          ctx.strokeStyle = colours.thread;
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.lineWidth = 1.1;
          ctx.strokeStyle = colours.line;
        } else {
          ctx.globalAlpha = 0.18;
          ctx.fillStyle = colours[n.kind];
          ctx.fill();
        }
      });
      ctx.globalAlpha = 1;

      if (!still.matches) raf = requestAnimationFrame(draw);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      readColours();
      raf = requestAnimationFrame(draw);
    };
    const onVisibility = () => (document.hidden ? cancelAnimationFrame(raf) : start());
    const onResize = () => {
      resize();
      start();
    };
    // Colours follow the theme, and the crossfader if it comes back
    const themeWatch = new MutationObserver(readColours);
    themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ["style", "data-side"] });

    resize();
    start();
    window.addEventListener("resize", onResize);
    // The loop already follows the scroll; a still picture only needs redrawing when it moves
    const onScroll = () => still.matches && start();
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    still.addEventListener("change", start);
    return () => {
      cancelAnimationFrame(raf);
      themeWatch.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      probe.remove();
      document.removeEventListener("visibilitychange", onVisibility);
      still.removeEventListener("change", start);
    };
  }, [layout, links]);

  return <canvas ref={canvas} className="backdrop-map" aria-hidden="true" />;
}
