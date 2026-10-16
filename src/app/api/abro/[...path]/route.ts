import { NextResponse } from "next/server";
import { AbroError, checkKey, deleteEntry, listEntries, patchEntry, profile, putEntry, putResume } from "@/lib/abro";

/**
 * Portfolio API for Abro: GET/PUT/PATCH/DELETE /api/abro/entries[/:id], GET /api/abro/profile,
 * PUT /api/abro/resume. Every call needs `Authorization: Bearer ABRO_API_KEY`. See src/lib/abro.ts.
 */
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ path: string[] }> };

async function handle(request: Request, ctx: Ctx, method: string) {
  try {
    checkKey(request);
    const [section, id, extra] = (await ctx.params).path ?? [];
    if (extra) throw new AbroError("Not found.", 404);
    const body = method === "GET" || method === "DELETE" ? {} : ((await request.json().catch(() => null)) as Record<string, unknown> | null);
    if (!body) throw new AbroError("The body wasn't valid JSON.");

    if (section === "entries" && !id && method === "GET") return NextResponse.json({ entries: await listEntries() });
    if (section === "entries" && id && method === "PUT") return NextResponse.json(await putEntry(id, body));
    if (section === "entries" && id && method === "PATCH") return NextResponse.json(await patchEntry(id, body));
    if (section === "entries" && id && method === "DELETE") { await deleteEntry(id); return NextResponse.json({ ok: true }); }
    if (section === "profile" && !id && method === "GET") return NextResponse.json(await profile());
    if (section === "resume" && !id && method === "PUT") return NextResponse.json(await putResume(body));
    throw new AbroError("Not found.", 404);
  } catch (error) {
    if (error instanceof AbroError) return NextResponse.json({ error: error.message }, { status: error.status });
    return NextResponse.json({ error: error instanceof Error ? error.message : "Something went wrong." }, { status: 500 });
  }
}

export const GET = (r: Request, c: Ctx) => handle(r, c, "GET");
export const PUT = (r: Request, c: Ctx) => handle(r, c, "PUT");
export const PATCH = (r: Request, c: Ctx) => handle(r, c, "PATCH");
export const DELETE = (r: Request, c: Ctx) => handle(r, c, "DELETE");
