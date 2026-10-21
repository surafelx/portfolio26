/**
 * The playground's tiny pattern language. One line per sound, one token per step:
 *
 *   bpm 124
 *   kick  x . . . x . . .
 *   bass  a1 . a1 . c2 . e2 .
 *
 * `.` or `-` is a rest, `x` a hit, `X` a loud hit, and melodic sounds also take notes like `c3` or `f#4`.
 * Lines can be different lengths, so a 3-step line against a 4-step one drifts around it (polymeter).
 * Nothing here touches audio, so it can be checked on its own.
 */

export const DRUMS = ["kick", "snare", "hat", "clap"] as const;
export const SYNTHS = ["bass", "lead", "pluck"] as const;
export type Sound = (typeof DRUMS)[number] | (typeof SYNTHS)[number];

export type Step = null | { gain: number; freq?: number };
export type Track = { line: number; sound: Sound; steps: Step[] };
export type Problem = { line: number; message: string };
export type Pattern = { bpm: number; swing: number; tracks: Track[]; problems: Problem[] };

const SOUNDS: readonly string[] = [...DRUMS, ...SYNTHS];
const DEFAULT_NOTE: Record<string, string> = { bass: "a1", lead: "a4", pluck: "e4" };
const SEMITONE: Record<string, number> = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 };

/** `a4` → 440 Hz. Returns null for anything that isn't a note. */
export function noteFreq(token: string): number | null {
  const m = /^([a-g])([#b]?)(-?\d)$/i.exec(token);
  if (!m) return null;
  let n = SEMITONE[m[1].toLowerCase()] + (m[2] === "#" ? 1 : m[2] === "b" ? -1 : 0);
  n += (Number(m[3]) + 1) * 12; // MIDI number
  return 440 * Math.pow(2, (n - 69) / 12);
}

export function parse(source: string): Pattern {
  let bpm = 120;
  let swing = 0;
  const tracks: Track[] = [];
  const problems: Problem[] = [];

  source.split("\n").forEach((raw, i) => {
    const line = i + 1;
    const text = raw.replace(/\/\/.*$/, "").trim();
    if (!text) return;
    const [head, ...rest] = text.split(/\s+/);
    const word = head.toLowerCase();

    if (word === "bpm" || word === "swing") {
      const v = Number(rest[0]);
      const [lo, hi] = word === "bpm" ? [40, 220] : [0, 60];
      if (!Number.isFinite(v) || v < lo || v > hi) {
        problems.push({ line, message: `${word} wants a number from ${lo} to ${hi}` });
      } else if (word === "bpm") bpm = v;
      else swing = v;
      return;
    }

    if (!SOUNDS.includes(word)) {
      problems.push({ line, message: `there's no sound called "${head}". Try ${SOUNDS.join(", ")}` });
      return;
    }
    if (!rest.length) {
      problems.push({ line, message: `${word} needs some steps, like x . . .` });
      return;
    }
    if (rest.length > 32) {
      problems.push({ line, message: `${word} has ${rest.length} steps; 32 is the most` });
      return;
    }

    const melodic = (SYNTHS as readonly string[]).includes(word);
    const steps: Step[] = [];
    for (const t of rest) {
      if (t === "." || t === "-" || t === "~") {
        steps.push(null);
      } else if (t === "x" || t === "X") {
        steps.push({ gain: t === "X" ? 1 : 0.7, freq: melodic ? noteFreq(DEFAULT_NOTE[word])! : undefined });
      } else {
        const loud = t.endsWith("!");
        const f = noteFreq(loud ? t.slice(0, -1) : t);
        if (f === null) {
          problems.push({ line, message: `"${t}" isn't a step. Use x, X, . or a note like c3` });
          return;
        }
        if (!melodic) {
          problems.push({ line, message: `${word} is a drum, so it takes x and ., not notes` });
          return;
        }
        steps.push({ gain: loud ? 1 : 0.7, freq: f });
      }
    }
    tracks.push({ line, sound: word as Sound, steps });
  });

  return { bpm, swing, tracks, problems };
}

export const PRESETS: { name: string; code: string }[] = [
  {
    name: "Addis 124",
    code: `// edit anything, it plays on the next step
bpm 124
kick  X . . . x . . . X . . . x . x .
hat   . . x . . . x . . . x . . . x x
clap  . . . . x . . . . . . . x . . .
bass  a1 . a1 . c2 . . e2 . . a1 . g1 . . .
pluck e4 . . a4 . . c5 . . a4 . . g4 . e4 .`,
  },
  {
    name: "Sunday",
    code: `// slow, for a Sunday
bpm 88
swing 30
kick  x . . . . . . . x . . x . . . .
hat   . x . x . x . x . x . x . x . x
bass  d2 . . . . . f2 . . . . . a1 . . .
lead  a4 . . . c5 . . . e5 . . . d5 . c5 .
pluck d4 f4 a4`,
  },
  {
    name: "Noise",
    code: `// slide the fader to Artist for this one
bpm 142
kick  X . x . . x . . X . . x . . x .
snare . . . . X . . x . . . . X . x x
hat   x x x
clap  . . . . . . . . . . . . . . X .
bass  e1! e1 . e1 g1 . e1 . b1! . e1 e1 . d2 . .
lead  e5 . . b4 . . g5 . . . e5 . d5 . b4 .`,
  },
];
