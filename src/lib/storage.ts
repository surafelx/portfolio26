import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * Where admin saves go.
 * - "github": GITHUB_TOKEN + GITHUB_REPO are set. Each save is a commit; Vercel redeploys on push.
 * - "local":  running on your own machine. Saves write straight to the files in this folder.
 * - "readonly": deployed on Vercel without GitHub settings. Vercel's disk is read-only, so saving is off.
 */
export type StorageMode = "github" | "local" | "readonly";

const CONTENT_PATH = "content/site.json";

type GitHub = { token: string; repo: string; branch: string };

function github(): GitHub | null {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  if (!token || !repo) return null;
  return { token, repo, branch: process.env.GITHUB_BRANCH || "main" };
}

export function storageMode(): StorageMode {
  if (github()) return "github";
  if (process.env.VERCEL) return "readonly";
  return "local";
}

function ghHeaders(g: GitHub) {
  return {
    Authorization: `Bearer ${g.token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "surafel-site-admin",
  };
}

async function ghRead(g: GitHub, filePath: string): Promise<{ sha: string; content: string } | null> {
  const res = await fetch(`https://api.github.com/repos/${g.repo}/contents/${filePath}?ref=${encodeURIComponent(g.branch)}`, {
    headers: ghHeaders(g),
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub could not read ${filePath} (${res.status}). Check GITHUB_TOKEN and GITHUB_REPO.`);
  return (await res.json()) as { sha: string; content: string };
}

async function ghWrite(g: GitHub, filePath: string, base64: string, message: string): Promise<void> {
  const existing = await ghRead(g, filePath);
  const res = await fetch(`https://api.github.com/repos/${g.repo}/contents/${filePath}`, {
    method: "PUT",
    headers: { ...ghHeaders(g), "Content-Type": "application/json" },
    body: JSON.stringify({ message, content: base64, branch: g.branch, sha: existing?.sha }),
  });
  if (!res.ok) {
    const detail = (await res.text()).slice(0, 200);
    throw new Error(`GitHub rejected the save (${res.status}). ${detail}`);
  }
}

export async function readContent(): Promise<unknown> {
  const g = github();
  if (g) {
    const file = await ghRead(g, CONTENT_PATH);
    if (file) return JSON.parse(Buffer.from(file.content, "base64").toString("utf8"));
  }
  const text = await fs.readFile(path.join(process.cwd(), CONTENT_PATH), "utf8");
  return JSON.parse(text);
}

export async function writeContent(data: unknown): Promise<StorageMode> {
  const json = JSON.stringify(data, null, 2) + "\n";
  const mode = storageMode();
  if (mode === "github") {
    await ghWrite(github()!, CONTENT_PATH, Buffer.from(json).toString("base64"), "Update site content from admin");
  } else if (mode === "local") {
    await fs.writeFile(path.join(process.cwd(), CONTENT_PATH), json, "utf8");
  } else {
    throw new Error("Saving is off on this deployment. Add GITHUB_TOKEN and GITHUB_REPO in your Vercel project settings, then redeploy.");
  }
  return mode;
}

export async function writeUpload(fileName: string, bytes: Buffer): Promise<{ mode: StorageMode; url: string }> {
  const mode = storageMode();
  const relative = `public/uploads/${fileName}`;
  if (mode === "github") {
    await ghWrite(github()!, relative, bytes.toString("base64"), `Upload ${fileName} from admin`);
  } else if (mode === "local") {
    const dir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, fileName), bytes);
  } else {
    throw new Error("Uploads are off on this deployment. Add GITHUB_TOKEN and GITHUB_REPO in your Vercel project settings.");
  }
  return { mode, url: `/uploads/${fileName}` };
}
