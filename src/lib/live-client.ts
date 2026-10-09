"use client";

/**
 * Browser-side readers for the live numbers. Each result is fetched once per page and shared,
 * so the header and the Right now panel never make the same request twice.
 */
import type { Visits } from "./visits";
import type { Activity } from "@/app/api/github/route";

const SESSION_KEY = "surafel.visited";
let visitsPromise: Promise<Visits | null> | null = null;
let activityPromise: Promise<Activity | null> | null = null;

/** Counts this visit once per browser session, then returns the totals. */
export function loadVisits(): Promise<Visits | null> {
  if (!visitsPromise) {
    visitsPromise = (async () => {
      let seen = false;
      try {
        seen = sessionStorage.getItem(SESSION_KEY) === "1";
      } catch {
        // Private windows may block storage; the visit is still counted once per page load.
      }
      try {
        const res = await fetch("/api/visits", seen ? { cache: "no-store" } : { method: "POST" });
        if (!res.ok) return null;
        if (!seen) {
          try {
            sessionStorage.setItem(SESSION_KEY, "1");
          } catch {
            // Fine without it.
          }
        }
        return (await res.json()) as Visits;
      } catch {
        return null;
      }
    })();
  }
  return visitsPromise;
}

export function loadActivity(): Promise<Activity | null> {
  if (!activityPromise) {
    activityPromise = (async () => {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const res = await fetch("/api/github");
          if (res.ok) return (await res.json()) as Activity;
          if (res.status === 404) return null;
        } catch {
          // Try once more below.
        }
        await new Promise((r) => setTimeout(r, 6000));
      }
      return null;
    })();
  }
  return activityPromise;
}

/** "3h ago", "2 days ago", "just now". */
export function ago(iso: string, now = Date.now()): string {
  const s = Math.max(0, (now - new Date(iso).getTime()) / 1000);
  if (s < 90) return "just now";
  const m = s / 60;
  if (m < 60) return `${Math.round(m)} min ago`;
  const h = m / 60;
  if (h < 36) return `${Math.round(h)}h ago`;
  const d = h / 24;
  if (d < 14) return `${Math.round(d)} days ago`;
  return `${Math.round(d / 7)} weeks ago`;
}
