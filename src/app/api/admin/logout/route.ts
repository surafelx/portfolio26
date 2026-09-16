import { NextResponse } from "next/server";
import { ADMIN_COOKIE, sameOrigin, sessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Request blocked." }, { status: 403 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, "", { ...sessionCookie, maxAge: 0 });
  return res;
}
