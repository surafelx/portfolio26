import type { About } from "@/data/types";

export type { About } from "@/data/types";

// Paragraphs for the home "About" section.
export const aboutParagraphs: string[] = [
  "I'm a full-stack software engineer with 9+ years of experience — currently Chief Agent Officer at Vision Infrastructure Group Services (Sydney) and co-founder of Celerus.io, based in Addis Ababa, Ethiopia. I've been building since I was a kid, driven by turning ideas into innovative, user-friendly products.",
  "I work across the full stack and the MERN ecosystem: React, Next.js, Vue, and Angular on the frontend; Node.js and MongoDB on the backend; plus CMS platforms (WordPress, Shopify, HubSpot) and solid DevOps / CI-CD practices.",
  "I'm a big believer in vibe-coding — moving fast with AI to prototype and ship ideas in hours, not weeks. But the real value is in the cleanup: years of experience mean I can take AI-generated or rushed code and turn it into something typed, tested, and genuinely production-ready.",
  "Right now I'm building an AI-powered eLearning platform, interactive 3D modeling tools, and a recruiting venture connecting Ethiopian talent with U.S. software opportunities.",
];

// Flat tech list for the home "About" stack panel.
export const stackList: string[] = [
  "JavaScript", "TypeScript", "Python",
  "React", "Next.js", "Vue.js", "Angular",
  "Node.js", "Express", "MERN stack",
  "MongoDB", "PostgreSQL", "Redis",
  "REST & GraphQL", "WordPress", "Shopify", "HubSpot",
  "OpenAI API", "LangChain", "OpenClaw",
  "Docker", "CI/CD", "Git",
  "Vibe-coding", "Code cleanup",
];

// Certifications (from LinkedIn profile).
export const certifications: string[] = [
  "Introduction to Cloud Computing",
  "HTML, CSS, & JavaScript",
];

// Condensed experience timeline for the home "Experience" section.
export const experience = [
  { company: "Vision Infrastructure Group Services", role: "Chief Agent Officer", dates: "Mar 2026 — Present", note: "Leading AI agent strategy and delivery — agentic systems and AI infrastructure. (Sydney, NSW)" },
  { company: "Celerus.io", role: "Co-Founder", dates: "Aug 2024 — Present", note: "Co-founded an AI agents platform; analytics, dashboards, and predictive models for global clients." },
  { company: "Budera", role: "Chief Technology Officer", dates: "Apr 2025 — Sep 2025", note: "Led an AI-powered business-partner SaaS from idea to MVP; 5 orchestrated AI agents. (Singapore)" },
  { company: "Coderz", role: "Product Manager", dates: "Nov 2024 — Jan 2025", note: "Product management for a coding-education product." },
  { company: "Empire Business", role: "Senior Web Developer", dates: "Oct 2024 — Jan 2025", note: "Sales funnels and CRM automation that improved client lead conversion." },
  { company: "AgriSun Ethiopia", role: "Technology Lead", dates: "Jan 2023 — Sep 2024", note: "Software for solar-powered agriculture, IoT, and analytics dashboards." },
  { company: "ITIO", role: "Full Stack Engineer", dates: "Jun 2020 — Sep 2023", note: "End-to-end web apps — website testing tool, social platform, and solar monitoring." },
];

export const education = {
  institution: "University of Gondar",
  degree: "BSc. Biomedical Engineering",
  graduation: "2023",
};

// Full structured about used by the /about resume page.
export const about: About = {
  id: "about",
  summary: aboutParagraphs.join(" "),
  skills: {
    programming: ["JavaScript", "TypeScript", "Python"],
    tools: ["React", "Next.js", "Vue.js", "Angular", "Node.js", "Express"],
    databases: ["MongoDB", "PostgreSQL", "Redis"],
    ai: ["OpenAI API", "LangChain", "OpenClaw", "AI agents"],
    testing: ["Unit", "Integration", "E2E", "TDD"],
    devops: ["Docker", "CI/CD", "AWS", "Git"],
    other: ["MERN stack", "REST & GraphQL", "WordPress", "Shopify", "HubSpot"],
  },
  experience: experience.map((e) => ({
    company: e.company,
    position: e.role,
    dates: e.dates,
    description: [e.note],
  })),
  education: {
    institution: "University of Gondar",
    degree: "BSc. Biomedical Engineering",
    graduation: "2023",
  },
  qualifications: certifications,
  contact: {
    email: "workwithsurafel@gmail.com",
    location: "Addis Ababa, Ethiopia",
    responseTime: "Usually responds within 24h",
  },
  socialLinks: {
    github: "https://github.com/surafelx",
    linkedin: "https://www.linkedin.com/in/surafelykebede",
    website: "https://www.surafel.work",
  },
  resumeUrl: "/Surafel-Yimam-Resume.pdf",
};

export function getAbout(): About {
  return about;
}
