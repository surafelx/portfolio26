import { NextResponse } from "next/server";
import { site } from "@/lib/content";
import { githubRepo } from "@/lib/project-media";

const MAX_BYTES = 80_000;

/** The README of the project's GitHub repo (docs link first, then code link). Public repos only. */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = site.projects.find((p) => p.id === id && p.visible);
  const repo = project && (githubRepo(project.docsUrl) ?? githubRepo(project.codeUrl));
  if (!repo) return NextResponse.json({ error: "No public repository for this project." }, { status: 404 });

  for (const file of ["README.md", "readme.md", "Readme.md"]) {
    try {
      const res = await fetch(`https://raw.githubusercontent.com/${repo.owner}/${repo.repo}/HEAD/${file}`, {
        signal: AbortSignal.timeout(6000),
        next: { revalidate: 3600 },
      });
      if (!res.ok) continue;
      const markdown = (await res.text()).slice(0, MAX_BYTES);
      return NextResponse.json(
        { markdown, repoUrl: `https://github.com/${repo.owner}/${repo.repo}`, blobBase: `https://github.com/${repo.owner}/${repo.repo}/blob/HEAD/` },
        { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } },
      );
    } catch {
      // try the next file name
    }
  }
  return NextResponse.json({ error: "This repository has no public README." }, { status: 404 });
}
