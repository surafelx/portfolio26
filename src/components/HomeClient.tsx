"use client";
import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  Send,
  Star,
} from "lucide-react";
import {
  getClientProjects,
  getPersonalProjects,
  getRecommendations,
  getArticles,
  aboutParagraphs,
  stackList,
} from "@/data";
import { SOCIAL_LINKS } from "@/lib/links";
import type { PortfolioProject } from "@/data";

function StackChips({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((s) => (
        <span
          key={s}
          className="text-xs font-mono bg-secondary text-secondary-foreground px-2 py-0.5 rounded-md"
        >
          {s}
        </span>
      ))}
    </div>
  );
}

function SectionHeading({
  label,
  title,
  sub,
}: {
  label: string;
  title: string;
  sub?: string;
}) {
  return (
    <div className="mb-10">
      <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">
        {label}
      </p>
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">{title}</h2>
      {sub && <p className="text-muted-foreground max-w-xl">{sub}</p>}
    </div>
  );
}

export default function HomeClient() {
  const clientProjects = getClientProjects();
  const personalProjects = getPersonalProjects();
  const recommendations = getRecommendations();
  const articles = getArticles();

  const sliderRef = useRef<HTMLDivElement>(null);
  const scrollSlider = (dir: "left" | "right") => {
    sliderRef.current?.scrollBy({
      left: dir === "left" ? -380 : 380,
      behavior: "smooth",
    });
  };

  return (
    <div className="space-y-24">
      {/* HERO */}
      <section className="pt-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full mb-6">
            Available for roles worldwide
          </span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05] mb-6">
            Full-Stack Engineer
            <br />
            <span className="text-primary">&amp; AI Systems Builder</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl leading-relaxed mb-8">
            I build production software: AI agents that think, full-stack apps
            that scale, and the integrations that make businesses actually run
            without manual chasing.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="#work"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-medium px-5 py-2.5 rounded-lg hover:brightness-110 transition"
            >
              View my work <ArrowRight size={16} />
            </a>
            <a
              href={`mailto:${SOCIAL_LINKS.email}`}
              className="inline-flex items-center gap-2 border border-border text-foreground font-medium px-5 py-2.5 rounded-lg hover:bg-secondary transition"
            >
              <Mail size={16} /> {SOCIAL_LINKS.email}
            </a>
          </div>
        </motion.div>
      </section>

      {/* CLIENT WORK — slider */}
      <section id="work" className="scroll-mt-24">
        <div className="flex items-end justify-between gap-4">
          <SectionHeading
            label="Client Work"
            title="Global & Ethiopian Clients"
            sub="Full-stack products, AI integrations, and automation systems built for clients across Australia, Ethiopia, and beyond."
          />
          <div className="hidden sm:flex gap-2 mb-10">
            <button
              onClick={() => scrollSlider("left")}
              aria-label="Scroll left"
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-border hover:bg-secondary transition"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scrollSlider("right")}
              aria-label="Scroll right"
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-border hover:bg-secondary transition"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div
          ref={sliderRef}
          className="no-scrollbar flex gap-5 overflow-x-auto snap-x snap-mandatory pb-2 -mx-1 px-1"
        >
          {clientProjects.map((p) => (
            <article
              key={p.id}
              className="snap-start shrink-0 w-[320px] sm:w-[360px] terminal-border bg-card overflow-hidden flex flex-col"
            >
              <div className="flex items-start justify-between p-6 border-b border-border">
                <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-primary/10 text-xl">
                  {p.icon}
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground border border-border rounded-full px-2.5 py-1">
                  {p.badge}
                </span>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-semibold">{p.name}</h3>
                <p className="text-xs font-medium text-primary mb-3">{p.subtitle}</p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
                  {p.description}
                </p>
                <StackChips items={p.stack} />
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* PERSONAL PROJECTS — grid */}
      <section id="personal" className="scroll-mt-24">
        <SectionHeading
          label="Personal Projects"
          title="Things I Built Because I Wanted To"
          sub="Side projects and experiments — some turned into real products, some remain prototypes. All taught me something."
        />
        <div className="grid gap-5 md:grid-cols-2">
          {personalProjects.map((p) => (
            <ProjectPanel key={p.id} project={p} />
          ))}
        </div>
      </section>

      {/* RECOMMENDATIONS */}
      <section id="recommendations" className="scroll-mt-24">
        <SectionHeading
          label="Recommendations"
          title="What People Say"
          sub="Feedback from clients and collaborators."
        />
        <div className="grid gap-5 md:grid-cols-3">
          {recommendations.map((r) => (
            <figure key={r.id} className="terminal-border bg-card p-6">
              <div className="flex gap-0.5 text-amber-400 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <blockquote className="text-sm text-muted-foreground italic leading-relaxed mb-4">
                “{r.quote}”
              </blockquote>
              <figcaption className="flex items-center gap-3">
                <span className="w-9 h-9 flex items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                  {r.initial}
                </span>
                <span>
                  <span className="block text-sm font-medium">{r.name}</span>
                  <span className="block text-xs text-muted-foreground">{r.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ARTICLES */}
      <section id="articles" className="scroll-mt-24">
        <SectionHeading
          label="Articles"
          title="Thinking in Public"
          sub="Occasional writing about what I'm building and learning."
        />
        <div className="grid gap-5 md:grid-cols-3">
          {articles.map((a) => (
            <Link
              key={a.id}
              href={`/articles/${a.id}`}
              className="group terminal-border bg-card p-6 transition hover:border-primary/40 hover:-translate-y-0.5"
            >
              <p className="text-xs text-muted-foreground mb-2">
                {new Date(a.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                })}
              </p>
              <h3 className="font-semibold leading-snug mb-2 group-hover:text-primary transition-colors">
                {a.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                {a.excerpt}
              </p>
              <span className="text-xs font-medium text-primary inline-flex items-center gap-1">
                Read more <ArrowRight size={13} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="scroll-mt-24">
        <SectionHeading label="About" title="Who's Building This" />
        <div className="grid gap-10 md:grid-cols-2 md:items-start">
          <div className="space-y-4">
            {aboutParagraphs.map((para, i) => (
              <p key={i} className="text-muted-foreground leading-relaxed">
                {para}
              </p>
            ))}
            <a
              href="/Surafel Yimam CV.pdf"
              download
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              <Download size={15} /> Download résumé
            </a>
          </div>
          <div className="terminal-border bg-card p-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Stack
            </h3>
            <StackChips items={stackList} />
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="scroll-mt-24 text-center py-8">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          Let&apos;s build something.
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto mb-8">
          I'm open to full-time roles, consulting projects, and interesting
          problems. If you're building something that needs a full-stack engineer
          who actually ships — let's talk.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <ContactLink href={`mailto:${SOCIAL_LINKS.email}`} icon={<Mail size={15} />} label="Email" />
          <ContactLink href={SOCIAL_LINKS.github} icon={<Github size={15} />} label="GitHub" />
          <ContactLink href={SOCIAL_LINKS.linkedin} icon={<Linkedin size={15} />} label="LinkedIn" />
          <ContactLink href={SOCIAL_LINKS.telegram} icon={<Send size={15} />} label="Telegram" />
        </div>
      </section>
    </div>
  );
}

function ProjectPanel({ project: p }: { project: PortfolioProject }) {
  return (
    <article className="terminal-border bg-card p-7 transition hover:border-primary/40">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg">{p.name}</h3>
          <p className="text-xs font-medium text-primary mt-0.5">{p.subtitle}</p>
        </div>
        <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-primary/10 text-xl shrink-0">
          {p.icon}
        </div>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
        {p.description}
      </p>
      {p.link && (
        <div className="mb-4">
          {p.link.url ? (
            <a
              href={p.link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-muted-foreground hover:text-primary inline-flex items-center gap-1"
            >
              <ExternalLink size={13} /> {p.link.label}
            </a>
          ) : (
            <span className="text-xs font-medium text-muted-foreground inline-flex items-center gap-1">
              {p.link.label}
            </span>
          )}
        </div>
      )}
      <StackChips items={p.stack} />
    </article>
  );
}

function ContactLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="inline-flex items-center gap-2 border border-border rounded-lg px-4 py-2.5 text-sm font-medium text-muted-foreground hover:border-primary hover:text-primary transition"
    >
      {icon}
      {label}
    </a>
  );
}
