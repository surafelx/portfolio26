import type { About } from "@/data/types";

export type { About } from "@/data/types";

// Paragraphs for the home "About" section.
export const aboutParagraphs: string[] = [
  "I'm a full-stack software engineer with 8+ years of experience — currently Chief AI Officer at Vision Infrastructure Services and a former CTO at Budera, based in Addis Ababa, Ethiopia. I've been building since I was a kid, driven by turning ideas into innovative, user-friendly products.",
  "I work across the full stack: Python (Django, FastAPI) and Node.js on the backend, React and Next.js on the frontend, PostgreSQL/MongoDB for data, and the OpenAI/LangChain stack for AI features. I deploy, I debug, I ship.",
  "I'm a big believer in vibe-coding — moving fast with AI to prototype and ship ideas in hours, not weeks. But the real value is in the cleanup: years of experience mean I can take AI-generated or rushed code and turn it into something typed, tested, and genuinely production-ready.",
  "I've led product from idea to MVP, architected multi-agent AI systems, built B2B marketplaces and SaaS platforms, and shipped 20+ projects for Australian, Ethiopian, and global clients — comfortable with international teams, async work, and tight deadlines.",
];

// Condensed experience timeline (from CV) for the home "Experience" section.
export const experience = [
  { company: "Vision Infrastructure Services", role: "Chief AI Officer", dates: "Mar 2026 — Present", note: "Leading AI strategy and delivery — agentic systems and AI infrastructure for the business and its clients." },
  { company: "Agrisun Engineering", role: "Senior Software Engineer", dates: "2024 — Present", note: "Software for solar-powered agriculture, IoT, and analytics dashboards." },
  { company: "Budera", role: "CTO / Senior Software Engineer", dates: "2025", note: "Led an AI-powered business-partner SaaS from idea to MVP; built 5 orchestrated AI agents." },
  { company: "Celerus", role: "CTO / Senior Software Engineer", dates: "2024 — 2025", note: "Talent-assessment tooling, recruitment automation, and predictive analytics." },
  { company: "Nibret", role: "CTO / Senior Software Engineer", dates: "2024 — 2025", note: "Full-stack SaaS real-estate platform across web, Android, and iOS." },
  { company: "ITIO", role: "Software Engineer", dates: "2022 — 2024", note: "End-to-end web apps with Node.js/React/MongoDB and TDD." },
  { company: "Freelance · Upwork", role: "Software Engineer", dates: "2020 — 2022", note: "Delivered 20+ full-stack web and mobile projects for global clients." },
];

export const education = {
  institution: "University of Gondar",
  degree: "BSc. Biomedical Engineering — Cum Laude (3.6 GPA)",
  graduation: "2023",
};

// Flat tech list for the home "About" stack panel.
export const stackList: string[] = [
  "JavaScript", "TypeScript", "Python", "SQL",
  "React", "Next.js", "Tailwind CSS",
  "Node.js", "Next.js API Routes",
  "PostgreSQL", "Prisma", "MongoDB",
  "OpenAI API", "Assistants v2", "LangChain",
  "Google Calendar", "Monday.com", "Telegram",
  "SearchAtlas API", "Git", "Docker", "OpenClaw",
  "Vibe-coding", "Code cleanup",
];

// Full structured about used by the /about resume page.
export const about: About = {
  id: "about",
  summary: aboutParagraphs.join(" "),
  skills: {
    programming: ["JavaScript", "TypeScript", "Python", "SQL"],
    tools: ["Git", "Monday.com", "Google Calendar", "SearchAtlas API"],
    databases: ["PostgreSQL", "Prisma", "MongoDB"],
    ai: ["OpenAI API", "Assistants v2", "LangChain", "OpenClaw"],
    testing: ["Vitest", "Playwright"],
    devops: ["Docker", "Vercel", "EC2"],
    other: ["React", "Next.js", "Tailwind CSS", "Telegram Bot API"],
  },
  experience: [
    {
      company: "Independent / Freelance",
      position: "Full-Stack & AI Engineer",
      dates: "2022 — Present",
      location: "Remote / Addis Ababa",
      description: [
        "Built AI agent platforms and automation systems for Australian and global clients.",
        "Co-built B2B marketplaces for Ethiopian healthcare and specialty-coffee export.",
        "Shipped full-stack SaaS across web, Android, and iOS.",
      ],
    },
  ],
  education: {
    institution: "University of Gondar",
    degree: "BSc. Biomedical Engineering (Cum Laude)",
    graduation: "2023",
    gpa: "3.6",
  },
  contact: {
    email: "workwithsurafel@gmail.com",
    location: "Addis Ababa, Ethiopia",
    responseTime: "Usually responds within 24h",
  },
  socialLinks: {
    github: "https://github.com/surafelx",
    linkedin: "https://www.linkedin.com/in/surafelykebede",
  },
  resumeUrl: "/Surafel Yimam CV.pdf",
};

export function getAbout(): About {
  return about;
}
