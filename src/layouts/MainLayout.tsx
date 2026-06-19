"use client";

import { ReactNode } from "react";
import { Footer } from "@/components/Footer";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 pt-14 pb-20">
        {children}
      </main>
      <Footer />
    </div>
  );
};
