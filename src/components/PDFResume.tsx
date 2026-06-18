"use client";
import { Download } from "lucide-react";
import type { About } from "@/data/types";

interface PDFResumeProps {
  about?: About;
}

export const PDFResume = (_props: PDFResumeProps) => {
  return (
    <a
      href="/Surafel-Yimam-Resume.pdf"
      download
      className="inline-flex items-center gap-2 text-sm font-medium border border-border rounded-full px-4 py-2 hover:border-primary hover:text-primary hover:bg-primary/5 transition"
    >
      <Download size={15} /> Download résumé
    </a>
  );
};
