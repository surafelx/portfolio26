import type { About } from "@/data/types";

export type { About } from "@/data/types";

// Static "about" content for the resume/about page. Edit to taste.
export const about: About = {
  id: "about",
  summary:
    "Full-stack engineer who likes building products end to end — from the data model to the pixels. I care about fast feedback loops, clean abstractions, and shipping things people actually use. Lately I've been working at the intersection of real-time systems and AI tooling.",
  qualifications: [
    "AWS Certified Solutions Architect – Associate",
    "Meta Front-End Developer Professional Certificate",
    "Contributor to several open-source TypeScript libraries",
  ],
  skills: {
    programming: ["TypeScript", "JavaScript", "Python", "Go", "Rust", "SQL"],
    tools: ["Git", "Vite", "Webpack", "Figma", "Linear"],
    databases: ["PostgreSQL", "MongoDB", "Redis", "DuckDB"],
    ai: ["LLM apps", "Diffusion models", "Embeddings", "RAG pipelines"],
    testing: ["Vitest", "Playwright", "Jest", "Testing Library"],
    devops: ["Docker", "Kubernetes", "GitHub Actions", "Terraform", "Vercel"],
    other: ["WebSockets", "gRPC", "WebAssembly", "Accessibility"],
  },
  experience: [
    {
      company: "Independent / Freelance",
      position: "Full-Stack Engineer",
      dates: "2022 — Present",
      location: "Remote",
      description: [
        "Designed and shipped real-time collaborative web apps for early-stage startups.",
        "Built self-hosted analytics and internal tooling that replaced costly SaaS subscriptions.",
        "Led migrations from legacy stacks to modern Next.js + TypeScript codebases.",
      ],
    },
    {
      company: "Acme Labs",
      position: "Software Engineer",
      dates: "2020 — 2022",
      location: "Remote",
      description: [
        "Owned the front-end architecture for a multi-tenant SaaS dashboard.",
        "Introduced a component library and testing culture that cut UI regressions noticeably.",
        "Partnered with design to ship an accessible, themeable design system.",
      ],
    },
  ],
  education: {
    institution: "Addis Ababa University",
    degree: "B.Sc. in Computer Science",
    graduation: "2020",
    gpa: "3.8/4.0",
  },
  personalInterests: {
    coffeeAndLateNights: "Best ideas arrive somewhere around the third cup.",
    liveCodingMusic: "I write algorithmic music with Strudel for fun.",
    gamingAndStrategy: "Strategy games are just systems design with a timer.",
    photographyAndTech: "Always chasing good light and a clean frame.",
  },
  contact: {
    email: "hello@example.com",
    location: "Remote (UTC+3)",
    responseTime: "Usually responds within 24h",
  },
  socialLinks: {
    github: "https://github.com/surafelx",
    linkedin: "https://linkedin.com/in/your-handle",
    website: "https://example.com",
  },
  resumeUrl: "/Surafel Yimam CV.pdf",
};

export function getAbout(): About {
  return about;
}
