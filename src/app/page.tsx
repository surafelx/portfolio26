import type { SectionId, Site, Section } from "@/lib/schema";
import { site } from "@/lib/content";
import { Header } from "@/components/site/Header";
import { ProjectDialog } from "@/components/site/ProjectDialog";
import { ScrollStage } from "@/components/site/ScrollStage";
import {
  AiScene,
  ArtScene,
  ContactScene,
  EcommerceScene,
  ErpScene,
  EventsScene,
  ExperienceScene,
  FeaturedScene,
  HeroScene,
  MoreScene,
  ProductsScene,
  RolesScene,
  TestimonialsScene,
  WebsitesScene,
  WritingScene,
} from "@/components/site/Scenes";

const scenes: Record<SectionId, (props: { site: Site; section: Section }) => React.ReactNode> = {
  hero: HeroScene,
  featured: FeaturedScene,
  roles: RolesScene,
  ai: AiScene,
  products: ProductsScene,
  ecommerce: EcommerceScene,
  erp: ErpScene,
  websites: WebsitesScene,
  art: ArtScene,
  events: EventsScene,
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
    case "ai":
    case "ecommerce":
    case "erp":
    case "websites":
    case "art":
      return site.projects.some((p) => p.visible && p.placement === section.id);
    case "more":
      return site.projects.some((p) => p.visible && p.placement === "compact") || site.highlights.length > 0;
    case "roles":
      return site.roles.length > 0;
    case "writing":
      return site.posts.length > 0;
    case "events":
      return site.events.length > 0;
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
      <ProjectDialog projects={site.projects.filter((p) => p.visible)} />
    </div>
  );
}
