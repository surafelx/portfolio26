/**
 * Everything the site says lives here.
 * An entry with `draft: true` shows in `npm run dev` with a Draft tag and is left out of production builds.
 */

export const isDev = process.env.NODE_ENV !== "production";

export type Entry = {
  title: string;
  kicker: string;
  body: string;
  image?: string;
  links?: { label: string; href: string }[];
  draft?: boolean;
};

export type PillarId = "work" | "music" | "writing" | "art" | "ethiopia";

export type Pillar = {
  id: PillarId;
  nav: string;
  title: string;
  intro: string;
  /** One line used on the home page door. */
  door: string;
  tone: string;
};

export const profile = {
  name: "Surafel Yimam",
  fullName: "Surafel Yimam Kebede",
  amharic: "ሱራፌል ይማም",
  lede: "I build software, make music with code, make art out of noise, and try to build things that matter here in Ethiopia.",
  about:
    "I'm a software engineer in Addis Ababa. I trained as a biomedical engineer and spent a year keeping hospital equipment running before I went all in on software. Nine years on, I build AI agents and products for teams in the US, Australia and Ethiopia. Away from client work I live-code music, run an art practice called VisualSpam, and build free tools for children and families who need them.",
  location: "Addis Ababa, Ethiopia",
  timeZone: "Africa/Addis_Ababa",
  email: "workwithsurafel@gmail.com",
  phone: "+251 94 551 4370",
  whatsappUrl: "https://wa.me/251945514370",
  telegram: "@youarethethingilovemost",
  telegramUrl: "https://t.me/youarethethingilovemost",
  /** Said wherever availability comes up: hours are not a constraint. */
  hours: "I work in any time zone, and have worked on US, Australian, Chinese and Singapore hours.",
  bookingUrl: "https://cal.com/surafelx",
  cvUrl: "/Surafel-Yimam-Kebede-CV.pdf",
  githubUrl: "https://github.com/surafelx",
  linkedinUrl: "https://www.linkedin.com/in/surafelykebede",
  siteUrl: "https://surafelyimam.com",
};

/** The crossfader's three positions. Each line of the hero has a version for each. */
export type Side = "engineer" | "middle" | "artist";

export const hero: Record<Side, { headline: string; mark: string; lede: string; note: string }> = {
  engineer: {
    headline: "I build AI agents",
    mark: "that actually ship.",
    lede: "Nine years shipping products for teams in the US, Australia and Ethiopia. Trained as a biomedical engineer, so I build the layer underneath too: where data lands, who can see it, and how it keeps running when nobody is watching.",
    note: "the engineer",
  },
  middle: {
    headline: "I build agents by day",
    mark: "and make noise by night.",
    lede: "Software engineer in Addis Ababa. Live coder, VisualSpam, and the person behind a Sunday project for kids and charity homes in Bahir Dar.",
    note: "both, honestly",
  },
  artist: {
    headline: "I make music with code",
    mark: "and art out of noise.",
    lede: "Live-coded sets, the instruments I build to play them, and VisualSpam: a firehose of one life, transcribed, corrupted and reflected back.",
    note: "the artist",
  },
};

export const now: { what: string; detail: string }[] = [
  { what: "Dimtse", detail: "an eye-gaze talk board for children with cerebral palsy" },
  { what: "Crossfade Lab", detail: "a browser DJ booth with live coding and DMX lights" },
  { what: "Autopilot", detail: "an AI CRM that texts, calls and books leads" },
  { what: "Looking for", detail: "a remote forward-deployed or senior AI engineering role" },
];

export const pillars: Pillar[] = [
  {
    id: "work",
    nav: "Work",
    title: "The engineer.",
    intro:
      "AI agents, full-stack products and the systems underneath them. If you're hiring, start here: what I've shipped, where I've worked and how to reach me.",
    door: "AI agents and products, shipped for teams on three continents.",
    tone: "ink",
  },
  {
    id: "music",
    nav: "Music",
    title: "Music, mostly in code.",
    intro: "I write music as code and perform it live, and I build my own instruments for mixing, lights and visuals.",
    door: "Live-coded sets and the instruments I build to play them.",
    tone: "berry",
  },
  {
    id: "writing",
    nav: "Writing",
    title: "Things I think about.",
    intro: "Essays, build notes and half-formed ideas. The longer-running notes grow in my garden.",
    door: "Essays, build notes and ideas still growing.",
    tone: "moss",
  },
  {
    id: "art",
    nav: "Art",
    title: "A firehose of one life.",
    intro:
      "VisualSpam is my art practice: visuals, audio, shows and a video diary, transcribed, corrupted and reflected back.",
    door: "VisualSpam: visuals, audio and experiments.",
    tone: "ember",
  },
  {
    id: "ethiopia",
    nav: "Ethiopia",
    title: "Building for home.",
    intro:
      "I was a biomedical engineer in Ethiopian hospitals before I wrote software for them. These are the things I build because they should exist here.",
    door: "Assistive tech, healthcare and community, built here.",
    tone: "sun",
  },
];

export const music: Entry[] = [
  {
    title: "Live coding music",
    kicker: "Workshop and performance",
    body: "At Dagmawi Babi's event I taught a room how to write music as code, then performed a live-coded set: patterns typed, changed and layered in front of the audience.",
  },
  {
    title: "Crossfade Lab",
    kicker: "Instrument · 2026",
    body: "My own DJ booth in the browser. Two decks with EQ kills, beat-synced live coding, track analysis (BPM, key, Camelot), stem separation, shader visuals and a DMX layer that drives real lights, lasers and fog.",
  },
  {
    title: "Recorded sets",
    kicker: "Coming soon",
    body: "Recordings of sets and live-coded sessions will go here. Add SoundCloud, Mixcloud or YouTube links to this entry.",
    draft: true,
  },
];

export const ideas: Entry[] = [
  {
    title: "Garden",
    kicker: "Digital garden",
    body: "Essays, notes and logs that keep growing, with a private planning studio and a browser extension that files anything worth keeping.",
    image: "/img/garden.jpg",
    links: [{ label: "Open the garden", href: "https://garden.visualspam.et" }],
  },
  {
    title: "Bytesoul",
    kicker: "An idea about meeting people",
    body: "Take eleven real tests to find the bits that make you you, then meet other people who took them too. No selfies, no swiping, no matching.",
    image: "/img/bytesoul.jpg",
    links: [{ label: "Try it", href: "https://byte-love-spark.vercel.app" }],
  },
];

export const teaching: Entry[] = [
  {
    title: "MindCoding",
    kicker: "Teaching · software",
    body: "My own attempt at teaching people to write software, built and run by me.",
  },
  {
    title: "MindLearning",
    kicker: "Teaching · languages",
    body: "My own attempt at teaching languages, built and run by me.",
  },
];

export const art: Entry[] = [
  {
    title: "VisualSpam",
    kicker: "Art home",
    body: "Visuals, audio, shows, live coding and a video diary, as one interactive site.",
    image: "/img/visualspam.jpg",
    links: [
      { label: "visualspam.et", href: "https://www.visualspam.et" },
      { label: "Code", href: "https://github.com/surafelx/visualspam" },
    ],
  },
  {
    title: "Kebele Zero",
    kicker: "3D world",
    body: "Drive around a 3D community world with events, a marketplace, radio, a forum and games.",
    image: "/img/kebele-zero.jpg",
    links: [{ label: "Visit", href: "https://kebelezero.com" }],
  },
];

export const ethiopia: Entry[] = [
  {
    title: "Dimtse · ድምፄ",
    kicker: "Assistive tech · with Happy Lucky Chacho",
    body: "A free talk board for non-verbal children, driven by their eyes or head through a webcam or phone, in Amharic and English. Commercial eye-gaze devices cost thousands of dollars and don't speak Amharic; Dimtse runs on hardware a family already owns. A working prototype, not yet trialled with children.",
    image: "/img/dimtse.jpg",
    links: [{ label: "Open Dimtse", href: "https://dimtse.happyluckychacho.org" }],
  },
  {
    title: "The Happy Lucky Project",
    kicker: "Founder · Nonprofit",
    body: "Sunday mentoring and essentials for kids and charity homes in Ethiopia. It starts with the Sunday 0 letter and a way to join.",
    image: "/img/happy-lucky.jpg",
    links: [{ label: "Read the letter", href: "https://happy-lucky-project.vercel.app" }],
  },
  {
    title: "The One Heart Wholeness Centre",
    kicker: "Website · through Happy Lucky Chacho · 2026",
    body: "A day therapy centre in Bahir Dar for 28 children with profound disabilities, run by Mena since 2013, and Happy Lucky's first visit. I built their new website: English and Amharic, a small CMS the staff update themselves, and ways to give from Ethiopia by bank transfer or Telebirr, or from abroad.",
    image: "/img/ohwc.jpg",
    links: [{ label: "ohwc.org.et", href: "https://www.ohwc.org.et/" }],
  },
  {
    title: "Hospital equipment",
    kicker: "Biomedical engineer · Infinity · 2022–2023",
    body: "Before software, I worked on the equipment Ethiopian hospitals depend on, with the team that installs, trains staff on and maintains it. It's why I build for healthcare from the inside.",
  },
  {
    title: "Ethiopian Medical Hub",
    kicker: "Co-founder · Healthcare",
    body: "Equipment, engineers, tenders and training for Ethiopia's healthcare supply chain, in one marketplace.",
    image: "/img/medical-hub.jpg",
    links: [{ label: "Visit", href: "https://ethiopianmedicalmarketplace.vercel.app" }],
  },
  {
    title: "Ethiopian Coffee Guide",
    kicker: "Coffee export",
    body: "Connects international specialty-coffee roasters with verified Ethiopian exporters.",
    image: "/img/coffee-guide.jpg",
    links: [{ label: "Visit", href: "https://ethiopiancoffeeguide.com" }],
  },
];

/* ---------- Work: the part a recruiter reads ---------- */

export const work = {
  headline: "AI and full-stack engineer.",
  summary:
    "Nine years building products, trained as a biomedical engineer. I design multi-agent systems and the layer underneath them: where data lands, how it gets there, who can see it, and how it keeps running when nobody is watching.",
  availability: "Open to remote forward-deployed and senior AI engineering roles, contract or full-time, in any time zone.",
  stats: [
    { value: "9", label: "years shipping products" },
    { value: "2", label: "CTO roles" },
    { value: "3", label: "countries of clients: US, Australia, Ethiopia" },
    { value: "15", label: "agents running on a schedule" },
  ],
};

export const projects: (Entry & { stack?: string })[] = [
  {
    title: "Budera AI Legion",
    kicker: "Built as CTO · 2025",
    body: "An AI business partner: five built-in agents plus ones founders build themselves, working from real Stripe, Shopify and Analytics data.",
    image: "/img/budera.jpg",
    stack: "Next.js, TypeScript, Postgres, Drizzle, OpenAI-compatible LLMs, Stripe, Shopify",
    links: [
      { label: "Live", href: "https://budera-ai-legion.vercel.app" },
      { label: "Docs", href: "https://github.com/surafelx/budera" },
    ],
  },
  {
    title: "Autopilot",
    kicker: "AI agent CRM · 2026",
    body: "Texts every new lead in seconds, calls the ones who go quiet with a natural AI voice, and books the job, across every client an agency runs.",
    image: "/img/autopilot.jpg",
    stack: "Next.js, Postgres, React Flow, Twilio, Retell, ElevenLabs",
    links: [{ label: "Live", href: "https://autopilot-crm-alpha.vercel.app" }],
  },
  {
    title: "Apleo",
    kicker: "Founder · 2026",
    body: "Every scholarship, job, fellowship and grant worth your shot, across 190+ countries, with personal matches and alerts.",
    image: "/img/apleo-cover.jpg",
    links: [{ label: "Live", href: "https://apleo-delta.vercel.app" }],
  },
  {
    title: "Conducting OS",
    kicker: "Celerus.io",
    body: "Sales, support, analytics, scheduling and reporting agents coordinated by one conductor.",
    image: "/img/conducting-os.jpg",
    links: [
      { label: "Live", href: "https://www.celerus.io" },
      { label: "Code", href: "https://github.com/surafelx/celerus-io" },
    ],
  },
  {
    title: "Celerus Pay",
    kicker: "Celerus suite · Payroll",
    body: "Payroll for multi-branch organisations: income tax and pension built in, amounts in birr, in English and Amharic.",
    image: "/img/celerus-pay.jpg",
    stack: "Next.js, Express, PostgreSQL",
  },
  {
    title: "The One Heart Wholeness Centre",
    kicker: "Website + CMS · through Happy Lucky Chacho",
    body: "A bilingual English and Amharic site for a therapy centre for children with disabilities in Bahir Dar, with a CMS for the staff, live figures and donations by bank, Telebirr and GoFundMe.",
    image: "/img/ohwc.jpg",
    stack: "Static HTML, Vercel functions, Neon Postgres",
    links: [{ label: "Live", href: "https://www.ohwc.org.et/" }],
  },
  {
    title: "Raspberry Pi and solar monitoring",
    kicker: "Hardware · several projects",
    body: "Raspberry Pis wired to solar inverters and other equipment, reading them for monitoring and raising alarms when something goes wrong.",
    stack: "Raspberry Pi, solar inverters, monitoring and alarms",
  },
  {
    title: "OpenClaw agents",
    kicker: "Private · 15 agents",
    body: "Fifteen scheduled agents that research, audit, write and draft outreach. Many drive a real Chrome window the way a person would.",
    stack: "OpenClaw, Python, Playwright, OpenCV, Google Workspace APIs, Whisper, Ollama",
  },
];

export const jobs: { when: string; role: string; org: string }[] = [
  { when: "2026", role: "Chief Agent Officer", org: "Vision Infrastructure Group Services, Sydney" },
  { when: "2026", role: "AI and SDR Automation", org: "Homewise, North Carolina" },
  { when: "", role: "Co-founder", org: "Celerus.io" },
  { when: "2025", role: "CTO", org: "Budera, Singapore" },
  { when: "2024–2025", role: "CTO", org: "Nibret" },
  { when: "", role: "Product Manager", org: "Coderz" },
  { when: "", role: "Senior Web Developer", org: "Empire Business" },
  { when: "", role: "Technology Lead", org: "AgriSun Ethiopia" },
  { when: "2022–2023", role: "Biomedical Engineer", org: "Infinity Advanced Technology Solutions" },
  { when: "", role: "Full-Stack Engineer", org: "ITIO, California" },
];

export const skills: { group: string; items: string }[] = [
  { group: "AI and agents", items: "LangGraph, LangChain, MCP, Claude and OpenAI APIs, RAG, n8n, Playwright" },
  { group: "Full stack", items: "TypeScript, React, Next.js, Node.js, Python, FastAPI, PostgreSQL, MongoDB, Redis" },
  { group: "Shipping", items: "Docker, GitHub Actions, AWS, Vercel, Stripe" },
  { group: "Hardware", items: "Raspberry Pi, solar inverter integration, monitoring and alarms" },
  { group: "Healthcare", items: "Biomedical engineering, hospital equipment, medical supply chain, assistive tech" },
];

export const education = "BSc Biomedical Engineering, University of Gondar, 2023, cum laude.";

export const testimonials: { quote: string; who: string }[] = [
  {
    quote:
      "A very strong fit for AI work. He has a good understanding of structure, was able to pick up concepts and then advance them to new levels, and communication was easy.",
    who: "AI project client, Upwork",
  },
  {
    quote:
      "Surafel did an outstanding job and delivered results far beyond my expectations. I'd highly recommend him to anyone looking for a reliable, skilled full-stack developer.",
    who: "Full-stack project client, Upwork",
  },
];

export const visible = <T extends { draft?: boolean }>(list: T[]) => list.filter((e) => isDev || !e.draft);

/* ---------- Home page picks ---------- */

/** Which end of the crossfader an entry leans to. The home grid moves the matching ones to the front. */
export type Lean = Side;

const pick = (list: Entry[], title: string) => list.find((e) => e.title === title)!;

export const featured: (Entry & { lean: Lean; room: PillarId })[] = [
  { ...pick(projects, "Budera AI Legion"), lean: "engineer", room: "work" },
  { ...pick(ethiopia, "Dimtse · ድምፄ"), lean: "middle", room: "ethiopia" },
  { ...pick(art, "VisualSpam"), lean: "artist", room: "art" },
  { ...pick(projects, "Autopilot"), lean: "engineer", room: "work" },
  { ...pick(music, "Crossfade Lab"), lean: "artist", room: "music" },
  { ...pick(ethiopia, "The Happy Lucky Project"), lean: "middle", room: "ethiopia" },
];
