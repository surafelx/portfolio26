"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { profile } from "@/content/site";
import { FADE_KEY, FADER_ON, sideFor, applyFade } from "@/content/fade";
import { onSoundChange, stopAllSound } from "./playground/sound-bus";

/** The notch hanging from the top bar on every page: the time where I am, and the crossfader between the engineer and the artist. */
export function Booth() {
  const path = usePathname();
  const [fade, setFade] = useState<number | null>(null);
  const [time, setTime] = useState("");
  const [sound, setSound] = useState(false);

  // Whenever something is playing, the booth offers a way to stop it, and Escape works from anywhere
  useEffect(() => {
    const off = onSoundChange(setSound);
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") stopAllSound();
    };
    window.addEventListener("keydown", key);
    return () => {
      off();
      window.removeEventListener("keydown", key);
    };
  }, []);

  // The head script has already set --fade before paint; read it back so the slider matches.
  useEffect(() => {
    const v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--fade"));
    setFade(Number.isFinite(v) ? v : 0.2);
  }, []);

  // The work page is for people hiring, so it always opens on the engineer.
  useEffect(() => {
    if (path === "/work") move(0);
  }, [path]);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: profile.timeZone });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  function move(v: number) {
    setFade(v);
    applyFade(v);
    try {
      localStorage.setItem(FADE_KEY, String(v));
    } catch {}
  }

  const side = fade === null ? null : sideFor(fade);

  // With the fader switched off, the notch only appears while something is playing, to stop it
  if (!FADER_ON) {
    return sound ? (
      <div className="booth sound-only" role="region" aria-label="Sound">
        <button type="button" className="stop-sound" onClick={stopAllSound} title="Stop the music (Esc)">
          <span aria-hidden="true">■</span> STOP SOUND
        </button>
      </div>
    ) : null;
  }

  return (
    <div className={`booth${sound ? " has-sound" : ""}`} role="region" aria-label="Crossfader">
      <div className="clock">
        <b suppressHydrationWarning>{time || "--:--"}</b>
        <span>ADDIS</span>
      </div>
      <div className="fader">
        <button type="button" className={`end${side === "engineer" ? " on" : ""}`} onClick={() => move(0)}>
          ENGINEER
        </button>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={Math.round((fade ?? 0.2) * 100)}
          onChange={(e) => move(Number(e.target.value) / 100)}
          aria-label="Slide between the engineer and the artist"
          aria-valuetext={side ?? undefined}
        />
        <button type="button" className={`end${side === "artist" ? " on" : ""}`} onClick={() => move(1)}>
          ARTIST
        </button>
      </div>
      {sound && (
        <button type="button" className="stop-sound" onClick={stopAllSound} title="Stop the music (Esc)">
          <span aria-hidden="true">■</span> STOP SOUND
        </button>
      )}
    </div>
  );
}
