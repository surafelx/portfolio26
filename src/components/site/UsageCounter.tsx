"use client";

import { useEffect, useRef, useState } from "react";

type Reading = { name: string; value: number; live: boolean };
type Usage = { total: number; label: string; sources: Reading[] };

const REFRESH = 60 * 1000;

/** The number of people using software I built, added up from each app and refreshed every minute. */
export function UsageCounter() {
  const [usage, setUsage] = useState<Usage | null>(null);
  const [shown, setShown] = useState(0);
  const shownRef = useRef(0);

  useEffect(() => {
    let stopped = false;
    const load = async () => {
      try {
        const res = await fetch("/api/usage");
        if (!res.ok) return;
        const body = (await res.json()) as Usage;
        if (!stopped) setUsage(body);
      } catch {
        // Keep the last reading.
      }
    };
    load();
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") load();
    }, REFRESH);
    return () => {
      stopped = true;
      window.clearInterval(timer);
    };
  }, []);

  // Count up to the new total.
  useEffect(() => {
    if (!usage) return;
    const from = shownRef.current;
    const to = usage.total;
    if (from === to) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      shownRef.current = to;
      setShown(to);
      return;
    }
    const start = performance.now();
    const duration = from === 0 ? 1200 : 600;
    let frame = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const value = Math.round(from + (to - from) * (1 - Math.pow(1 - t, 3)));
      shownRef.current = value;
      setShown(value);
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [usage]);

  if (!usage || usage.total <= 0) return null;
  const live = usage.sources.some((s) => s.live);
  const apps = usage.sources.filter((s) => s.value > 0).length;

  return (
    <div className="usage" title={usage.sources.map((s) => `${s.name}: ${s.value.toLocaleString("en-US")}${s.live ? "" : " (last count)"}`).join("\n")}>
      <span className={`pulse${live ? " on" : ""}`} aria-hidden="true" />
      <b aria-live="polite">{shown.toLocaleString("en-US")}</b>
      <span>
        {usage.label}
        {apps > 1 ? ` across ${apps} apps` : ""}
      </span>
    </div>
  );
}
