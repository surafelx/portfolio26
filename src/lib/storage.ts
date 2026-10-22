import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * Where the Abro API's saves go (carried over from portfolio26).
 * - "github": GITHUB_TOKEN + GITHUB_REPO are set. Each save is a commit; Vercel redeploys on push.
 * - "local":  running on your own machine. Saves write straight to the files in this folder.
 * - "readonly": deployed on Vercel without GitHub settings. Vercel's disk is read-only, so saving is off.
 */
export type StorageMode = "github" | "local" | "readonly";

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
    "User-Agent": "surafelyimam-site",
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

/** Read a JSON file in the repo: the latest commit when GitHub is set up, else the local folder. */
export async function readJsonFile<T>(relative: string, fallback: T): Promise<T> {
  const g = github();
  try {
    if (g) {
      const file = await ghRead(g, relative);
      return file ? (JSON.parse(Buffer.from(file.content, "base64").toString("utf8")) as T) : fallback;
    }
    return JSON.parse(await fs.readFile(path.join(process.cwd(), relative), "utf8")) as T;
  } catch {
    return fallback;
  }
}

/** Write any file in the repo: a commit in "github" mode, a local write in "local" mode. */
export async function writeRepoFile(relative: string, bytes: Buffer, message: string): Promise<StorageMode> {
  const mode = storageMode();
  if (mode === "github") await ghWrite(github()!, relative, bytes.toString("base64"), message);
  else if (mode === "local") {
    const full = path.join(process.cwd(), relative);
    await fs.mkdir(path.dirname(full), { recursive: true });
    await fs.writeFile(full, bytes);
  } else throw new Error("Saving is off on this deployment. Add GITHUB_TOKEN and GITHUB_REPO in your Vercel project settings, then redeploy.");
  return mode;
}
