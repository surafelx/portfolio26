import type { Metadata } from "next";
import { Entries } from "@/components/Entries";
import { abroLearning, abroProjects } from "@/content/abro-entries";
import { education, jobs, profile, projects, skills, testimonials, work } from "@/content/site";

export const metadata: Metadata = {
  title: "Work",
  description: `${work.headline} ${work.summary}`,
};

export default function WorkPage() {
  // Projects and skills Abro has published sit alongside the hand-written ones
  const learning = abroLearning();
  const allSkills = learning ? [...skills, { group: "Currently learning", items: learning }] : skills;
  return (
    <>
      <header className="page-head">
        <div className="wrap">
          <p className="label">Work</p>
          <h1 className="squiggle">{work.headline}</h1>
          <p className="lede">{work.summary}</p>
          <p className="availability">{work.availability}</p>
          <p className="hours muted">{profile.hours}</p>
          <div className="actions">
            <a className="btn" href={profile.bookingUrl}>
              Book a call
            </a>
            <a className="btn line" href={profile.cvUrl}>
              Download CV
            </a>
            <a className="btn line" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
          </div>
        </div>
      </header>

      <section className="wrap stats">
        {work.stats.map((s) => (
          <div key={s.label}>
            <strong>{s.value}</strong>
            <span>{s.label}</span>
          </div>
        ))}
      </section>

      <Entries heading="Selected work" items={[...projects, ...abroProjects()]} />

      <section className="wrap two-col">
        <div>
          <h2 className="section-title">Experience</h2>
          <ol className="timeline">
            {jobs.map((j) => (
              <li key={`${j.role}-${j.org}`}>
                <span className="when">{j.when}</span>
                <span>
                  <strong>{j.role}</strong>
                  <span className="muted"> · {j.org}</span>
                </span>
              </li>
            ))}
          </ol>
          <p className="muted education">{education}</p>
        </div>
        <div>
          <h2 className="section-title">Skills</h2>
          <dl className="skills">
            {allSkills.map((s) => (
              <div key={s.group}>
                <dt>{s.group}</dt>
                <dd>{s.items}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="wrap quotes">
        {testimonials.map((t) => (
          <figure key={t.who}>
            <p className="q-mark" aria-hidden="true">&ldquo;</p>
            <blockquote>{t.quote}</blockquote>
            <figcaption>{t.who}</figcaption>
          </figure>
        ))}
      </section>
    </>
  );
}
