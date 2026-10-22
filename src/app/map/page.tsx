import type { Metadata } from "next";
import { NextRoom } from "@/components/NextRoom";
import Link from "next/link";
import { LifeMap } from "@/components/LifeMap";
import { kinds, links, nodes, type Kind } from "@/content/map";
import { layout } from "@/content/map-layout";

export const metadata: Metadata = {
  title: "Map",
  description: "Everything Surafel Yimam does, from hospital equipment to live-coded sets, and how one thing led to another.",
};

// Laid out once at build time: a landscape map for wide screens and a portrait one for phones.
const wide = layout(1100, 720);
const tall = layout(420, 980, 40);

export default function MapPage() {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  return (
    <>
      <header className="page-head">
        <div className="wrap">
          <p className="label">The map</p>
          <h1 className="squiggle">How one thing led to another.</h1>
          <p className="lede">
            Everything I do, from hospital equipment to live-coded sets, and the threads between them. Point at anything to
            see what it&rsquo;s connected to, and why.
          </p>
        </div>
      </header>

      <section className="wrap map-section">
        <LifeMap wide={wide} tall={tall} links={links} />
      </section>

      <section className="wrap section">
        <p className="label">The same map, as a list</p>
        <div className="map-list">
          {(Object.keys(kinds) as Kind[]).map((k) => (
            <div key={k}>
              <h2 className="section-title">{kinds[k].name}</h2>
              <ul>
                {nodes
                  .filter((n) => n.kind === k)
                  .map((n) => {
                    const mine = links.filter((l) => l.a === n.id || l.b === n.id);
                    return (
                      <li key={n.id}>
                        {n.href ? <Link href={n.href}>{n.label}</Link> : <strong>{n.label}</strong>}
                        <span>
                          {" "}
                          connects to {mine.map((l) => byId.get(l.a === n.id ? l.b : l.a)!.label).join(", ")}.
                        </span>
                      </li>
                    );
                  })}
              </ul>
            </div>
          ))}
        </div>
      </section>
      <NextRoom from="map" />
    </>
  );
}
