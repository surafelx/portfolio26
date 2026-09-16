"use client";

import { useEffect, useRef } from "react";
import type { Site } from "@/lib/schema";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Header({ site }: { site: Site }) {
  const bar = useRef<HTMLDivElement>(null);
  const { profile, headerStats, settings } = site;

  useEffect(() => {
    if (!settings.showProgress) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${ratio})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [settings.showProgress]);

  return (
    <header className="header">
      <div className="container bar">
        <a className="brand" href="#hero" aria-label={`${profile.shortName}, back to top`}>
          <span className="dot" aria-hidden="true" />
          {profile.shortName}
        </a>
        {headerStats.length > 0 && (
          <ul className="hstats" aria-label="At a glance">
            {headerStats.map((s) => (
              <li key={`${s.value}-${s.label}`}>
                <b>{s.value}</b>
                <span>{s.label}</span>
              </li>
            ))}
          </ul>
        )}
        <span className="spacer" />
        <div className="tools">
          <ThemeToggle />
          {profile.bookingUrl && (
            <a className="btn sm cta" href={profile.bookingUrl}>
              Book a call
            </a>
          )}
        </div>
      </div>
      {settings.showProgress && <div className="progress" ref={bar} aria-hidden="true" />}
    </header>
  );
}
