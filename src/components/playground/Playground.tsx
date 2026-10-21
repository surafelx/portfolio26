"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { HandNote } from "@/components/HandNote";
import { FADER_ON } from "@/content/fade";
import { Engine } from "./engine";
import { parse, PRESETS, type Pattern } from "./pattern";
import { announceSound, onStopRequest } from "./sound-bus";

const readFade = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--fade")) || 0;

/**
 * Type a pattern, hear it change on the next step. The engine is only created on the first press of Play,
 * because browsers won't start audio before someone asks for it.
 */
export function Playground() {
  const [code, setCode] = useState(PRESETS[0].code);
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState(-1);
  const pattern = useMemo(() => parse(code), [code]);

  const patternRef = useRef<Pattern>(pattern);
  const engineRef = useRef<Engine | null>(null);
  const queue = useRef<{ step: number; time: number }[]>([]);

  patternRef.current = pattern;

  // Light the step that's sounding now, not the one being queued ahead
  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    const loop = () => {
      const e = engineRef.current;
      if (e) {
        let latest = -1;
        while (queue.current.length && queue.current[0].time <= e.now) latest = queue.current.shift()!.step;
        if (latest >= 0) setStep(latest);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  // The site's crossfader is also this instrument's drive and echo
  useEffect(() => {
    const obs = new MutationObserver(() => engineRef.current?.setFade(readFade()));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["style"] });
    return () => obs.disconnect();
  }, []);

  // Sound never outlives the page: stop on the booth's Stop button, on Escape, when leaving, and on unmount
  useEffect(() => {
    const off = onStopRequest(stop);
    const hide = () => stop();
    window.addEventListener("pagehide", hide);
    return () => {
      off();
      window.removeEventListener("pagehide", hide);
      engineRef.current?.close();
      engineRef.current = null;
      announceSound(false);
    };
  }, []);

  async function play() {
    if (!engineRef.current) {
      const e = new Engine(() => patternRef.current);
      e.onStep = (s, time) => queue.current.push({ step: s, time });
      engineRef.current = e;
    }
    const e = engineRef.current;
    e.setFade(readFade());
    queue.current = [];
    await e.start();
    // Stop may have been pressed while the audio was starting up
    if (!e.playing) return;
    setPlaying(true);
    announceSound(true);
  }

  function stop() {
    engineRef.current?.stop();
    queue.current = [];
    setPlaying(false);
    setStep(-1);
    announceSound(false);
  }

  function onKey(e: React.KeyboardEvent) {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      if (!playing) void play();
    } else if ((e.ctrlKey || e.metaKey) && e.key === ".") {
      e.preventDefault();
      stop();
    }
  }

  const lines = code.split("\n").length;

  return (
    <div className="playground">
      <div className="pg-bar">
        <div className="actions">
          {playing ? (
            <button type="button" className="btn" onClick={stop}>
              ■ Stop
            </button>
          ) : (
            <button type="button" className="btn" onClick={play}>
              ▶ Play
            </button>
          )}
          <span className="pg-bpm">
            {pattern.bpm} bpm{pattern.swing ? ` · swing ${pattern.swing}` : ""}
          </span>
        </div>
        <div className="pg-presets" role="group" aria-label="Start from a pattern">
          {PRESETS.map((p) => (
            <button key={p.name} type="button" className="chip" aria-pressed={code === p.code} onClick={() => setCode(p.code)}>
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="pg-editor">
        <div className="pg-gutter" aria-hidden="true">
          {Array.from({ length: lines }, (_, i) => (
            <span key={i} className={pattern.problems.some((p) => p.line === i + 1) ? "bad" : undefined}>
              {i + 1}
            </span>
          ))}
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={onKey}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          wrap="off"
          rows={Math.max(lines, 6)}
          aria-label="Pattern code. Ctrl+Enter plays, Escape stops."
        />
      </div>

      <div className="pg-problems" aria-live="polite">
        {pattern.problems.length ? (
          pattern.problems.map((p) => (
            <p key={`${p.line}-${p.message}`}>
              <b>line {p.line}</b> {p.message}. The other lines keep playing.
            </p>
          ))
        ) : (
          <p className="ok">Ctrl+Enter plays. Esc stops it from anywhere on the site. Change anything while it plays.</p>
        )}
      </div>

      <div className="pg-grid" aria-hidden="true">
        {pattern.tracks.map((t) => {
          const now = step >= 0 ? step % t.steps.length : -1;
          return (
            <div key={t.line} className="pg-row">
              <span className="pg-name">{t.sound}</span>
              <span className="pg-cells" style={{ gridTemplateColumns: `repeat(${t.steps.length}, minmax(0, 1fr))` }}>
                {t.steps.map((s, i) => (
                  <span key={i} className={`pg-cell${s ? (s.gain >= 1 ? " hit loud" : " hit") : ""}${i === now ? " now" : ""}`} />
                ))}
              </span>
            </div>
          );
        })}
      </div>

      {FADER_ON && (
        <HandNote arrow="up" className="pg-note">
          the fader up top is your drive and echo
        </HandNote>
      )}
    </div>
  );
}
