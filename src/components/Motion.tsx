"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** What eases in as it scrolls into view. Cards and list rows stagger with their siblings. */
const TARGETS = [
  ".section-head",
  ".page-head > .wrap > *",
  ".card",
  ".panel",
  ".stats > div",
  ".timeline li",
  ".skills > div",
  ".quotes figure",
  ".essay-list li",
  ".about-block > *",
  ".contact",
  ".playground",
  ".map-canvas",
  ".map-list > div",
  ".section-title",
].join(",");

/**
 * Scroll-in transitions for every page, and a short fade when moving between pages.
 * Only things below the fold are hidden first, so nothing on screen ever blinks, and nothing is hidden
 * at all without JavaScript or for anyone who has asked for less motion.
 */
export function Motion({ children }: { children: React.ReactNode }) {
  const path = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const els = [...document.querySelectorAll<HTMLElement>(TARGETS)].filter((el) => !el.closest(".dock, .gaze-ui"));
    let pending: HTMLElement[] = [];
    els.forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;
      // Stagger siblings: the third card in a row arrives a beat after the first
      const i = el.parentElement ? [...el.parentElement.children].indexOf(el) : 0;
      el.style.setProperty("--stagger", `${Math.min(i % 4, 3) * 80}ms`);
      el.classList.add("reveal");
      pending.push(el);
    });

    // Anything that has reached the viewport, or been jumped past, comes in. Checked once per frame at most.
    let queued = false;
    const check = () => {
      queued = false;
      const line = window.innerHeight * 0.92;
      pending = pending.filter((el) => {
        if (el.getBoundingClientRect().top > line) return true;
        el.classList.add("in");
        return false;
      });
      if (!pending.length) stop();
    };
    const onScroll = () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(check);
      }
    };
    const stop = () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return stop;
  }, [path]);

  return (
    <div key={path} className="page-enter">
      {children}
    </div>
  );
}
