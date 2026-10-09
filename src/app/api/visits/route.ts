import { NextResponse } from "next/server";
import { site } from "@/lib/content";
import { readVisits, recordVisit } from "@/lib/visits";

export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store" };
const BOT = /bot|crawl|spider|slurp|preview|lighthouse|headless|monitor|fetch|curl|wget/i;

/** The visitor count so far. */
export async function GET() {
  if (!site.live.visitors) return NextResponse.json({ error: "The visitor count is off." }, { status: 404, headers: noStore });
  try {
    return NextResponse.json(await readVisits(), { headers: noStore });
  } catch (error) {
    console.error("visits: could not read", error);
    return NextResponse.json({ error: "Could not read the count." }, { status: 503, headers: noStore });
  }
}

/** Counts one visit. The browser calls this once per session; crawlers are not counted. */
export async function POST(request: Request) {
  if (!site.live.visitors) return NextResponse.json({ error: "The visitor count is off." }, { status: 404, headers: noStore });
  try {
    const agent = request.headers.get("user-agent") || "";
    const visits = agent && !BOT.test(agent) ? await recordVisit() : await readVisits();
    return NextResponse.json(visits, { headers: noStore });
  } catch (error) {
    console.error("visits: could not record", error);
    return NextResponse.json({ error: "Could not record the visit." }, { status: 503, headers: noStore });
  }
}
