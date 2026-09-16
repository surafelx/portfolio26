import type { SectionId, Site, Section } from "@/lib/schema";
import { site } from "@/lib/content";
import { Header } from "@/components/site/Header";
import { ScrollStage } from "@/components/site/ScrollStage";
import {
  ContactScene,
  ExperienceScene,
  FeaturedScene,
  HeroScene,
  MoreScene,
  ProductsScene,
  TestimonialsScene,
  WritingScene,
} from "@/components/site/Scenes";

const scenes: Record<SectionId, (props: { site: Site; section: Section }) => React.ReactNode> = {
  hero: HeroScene,
  featured: FeaturedScene,
  products: ProductsScene,
  more: MoreScene,
  experience: ExperienceScene,
  testimonials: TestimonialsScene,
  writing: WritingScene,
  contact: ContactScene,
};

function hasContent(section: Section): boolean {
  switch (section.id) {
    case "featured":
      return site.projects.some((p) => p.visible && p.placement === "featured");
    case "products":
      return site.projects.some((p) => p.visible && p.placement === "grid");
    case "more":
      return site.projects.some((p) => p.visible && p.placement === "compact") || site.highlights.length > 0;
    case "writing":
      return site.posts.length > 0;
    case "testimonials":
      return site.testimonials.length > 0;
    default:
      return true;
  }
}

export default function Home() {
  const sections = site.sections.filter((s) => s.visible && hasContent(s));
  const rail = sections.map((s) => ({ id: s.id, label: s.nav || s.eyebrow || s.id }));

  return (
    <div className="site">
      <Header site={site} />
      <ScrollStage items={rail} showRail={site.settings.showRail} />
      <main>
        {sections.map((section) => {
          const SceneComponent = scenes[section.id];
          return <SceneComponent key={section.id} site={site} section={section} />;
        })}
      </main>
    </div>
  );
}
