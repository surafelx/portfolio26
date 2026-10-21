import type { Metadata } from "next";
import Link from "next/link";
import { Entries, PageHead } from "@/components/Entries";
import { ethiopia, pillars } from "@/content/site";

const pillar = pillars.find((p) => p.id === "ethiopia")!;

export const metadata: Metadata = { title: pillar.nav, description: pillar.intro };

export default function EthiopiaPage() {
  return (
    <>
      <PageHead pillar={pillar} />
      <Entries items={ethiopia} />
      <section className="wrap aside-note">
        <p>
          More on this in{" "}
          <Link href="/writing/building-in-ethiopia">What building in Ethiopia taught me</Link>.
        </p>
      </section>
    </>
  );
}
