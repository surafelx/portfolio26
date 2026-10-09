import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { site } from "@/lib/content";
import { pitchBySlug, pitches } from "@/lib/pitches";
import { ThemeToggle } from "@/components/ThemeToggle";
import { VisitPing } from "@/components/site/VisitPing";
import "../pitch.css";

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

function isExternal(url: string) {
  return /^https?:\/\//.test(url);
}

export default async function PitchPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pitch = pitchBySlug(slug);
  if (!pitch) notFound();

  const { profile } = site;
  const projectById = new Map(site.projects.map((p) => [p.id, p]));
  const year = new Date().getFullYear();

  return (
    <div className="site pitch">
      <VisitPing />
      <header className="header">
        <div className="container bar">
          <a className="brand" href="/" aria-label={`${profile.shortName}, home`}>
            <span className="dot" aria-hidden="true" />
            {profile.shortName}
          </a>
          <span className="spacer" />
          <div className="tools">
            <ThemeToggle />
            {profile.bookingUrl && (
              <a className="btn sm cta" href={profile.bookingUrl} target="_blank" rel="noopener noreferrer">
                Book a call
              </a>
            )}
          </div>
        </div>
      </header>

      <main className="container pitch-main">
        <section className="pitch-hero">
          {pitch.eyebrow && <div className="label">{pitch.eyebrow}</div>}
          <h1>
            {pitch.headline} {pitch.headlineMuted && <span>{pitch.headlineMuted}</span>}
          </h1>
          {pitch.intro && <p className="lede">{pitch.intro}</p>}
          <div className="pitch-meta">
            {pitch.hours && (
              <span className="avail">
                <i aria-hidden="true" />
                {pitch.hours}
              </span>
            )}
            <span className="pitch-links">
              <a href="/">The full site</a>
              {profile.cvUrl && <a href={profile.cvUrl}>CV</a>}
              {profile.githubUrl && (
                <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              )}
              {profile.linkedinUrl && (
                <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              )}
            </span>
          </div>
        </section>

        {pitch.fit.length > 0 && (
          <section className="pitch-block" aria-labelledby="fit">
            <h2 id="fit">{pitch.fitTitle}</h2>
            <ol className="fit">
              {pitch.fit.map((row) => {
                const projects = row.projects.map((id) => projectById.get(id)).filter((p): p is NonNullable<typeof p> => !!p && p.visible);
                return (
                  <li key={row.need}>
                    <h3>{row.need}</h3>
                    <p>{row.built}</p>
                    {projects.length > 0 && (
                      <div className="chips">
                        {projects.map((p) => {
                          const href = p.liveUrl || p.codeUrl || "/";
                          return isExternal(href) ? (
                            <a key={p.id} className="chip" href={href} target="_blank" rel="noopener noreferrer">
                              {p.name}
                            </a>
                          ) : (
                            <a key={p.id} className="chip" href={href}>
                              {p.name}
                            </a>
                          );
                        })}
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
            <h2 id="week">{pitch.weekTitle}</h2>
            <ol className="week">
              {pitch.week.map((step) => (
                <li key={step.when}>
                  <span className="mono">{step.when}</span>
                  <p>{step.what}</p>
                </li>
              ))}
            </ol>
          </section>
        )}

        {pitch.gaps.length > 0 && (
          <section className="pitch-block" aria-labelledby="gaps">
            <h2 id="gaps">{pitch.gapsTitle}</h2>
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
            <h2 id="stack">{pitch.stackTitle}</h2>
            <div className="skills pitch-skills">
              {pitch.stack.map((s) => (
                <div key={s.group}>
                  <b>{s.group}</b>
                  {s.items}
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="pitch-block pitch-cta" aria-labelledby="cta">
          <h2 id="cta">{pitch.ctaTitle}</h2>
          {pitch.ctaNote && <p>{pitch.ctaNote}</p>}
          <div className="actions">
            {profile.bookingUrl && (
              <a className="btn" href={profile.bookingUrl} target="_blank" rel="noopener noreferrer">
                Book a 20-minute call
              </a>
            )}
            {profile.email && (
              <a className="btn line" href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
            )}
          </div>
        </section>
      </main>

      <footer className="container footer-base pitch-foot">
        <span>
          © {year} {profile.name}
        </span>
        <span>{profile.location}</span>
      </footer>
    </div>
  );
}
