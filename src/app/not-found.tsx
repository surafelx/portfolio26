import Link from "next/link";
import { pillars } from "@/content/site";

export const metadata = { title: "Not here" };

export default function NotFound() {
  return (
    <section className="wrap lost">
      <p className="label">
        Not here <span className="am" lang="am">፬፻፬</span>
      </p>
      <h1 className="squiggle">This page wandered off.</h1>
      <p className="lede">
        The link may be old, or I moved things around. Every room is still one click away, and the map shows how they
        connect.
      </p>
      <div className="rooms">
        {pillars.map((p, i) => (
          <Link key={p.id} href={`/${p.id}`} className="card room">
            <span className="num">0{i + 1}</span>
            <div>
              <h3>{p.nav}</h3>
              <p>{p.door}</p>
            </div>
          </Link>
        ))}
      </div>
      <p className="lost-links">
        <Link href="/">Home</Link>
        <Link href="/map">The map</Link>
      </p>
    </section>
  );
}
