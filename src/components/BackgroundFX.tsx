"use client";
import { useEffect } from "react";

/**
 * Subtle, interactive animated background. Two soft gradient blobs drift on
 * their own and gently follow the pointer (parallax). Respects reduced motion.
 */
export const BackgroundFX = () => {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * 40; // ±20px
        const y = (e.clientY / window.innerHeight - 0.5) * 40;
        document.documentElement.style.setProperty("--bgx", `${x}px`);
        document.documentElement.style.setProperty("--bgy", `${y}px`);
      });
    };

    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div className="bg-fx" aria-hidden="true" />;
};
