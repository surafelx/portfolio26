"use client";

import { useEffect, useState } from "react";

type RailItem = { id: string; label: string };

/**
 * Watches the full-screen scenes: marks each one as it enters view (for the reveal),
 * tracks which one is current, and renders the side rail that jumps between them.
 */
export function ScrollStage({ items, showRail }: { items: RailItem[]; showRail: boolean }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scenes = Array.from(document.querySelectorAll<HTMLElement>("[data-scene]"));

    // Scenes already on screen are marked before the reveal class goes on, so nothing visible jumps.
    const vh = window.innerHeight;
    scenes.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < vh * 0.85 && r.bottom > 0) el.dataset.inview = "true";
    });
    if (!reduced) root.classList.add("reveal-ready");

    const ratios = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          ratios.set(el.id, entry.intersectionRatio);
          if (entry.isIntersecting && entry.intersectionRatio > 0.2) el.dataset.inview = "true";
        }
        let best = "";
        let bestRatio = 0;
        ratios.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            best = id;
            bestRatio = ratio;
          }
        });
        if (best) setActive(best);
      },
      { threshold: [0, 0.2, 0.4, 0.6, 0.8, 1] },
    );
    scenes.forEach((el) => observer.observe(el));
    return () => {
      observer.disconnect();
      root.classList.remove("reveal-ready");
    };
  }, []);

  if (!showRail || items.length < 2) return null;

  const go = (id: string) => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(id)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };

  return (
    <nav aria-label="Sections">
      <ul className="rail">
        {items.map((item) => (
          <li key={item.id}>
            <button type="button" onClick={() => go(item.id)} aria-current={active === item.id ? "true" : undefined}>
              <span className="name">{item.label}</span>
              <span className="tick" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
