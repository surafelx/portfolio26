import { NextResponse } from "next/server";
import { ADMIN_COOKIE, adminConfigured, createSessionToken, passwordMatches, sameOrigin, sessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Request blocked." }, { status: 403 });
  if (!adminConfigured()) {
    return NextResponse.json({ error: "The settings page is locked. Set ADMIN_PASSWORD in your environment first." }, { status: 503 });
  }

  let password = "";
  try {
    const body = (await request.json()) as { password?: unknown };
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ error: "Send the password as JSON." }, { status: 400 });
  }

  if (!passwordMatches(password)) {
    await new Promise((r) => setTimeout(r, 600)); // slow down guessing
    return NextResponse.json({ error: "That password isn't right." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, createSessionToken(), sessionCookie);
  return res;
}
