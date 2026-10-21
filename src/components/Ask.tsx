"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export type AskDoc = { title: string; text: string; href: string; where: string };

/** Words people use that the site spells differently. */
const ALIASES: Record<string, string[]> = {
  voice: ["call", "calls", "retell", "elevenlabs", "speaks"],
  agent: ["agents", "agentic", "openclaw", "multi-agent", "conductor"],
  ai: ["llm", "llms", "agents", "openai", "claude", "model"],
  health: ["healthcare", "medical", "hospital", "hospitals", "biomedical", "clinic"],
  music: ["live", "coding", "dj", "set", "sets", "audio", "bpm"],
  art: ["visualspam", "visuals", "noise"],
  payment: ["stripe", "payroll", "billing"],
  ethiopia: ["ethiopian", "amharic", "addis", "bahir", "birr"],
  kids: ["children", "child", "charity"],
  crm: ["leads", "sales", "pipeline"],
  teaching: ["teach", "teaches", "taught", "tutor", "course", "courses", "mentor", "language", "languages", "education"],
  hardware: ["raspberry", "pi", "iot", "solar", "inverter", "inverters", "sensor", "sensors", "alarms", "monitoring", "embedded"],
};

const words = (s: string): string[] => s.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];

function expand(q: string) {
  const out = new Set<string>();
  for (const w of words(q)) {
    if (w.length < 2) continue;
    out.add(w);
    for (const [key, list] of Object.entries(ALIASES)) {
      if (w === key || list.includes(w)) {
        out.add(key);
        list.forEach((x) => out.add(x));
      }
    }
  }
  return [...out];
}

const SUGGESTIONS = ["Has he built voice agents?", "Healthcare work?", "Does he make music?", "Anything in Amharic?"];

/**
 * Ask Surafel. For now it answers from what's on this site, by matching words, and links to the proof.
 * It doesn't make anything up, because it can't: every answer is a page here.
 */
export function Ask({ docs }: { docs: AskDoc[] }) {
  const [q, setQ] = useState("");
  const [asked, setAsked] = useState("");

  const index = useMemo(() => docs.map((d) => ({ d, bag: new Set(words(`${d.title} ${d.text}`)) })), [docs]);

  const results = useMemo(() => {
    if (!asked) return [];
    const terms = expand(asked);
    return index
      .map(({ d, bag }) => ({ d, score: terms.reduce((n, t) => n + (bag.has(t) ? (words(d.title).includes(t) ? 3 : 1) : 0), 0) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [asked, index]);

  function submit(text: string) {
    setQ(text);
    setAsked(text.trim());
  }

  return (
    <div className="ask">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(q);
        }}
      >
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Has he built voice agents?" aria-label="Ask a question about Surafel" />
        <button className="btn" type="submit">
          Ask
        </button>
      </form>
      {!asked && (
        <div className="chips">
          {SUGGESTIONS.map((s) => (
            <button key={s} type="button" onClick={() => submit(s)}>
              {s}
            </button>
          ))}
        </div>
      )}
      {asked && (
        <ul className="answers" aria-live="polite">
          {results.length ? (
            results.map(({ d }) => (
              <li key={d.title}>
                <Link href={d.href}>{d.title}</Link> <span className="muted">· {d.where}</span>
                <span>{d.text.length > 150 ? `${d.text.slice(0, 150).trimEnd()}…` : d.text}</span>
              </li>
            ))
          ) : (
            <li>
              Nothing on the site matches that yet. <Link href="/work">Ask me directly</Link>, I usually reply within a day.
            </li>
          )}
        </ul>
      )}
      <p className="hint">Answers come from this site, each with a link to the proof.</p>
    </div>
  );
}
