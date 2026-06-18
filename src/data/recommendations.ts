import type { Recommendation } from "@/data/types";

export type { Recommendation } from "@/data/types";

// Placeholder recommendations — replace the quotes/names with real ones.
export const recommendations: Recommendation[] = [
  {
    id: "rec-1",
    quote:
      "Surafel shipped fast and communicated clearly the whole way through. The automation he built saved us hours every single day.",
    name: "Add Name",
    role: "Title, Company",
    initial: "A",
  },
  {
    id: "rec-2",
    quote:
      "He understood the product, not just the code. He pushed back where it mattered and delivered something we could actually run a business on.",
    name: "Add Name",
    role: "Title, Company",
    initial: "B",
  },
  {
    id: "rec-3",
    quote:
      "Reliable, thoughtful, and genuinely good at full-stack work. Would happily work with him again on the next thing.",
    name: "Add Name",
    role: "Title, Company",
    initial: "C",
  },
];

export function getRecommendations(): Recommendation[] {
  return recommendations;
}
