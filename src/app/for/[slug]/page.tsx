import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { catalog } from "@/content/catalog";
import { pitchBySlug, pitches } from "@/content/pitches";
import { profile } from "@/content/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return pitches().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const pitch = pitchBySlug(slug);
  if (!pitch) return {};
  return {
    title: pitch.title,
    description: pitch.intro.slice(0, 160),
    // Written for one reader; keep it out of search results.
    robots: { index: false, follow: false },
  };
}

const external = (href: string) => /^https?:\/\//.test(href);

export default async function PitchPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pitch = pitchBySlug(slug);
  if (!pitch) notFound();

  return (
    <article className="wrap pitch">
      <header className="pitch-hero">
        {pitch.eyebrow && <p className="label">{pitch.eyebrow}</p>}
        <h1 className="squiggle">
          {pitch.headline} {pitch.headlineMuted && <span className="muted">{pitch.headlineMuted}</span>}
        </h1>
        {pitch.intro && <p className="lede">{pitch.intro}</p>}
        <div className="pitch-meta">
          {pitch.hours && (
            <span className="status">
              <span className="pulse" aria-hidden="true" />
              {pitch.hours}
            </span>
          )}
          <span className="pitch-links">
            <Link href="/">The full site</Link>
            <a href={profile.cvUrl}>CV</a>
            <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </span>
        </div>
      </header>

      {pitch.fit.length > 0 && (
        <section className="pitch-block" aria-labelledby="fit">
          <h2 id="fit" className="section-title">{pitch.fitTitle}</h2>
          <ol className="fit">
            {pitch.fit.map((row) => {
              const projects = row.projects.map((id) => catalog[id]).filter(Boolean);
              return (
                <li key={row.need}>
                  <h3>{row.need}</h3>
                  <p>{row.built}</p>
                  {projects.length > 0 && (
                    <div className="pitch-chips">
                      {projects.map((p) => (
                        <a key={p.name} className="chip" href={p.href || "/work"} {...(external(p.href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                          {p.name}
                        </a>
                      ))}
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </section>
      )}

      {pitch.week.length > 0 && (
        <section className="pitch-block" aria-labelledby="week">
          <h2 id="week" className="section-title">{pitch.weekTitle}</h2>
          <ol className="week">
            {pitch.week.map((step) => (
              <li key={step.when}>
                <span className="when">{step.when}</span>
                <p>{step.what}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {pitch.gaps.length > 0 && (
        <section className="pitch-block" aria-labelledby="gaps">
          <h2 id="gaps" className="section-title">{pitch.gapsTitle}</h2>
          <dl className="gaps">
            {pitch.gaps.map((gap) => (
              <div key={gap.need}>
                <dt>{gap.need}</dt>
                <dd>{gap.note}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {pitch.stack.length > 0 && (
        <section className="pitch-block" aria-labelledby="stack">
          <h2 id="stack" className="section-title">{pitch.stackTitle}</h2>
          <dl className="skills pitch-skills">
            {pitch.stack.map((s) => (
              <div key={s.group}>
                <dt>{s.group}</dt>
                <dd>{s.items}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <section className="contact pitch-cta" aria-labelledby="cta">
        <div>
          <h2 id="cta" className="squiggle">{pitch.ctaTitle}</h2>
          {pitch.ctaNote && <p>{pitch.ctaNote}</p>}
        </div>
        <div className="actions">
          <a className="btn" href={profile.bookingUrl} target="_blank" rel="noopener noreferrer">
            Book a 20-minute call
          </a>
          <a className="btn line" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
        </div>
      </section>
    </article>
  );
}
