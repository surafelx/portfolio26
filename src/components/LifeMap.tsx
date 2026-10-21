"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { kinds, type Kind, type MapLink } from "@/content/map";
import type { Layout, Placed } from "@/content/map-layout";

/** A pencil line between two points, bowed a little so it looks drawn rather than ruled. */
export function curve(p: Placed, q: Placed, i: number) {
  const mx = (p.x + q.x) / 2;
  const my = (p.y + q.y) / 2;
  const dx = q.x - p.x;
  const dy = q.y - p.y;
  const len = Math.hypot(dx, dy) || 1;
  const bow = ((i % 5) - 2) * 0.05 * len + 6;
  return `M${p.x},${p.y} Q${mx - (dy / len) * bow},${my + (dx / len) * bow} ${q.x},${q.y}`;
}

function Graph({ layout, links, active, setActive, hidden, className }: {
  layout: Layout;
  links: MapLink[];
  active: string | null;
  setActive: (id: string | null) => void;
  hidden: Set<Kind>;
  className: string;
}) {
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

  return (
    <svg className={`map-svg ${className}`} viewBox={`0 0 ${layout.width} ${layout.height}`} role="group" aria-label="Map of everything Surafel does">
      <g className="map-links">
        {links.map((l, i) => {
          const p = byId.get(l.a)!;
          const q = byId.get(l.b)!;
          const off = hidden.has(p.kind) || hidden.has(q.kind);
          const lit = active && (l.a === active || l.b === active);
          return <path key={`${l.a}-${l.b}`} d={curve(p, q, i)} className={`map-link${lit ? " lit" : ""}${near && !lit ? " dim" : ""}${off ? " off" : ""}`} />;
        })}
      </g>
      {layout.nodes.map((n) => {
        const off = hidden.has(n.kind);
        const state = n.id === active ? " on" : near && !near.has(n.id) ? " dim" : "";
        return (
          <g
            key={n.id}
            className={`map-node k-${n.kind} lean-${kinds[n.kind].lean}${state}${off ? " off" : ""}`}
            transform={`translate(${n.x} ${n.y})`}
            tabIndex={off ? -1 : 0}
            role="button"
            aria-label={`${n.label}, ${kinds[n.kind].name}`}
            aria-pressed={n.id === active}
            onMouseEnter={() => setActive(n.id)}
            onFocus={() => setActive(n.id)}
            onClick={() => setActive(n.id)}
          >
            <circle className="halo" r={n.r + 9} />
            <circle className="dot" r={n.r} />
            {/* a second, slightly-off pencil ring */}
            <circle className="ring" r={n.r + 3} cx={0.8} cy={-0.6} />
            <text className={`name${n.kind === "thread" ? " thread" : ""}`} x={n.left ? -(n.r + 7) : n.r + 7} y={4} textAnchor={n.left ? "end" : "start"}>
              {n.label}
            </text>
            {n.note && (
              <text className="note" x={-n.r} y={-n.r - 14} textAnchor="middle" transform="rotate(-6)">
                {n.note} ↓
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export function LifeMap({ wide, tall, links }: { wide: Layout; tall: Layout; links: MapLink[] }) {
  const [active, setActive] = useState<string | null>("biomed");
  const [hidden, setHidden] = useState<Set<Kind>>(new Set());

  const node = wide.nodes.find((n) => n.id === active) ?? null;
  const threads = active
    ? links
        .filter((l) => l.a === active || l.b === active)
        .map((l) => ({ other: wide.nodes.find((n) => n.id === (l.a === active ? l.b : l.a))!, why: l.why }))
    : [];

  function toggle(k: Kind) {
    setHidden((h) => {
      const next = new Set(h);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  }

  return (
    <div className="map">
      <div className="map-filters" role="group" aria-label="Show or hide kinds">
        {(Object.keys(kinds) as Kind[]).map((k) => (
          <button key={k} type="button" className={`chip k-${k}`} aria-pressed={!hidden.has(k)} onClick={() => toggle(k)}>
            <span className="swatch" aria-hidden="true" />
            {kinds[k].name}
          </button>
        ))}
      </div>

      <div className="map-stage">
        <div className="map-canvas">
          <Graph layout={wide} links={links} active={active} setActive={setActive} hidden={hidden} className="wide" />
          <Graph layout={tall} links={links} active={active} setActive={setActive} hidden={hidden} className="tall" />
        </div>

        <aside className="map-card panel" aria-live="polite">
          {node ? (
            <>
              <p className="label">{kinds[node.kind].name}</p>
              <h2>{node.label}</h2>
              <p className="blurb">{node.blurb}</p>
              {threads.length > 0 && (
                <>
                  <p className="threads-title">Connected to</p>
                  <ul className="threads">
                    {threads.map((t) => (
                      <li key={t.other.id}>
                        <button type="button" onClick={() => setActive(t.other.id)}>
                          {t.other.label}
                        </button>
                        <span>{t.why}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {node.href && (
                <Link className="btn" href={node.href}>
                  Open {node.label.split(" · ")[0]} →
                </Link>
              )}
            </>
          ) : (
            <p className="blurb">Point at anything on the map.</p>
          )}
        </aside>
      </div>
    </div>
  );
}
