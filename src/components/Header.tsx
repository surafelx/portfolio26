import { Navigation } from "./Navigation";
import { ThemeToggle } from "./ThemeToggle";
import Link from "next/link";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-16">
        <Link
          href="/"
          className="font-semibold tracking-tight text-foreground hover:text-primary transition-colors"
        >
          Surafel Yimam
        </Link>
        <div className="flex items-center gap-5">
          <Navigation />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
