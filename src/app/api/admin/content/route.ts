import { NextResponse } from "next/server";
import { isAdmin, sameOrigin } from "@/lib/auth";
import { siteSchema } from "@/lib/schema";
import { readContent, storageMode, writeContent } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  try {
    const data = siteSchema.parse(await readContent());
    return NextResponse.json({ data, mode: storageMode() });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not read content." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Request blocked." }, { status: 403 });
  if (!(await isAdmin())) return NextResponse.json({ error: "Your session ended. Sign in again, then save." }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "The content wasn't valid JSON." }, { status: 400 });
  }

  const parsed = siteSchema.safeParse(body);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((issue) => ({
      path: issue.path.map(String).join("."),
      message: issue.message,
    }));
    return NextResponse.json({ error: "Some fields need fixing before this can be saved.", issues }, { status: 422 });
  }

  try {
    const mode = await writeContent(parsed.data);
    const message =
      mode === "github"
        ? "Saved to GitHub. Vercel will rebuild and the site updates in about a minute."
        : "Saved. The site has updated.";
    return NextResponse.json({ ok: true, mode, message, data: parsed.data });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Saving failed." }, { status: 500 });
  }
}
