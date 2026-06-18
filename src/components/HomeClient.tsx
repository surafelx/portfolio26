"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  Building2,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  FileText,
  Github,
  GraduationCap,
  Linkedin,
  Mail,
  MessageSquareQuote,
  Send,
  Sparkles,
  Star,
  UserRound,
  X,
} from "lucide-react";
import type { ReactNode } from "react";
import {
  getClientProjects,
  getPersonalProjects,
  getRecommendations,
  getArticles,
  aboutParagraphs,
  stackList,
  experience,
  education,
} from "@/data";
import { SOCIAL_LINKS } from "@/lib/links";
import { ImageWithFallback } from "@/components/ImageWithFallback";
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
  icon,
}: {
  label: string;
  title: string;
  sub?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="mb-8">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary mb-2">
        {icon && (
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-primary/10">
            {icon}
          </span>
        )}
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

  // Project detail modal (shared by both sections)
  const [modal, setModal] = useState<{ list: PortfolioProject[]; index: number } | null>(
    null
  );
  const openModal = (list: PortfolioProject[], index: number) =>
    setModal({ list, index });
  const closeModal = useCallback(() => setModal(null), []);
  const stepModal = useCallback(
    (dir: -1 | 1) =>
      setModal((m) =>
        m
          ? { ...m, index: (m.index + dir + m.list.length) % m.list.length }
          : m
      ),
    []
  );

  useEffect(() => {
    if (!modal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowRight") stepModal(1);
      if (e.key === "ArrowLeft") stepModal(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modal, closeModal, stepModal]);

  return (
    <div className="space-y-24">
      {/* HERO — name first */}
      <section className="pt-2">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.02] mb-4 text-foreground">
            Surafel Yimam
          </h1>
          <p className="text-xl md:text-2xl font-medium text-foreground/80 mb-4">
            Chief Agent Officer · AI Engineer · Full-Stack Engineer
          </p>

          {/* Small icons + résumé below role */}
          <div className="flex items-center gap-1 mb-7">
            <HeroIcon href={`mailto:${SOCIAL_LINKS.email}`} label="Email">
              <Mail size={18} />
            </HeroIcon>
            <HeroIcon href={SOCIAL_LINKS.github} label="GitHub" external>
              <Github size={18} />
            </HeroIcon>
            <HeroIcon href={SOCIAL_LINKS.linkedin} label="LinkedIn" external>
              <Linkedin size={18} />
            </HeroIcon>
            <HeroIcon href={SOCIAL_LINKS.telegram} label="Telegram" external>
              <Send size={18} />
            </HeroIcon>
            <span className="w-px h-5 bg-border mx-2" />
            <a
              href="/Surafel-Yimam-Resume.pdf"
              download
              className="group inline-flex items-center gap-2 text-sm font-medium text-foreground border border-border rounded-full pl-3 pr-3.5 py-1.5 hover:border-primary hover:text-primary hover:bg-primary/5 transition"
            >
              <Download size={15} className="transition-transform group-hover:translate-y-0.5" />
              Résumé
            </a>
          </div>

          <p className="text-lg text-muted-foreground max-w-xl leading-relaxed mb-5">
            I build production software: AI agents that think, full-stack apps
            that scale, and the integrations that make businesses actually run
            without manual chasing.
          </p>
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Available for roles worldwide
          </p>
        </motion.div>
      </section>

      {/* CLIENT WORK — full-width carousel */}
      <section id="work" className="scroll-mt-12">
        <SectionHeading
          icon={<Briefcase size={12} />}
          label="Client & Global Work"
          title="Global & Ethiopian Clients"
          sub="Full-stack products, AI integrations, and automation systems built for clients across Australia, Ethiopia, and beyond."
        />

        <ProjectCarousel projects={clientProjects} onOpen={openModal} />
      </section>

      {/* PERSONAL PROJECTS — grid */}
      <section id="personal" className="scroll-mt-12">
        <SectionHeading
          icon={<Sparkles size={12} />}
          label="Personal Projects"
          title="Things I Built Because I Wanted To"
          sub="Side projects and experiments — some turned into real products, some remain prototypes. All taught me something."
        />
        <ProjectCarousel projects={personalProjects} onOpen={openModal} />
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="scroll-mt-12">
        <SectionHeading
          icon={<Building2 size={12} />}
          label="Experience"
          title="Where I've Worked"
          sub="8+ years across startups and agencies — including CTO roles. Full history in the résumé."
        />
        <div className="divide-y divide-border border-t border-border">
          {experience.map((e) => (
            <div key={e.company + e.dates} className="py-5 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-x-6 gap-y-1">
              <div>
                <h3 className="font-semibold">
                  {e.role} <span className="text-muted-foreground font-normal">· {e.company}</span>
                </h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{e.note}</p>
              </div>
              <p className="text-sm text-muted-foreground tabular-nums sm:text-right">{e.dates}</p>
            </div>
          ))}
        </div>
      </section>

      {/* RECOMMENDATIONS */}
      <section id="recommendations" className="scroll-mt-12">
        <SectionHeading
          icon={<MessageSquareQuote size={12} />}
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
      <section id="articles" className="scroll-mt-12">
        <SectionHeading
          icon={<FileText size={12} />}
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
      <section id="about" className="scroll-mt-12">
        <SectionHeading icon={<UserRound size={12} />} label="About" title="Who's Building This" />
        <div className="grid gap-10 md:grid-cols-2 md:items-start">
          <div className="space-y-4">
            {aboutParagraphs.map((para, i) => (
              <p key={i} className="text-muted-foreground leading-relaxed">
                {para}
              </p>
            ))}
            <a
              href="/Surafel-Yimam-Resume.pdf"
              download
              className="inline-flex items-center gap-2 text-sm font-medium border border-border rounded-full px-4 py-2 hover:border-primary hover:text-primary hover:bg-primary/5 transition"
            >
              <Download size={15} /> Download résumé
            </a>
          </div>
          <div className="space-y-5">
            <div className="terminal-border bg-card p-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Stack
              </h3>
              <StackChips items={stackList} />
            </div>
            <div className="terminal-border bg-card p-6">
              <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                <GraduationCap size={14} /> Education
              </h3>
              <p className="font-medium">{education.institution}</p>
              <p className="text-sm text-muted-foreground">{education.degree}</p>
              <p className="text-sm text-muted-foreground">Graduated {education.graduation}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="scroll-mt-12 text-center py-8">
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

      {/* PROJECT MODAL */}
      <AnimatePresence>
        {modal && (
          <ProjectModal
            project={modal.list[modal.index]}
            position={`${modal.index + 1} / ${modal.list.length}`}
            onPrev={() => stepModal(-1)}
            onNext={() => stepModal(1)}
            onClose={closeModal}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ProjectCarousel({
  projects,
  onOpen,
}: {
  projects: PortfolioProject[];
  onOpen: (list: PortfolioProject[], index: number) => void;
}) {
  const [slide, setSlide] = useState(0);
  const last = projects.length - 1;
  const go = (dir: -1 | 1) =>
    setSlide((s) => Math.min(last, Math.max(0, s + dir)));

  return (
    <div>
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${slide * 100}%)` }}
        >
          {projects.map((p, i) => (
            <div key={p.id} className="w-full shrink-0 px-0.5">
              <button
                onClick={() => onOpen(projects, i)}
                className="group w-full text-left"
              >
                {p.image && (
                  <div className="h-52 md:h-72 w-full overflow-hidden rounded-2xl border border-border bg-secondary mb-6">
                    <ImageWithFallback
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                      showIcon={false}
                      fallbackText={p.name}
                    />
                  </div>
                )}
                <div>
                  <div className="flex items-baseline justify-between gap-4 mb-2">
                    <h3 className="text-2xl md:text-3xl font-bold tracking-tight">{p.name}</h3>
                    <span className="hidden sm:inline-block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground shrink-0">
                      {p.badge}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-primary mb-4">{p.subtitle}</p>
                  <p className="text-muted-foreground leading-relaxed max-w-2xl mb-5">
                    {p.description}
                  </p>
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <StackChips items={p.stack} />
                    <span className="text-sm font-medium text-primary inline-flex items-center gap-1 opacity-60 group-hover:opacity-100 transition">
                      View details <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Carousel controls */}
      <div className="flex items-center justify-between mt-5">
        <div className="flex gap-1.5">
          {projects.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              aria-label={`Go to item ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === slide ? "w-7 bg-primary" : "w-3 bg-border hover:bg-muted-foreground/40"
              }`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground tabular-nums mr-1">
            {slide + 1} / {projects.length}
          </span>
          <button
            onClick={() => go(-1)}
            disabled={slide === 0}
            aria-label="Previous"
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-border hover:bg-secondary transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => go(1)}
            disabled={slide === last}
            aria-label="Next"
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-border hover:bg-secondary transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

function ProjectModal({
  project: p,
  position,
  onPrev,
  onNext,
  onClose,
}: {
  project: PortfolioProject;
  position: string;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-card border border-border rounded-2xl shadow-xl p-8"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition"
        >
          <X size={20} />
        </button>

        {p.image && (
          <div className="h-44 w-full overflow-hidden rounded-xl border border-border bg-secondary mb-5">
            <ImageWithFallback
              src={p.image}
              alt={p.name}
              className="w-full h-full object-cover object-top"
              showIcon={false}
              fallbackText={p.name}
            />
          </div>
        )}

        <div className="flex items-center gap-4 mb-5 pr-8">
          <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-primary/10 text-2xl shrink-0">
            {p.icon}
          </div>
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground border border-border rounded-full px-2.5 py-0.5">
              {p.badge}
            </span>
            <h3 className="text-2xl font-bold tracking-tight mt-1">{p.name}</h3>
            <p className="text-sm font-medium text-primary">{p.subtitle}</p>
          </div>
        </div>

        <p className="text-muted-foreground leading-relaxed mb-5">{p.description}</p>

        <div className="mb-6">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Stack
          </h4>
          <StackChips items={p.stack} />
        </div>

        {p.link?.url && (
          <a
            href={p.link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline mb-6"
          >
            <ExternalLink size={14} /> {p.link.label}
          </a>
        )}

        <div className="flex items-center justify-between border-t border-border pt-4 mt-2">
          <span className="text-xs text-muted-foreground tabular-nums">{position}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={onPrev}
              aria-label="Previous project"
              className="inline-flex items-center gap-1 text-sm border border-border rounded-lg px-3 py-1.5 hover:bg-secondary transition"
            >
              <ChevronLeft size={16} /> Prev
            </button>
            <button
              onClick={onNext}
              aria-label="Next project"
              className="inline-flex items-center gap-1 text-sm border border-border rounded-lg px-3 py-1.5 hover:bg-secondary transition"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function HeroIcon({
  href,
  label,
  external,
  children,
}: {
  href: string;
  label: string;
  external?: boolean;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      title={label}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-muted-foreground hover:text-primary hover:bg-secondary transition"
    >
      {children}
    </a>
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
