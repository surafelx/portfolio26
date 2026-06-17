import type { Project } from "@/data/types";

export type { Project } from "@/data/types";

// Static portfolio projects. Edit these freely — they are plain data, no
// database required.
export const projects: Project[] = [
  {
    id: "neural-canvas",
    title: "Neural Canvas",
    brief: "Real-time collaborative AI image studio.",
    description:
      "Neural Canvas is a browser-based studio where teams generate, edit, and remix AI imagery together in real time. It pairs a diffusion backend with a CRDT-synced canvas so multiple people can iterate on the same board without conflicts. The app streams generation progress over WebSockets and keeps a full, branchable history of every prompt and edit.",
    tags: ["AI", "Web", "Realtime"],
    keywords: ["diffusion", "collaboration", "crdt", "websockets", "canvas"],
    techStack: ["Next.js", "TypeScript", "Python", "FastAPI", "WebSockets", "PostgreSQL"],
    imageUrl: "/projects/neural.jpg",
    liveUrl: "https://example.com/neural-canvas",
    githubUrl: "https://github.com/surafelx/neural-canvas",
    year: "2025",
    priority: 9,
    nodeGraph: {
      nodes: [
        { id: "client", type: "input", position: { x: 0, y: 0 }, data: { label: "Canvas Client", description: "React + CRDT", tech: ["Next.js", "Yjs"] } },
        { id: "gateway", type: "default", position: { x: 220, y: 0 }, data: { label: "Realtime Gateway", description: "WebSocket fan-out", tech: ["Node", "ws"] } },
        { id: "infer", type: "default", position: { x: 220, y: 140 }, data: { label: "Inference", description: "Diffusion workers", tech: ["Python", "FastAPI"] } },
        { id: "store", type: "output", position: { x: 440, y: 70 }, data: { label: "History Store", description: "Branchable edits", tech: ["PostgreSQL"] } },
      ],
      edges: [
        { id: "e1", source: "client", target: "gateway", animated: true },
        { id: "e2", source: "gateway", target: "infer" },
        { id: "e3", source: "infer", target: "store" },
        { id: "e4", source: "gateway", target: "store" },
      ],
    },
  },
  {
    id: "meshroute",
    title: "MeshRoute",
    brief: "Edge-first request router with zero-downtime deploys.",
    description:
      "MeshRoute is a lightweight service mesh control plane that pushes routing rules to edge nodes in milliseconds. It supports weighted canaries, automatic rollback on error-budget burn, and a declarative config that compiles to per-node rule sets. Operators get a live topology view and can shift traffic with a single command.",
    tags: ["Infrastructure", "DevOps", "Go"],
    keywords: ["service mesh", "routing", "canary", "edge", "observability"],
    techStack: ["Go", "gRPC", "Redis", "React", "Prometheus"],
    imageUrl: "/projects/mesh.jpg",
    githubUrl: "https://github.com/surafelx/meshroute",
    year: "2024",
    priority: 8,
  },
  {
    id: "pulse-analytics",
    title: "Pulse",
    brief: "Privacy-first product analytics in a single binary.",
    description:
      "Pulse is a self-hosted analytics platform that captures product events without third-party cookies. It ships as one binary with an embedded column store, computes funnels and retention on the fly, and exposes a SQL-like query layer for ad-hoc exploration. Dashboards are shareable and update in near real time.",
    tags: ["Analytics", "Web", "Data"],
    keywords: ["analytics", "privacy", "funnels", "retention", "self-hosted"],
    techStack: ["Rust", "DuckDB", "SvelteKit", "TypeScript"],
    imageUrl: "/projects/pulse.jpg",
    liveUrl: "https://example.com/pulse",
    githubUrl: "https://github.com/surafelx/pulse",
    year: "2024",
    priority: 7,
  },
  {
    id: "syntax-notes",
    title: "Syntax",
    brief: "Markdown notebook that runs your code blocks.",
    description:
      "Syntax turns plain markdown notes into executable notebooks. Fenced code blocks run in sandboxed runtimes, results are inlined under each block, and notes stay diff-friendly as ordinary markdown files. It is built for engineers who want literate docs without leaving their editor.",
    tags: ["Tools", "Web", "Developer"],
    keywords: ["markdown", "notebook", "repl", "sandbox", "documentation"],
    techStack: ["Next.js", "TypeScript", "WebAssembly", "Monaco"],
    imageUrl: "/projects/syntax.jpg",
    githubUrl: "https://github.com/surafelx/syntax",
    year: "2023",
    priority: 6,
  },
  {
    id: "cryptotrack",
    title: "CryptoTrack",
    brief: "Portfolio tracker with on-chain alerts.",
    description:
      "CryptoTrack aggregates balances across wallets and exchanges into one dashboard and watches on-chain activity for the assets you hold. Users set threshold and event alerts (large transfers, governance votes, liquidity changes) and receive them via web push or email. Historical performance is broken down by asset and strategy.",
    tags: ["Web", "Data", "Fintech"],
    keywords: ["crypto", "portfolio", "alerts", "on-chain", "dashboard"],
    techStack: ["React", "Node.js", "TypeScript", "PostgreSQL", "Web3"],
    imageUrl: "/projects/crypto.jpg",
    liveUrl: "https://example.com/cryptotrack",
    year: "2023",
    priority: 5,
  },
];

export function getProjects(): Project[] {
  return [...projects].sort((a, b) => b.priority - a.priority);
}

export function getProjectById(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}

export function getProjectModules(): string[] {
  return Array.from(new Set(projects.flatMap((p) => p.tags)));
}
