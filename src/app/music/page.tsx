import type { Metadata } from "next";
import { Entries, PageHead } from "@/components/Entries";
import { Playground } from "@/components/playground/Playground";
import { music, pillars } from "@/content/site";

const pillar = pillars.find((p) => p.id === "music")!;

export const metadata: Metadata = { title: pillar.nav, description: pillar.intro };

export default function MusicPage() {
  return (
    <>
      <PageHead pillar={pillar} />
      <section className="wrap pg-section">
        <div className="section-head">
          <div>
            <p className="label">Play with it</p>
            <h2 className="squiggle">Write a beat. It plays as you type.</h2>
          </div>
          <p className="aside">
            One line per sound, one symbol per step: <code>x</code> hits, <code>.</code> rests, and the bass and leads take
            notes like <code>a1</code> or <code>c#4</code>. Lines of different lengths drift around each other.
          </p>
        </div>
        <Playground />
      </section>
      <Entries items={music} />
    </>
  );
}
