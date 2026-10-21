"use client";

import { useEffect, useRef, useState } from "react";
import { features, fit, OneEuro, predict, type Mode, type Model, type Point } from "./model";
import { Tracker } from "./tracker";

export const OPEN_EYE_MODE = "eye-mode-open";

const DWELL_MS = 1300;
const SETTLE_MS = 550; // after a calibration dot appears, before measuring: eyes take time to land
const SAMPLE_MS = 1000;
const GRACE_MS = 250; // a flicker off a target doesn't reset its dwell
const MAGNET_PX = 64; // a look this close to something clickable counts as looking at it
const CLICKABLE = "a[href], button, [role='button'], input, select, textarea, summary, label[for]";

type Phase = "off" | "intro" | "loading" | "calibrating" | "on" | "error";

/** Nine targets, inset from the edges so nobody has to strain for a corner. */
function calibrationTargets(): Point[] {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const xs = [0.1, 0.5, 0.9].map((f) => f * w);
  const ys = [0.12, 0.5, 0.86].map((f) => f * h);
  // Snake order, so the eyes never jump across the whole screen
  return ys.flatMap((y, row) => (row % 2 ? [...xs].reverse() : xs).map((x) => ({ x, y })));
}

function clickableNear(p: Point): HTMLElement | null {
  // The pointer itself ignores the mouse, so it's never in the way here; the eye-mode bar's own
  // buttons stay reachable, so someone using only their eyes can stop it too.
  const hit = document.elementFromPoint(p.x, p.y)?.closest<HTMLElement>(CLICKABLE);
  if (hit) return hit;
  let best: HTMLElement | null = null;
  let bestD = MAGNET_PX;
  document.querySelectorAll<HTMLElement>(CLICKABLE).forEach((el) => {
    const r = el.getBoundingClientRect();
    if (!r.width || r.bottom < 0 || r.top > window.innerHeight) return;
    const dx = Math.max(r.left - p.x, 0, p.x - r.right);
    const dy = Math.max(r.top - p.y, 0, p.y - r.bottom);
    const d = Math.hypot(dx, dy);
    if (d < bestD) {
      bestD = d;
      best = el;
    }
  });
  return best;
}

/**
 * Browse the site by looking: hold your gaze on a link or button and it clicks; look at the top or
 * bottom edge to scroll. Opened from the footer. Escape, or the Stop button, turns the camera off.
 */
export function EyeMode() {
  const [phase, setPhase] = useState<Phase>("off");
  const [mode, setMode] = useState<Mode>("head");
  const [message, setMessage] = useState("");
  const [dot, setDot] = useState<{ p: Point; progress: number; index: number } | null>(null);
  const [lost, setLost] = useState(false);

  const tracker = useRef<Tracker | null>(null);
  const model = useRef<Model | null>(null);
  const pointerEl = useRef<HTMLDivElement>(null);
  const ringEl = useRef<SVGCircleElement>(null);
  const run = useRef(0); // bumped to cancel whatever loop is running

  useEffect(() => {
    const open = () => setPhase((p) => (p === "off" || p === "error" ? "intro" : p));
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") stop();
    };
    window.addEventListener(OPEN_EYE_MODE, open);
    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener(OPEN_EYE_MODE, open);
      window.removeEventListener("keydown", key);
      stop();
    };
  }, []);

  function stop() {
    run.current++;
    tracker.current?.stop();
    tracker.current = null;
    document.querySelectorAll(".gaze-target").forEach((el) => el.classList.remove("gaze-target"));
    setDot(null);
    setPhase("off");
  }

  async function begin() {
    setPhase("loading");
    try {
      const t = new Tracker();
      await t.start(setMessage);
      tracker.current = t;
      await calibrate();
    } catch (err) {
      tracker.current?.stop();
      tracker.current = null;
      const name = (err as Error)?.name;
      setMessage(
        name === "NotAllowedError"
          ? "The camera wasn't allowed. You can allow it in the browser's address bar and try again."
          : name === "NotFoundError"
            ? "No camera found on this device."
            : (err as Error)?.message || "Something went wrong starting the camera.",
      );
      setPhase("error");
    }
  }

  async function calibrate() {
    const id = ++run.current;
    const t = tracker.current!;
    setPhase("calibrating");
    const xs: number[][] = [];
    const ys: Point[] = [];
    const groups: number[] = [];
    const targets = calibrationTargets();

    for (let i = 0; i < targets.length; i++) {
      const p = targets[i];
      setDot({ p, progress: 0, index: i });
      const shownAt = performance.now();
      let measured = 0;
      // Wait for the eyes to land, then gather a second of readings while the face is visible
      while (measured < SAMPLE_MS) {
        await new Promise(requestAnimationFrame);
        if (run.current !== id) return;
        const now = performance.now();
        const r = t.read(now);
        setLost(!r.ok);
        if (now - shownAt < SETTLE_MS || !r.ok) continue;
        xs.push(features(mode, r.pose, r.landmarks, r.blend));
        ys.push(p);
        groups.push(i);
        measured += 16;
        setDot({ p, progress: Math.min(measured / SAMPLE_MS, 1), index: i });
      }
    }
    setDot(null);

    const m = fit(mode, xs, ys, groups);
    if (!m || m.errorPx > Math.min(window.innerWidth, window.innerHeight) * 0.3) {
      setMessage("That calibration was too unsteady to trust. More light on your face usually fixes it, then try again.");
      setPhase("error");
      tracker.current?.stop();
      tracker.current = null;
      return;
    }
    model.current = m;
    setPhase("on");
    point(id);
  }

  /** The pointing loop: read the face, place the pointer, dwell to click, look at the edges to scroll. */
  function point(id: number) {
    const fx = new OneEuro();
    const fy = new OneEuro();
    let target: HTMLElement | null = null;
    let since = 0;
    let away = 0;
    let locked: HTMLElement | null = null;

    const setTarget = (el: HTMLElement | null, now: number) => {
      if (el === target) return;
      target?.classList.remove("gaze-target");
      target = el;
      target?.classList.add("gaze-target");
      since = now;
    };

    const frame = () => {
      if (run.current !== id) return;
      const now = performance.now();
      const r = tracker.current?.read(now);
      const pointer = pointerEl.current;
      const ring = ringEl.current;
      if (!r?.ok || !model.current || !pointer || !ring) {
        // No face: stop guessing rather than click something by accident
        setLost(true);
        pointer?.classList.add("lost");
        setTarget(null, now);
        requestAnimationFrame(frame);
        return;
      }
      setLost(false);
      pointer.classList.remove("lost");

      const raw = predict(model.current, features(model.current.mode, r.pose, r.landmarks, r.blend));
      const p = {
        x: Math.max(0, Math.min(window.innerWidth, fx.apply(raw.x, now))),
        y: Math.max(0, Math.min(window.innerHeight, fy.apply(raw.y, now))),
      };
      pointer.style.transform = `translate(${p.x}px, ${p.y}px)`;

      const near = clickableNear(p);
      if (locked && near !== locked) locked = null;
      if (near && near !== locked) {
        away = 0;
        setTarget(near, near === target ? since : now);
      } else if (target) {
        // A brief look away keeps the dwell; a long one lets go
        away ||= now;
        if (now - away > GRACE_MS) setTarget(null, now);
      }

      const progress = target ? Math.min((now - since) / DWELL_MS, 1) : 0;
      ring.style.strokeDashoffset = String(100 - progress * 100);
      if (target && progress >= 1) {
        const el = target;
        setTarget(null, now);
        locked = el; // look away before it can click again
        el.focus({ preventScroll: true });
        el.click();
      }

      // The top and bottom edges scroll, unless you're dwelling on something there
      if (!target) {
        const h = window.innerHeight;
        if (p.y < h * 0.07) window.scrollBy(0, -9);
        else if (p.y > h * 0.93) window.scrollBy(0, 9);
      }
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }

  if (phase === "off") return null;

  return (
    <div className="gaze-ui">
      {(phase === "intro" || phase === "loading" || phase === "error") && (
        <div className="gaze-backdrop" role="dialog" aria-modal="true" aria-labelledby="gaze-title">
          <div className="gaze-panel panel">
            <p className="label">Eye mode</p>
            <h2 id="gaze-title">Browse this site by looking.</h2>
            {phase === "intro" && (
              <>
                <p>
                  This is how <strong>Dimtse</strong> lets a child who can&rsquo;t speak or point choose with their eyes
                  or head. Hold your gaze on a link and it opens. Look at the top or bottom edge to scroll.
                </p>
                <p className="gaze-privacy">
                  Your camera stays on your device. Nothing is recorded or sent anywhere, and it turns off the moment
                  you press Stop or Escape.
                </p>
                <fieldset className="gaze-modes">
                  <legend>Point with</legend>
                  <label>
                    <input type="radio" name="gaze-mode" checked={mode === "head"} onChange={() => setMode("head")} />
                    <span>
                      <b>Your head</b> the steadiest; small nods and turns move the pointer
                    </span>
                  </label>
                  <label>
                    <input type="radio" name="gaze-mode" checked={mode === "eyes"} onChange={() => setMode("eyes")} />
                    <span>
                      <b>Your eyes and head</b> less moving, needs good light
                    </span>
                  </label>
                </fieldset>
                <p className="gaze-hint">First, about 15 seconds of calibration: follow the dot with your eyes (or nose).</p>
                <div className="actions">
                  <button type="button" className="btn" onClick={begin}>
                    Turn on the camera
                  </button>
                  <button type="button" className="btn line" onClick={stop}>
                    Not now
                  </button>
                </div>
              </>
            )}
            {phase === "loading" && <p aria-live="polite">{message}</p>}
            {phase === "error" && (
              <>
                <p role="alert">{message}</p>
                <div className="actions">
                  <button type="button" className="btn" onClick={() => setPhase("intro")}>
                    Try again
                  </button>
                  <button type="button" className="btn line" onClick={stop}>
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {phase === "calibrating" && (
        <div className="gaze-calibrate" aria-live="polite">
          <p className="gaze-calibrate-text">
            {lost ? "I can't see your face. Move into the light, facing the screen." : `Look at the dot · ${(dot?.index ?? 0) + 1} of 9`}
          </p>
          {dot && (
            <span
              className="gaze-dot"
              style={{ left: dot.p.x, top: dot.p.y, transform: `translate(-50%, -50%) scale(${1 - dot.progress * 0.55})` }}
            />
          )}
          <button type="button" className="btn line gaze-cancel" onClick={stop}>
            Stop (Esc)
          </button>
        </div>
      )}

      {phase === "on" && (
        <>
          <div ref={pointerEl} className="gaze-pointer" aria-hidden="true">
            <svg viewBox="0 0 40 40">
              <circle className="track" cx="20" cy="20" r="16" pathLength={100} />
              <circle ref={ringEl} className="fill" cx="20" cy="20" r="16" pathLength={100} strokeDasharray="100" strokeDashoffset="100" />
            </svg>
          </div>
          <div className="gaze-bar" role="region" aria-label="Eye mode">
            <span className={`gaze-live${lost ? " lost" : ""}`} aria-hidden="true" />
            <span>{lost ? "Looking for your face…" : "Eye mode on"}</span>
            <button type="button" onClick={() => tracker.current && calibrate()}>
              Recalibrate
            </button>
            <button type="button" className="stop" onClick={stop}>
              ■ Stop (Esc)
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/** The footer's way in. */
export function EyeModeButton({ className = "" }: { className?: string }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event(OPEN_EYE_MODE))}>
      Try browsing with your eyes
    </button>
  );
}
