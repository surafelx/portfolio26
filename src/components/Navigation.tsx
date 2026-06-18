"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navItems = [
  { path: "/", label: "Projects" },
  { path: "/about", label: "About" },
  { path: "/notes", label: "Notes" },
  { path: "/contact", label: "Contact" },
];

export const Navigation = () => {
  const pathname = usePathname();
  const isMobile = useIsMobile();

  const NavLinks = ({ stacked = false }: { stacked?: boolean }) => (
    <>
      {navItems.map((item) => {
        const isActive =
          item.path === "/" ? pathname === "/" : pathname.startsWith(item.path);
        return (
          <Link
            key={item.path}
            href={item.path}
            className={`text-sm transition-colors hover:text-foreground ${
              isActive ? "text-foreground font-medium" : "text-muted-foreground"
            } ${stacked ? "py-2 text-base" : ""}`}
          >
            {item.label}
          </Link>
        );
      })}
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
          </nav>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <nav className="flex items-center gap-6">
      <NavLinks />
    </nav>
  );
};
