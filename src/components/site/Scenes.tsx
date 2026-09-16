import type { Project, Section, Site } from "@/lib/schema";
import { LocalTime } from "./LocalTime";

type SceneProps = { site: Site; section: Section };

function isExternal(url: string) {
  return /^https?:\/\//.test(url);
}

function ExtLink({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
  return isExternal(href) ? (
    <a href={href} className={className} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ) : (
    <a href={href} className={className}>
      {children}
    </a>
  );
}

function Scene({ section, children, className = "" }: { section: Section; children: React.ReactNode; className?: string }) {
  return (
    <section id={section.id} data-scene className={`scene ${className}`} aria-label={section.nav || section.eyebrow || section.id}>
      <div className="container">{children}</div>
    </section>
  );
}

function SceneHead({ section }: { section: Section }) {
  if (!section.title && !section.intro && !section.eyebrow) return null;
  return (
    <div className="scene-head reveal">
      <div>
        {section.eyebrow && <div className="label">{section.eyebrow}</div>}
        {section.title && <h2>{section.title}</h2>}
      </div>
      {section.intro && <p>{section.intro}</p>}
    </div>
  );
}

function ProjectLinks({ project }: { project: Project }) {
  const hasAny = project.liveUrl || project.codeUrl || (project.ctaLabel && project.ctaUrl);
  if (!hasAny) return null;
  return (
    <div className="links">
      {project.liveUrl && (
        <ExtLink className="more" href={project.liveUrl}>
          Open
        </ExtLink>
      )}
      {project.codeUrl && (
        <ExtLink className="more" href={project.codeUrl}>
          Code
        </ExtLink>
      )}
      {project.ctaLabel && project.ctaUrl && (
        <ExtLink className="more" href={project.ctaUrl}>
          {project.ctaLabel}
        </ExtLink>
      )}
    </div>
  );
}

function Shot({ project }: { project: Project }) {
  if (!project.image) return null;
  const img = <img src={project.image} alt={`${project.name} screenshot`} loading="lazy" width={640} height={400} />;
  return project.liveUrl ? (
    <ExtLink className="shot" href={project.liveUrl}>
      {img}
    </ExtLink>
  ) : (
    <div className="shot">{img}</div>
  );
}

function ProjectCopy({ project }: { project: Project }) {
  return (
    <div className="copy">
      {project.label && <div className="label">{project.label}</div>}
      <h3>{project.name}</h3>
      {project.tagline && <p className="tag">{project.tagline}</p>}
      <ProjectLinks project={project} />
    </div>
  );
}

const visibleProjects = (site: Site, placement: Project["placement"]) =>
  site.projects.filter((p) => p.visible && p.placement === placement);

/* ---------------- Scenes ---------------- */

export function HeroScene({ site, section }: SceneProps) {
  const { profile, now } = site;
  return (
    <Scene section={section}>
      <div className="intro">
        <div>
          {profile.greeting && <p className="greeting reveal">{profile.greeting}</p>}
          <h1 className="reveal">
            {profile.headline} {profile.headlineMuted && <span>{profile.headlineMuted}</span>}
          </h1>
          {profile.intro && <p className="lede reveal">{profile.intro}</p>}
          <div className="actions reveal">
            <a className="btn" href="#featured">
              See the work
            </a>
            {profile.cvUrl && (
              <a className="btn line" href={profile.cvUrl}>
                Download CV
              </a>
            )}
          </div>
        </div>

        <aside className="now reveal" aria-label="What I'm doing now">
          <div className="top">
            <span className="label">Right now</span>
            {profile.availability && (
              <span className="avail">
                <i aria-hidden="true" />
                {profile.availability}
              </span>
            )}
          </div>
          {now.length > 0 && (
            <ul>
              {now.map((role) => (
                <li key={`${role.title}-${role.org}`}>
                  <div>
                    <b>{role.title}</b>
                    <span>
                      {role.org}
                      {role.place ? `, ${role.place}` : ""}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {profile.location && (
            <div className="clock">
              <span>{profile.location}</span>
              <LocalTime timeZone={profile.timeZone} />
            </div>
          )}
        </aside>
      </div>
      <div className="scroll-cue label" aria-hidden="true">
        Scroll
        <i />
      </div>
    </Scene>
  );
}

export function FeaturedScene({ site, section }: SceneProps) {
  const projects = visibleProjects(site, "featured");
  if (projects.length === 0) return null;
  // Two screenshot projects sit side by side as equal cards; any other mix uses the wide layout.
  const pair = projects.length === 2 && projects.every((p) => p.steps.length === 0 && p.image);
  return (
    <Scene section={section}>
      <SceneHead section={section} />
      <div className={`featured reveal${pair ? " pair" : ""}`}>
        {projects.map((project) =>
          pair ? (
            <article key={project.id} className="tile deep">
              <ProjectCopy project={project} />
              <Shot project={project} />
            </article>
          ) : project.steps.length > 0 ? (
            <article key={project.id} className="tile deep">
              <ProjectCopy project={project} />
              <ol className="flow" aria-label={`How ${project.name} works`}>
                {project.steps.map((step) => (
                  <li key={step.name}>
                    {step.name} {step.note && <span className="mono">{step.note}</span>}
                  </li>
                ))}
              </ol>
            </article>
          ) : (
            <article key={project.id} className="tile wide deep">
              <ProjectCopy project={project} />
              <Shot project={project} />
            </article>
          ),
        )}
      </div>
    </Scene>
  );
}

export function ProductsScene({ site, section }: SceneProps) {
  const projects = visibleProjects(site, "grid");
  if (projects.length === 0) return null;
  return (
    <Scene section={section}>
      <SceneHead section={section} />
      <div className="products reveal">
        {projects.map((project) => (
          <article key={project.id} className="tile">
            <ProjectCopy project={project} />
            <Shot project={project} />
          </article>
        ))}
      </div>
    </Scene>
  );
}

export function MoreScene({ site, section }: SceneProps) {
  const projects = visibleProjects(site, "compact");
  if (projects.length === 0 && site.highlights.length === 0) return null;
  return (
    <Scene section={section}>
      <SceneHead section={section} />
      {projects.length > 0 && (
        <div className="compact reveal">
          {projects.map((project) => (
            <article key={project.id} className="tile">
              <ProjectCopy project={project} />
            </article>
          ))}
        </div>
      )}
      {site.highlights.length > 0 && (
        <div className="highlights reveal" aria-label="In numbers">
          {site.highlights.map((h) => (
            <div key={`${h.value}-${h.label}`}>
              <b>{h.value}</b>
              <span>{h.label}</span>
            </div>
          ))}
        </div>
      )}
    </Scene>
  );
}

export function ExperienceScene({ site, section }: SceneProps) {
  const jobs = site.jobs.filter((j) => j.visible);
  return (
    <Scene section={section}>
      <div className="xp">
        <aside className="reveal">
          {section.eyebrow && <div className="label">{section.eyebrow}</div>}
          {section.title && <h2>{section.title}</h2>}
          {section.intro && <p>{section.intro}</p>}
          {site.skills.length > 0 && (
            <div className="skills">
              {site.skills.map((s) => (
                <div key={s.group}>
                  <b>{s.group}</b>
                  {s.items}
                </div>
              ))}
            </div>
          )}
          {site.education && <p className="label" style={{ textTransform: "none", letterSpacing: 0 }}>{site.education}</p>}
          {site.profile.cvUrl && (
            <a className="more" href={site.profile.cvUrl}>
              Full CV
            </a>
          )}
        </aside>
        <ul className="jobs reveal">
          {jobs.map((job) => (
            <li key={`${job.when}-${job.title}-${job.org}`}>
              <span className="when mono">{job.when}</span>
              <div>
                <b>{job.title}</b> {job.org && <span className="org">· {job.org}</span>}
                {job.summary && <p>{job.summary}</p>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Scene>
  );
}

export function TestimonialsScene({ site, section }: SceneProps) {
  if (site.testimonials.length === 0) return null;
  return (
    <Scene section={section}>
      <SceneHead section={section} />
      <div className="quotes reveal">
        {site.testimonials.map((t) => (
          <figure key={t.quote.slice(0, 40)} className="quote">
            <span className="mark" aria-hidden="true">“</span>
            <blockquote>{t.quote}</blockquote>
            <figcaption>
              <span className="who" aria-hidden="true">{t.name.charAt(0)}</span>
              <span>
                <b>{t.name}</b>
                {t.role && <small>{t.role}</small>}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </Scene>
  );
}

export function WritingScene({ site, section }: SceneProps) {
  if (site.posts.length === 0) return null;
  return (
    <Scene section={section}>
      <SceneHead section={section} />
      <div className="posts reveal">
        {site.posts.map((post) => (
          <ExtLink key={post.title} className="post" href={post.url || "#writing"}>
            {post.date && <span className="label">{post.date}</span>}
            <h3>{post.title}</h3>
            {post.summary && <p>{post.summary}</p>}
            <span className="more">Read</span>
          </ExtLink>
        ))}
      </div>
    </Scene>
  );
}

export function ContactScene({ site, section }: SceneProps) {
  const { profile, contact } = site;
  const year = new Date().getFullYear();
  return (
    <Scene section={section}>
      <div className="contact reveal">
        <div>
          <h2>{section.title}</h2>
          {section.intro && <p>{section.intro}</p>}
        </div>
        <div className="actions">
          {profile.bookingUrl && (
            <ExtLink className="btn" href={profile.bookingUrl}>
              Book a 20-minute call
            </ExtLink>
          )}
          {profile.email && (
            <a className="btn line" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
          )}
          {contact.note && <span className="note">{contact.note}</span>}
        </div>
      </div>

      <footer className="footer reveal">
        <div>
          <b>{profile.name}</b>
          {contact.footerNote}
        </div>
        <div>
          <span className="label">Work</span>
          <ul>
            <li><a href="#featured">Projects</a></li>
            <li><a href="#experience">Experience</a></li>
            {profile.cvUrl && <li><a href={profile.cvUrl}>CV</a></li>}
          </ul>
        </div>
        <div>
          <span className="label">Elsewhere</span>
          <ul>
            {profile.githubUrl && <li><ExtLink href={profile.githubUrl}>GitHub</ExtLink></li>}
            {profile.linkedinUrl && <li><ExtLink href={profile.linkedinUrl}>LinkedIn</ExtLink></li>}
            <li><a href="#writing">Writing</a></li>
          </ul>
        </div>
        <div>
          <span className="label">Contact</span>
          <ul>
            {profile.email && <li><a href={`mailto:${profile.email}`}>Email</a></li>}
            {profile.bookingUrl && <li><ExtLink href={profile.bookingUrl}>Book a call</ExtLink></li>}
          </ul>
        </div>
      </footer>
      <div className="footer-base">
        <span>© {year} {profile.shortName}</span>
        <span>{profile.location}</span>
      </div>
    </Scene>
  );
}
