import Link from "next/link";
import { pillars, type PillarId } from "@/content/site";

/**
 * The end of every room: a door to the next one, so the site reads front to back,
 * and a way out to the map. After the last room it goes round to the first.
 */
export function NextRoom({ from }: { from: PillarId | "map" }) {
  const i = pillars.findIndex((p) => p.id === from);
  const next = pillars[(i + 1) % pillars.length];
  return (
    <nav className="wrap next-room" aria-label="Keep going">
      <Link href={`/${next.id}`} className="card next-door">
        <span className="label">Next room</span>
        <span className="next-name">{next.nav}</span>
        <span className="next-line">{next.door}</span>
        <span className="next-arrow" aria-hidden="true">→</span>
      </Link>
      {from !== "map" && (
        <Link href="/map" className="next-map">
          or see how it all connects on the map
        </Link>
      )}
    </nav>
  );
}
