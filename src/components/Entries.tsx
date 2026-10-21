import Link from "next/link";
import type { Entry, Pillar } from "@/content/site";
import { visible } from "@/content/site";

export function PageHead({ pillar }: { pillar: Pillar }) {
  return (
    <header className="page-head">
      <div className="wrap">
        <p className="label">{pillar.nav}</p>
        <h1 className="squiggle">{pillar.title}</h1>
        <p className="lede">{pillar.intro}</p>
      </div>
    </header>
  );
}

function Shot({ entry }: { entry: Entry }) {
  return entry.image ? (
    <div className="shot">
      {/* Screenshots are plain files in /public; next/image adds nothing for a handful of them. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={entry.image} alt="" loading="lazy" />
    </div>
  ) : (
    <div className="shot blank" aria-hidden="true">
      <span>{entry.title}</span>
    </div>
  );
}

function Copy({ entry, withLinks }: { entry: Entry & { stack?: string }; withLinks: boolean }) {
  return (
    <div className="copy">
      <p className="kicker">
        {entry.kicker}
        {entry.draft && <span className="draft">Draft</span>}
      </p>
      <h3>{entry.title}</h3>
      <p>{entry.body}</p>
      {entry.stack && <p className="stack">{entry.stack}</p>}
      {withLinks && entry.links?.length ? (
        <p className="links">
          {entry.links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label} <span aria-hidden="true">↗</span>
            </a>
          ))}
        </p>
      ) : null}
    </div>
  );
}

/** A whole card that opens a page, used on the home grid. */
export function CardLink({ entry, href, className = "" }: { entry: Entry; href: string; className?: string }) {
  return (
    <Link href={href} className={`card ${className}`}>
      <Shot entry={entry} />
      <Copy entry={entry} withLinks={false} />
    </Link>
  );
}

export function Entries({ items, heading }: { items: (Entry & { stack?: string })[]; heading?: string }) {
  const shown = visible(items);
  if (!shown.length) return null;
  return (
    <section className="wrap entries">
      {heading && <h2 className="section-title">{heading}</h2>}
      <div className="grid">
        {shown.map((e) => (
          <article key={e.title} className="card">
            <Shot entry={e} />
            <Copy entry={e} withLinks />
          </article>
        ))}
      </div>
    </section>
  );
}
