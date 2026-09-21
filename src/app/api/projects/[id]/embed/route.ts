import { NextResponse } from "next/server";
import { site } from "@/lib/content";

type Result = { embeddable: boolean; reason?: string };
const cache = new Map<string, { at: number; result: Result }>();
const TTL = 60 * 60 * 1000;

/** Can this site be shown in an iframe on another origin? Reads X-Frame-Options and CSP frame-ancestors. */
function framePolicy(headers: Headers): Result {
  const xfo = headers.get("x-frame-options")?.toLowerCase().trim();
  if (xfo === "deny" || xfo === "sameorigin" || xfo?.startsWith("allow-from")) return { embeddable: false, reason: "x-frame-options" };

  const csp = headers.get("content-security-policy") ?? "";
  const directive = csp
    .split(";")
    .map((d) => d.trim().toLowerCase())
    .find((d) => d.startsWith("frame-ancestors"));
  if (directive) {
    const sources = directive.split(/\s+/).slice(1);
    const allowed = sources.some((s) => s === "*" || s === "https:" || /(^|\.)surafel\.work$/.test(s.replace(/^https?:\/\//, "").replace(/^\*\./, "")));
    if (!allowed) return { embeddable: false, reason: "frame-ancestors" };
  }
  return { embeddable: true };
}

/**
 * Only checks the live link saved for a project in the site content, never an arbitrary URL, so it can't be used to
 * make this server fetch other addresses.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = site.projects.find((p) => p.id === id && p.visible);
  if (!project?.liveUrl.startsWith("https://")) return NextResponse.json({ embeddable: false, reason: "no-live-url" }, { status: 404 });

  const cached = cache.get(project.liveUrl);
  let result = cached && Date.now() - cached.at < TTL ? cached.result : null;
  if (!result) {
    try {
      const res = await fetch(project.liveUrl, { redirect: "follow", signal: AbortSignal.timeout(9000), headers: { "User-Agent": "surafel.work preview check" } });
      result = framePolicy(res.headers);
      await res.body?.cancel();
      cache.set(project.liveUrl, { at: Date.now(), result });
    } catch {
      // Couldn't check (slow or briefly down): let the visitor's browser try the frame rather than hiding a working app.
      result = { embeddable: true, reason: "unchecked" };
    }
  }
  return NextResponse.json(result, { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } });
}
