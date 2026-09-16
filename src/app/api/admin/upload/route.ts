import { NextResponse } from "next/server";
import { isAdmin, sameOrigin } from "@/lib/auth";
import { writeUpload } from "@/lib/storage";

const TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};
const MAX_BYTES = 3 * 1024 * 1024;

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Request blocked." }, { status: 403 });
  if (!(await isAdmin())) return NextResponse.json({ error: "Sign in first." }, { status: 401 });

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Choose an image to upload." }, { status: 400 });

  const ext = TYPES[file.type];
  if (!ext) return NextResponse.json({ error: "Use a JPG, PNG, WebP or AVIF image." }, { status: 415 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "That image is over 3 MB. Resize it and try again." }, { status: 413 });

  const base =
    file.name
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) || "image";
  const fileName = `${base}-${Date.now().toString(36)}.${ext}`;

  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    const { url, mode } = await writeUpload(fileName, bytes);
    return NextResponse.json({ ok: true, url, mode });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Upload failed." }, { status: 500 });
  }
}
