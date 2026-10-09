import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * The visitor counter. One count per browser session, kept as a running total and a per-day tally.
 * Where it is stored, in order of preference:
 * - "redis":  UPSTASH_REDIS_REST_URL + _TOKEN (or Vercel's KV_REST_API_URL + _TOKEN) are set. Survives deploys.
 * - "file":   running on your own machine. data/visits.json, which is not committed.
 * - "memory": deployed without Redis. Counts since the server last started, and resets on each deploy.
 * No IP addresses or user agents are stored anywhere.
 */
export type Visits = { total: number; today: number; day: string; mode: VisitsMode };
export type VisitsMode = "redis" | "file" | "memory";

const FILE = path.join(process.cwd(), "data", "visits.json");
const KEEP_DAYS = 3;

type Store = { total: number; days: Record<string, number> };
let memory: Store = { total: 0, days: {} };

const dayKey = (d = new Date()) => d.toISOString().slice(0, 10);

function redis(): { url: string; token: string } | null {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ""), token } : null;
}

export function visitsMode(): VisitsMode {
  if (redis()) return "redis";
  if (process.env.VERCEL) return "memory";
  return "file";
}

/** Runs a few Redis commands in one round trip (Upstash's REST pipeline). */
async function pipeline(r: { url: string; token: string }, commands: (string | number)[][]): Promise<unknown[]> {
  const res = await fetch(`${r.url}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${r.token}`, "Content-Type": "application/json" },
    body: JSON.stringify(commands),
    cache: "no-store",
    signal: AbortSignal.timeout(4000),
  });
  if (!res.ok) throw new Error(`Redis answered ${res.status}`);
  const rows = (await res.json()) as { result?: unknown; error?: string }[];
  return rows.map((row) => {
    if (row.error) throw new Error(row.error);
    return row.result;
  });
}

const num = (v: unknown) => (typeof v === "string" ? Number(v) : typeof v === "number" ? v : 0) || 0;

function prune(store: Store, day: string): Store {
  const keep = new Set(Array.from({ length: KEEP_DAYS }, (_, i) => dayKey(new Date(Date.now() - i * 86_400_000))));
  const days: Record<string, number> = {};
  for (const [k, v] of Object.entries(store.days)) if (keep.has(k) || k === day) days[k] = v;
  return { total: store.total, days };
}

async function readFileStore(): Promise<Store> {
  try {
    const parsed = JSON.parse(await fs.readFile(FILE, "utf8")) as Partial<Store>;
    return { total: num(parsed.total), days: parsed.days && typeof parsed.days === "object" ? parsed.days : {} };
  } catch {
    return { total: 0, days: {} };
  }
}

async function writeFileStore(store: Store): Promise<void> {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(store, null, 2) + "\n", "utf8");
}

export async function readVisits(): Promise<Visits> {
  const day = dayKey();
  const mode = visitsMode();
  if (mode === "redis") {
    const [total, today] = await pipeline(redis()!, [["GET", "visits:total"], ["GET", `visits:day:${day}`]]);
    return { total: num(total), today: num(today), day, mode };
  }
  const store = mode === "file" ? await readFileStore() : memory;
  return { total: store.total, today: store.days[day] ?? 0, day, mode };
}

export async function recordVisit(): Promise<Visits> {
  const day = dayKey();
  const mode = visitsMode();
  if (mode === "redis") {
    const [total, today] = await pipeline(redis()!, [
      ["INCR", "visits:total"],
      ["INCR", `visits:day:${day}`],
      ["EXPIRE", `visits:day:${day}`, KEEP_DAYS * 86_400],
    ]);
    return { total: num(total), today: num(today), day, mode };
  }
  if (mode === "file") {
    const store = prune(await readFileStore(), day);
    store.total += 1;
    store.days[day] = (store.days[day] ?? 0) + 1;
    await writeFileStore(store);
    return { total: store.total, today: store.days[day], day, mode };
  }
  memory = prune(memory, day);
  memory.total += 1;
  memory.days[day] = (memory.days[day] ?? 0) + 1;
  return { total: memory.total, today: memory.days[day], day, mode };
}
