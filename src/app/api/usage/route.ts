import { NextResponse } from "next/server";
import { site } from "@/lib/content";
import type { UsageSource } from "@/lib/schema";

type Reading = { name: string; value: number; live: boolean };
type Result = { total: number; label: string; sources: Reading[]; updatedAt: string };

const TTL = 60 * 1000;
let cached: { at: number; result: Result } | null = null;

/** Reads a number at a dotted path such as "users" or "data.activeUsers". */
function pick(body: unknown, path: string): number | null {
  let value: unknown = body;
  for (const key of (path || "users").split(".")) {
    if (!value || typeof value !== "object") return null;
    value = (value as Record<string, unknown>)[key];
  }
  const n = typeof value === "string" ? Number(value.replace(/,/g, "")) : value;
  return typeof n === "number" && Number.isFinite(n) && n >= 0 ? Math.floor(n) : null;
}

async function read(source: UsageSource): Promise<Reading> {
  // Only the endpoints saved in the site content are fetched, never a URL from the request.
  if (source.url.startsWith("https://")) {
    try {
      const res = await fetch(source.url, { signal: AbortSignal.timeout(5000), headers: { Accept: "application/json", "User-Agent": "surafel.work usage counter" }, cache: "no-store" });
      if (res.ok) {
        const value = pick(await res.json(), source.field);
        if (value !== null) return { name: source.name, value, live: true };
      }
    } catch {
      // Fall back to the saved count below.
    }
  }
  return { name: source.name, value: source.count, live: false };
}

/** The live counter: adds up the user counts each app reports, cached for a minute. */
export async function GET() {
  const { usage } = site;
  if (!usage.visible || usage.sources.length === 0) return NextResponse.json({ total: 0, label: usage.label, sources: [], updatedAt: new Date().toISOString() });

  if (!cached || Date.now() - cached.at > TTL) {
    const sources = await Promise.all(usage.sources.map(read));
    const result = { total: sources.reduce((sum, s) => sum + s.value, 0), label: usage.label, sources, updatedAt: new Date().toISOString() };
    cached = { at: Date.now(), result };
  }
  return NextResponse.json(cached.result, { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } });
}
