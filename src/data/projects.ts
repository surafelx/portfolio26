import type { PortfolioProject } from "@/data/types";

export type { PortfolioProject } from "@/data/types";

// Client work — shown as a horizontal slider on the home page.
export const clientProjects: PortfolioProject[] = [
  {
    id: "celerus",
    name: "Celerus.io",
    subtitle: "AI Agent Orchestration Platform",
    icon: "🤖",
    badge: "AI / Agents",
    description:
      "Designed and built a multi-agent AI system where 5 specialized agents work together like an orchestra — sales, support, analytics, scheduling, and reporting, all coordinated through an orchestration layer.",
    stack: ["Next.js", "TypeScript", "OpenAI API", "Telegram", "Tailwind"],
    link: { label: "celerus.io", url: "https://celerus.io" },
  },
  {
    id: "vigs-seo",
    name: "VIGS SEO",
    subtitle: "SEO Operations Automation",
    icon: "📈",
    badge: "Automation",
    description:
      "Built an automation layer connecting the SearchAtlas API to OpenClaw for an SEO agency. Daily digest reports, proactive alerts, backlink monitoring, and Monday.com auto-tasks for 7 Australian clients.",
    stack: ["SearchAtlas API", "OpenClaw", "Node.js", "Monday.com", "Telegram"],
  },
  {
    id: "ethiopian-medical-hub",
    name: "Ethiopian Medical Hub",
    subtitle: "B2B Healthcare Marketplace",
    icon: "🏥",
    badge: "Full-Stack",
    description:
      "Co-built a B2B marketplace connecting Ethiopian healthcare suppliers with buyers across East Africa. Full product strategy, revenue model, and platform build.",
    stack: ["Next.js", "PostgreSQL", "Prisma", "Stripe", "Email automation"],
  },
  {
    id: "ethiopian-coffee-guide",
    name: "Ethiopian Coffee Guide",
    subtitle: "B2B Specialty Coffee Export Platform",
    icon: "☕",
    badge: "Product",
    description:
      "Built the product vision and platform for a B2B marketplace connecting international specialty-coffee buyers with Ethiopian exporters. Revenue model: paid profiles + FOB commission + agent fees.",
    stack: ["Next.js", "PostgreSQL", "Prisma", "Brand positioning", "GTM"],
  },
  {
    id: "nexus-solar",
    name: "Nexus Solar Platform",
    subtitle: "Solar Operations SaaS",
    icon: "☀️",
    badge: "Full-Stack SaaS",
    description:
      "Full-stack SaaS platform for solar company operations — company profiles, PV array analysis, load assessment reports, and multi-platform delivery (web, Android, iOS).",
    stack: ["React", "Next.js", "Node.js", "MongoDB", "REST API"],
  },
  {
    id: "nibret",
    name: "Nibret.com",
    subtitle: "Ethiopian Client",
    icon: "🌱",
    badge: "Ethiopian Client",
    description:
      "Full-stack web build for an Ethiopian client.",
    stack: ["Next.js", "Node.js"],
  },
  {
    id: "rubypictures",
    name: "RubyPictures.com",
    subtitle: "Ethiopian Client",
    icon: "📸",
    badge: "Ethiopian Client",
    description:
      "Website build for a creative studio.",
    stack: ["Next.js", "Tailwind"],
  },
  {
    id: "kebelezero",
    name: "Kebelezero.com",
    subtitle: "Ethiopian Client",
    icon: "🌍",
    badge: "Ethiopian Client",
    description:
      "Full-stack web build for an Ethiopian client.",
    stack: ["Next.js", "Node.js"],
  },
  {
    id: "yenesuzuki",
    name: "Yenesuzuki.com",
    subtitle: "Global Client",
    icon: "⚙️",
    badge: "Global Client",
    description:
      "Website build for an automotive client.",
    stack: ["Next.js"],
  },
  {
    id: "agrisun",
    name: "AgriSun Ethiopia",
    subtitle: "Agricultural Reference",
    icon: "🌾",
    badge: "Ethiopian Client",
    description:
      "Reference letter and documentation prepared for agricultural operations and export work in Ethiopia.",
    stack: ["Document preparation"],
  },
];

// Personal projects — shown as a grid on the home page.
export const personalProjects: PortfolioProject[] = [
  {
    id: "mindbridge",
    name: "MindBridge",
    subtitle: "AI Therapy Companion",
    icon: "🧠",
    badge: "Personal",
    description:
      "A personal AI therapy and wellness companion with encrypted mood tracking, journaling, and AI chat via Telegram. Includes 7 therapy exercises (CBT thought records, grounding, box breathing, self-compassion, behavioral activation, values clarification, grief work). AES-256-GCM field-level encryption with built-in crisis detection.",
    stack: ["Next.js", "Prisma", "Telegram Bot", "OpenAI", "AES-256", "PostgreSQL"],
    link: { label: "Private build" },
  },
  {
    id: "conducting-ai",
    name: "Conducting.ai",
    subtitle: "Multi-Agent AI Orchestration",
    icon: "🎯",
    badge: "Personal",
    description:
      "The core architecture behind Celerus.io — 5 independent AI agents that coordinate through an orchestration layer. Each agent handles a distinct role (sales, support, analytics, scheduling, reporting) and the system manages communication between them.",
    stack: ["Next.js", "TypeScript", "OpenAI Assistants", "Agent orchestration"],
    link: { label: "celerus.io", url: "https://celerus.io" },
  },
  {
    id: "abebe",
    name: "Abebe — My AI Assistant",
    subtitle: "OpenClaw-Powered Assistant",
    icon: "🤝",
    badge: "Personal",
    description:
      "A persistent AI assistant running on an EC2 server, connected to Telegram. Handles scheduling, reminders, research, writing, opportunity finding, and daily check-ins. Built with OpenClaw, Google Calendar API, and AfroMessage SMS.",
    stack: ["OpenClaw", "Telegram", "Google Calendar", "AfroMessage", "Node.js"],
    link: { label: "Personal tool" },
  },
  {
    id: "opportunity-finder",
    name: "Opportunity Finder",
    subtitle: "Scholarship & Freelance Tracker",
    icon: "🔍",
    badge: "Personal",
    description:
      "Automated system that proactively searches for scholarships, fellowships, freelance gigs, and writing opportunities relevant to my goals. Delivers results formatted for Telegram with source links and deadlines.",
    stack: ["OpenClaw", "Web scraping", "Telegram", "Scheduler"],
    link: { label: "Personal tool" },
  },
];

export function getClientProjects(): PortfolioProject[] {
  return clientProjects;
}

export function getPersonalProjects(): PortfolioProject[] {
  return personalProjects;
}
