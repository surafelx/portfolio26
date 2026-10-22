/**
 * A small pen drawing for things that have no screenshot, picked from what the entry is about,
 * so a text-only card still has a picture: a waveform for sound, a circuit for hardware, linked
 * nodes for agents, letters for teaching, and a loose scribble for anything else.
 */
type Theme = "sound" | "circuit" | "agents" | "letters" | "scribble";

export function themeFor(text: string): Theme {
  const t = text.toLowerCase();
  if (/music|sound|\bdj\b|live[- ]cod|\bsets?\b|audio|crossfade|bpm/.test(t)) return "sound";
  if (/raspberry|solar|inverter|hardware|sensor|equipment|hospital/.test(t)) return "circuit";
  if (/agent|openclaw|automation|bot/.test(t)) return "agents";
  if (/teach|language|learn|course|coding/.test(t)) return "letters";
  return "scribble";
}

const pen = { fill: "none", stroke: "currentColor", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

function Drawing({ theme }: { theme: Theme }) {
  switch (theme) {
    case "sound":
      return (
        <g {...pen} strokeWidth={3}>
          {[14, 26, 44, 30, 52, 38, 22, 48, 34, 18, 40, 28, 12, 24, 36, 20].map((h, i) => (
            <path key={i} d={`M${14 + i * 11} ${50 - h / 2}v${h}`} />
          ))}
        </g>
      );
    case "circuit":
      return (
        <g {...pen} strokeWidth={2.4}>
          <rect x="70" y="28" width="52" height="44" rx="5" />
          <path d="M80 28v-12M96 28v-12M112 28v-12M80 72v12M96 72v12M112 72v12M70 40H38v-14M70 60H30M122 50h40v24M162 74h14" />
          <circle cx="38" cy="22" r="4" />
          <circle cx="26" cy="60" r="4" />
          <circle cx="180" cy="74" r="4" />
          <path d="M84 50h24" strokeDasharray="3 5" />
        </g>
      );
    case "agents":
      return (
        <g {...pen} strokeWidth={2.4}>
          <path d="M100 50L48 26M100 50L46 76M100 50l54-26M100 50l52 28M100 50V14" />
          <circle cx="100" cy="50" r="12" />
          <circle cx="44" cy="24" r="7" />
          <circle cx="42" cy="78" r="7" />
          <circle cx="158" cy="22" r="7" />
          <circle cx="156" cy="80" r="7" />
          <circle cx="100" cy="10" r="5" />
        </g>
      );
    case "letters":
      return (
        <g {...pen} strokeWidth={2.6}>
          <path d="M30 76l20-54 20 54M38 56h24" />
          <path d="M108 40c-14-8-30 2-28 18s20 22 30 10M110 40v34" />
          <path d="M140 22v54c10 6 30 4 30-14s-20-24-30-12" />
          <path d="M24 88c40-6 110-6 156 0" strokeDasharray="2 6" />
        </g>
      );
    default:
      return (
        <g {...pen} strokeWidth={2.6}>
          <path d="M20 60c20-40 40 30 60-6s30-30 44 4 30 20 40-14 16-8 22 4" />
          <path d="M40 80c30-6 80-8 120-2" strokeDasharray="3 6" />
        </g>
      );
  }
}

/** The drawing on its own, sized by the container. */
export function Doodle({ text, className = "" }: { text: string; className?: string }) {
  return (
    <svg className={`doodle ${className}`} viewBox="0 0 200 100" aria-hidden="true">
      <Drawing theme={themeFor(text)} />
    </svg>
  );
}
