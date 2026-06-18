"use client";
import Link from "next/link";
import { Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { SOCIAL_LINKS } from "@/lib/links";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navItems = [
  { href: "/#work", label: "Work" },
  { href: "/#personal", label: "Projects" },
  { href: "/#recommendations", label: "Recommendations" },
  { href: "/#articles", label: "Articles" },
  { href: "/#about", label: "About" },
];

export const Navigation = () => {
  const isMobile = useIsMobile();

  const NavLinks = ({ stacked = false }: { stacked?: boolean }) => (
    <>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`text-sm text-muted-foreground transition-colors hover:text-foreground ${
            stacked ? "py-2 text-base" : ""
          }`}
        >
          {item.label}
        </Link>
      ))}
    </>
  );

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <button
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
        </SheetTrigger>
        <SheetContent side="right" className="w-64">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-1 mt-6">
            <NavLinks stacked />
            <a
              href={`mailto:${SOCIAL_LINKS.email}`}
              className="mt-3 inline-flex items-center justify-center bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-lg hover:brightness-110 transition"
            >
              Get in touch
            </a>
          </nav>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <nav className="flex items-center gap-6">
      <NavLinks />
      <a
        href={`mailto:${SOCIAL_LINKS.email}`}
        className="bg-primary text-primary-foreground text-sm font-medium px-4 py-1.5 rounded-lg hover:brightness-110 transition"
      >
        Get in touch
      </a>
    </nav>
  );
};
