/**
 * The life map: everything I do, and the threads between them.
 * A node is one thing (a project, a set, an essay, a cause) or a thread that runs through many (biomedical
 * engineering, agents, live coding, Ethiopia, writing). A link says why two things are connected, in a short note
 * shown under the other end when you open either one.
 */
import type { Side } from "./site";

export type Kind = "thread" | "work" | "music" | "art" | "writing" | "cause";

export type MapNode = {
  id: string;
  label: string;
  kind: Kind;
  blurb: string;
  href?: string;
  /** A handwritten note drawn next to the node on the map. */
  note?: string;
};

export type MapLink = { a: string; b: string; why: string };

export const kinds: Record<Kind, { name: string; lean: Side }> = {
  thread: { name: "Threads", lean: "middle" },
  work: { name: "Work", lean: "engineer" },
  music: { name: "Music", lean: "artist" },
  art: { name: "Art", lean: "artist" },
  writing: { name: "Writing", lean: "middle" },
  cause: { name: "Causes", lean: "middle" },
};

export const nodes: MapNode[] = [
  // Threads
  { id: "biomed", label: "Biomedical engineering", kind: "thread", blurb: "BSc, University of Gondar, 2023, cum laude. The first way I learned to build: for patients and the people who care for them.", note: "where it started" },
  { id: "agents", label: "AI agents", kind: "thread", blurb: "Most of my work now: agents that research, sell, support and report, and the systems that keep them honest.", href: "/work" },
  { id: "livecode", label: "Live coding", kind: "thread", blurb: "Writing music as code, in front of people, and building the instruments to do it.", href: "/music" },
  { id: "ethiopia", label: "Ethiopia", kind: "thread", blurb: "Home. Many of my products are built for the constraints here: bandwidth, payments, Amharic, trust.", href: "/ethiopia" },
  { id: "teaching", label: "Teaching", kind: "thread", blurb: "Showing other people how: software, languages, and music as code.", href: "/writing" },
  { id: "words", label: "Writing", kind: "thread", blurb: "Essays, build notes and ideas that keep growing.", href: "/writing" },

  // Work
  { id: "infinity", label: "Hospital equipment", kind: "work", blurb: "Biomedical engineer at Infinity, 2022 to 2023, with the team that installs, trains staff on and maintains hospital equipment across Ethiopia.", href: "/ethiopia" },
  { id: "budera", label: "Budera", kind: "work", blurb: "Built as CTO in 2025: an AI business partner with five built-in agents working from real Stripe, Shopify and Analytics data.", href: "/work" },
  { id: "autopilot", label: "Autopilot", kind: "work", blurb: "An AI agent CRM that texts new leads in seconds, calls the quiet ones with an AI voice, and books the job.", href: "/work" },
  { id: "homewise", label: "Homewise", kind: "work", blurb: "AI and SDR automation for a North Carolina company, so reps only talk to leads who are ready.", href: "/work" },
  { id: "conducting", label: "Conducting OS", kind: "work", blurb: "Celerus.io: sales, support, analytics, scheduling and reporting agents coordinated by one conductor.", href: "/work" },
  { id: "openclaw", label: "OpenClaw agents", kind: "work", blurb: "Fifteen scheduled agents that research, audit, write and draft outreach, many driving a real Chrome window.", href: "/work" },
  { id: "apleo", label: "Apleo", kind: "work", blurb: "Every scholarship, job, fellowship and grant worth your shot, across 190+ countries, with personal matches.", href: "/work" },
  { id: "celerus-pay", label: "Celerus Pay", kind: "work", blurb: "Payroll for multi-branch organisations, with Ethiopian income tax and pension built in, in English and Amharic.", href: "/work" },
  { id: "inventory", label: "Celerus Inventory", kind: "work", blurb: "A stock ledger where every quantity and cost comes from transactions. Running at AgriSun Ethiopia.", href: "/work" },
  { id: "nibret", label: "Nibret", kind: "work", blurb: "Built as CTO: find a home in Ethiopia, with listings, a CRM and a full Amharic interface.", href: "/work" },
  { id: "medical-hub", label: "Ethiopian Medical Hub", kind: "work", blurb: "Equipment, engineers, tenders and training for Ethiopia's healthcare supply chain, in one marketplace.", href: "/ethiopia" },
  { id: "coffee", label: "Coffee Guide", kind: "work", blurb: "Connects specialty-coffee roasters abroad with verified Ethiopian exporters.", href: "/ethiopia" },
  { id: "mindbridge", label: "MindBridge", kind: "work", blurb: "An AI therapy companion on Telegram with mood tracking, CBT-based exercises and crisis detection.", href: "/work" },
  { id: "hardware", label: "Raspberry Pi and solar", kind: "work", blurb: "Several projects wiring Raspberry Pis to solar inverters and other equipment, for monitoring and alarms.", href: "/work" },
  { id: "kebele", label: "Kebele Zero", kind: "work", blurb: "A 3D community world you drive around, with events, a marketplace, radio, a forum and games.", href: "/art" },

  // Music and art
  { id: "set", label: "Live-coded set", kind: "music", blurb: "At Dagmawi Babi's event I taught a room to write music as code, then performed a live-coded set.", href: "/music" },
  { id: "crossfade", label: "Crossfade Lab", kind: "music", blurb: "My DJ booth in the browser: two decks, live coding on the beat, stems, shader visuals and real DMX lights.", href: "/music" },
  { id: "visualspam", label: "VisualSpam", kind: "art", blurb: "My art practice: visuals, audio, shows and a video diary. A firehose of one life.", href: "/art" },
  { id: "garden", label: "Garden", kind: "art", blurb: "A digital garden for essays, notes and logs that keep growing.", href: "/writing" },

  // Writing
  { id: "essay-agents", label: "Five-agent orchestration", kind: "writing", blurb: "How I built a system where five agents work together like an orchestra, with one conductor.", href: "/writing/5-agent-orchestration" },
  { id: "essay-seo", label: "Automating SEO reporting", kind: "writing", blurb: "Replacing a daily manual report across seven clients with an agent and a digest.", href: "/writing/automating-seo-searchatlas" },
  { id: "essay-ethiopia", label: "Building in Ethiopia", kind: "writing", blurb: "What building in a constrained market taught me about building anywhere.", href: "/writing/building-in-ethiopia" },
  { id: "mindcoding", label: "MindCoding", kind: "writing", blurb: "My own attempt at teaching people to write software.", href: "/writing" },
  { id: "mindlearning", label: "MindLearning", kind: "writing", blurb: "My own attempt at teaching languages.", href: "/writing" },
  { id: "bytesoul", label: "Bytesoul", kind: "writing", blurb: "An idea about meeting people: eleven real tests instead of selfies and swiping.", href: "/writing" },

  // Causes
  { id: "dimtse", label: "Dimtse · ድምፄ", kind: "cause", blurb: "A free talk board for non-verbal children, driven by their eyes or head, in Amharic and English.", href: "/ethiopia" },
  { id: "happy-lucky", label: "Happy Lucky", kind: "cause", blurb: "Sunday mentoring and essentials for kids and charity homes. It began as a letter on a Sunday.", href: "/ethiopia" },
  { id: "ohwc", label: "One Heart Wholeness Centre", kind: "cause", blurb: "A day therapy centre in Bahir Dar for 28 children with profound disabilities. Happy Lucky's first visit, and I built their new website.", href: "/ethiopia" },
];

export const links: MapLink[] = [
  // Where it started
  { a: "biomed", b: "infinity", why: "my degree put me in hospitals, keeping their equipment running." },
  { a: "infinity", b: "medical-hub", why: "I saw the supply chain from the inside before building a marketplace for it." },
  { a: "biomed", b: "dimtse", why: "assistive technology is biomedical engineering for one child at a time." },
  { a: "biomed", b: "mindbridge", why: "health, this time for the mind." },
  { a: "biomed", b: "hardware", why: "the same habit of building with equipment, not only screens." },
  { a: "medical-hub", b: "ethiopia", why: "it's built for Ethiopian hospitals and clinics." },

  // Agents
  { a: "agents", b: "budera", why: "five built-in agents, plus the ones founders build." },
  { a: "agents", b: "autopilot", why: "its agent texts, calls and books leads." },
  { a: "agents", b: "conducting", why: "one conductor coordinating five specialist agents." },
  { a: "agents", b: "openclaw", why: "fifteen of them, running on a schedule." },
  { a: "agents", b: "homewise", why: "AI qualification and follow-up for a sales team." },
  { a: "agents", b: "mindbridge", why: "a companion agent with crisis detection." },
  { a: "agents", b: "apleo", why: "an AI assistant matches people to opportunities." },
  { a: "autopilot", b: "homewise", why: "the same problem: only talk to leads who are ready." },
  { a: "essay-agents", b: "conducting", why: "the essay is the story of how Conducting OS works." },
  { a: "essay-seo", b: "openclaw", why: "the reporting agent runs on OpenClaw." },
  { a: "essay-agents", b: "words", why: "a build note." },
  { a: "essay-seo", b: "words", why: "a build note." },

  // Ethiopia
  { a: "ethiopia", b: "nibret", why: "homes in Ethiopia, fully in Amharic." },
  { a: "ethiopia", b: "celerus-pay", why: "Ethiopian tax bands, pension and birr built in." },
  { a: "celerus-pay", b: "inventory", why: "two modules of the same Celerus suite." },
  { a: "celerus-pay", b: "conducting", why: "both are Celerus." },
  { a: "inventory", b: "ethiopia", why: "it runs at AgriSun Ethiopia today." },
  { a: "ethiopia", b: "coffee", why: "Ethiopian coffee, to roasters abroad." },
  { a: "ethiopia", b: "kebele", why: "a kebele is a neighbourhood; this one is 3D." },
  { a: "ethiopia", b: "essay-ethiopia", why: "what building here taught me." },
  { a: "essay-ethiopia", b: "words", why: "an essay." },
  { a: "ethiopia", b: "dimtse", why: "Amharic voices that almost no device has." },

  // Causes
  { a: "dimtse", b: "happy-lucky", why: "Dimtse is made with Happy Lucky Chacho in Bahir Dar." },
  { a: "happy-lucky", b: "ohwc", why: "it was the project's first visit, and I built the centre's website through it." },
  { a: "dimtse", b: "ohwc", why: "both are for children who can't easily speak for themselves." },
  { a: "happy-lucky", b: "ethiopia", why: "kids and charity homes here." },

  // Teaching
  { a: "teaching", b: "mindcoding", why: "teaching software, on my own." },
  { a: "teaching", b: "mindlearning", why: "teaching languages, on my own." },
  { a: "teaching", b: "set", why: "I taught the room to write music as code before playing." },
  { a: "mindcoding", b: "mindlearning", why: "two tries at the same thing: helping people learn." },
  { a: "teaching", b: "words", why: "writing is teaching slowed down." },

  // Music and art
  { a: "livecode", b: "set", why: "performed live, typed in front of the room." },
  { a: "livecode", b: "crossfade", why: "it has live coding on the beat built in." },
  { a: "crossfade", b: "visualspam", why: "the same shows: sound, visuals and light." },
  { a: "livecode", b: "visualspam", why: "live coding is part of the practice." },
  { a: "visualspam", b: "garden", why: "the garden grows out of VisualSpam." },
  { a: "garden", b: "words", why: "where the longer notes live." },
  { a: "bytesoul", b: "words", why: "an idea still growing." },
  { a: "kebele", b: "visualspam", why: "a world to wander, with its own radio." },
];
