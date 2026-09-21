/** Helpers for the project dialog. Safe to import from client and server code. */

export type VideoEmbed = { kind: "iframe"; src: string } | { kind: "file"; src: string };

/** Turns a YouTube, Vimeo or Loom link into an embeddable player URL, or accepts a direct video file. */
export function videoEmbed(raw: string): VideoEmbed | null {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;
  const host = url.hostname.replace(/^www\./, "");

  if (host === "youtube.com" || host === "m.youtube.com" || host === "youtu.be") {
    const id = host === "youtu.be" ? url.pathname.slice(1) : url.pathname.startsWith("/shorts/") || url.pathname.startsWith("/embed/") ? url.pathname.split("/")[2] : url.searchParams.get("v");
    return id && /^[\w-]{6,20}$/.test(id) ? { kind: "iframe", src: `https://www.youtube-nocookie.com/embed/${id}?rel=0` } : null;
  }
  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const id = url.pathname.split("/").filter(Boolean).find((p) => /^\d+$/.test(p));
    return id ? { kind: "iframe", src: `https://player.vimeo.com/video/${id}` } : null;
  }
  if (host === "loom.com") {
    const id = url.pathname.split("/").filter(Boolean)[1];
    return id && /^[\w-]{8,64}$/.test(id) ? { kind: "iframe", src: `https://www.loom.com/embed/${id}` } : null;
  }
  if (/\.(mp4|webm|mov)$/i.test(url.pathname)) return { kind: "file", src: url.toString() };
  return null;
}

/** owner/repo from a github.com URL, or null. */
export function githubRepo(raw: string): { owner: string; repo: string } | null {
  try {
    const url = new URL(raw.trim());
    if (url.hostname !== "github.com") return null;
    const [owner, repo] = url.pathname.split("/").filter(Boolean);
    if (!owner || !repo || !/^[\w.-]+$/.test(owner) || !/^[\w.-]+$/.test(repo)) return null;
    return { owner, repo: repo.replace(/\.git$/, "") };
  } catch {
    return null;
  }
}

export const stackList = (stack: string) =>
  stack
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 16);
