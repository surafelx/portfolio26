import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Folder, User, Contact, Notebook, Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navItems = [
  { path: "/", label: "projects", icon: Folder },
  { path: "/about", label: "about", icon: User },
  { path: "/notes", label: "notes", icon: Notebook },
  { path: "/contact", label: "contact", icon: Contact },
];

export const Navigation = () => {
  const pathname = usePathname();
  const isMobile = useIsMobile();

  const NavLinks = () => (
    <>
      {navItems.map((item, index) => {
        const isActive = pathname === item.path;
        return (
          <motion.div
            key={item.path}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              href={item.path}
              className={`flex items-center gap-2 transition-all hover:text-primary ${
                isActive ? "text-primary terminal-glow" : "text-muted-foreground"
              } ${isMobile ? "py-2" : ""}`}
            >
              <item.icon size={16} className="text-muted-foreground/70" />
              <span>{item.label}</span>
              {isActive && <span className="text-primary cursor-blink">_</span>}
            </Link>
          </motion.div>
        );
      })}
    </>
  );

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <Menu size={20} />
            <span>menu</span>
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64">
          <SheetHeader>
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-4 mt-6">
            <NavLinks />
          </nav>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <nav className="flex items-center gap-6 text-sm">
      <NavLinks />
    </nav>
  );
};
