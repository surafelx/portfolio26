import type { Recommendation } from "@/data/types";

export type { Recommendation } from "@/data/types";

// Real client testimonials. Names withheld; add them if/when you have permission.
export const recommendations: Recommendation[] = [
  {
    id: "rec-ai",
    quote:
      "A very strong fit for AI work — we enjoyed working with him. He has a good understanding of structure, was able to pick up concepts and then advance them to new levels, and communication was easy.",
    name: "AI Project Client",
    role: "Upwork",
    initial: "A",
  },
  {
    id: "rec-fullstack",
    quote:
      "Surafel did an outstanding job and delivered results far beyond my expectations. I'm extremely satisfied and would highly recommend him to anyone looking for a reliable, skilled full-stack developer. I would definitely work with him again.",
    name: "Full-Stack Project Client",
    role: "Upwork",
    initial: "F",
  },
  {
    id: "rec-web",
    quote:
      "A good experience working with this freelancer. Communication was polite and respectful, and he showed real willingness to help and move the project forward.",
    name: "Web Project Client",
    role: "Upwork",
    initial: "W",
  },
];

export function getRecommendations(): Recommendation[] {
  return recommendations;
}
