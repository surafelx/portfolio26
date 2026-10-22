import type { Metadata } from "next";
import { NextRoom } from "@/components/NextRoom";
import { Entries, PageHead } from "@/components/Entries";
import { art, pillars } from "@/content/site";

const pillar = pillars.find((p) => p.id === "art")!;

export const metadata: Metadata = { title: pillar.nav, description: pillar.intro };

export default function ArtPage() {
  return (
    <>
      <PageHead pillar={pillar} />
      <Entries items={art} />
      <NextRoom from="art" />
    </>
  );
}
