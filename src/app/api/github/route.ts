import { NextResponse } from "next/server";
import { site } from "@/lib/content";

/**
 * Recent GitHub activity for the Right now panel.
 * With GITHUB_TOKEN set it asks GitHub's GraphQL API for commit contributions over the last 30 days,
 * which includes private repositories (their names stay hidden). Without a token it falls back to the
 * public events feed, which only shows pushes to public repositories. Cached for ten minutes.
 */
export type Activity = {
  user: string;
  days: number;
  /** Commits in the window, or null when only pushes are known. */
  commits: number | null;
  pushes: number;
  repos: number;
  latest: { repo: string; url: string; at: string; isPrivate: boolean } | null;
  source: "graphql" | "events";
  updatedAt: string;
};

export const dynamic = "force-dynamic";

const DAYS = 30;
const TTL = 10 * 60 * 1000;
let cached: { at: number; result: Activity } | null = null;

const headers = (token?: string) => ({
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  "User-Agent": "surafel.work live panel",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

function username(): string {
  if (site.live.githubUser) return site.live.githubUser;
  return site.profile.githubUrl.match(/github\.com\/([^/?#]+)/)?.[1] ?? "";
}

type GraphRepo = { repository: { nameWithOwner: string; url: string; pushedAt: string; isPrivate: boolean }; contributions: { totalCount: number } };
type GraphAnswer = {
  data?: { user?: { contributionsCollection: { totalCommitContributions: number; restrictedContributionsCount: number; commitContributionsByRepository: GraphRepo[] } } };
  errors?: { message: string }[];
};

async function fromGraphql(user: string, token: string, since: Date): Promise<Activity> {
  const query = `query($login: String!, $from: DateTime!) {
    user(login: $login) {
      contributionsCollection(from: $from) {
        totalCommitContributions
        restrictedContributionsCount
        commitContributionsByRepository(maxRepositories: 100) {
          repository { nameWithOwner url pushedAt isPrivate }
          contributions { totalCount }
        }
      }
    }
  }`;
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { ...headers(token), "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: { login: user, from: since.toISOString() } }),
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`GitHub GraphQL answered ${res.status}`);
  const body = (await res.json()) as GraphAnswer;
  const c = body.data?.user?.contributionsCollection;
  if (!c) throw new Error(body.errors?.[0]?.message ?? "No contributions in the answer");
  const repos = c.commitContributionsByRepository;
  const latestRepo = repos.slice().sort((a, b) => b.repository.pushedAt.localeCompare(a.repository.pushedAt))[0]?.repository ?? null;
  return {
    user,
    days: DAYS,
    commits: c.totalCommitContributions + c.restrictedContributionsCount,
    pushes: repos.reduce((sum, r) => sum + r.contributions.totalCount, 0),
    repos: repos.length,
    latest: latestRepo
      ? {
          repo: latestRepo.isPrivate ? "a private repo" : latestRepo.nameWithOwner,
          url: latestRepo.isPrivate ? "" : latestRepo.url,
          at: latestRepo.pushedAt,
          isPrivate: latestRepo.isPrivate,
        }
      : null,
    source: "graphql",
    updatedAt: new Date().toISOString(),
  };
}

type Event = { type: string; created_at: string; repo: { name: string } };

async function fromEvents(user: string, since: Date): Promise<Activity> {
  const res = await fetch(`https://api.github.com/users/${encodeURIComponent(user)}/events/public?per_page=100`, {
    headers: headers(),
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`GitHub events answered ${res.status}`);
  const events = (await res.json()) as Event[];
  const pushes = events.filter((e) => e.type === "PushEvent" && new Date(e.created_at) >= since);
  const repos = new Set(pushes.map((e) => e.repo.name));
  const latest = pushes[0] ?? null;
  return {
    user,
    days: DAYS,
    commits: null,
    pushes: pushes.length,
    repos: repos.size,
    latest: latest ? { repo: latest.repo.name, url: `https://github.com/${latest.repo.name}`, at: latest.created_at, isPrivate: false } : null,
    source: "events",
    updatedAt: new Date().toISOString(),
  };
}

const cacheHeaders = { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600" };

export async function GET() {
  const user = username();
  if (!site.live.github || !user) return NextResponse.json({ error: "GitHub activity is off." }, { status: 404 });
  if (cached && Date.now() - cached.at < TTL) return NextResponse.json(cached.result, { headers: cacheHeaders });

  const since = new Date(Date.now() - DAYS * 86_400_000);
  const token = process.env.GITHUB_TOKEN;
  try {
    let result: Activity;
    try {
      if (!token) throw new Error("no token");
      result = await fromGraphql(user, token, since);
    } catch (error) {
      if (token) console.warn("github: GraphQL failed, using public events", error);
      result = await fromEvents(user, since);
    }
    cached = { at: Date.now(), result };
    return NextResponse.json(result, { headers: cacheHeaders });
  } catch (error) {
    console.error("github: could not load activity", error);
    if (cached) return NextResponse.json(cached.result);
    return NextResponse.json({ error: "Could not reach GitHub." }, { status: 503 });
  }
}
