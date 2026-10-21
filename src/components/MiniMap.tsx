"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { kinds, type MapLink } from "@/content/map";
import type { Layout } from "@/content/map-layout";
import { curve } from "./LifeMap";

/**
 * The life map, small enough for the home page: only the threads are named, and pointing at a star
 * names it and lights its connections. Clicking it again opens that thing's page; the full map is one link away.
 */
export function MiniMap({ layout, links }: { layout: Layout; links: MapLink[] }) {
  const router = useRouter();
  const [active, setActive] = useState<string | null>(null);
  const byId = useMemo(() => new Map(layout.nodes.map((n) => [n.id, n])), [layout]);

  const near = useMemo(() => {
    if (!active) return null;
    const s = new Set([active]);
    links.forEach((l) => {
      if (l.a === active) s.add(l.b);
      if (l.b === active) s.add(l.a);
    });
    return s;
  }, [active, links]);

  const node = active ? byId.get(active) : null;

  return (
    <div className="mini-map">
      <svg viewBox={`0 0 ${layout.width} ${layout.height}`} role="group" aria-label="A small map of everything Surafel does" onMouseLeave={() => setActive(null)}>
        <g>
          {links.map((l, i) => {
            const lit = active && (l.a === active || l.b === active);
            return (
              <path
                key={`${l.a}-${l.b}`}
                d={curve(byId.get(l.a)!, byId.get(l.b)!, i)}
                className={`map-link${lit ? " lit" : ""}${near && !lit ? " dim" : ""}`}
              />
            );
          })}
        </g>
        {layout.nodes.map((n) => {
          const state = n.id === active ? " on" : near && !near.has(n.id) ? " dim" : "";
          const named = n.kind === "thread" || n.id === active;
          return (
            <g
              key={n.id}
              className={`map-node k-${n.kind}${state}`}
              transform={`translate(${n.x} ${n.y})`}
              tabIndex={0}
              role="link"
              aria-label={`${n.label}, ${kinds[n.kind].name}`}
              onMouseEnter={() => setActive(n.id)}
              onFocus={() => setActive(n.id)}
              // A mouse has already named the star by hovering; on a touch screen the first tap names it, the second opens it
              onClick={() => (active !== n.id ? setActive(n.id) : n.href && router.push(n.href))}
              onKeyDown={(e) => e.key === "Enter" && n.href && router.push(n.href)}
            >
              <circle className="halo" r={n.r + 9} />
              <circle className="dot" r={n.kind === "thread" ? n.r : n.r * 0.85} />
              <circle className="ring" r={n.r + 3} cx={0.8} cy={-0.6} />
              {named && (
                <text className={`name${n.kind === "thread" ? " thread" : ""}`} x={n.left ? -(n.r + 7) : n.r + 7} y={5} textAnchor={n.left ? "end" : "start"}>
                  {n.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <p className="mini-caption" aria-live="polite">
        {node ? (
          <>
            <b>{node.label}</b> {node.blurb}
          </>
        ) : (
          <>Point at any star. Each one is something I&rsquo;ve made or done, and the lines are why they connect.</>
        )}
      </p>
    </div>
  );
}
