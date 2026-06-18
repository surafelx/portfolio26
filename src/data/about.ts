import type { About } from "@/data/types";

export type { About } from "@/data/types";

// Paragraphs for the home "About" section.
export const aboutParagraphs: string[] = [
  "I'm a full-stack engineer based in Addis Ababa, Ethiopia who builds production software — AI agents, full-stack applications, and the integrations that connect everything together.",
  "I work across the full stack: React and Next.js on the frontend, Node.js APIs on the backend, PostgreSQL and Prisma for data, and OpenAI's API stack for AI features. I deploy, I debug, I ship.",
  "I've built products for Australian agencies, Ethiopian startups, and global SaaS companies. I'm comfortable working with international clients, async communication, and tight deadlines.",
  "Currently working on VIGS SEO automation, building Ethiopian Medical Hub, and looking for my next opportunity — ideally something that combines AI systems with real business impact.",
];

// Flat tech list for the home "About" stack panel.
export const stackList: string[] = [
  "JavaScript", "TypeScript", "Python", "SQL",
  "React", "Next.js", "Tailwind CSS",
  "Node.js", "Next.js API Routes",
  "PostgreSQL", "Prisma", "MongoDB",
  "OpenAI API", "Assistants v2", "LangChain",
  "Google Calendar", "Monday.com", "Telegram",
  "SearchAtlas API", "Git", "Docker", "OpenClaw",
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
    institution: "Addis Ababa, Ethiopia",
    degree: "Computer Science",
    graduation: "—",
  },
  contact: {
    email: "workwithsurafel@gmail.com",
    location: "Addis Ababa, Ethiopia",
    responseTime: "Usually responds within 24h",
  },
  socialLinks: {
    github: "https://github.com/surafelyimam",
    linkedin: "https://linkedin.com/in/surafelyimam",
  },
  resumeUrl: "/Surafel Yimam CV.pdf",
};

export function getAbout(): About {
  return about;
}
