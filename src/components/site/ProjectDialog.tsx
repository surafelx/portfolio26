"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { Project } from "@/lib/schema";
import { githubRepo, stackList, videoEmbed } from "@/lib/project-media";
import { Markdown } from "./Markdown";

type Tab = "live" | "video" | "docs";
const TAB_LABEL: Record<Tab, string> = { live: "Live app", video: "Video", docs: "Docs" };

function tabsFor(p: Project): Tab[] {
  const tabs: Tab[] = [];
  if (p.liveUrl) tabs.push("live");
  if (videoEmbed(p.videoUrl)) tabs.push("video");
  tabs.push("docs");
  return tabs;
}

const hostOf = (url: string) => {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
};

/* ---------------- Live app ---------------- */

function LivePanel({ project }: { project: Project }) {
  const [embed, setEmbed] = useState<"checking" | "ok" | "blocked">("checking");
  const [loaded, setLoaded] = useState(false);
  const [device, setDevice] = useState<"desktop" | "phone">("desktop");
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let alive = true;
    setEmbed("checking");
    setLoaded(false);
    fetch(`/api/projects/${project.id}/embed`)
      .then((r) => r.json() as Promise<{ embeddable?: boolean }>)
      .then((d) => alive && setEmbed(d.embeddable ? "ok" : "blocked"))
      .catch(() => alive && setEmbed("ok"));
    return () => {
      alive = false;
    };
  }, [project.id]);

  return (
    <div className="pd-live">
      <div className="pd-browser">
        <div className="pd-bar">
          <span className="pd-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="pd-url mono">{hostOf(project.liveUrl)}</span>
          {embed === "ok" && (
            <div className="pd-bar-tools">
              <div className="pd-device" role="group" aria-label="Preview width">
                <button type="button" aria-pressed={device === "desktop"} onClick={() => setDevice("desktop")}>
                  Desktop
                </button>
                <button type="button" aria-pressed={device === "phone"} onClick={() => setDevice("phone")}>
                  Phone
                </button>
              </div>
              <button
                type="button"
                className="pd-icon"
                onClick={() => {
                  setLoaded(false);
                  setReload((n) => n + 1);
                }}
                aria-label="Reload preview"
              >
                <svg viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M16 10a6 6 0 1 1-2-4.5M16 3v4h-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          )}
          <a className="pd-open" href={project.liveUrl} target="_blank" rel="noopener noreferrer">
            Open ↗
          </a>
        </div>

        <div className={`pd-stage device-${device}`}>
          {embed === "checking" && <p className="pd-status">Loading the app…</p>}
          {embed === "blocked" && (
            <div className="pd-blocked">
              {project.image && <img src={project.image} alt={`${project.name} screenshot`} />}
              <div>
                <p>{hostOf(project.liveUrl)} doesn&apos;t allow being shown inside other pages, so it opens in a new tab.</p>
                <a className="btn" href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  Open {project.name} ↗
                </a>
              </div>
            </div>
          )}
          {embed === "ok" && (
            <>
              {!loaded && project.image && <img className="pd-poster" src={project.image} alt="" aria-hidden="true" />}
              {!loaded && <p className="pd-status">Loading {hostOf(project.liveUrl)}…</p>}
              <iframe
                key={reload}
                src={project.liveUrl}
                title={`${project.name}, live preview`}
                onLoad={() => setLoaded(true)}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                referrerPolicy="strict-origin-when-cross-origin"
                allow={/webcam|camera|eye-gaze/i.test(`${project.tagline} ${project.stack}`) ? "fullscreen; clipboard-write; camera" : "fullscreen; clipboard-write"}
                className={loaded ? "is-loaded" : ""}
              />
            </>
          )}
        </div>
      </div>
      <p className="pd-hint">This is the real app running inside the page. Use it like you would in a browser tab.</p>
    </div>
  );
}

/* ---------------- Video ---------------- */

function VideoPanel({ project }: { project: Project }) {
  const video = videoEmbed(project.videoUrl);
  if (!video) return null;
  return (
    <div className="pd-video">
      {video.kind === "iframe" ? (
        <iframe src={video.src} title={`${project.name} walkthrough video`} allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowFullScreen />
      ) : (
        <video src={video.src} controls preload="metadata" poster={project.image || undefined} />
      )}
    </div>
  );
}

/* ---------------- Docs ---------------- */

function Writeup({ text }: { text: string }) {
  const blocks = text.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  return (
    <>
      {blocks.map((b, i) => {
        const lines = b.split("\n").map((l) => l.trim());
        return lines.every((l) => l.startsWith("- ")) ? (
          <ul key={i}>
            {lines.map((l) => (
              <li key={l}>{l.slice(2)}</li>
            ))}
          </ul>
        ) : (
          <p key={i}>{lines.join(" ")}</p>
        );
      })}
    </>
  );
}

function DocsPanel({ project }: { project: Project }) {
  const repo = githubRepo(project.docsUrl) ?? githubRepo(project.codeUrl);
  const [readme, setReadme] = useState<{ markdown: string; repoUrl: string; blobBase: string } | "loading" | "none">(repo ? "loading" : "none");
  const stack = stackList(project.stack);

  useEffect(() => {
    if (!repo) return;
    let alive = true;
    fetch(`/api/projects/${project.id}/readme`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => alive && setReadme(d?.markdown ? d : "none"))
      .catch(() => alive && setReadme("none"));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project.id]);

  const links = [
    project.liveUrl && { href: project.liveUrl, label: "Live app" },
    project.codeUrl && { href: project.codeUrl, label: "Source code" },
    project.docsUrl && project.docsUrl !== project.codeUrl && { href: project.docsUrl, label: "Documentation" },
    project.ctaLabel && project.ctaUrl && { href: project.ctaUrl, label: project.ctaLabel },
  ].filter(Boolean) as { href: string; label: string }[];

  return (
    <div className="pd-docs">
      <div className="pd-docs-side">
        <section>
          <h3 className="pd-h">Overview</h3>
          {project.tagline && <p className="pd-lede">{project.tagline}</p>}
          {project.details && <Writeup text={project.details} />}
        </section>
        {project.steps.length > 0 && (
          <section>
            <h3 className="pd-h">How it works</h3>
            <ol className="pd-steps">
              {project.steps.map((s) => (
                <li key={s.name}>
                  {s.name} {s.note && <span className="mono">{s.note}</span>}
                </li>
              ))}
            </ol>
          </section>
        )}
        {stack.length > 0 && (
          <section>
            <h3 className="pd-h">Built with</h3>
            <ul className="pd-chips">
              {stack.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </section>
        )}
        {links.length > 0 && (
          <section>
            <h3 className="pd-h">Links</h3>
            <ul className="pd-links">
              {links.map((l) => (
                <li key={l.href + l.label}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer">
                    {l.label} <span className="mono">{hostOf(l.href)}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {repo && (
        <section className="pd-readme" aria-label="README">
          <div className="pd-readme-head">
            <span className="mono">
              {repo.owner}/{repo.repo} · README.md
            </span>
            {typeof readme === "object" && (
              <a href={readme.repoUrl} target="_blank" rel="noopener noreferrer">
                View on GitHub ↗
              </a>
            )}
          </div>
          {readme === "loading" && <p className="pd-status">Loading the README…</p>}
          {readme === "none" && <p className="pd-status">The README isn&apos;t public yet.</p>}
          {typeof readme === "object" && <Markdown source={readme.markdown} linkBase={readme.blobBase} />}
        </section>
      )}
    </div>
  );
}

/* ---------------- Dialog ---------------- */

export function ProjectDialog({ projects }: { projects: Project[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [tab, setTab] = useState<Tab>("docs");
  const titleId = useId();

  const open = useCallback(
    (id: string, from: HTMLElement) => {
      const p = projects.find((x) => x.id === id);
      if (!p) return;
      trigger.current = from;
      setProject(p);
      setTab(tabsFor(p)[0]);
      document.documentElement.classList.add("dialog-open");
      if (!dialog.current?.open) dialog.current?.showModal();
    },
    [projects],
  );

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const target = e.target as HTMLElement;
      const button = target.closest<HTMLElement>("[data-open-project]");
      if (button) {
        e.preventDefault();
        open(button.dataset.openProject!, button);
        return;
      }
      const card = target.closest<HTMLElement>("[data-project-card]");
      if (card && !target.closest("a, button")) open(card.dataset.projectCard!, card);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [open]);

  // Cleanup runs directly on every way of closing (button, backdrop, Escape), because the dialog's own "close" event is
  // queued and can arrive late, and a missed cleanup would leave the page unscrollable. It's safe to run twice.
  const cleanup = useCallback(() => {
    if (!document.documentElement.classList.contains("dialog-open")) return;
    document.documentElement.classList.remove("dialog-open");
    setProject(null);
    trigger.current?.focus();
  }, []);

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    const onCancel = (e: Event) => {
      e.preventDefault();
      el.close();
      cleanup();
    };
    el.addEventListener("cancel", onCancel);
    el.addEventListener("close", cleanup);
    return () => {
      el.removeEventListener("cancel", onCancel);
      el.removeEventListener("close", cleanup);
    };
  }, [cleanup]);

  const close = () => {
    dialog.current?.close();
    cleanup();
  };
  const tabs = project ? tabsFor(project) : [];

  function onTabKey(e: React.KeyboardEvent) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const next = tabs[(tabs.indexOf(tab) + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
    setTab(next);
    (e.currentTarget.querySelector(`[data-tab="${next}"]`) as HTMLElement | null)?.focus();
  }

  return (
    <dialog
      ref={dialog}
      className="pd"
      aria-labelledby={titleId}
      onClick={(e) => {
        if (e.target === dialog.current) close();
      }}
    >
      {project && (
        <div className="pd-inner">
          <header className="pd-head">
            <div className="pd-title">
              {project.label && <span className="label">{project.label}</span>}
              <h2 id={titleId}>{project.name}</h2>
            </div>
            <div className="pd-tabs" role="tablist" aria-label="Project views" onKeyDown={onTabKey}>
              {tabs.map((t) => (
                <button
                  key={t}
                  type="button"
                  role="tab"
                  data-tab={t}
                  id={`${titleId}-tab-${t}`}
                  aria-selected={tab === t}
                  aria-controls={`${titleId}-panel`}
                  tabIndex={tab === t ? 0 : -1}
                  className="pd-tab"
                  onClick={() => setTab(t)}
                >
                  {TAB_LABEL[t]}
                </button>
              ))}
            </div>
            <button type="button" className="pd-close" onClick={close} aria-label="Close">
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path d="M5 5l10 10M15 5L5 15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </header>
          <div className="pd-body" role="tabpanel" id={`${titleId}-panel`} aria-labelledby={`${titleId}-tab-${tab}`}>
            {tab === "live" && <LivePanel key={project.id} project={project} />}
            {tab === "video" && <VideoPanel project={project} />}
            {tab === "docs" && <DocsPanel key={project.id} project={project} />}
          </div>
        </div>
      )}
    </dialog>
  );
}
