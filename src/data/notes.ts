import type { Note } from "@/data/types";

export type { Note, NoteBlock } from "@/data/types";

// Static notes — shorter, less formal than articles.
export const notes: Note[] = [
  {
    id: "useeffect-cleanup",
    title: "useEffect cleanup is not optional",
    createdAt: "2025-02-01",
    blocks: [
      { id: "n1", type: "title", content: "The bug that taught me" },
      { id: "n2", type: "paragraph", content: "A subscription set up in an effect kept firing after the component unmounted. The fix is always the same: return a cleanup function and tear down whatever you set up." },
      { id: "n3", type: "code", content: "useEffect(() => {\n  const sub = source.subscribe(onData);\n  return () => sub.unsubscribe();\n}, [source]);", metadata: { language: "javascript" } },
    ],
  },
  {
    id: "postgres-indexes",
    title: "Indexes I forget to add",
    createdAt: "2024-12-18",
    blocks: [
      { id: "n1", type: "title", content: "Foreign keys are not indexed by default" },
      { id: "n2", type: "paragraph", content: "In Postgres, declaring a foreign key does not create an index on the referencing column. Joins and cascading deletes get slow without one." },
      { id: "n3", type: "code", content: "CREATE INDEX ON orders (customer_id);", metadata: { language: "sql" } },
      { id: "n4", type: "quote", content: "Measure with EXPLAIN ANALYZE before and after — don't guess." },
    ],
  },
  {
    id: "rust-error-handling",
    title: "The ? operator changed how I write Rust",
    createdAt: "2024-08-09",
    blocks: [
      { id: "n1", type: "title", content: "Propagate, don't panic" },
      { id: "n2", type: "paragraph", content: "Early Rust code is full of match arms unwrapping results. The ? operator collapses that into a single readable line while keeping errors explicit." },
      { id: "n3", type: "code", content: "fn read_config(path: &str) -> Result<Config, Error> {\n    let raw = std::fs::read_to_string(path)?;\n    let cfg = toml::from_str(&raw)?;\n    Ok(cfg)\n}", metadata: { language: "rust" } },
    ],
  },
];

export function getNotes(): Note[] {
  return [...notes].sort(
    (a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
  );
}

export function getNoteById(id: string): Note | undefined {
  return notes.find((n) => n.id === id);
}
