"use client";

import { useEffect } from "react";
import { loadVisits } from "@/lib/live-client";

/** Counts the visit on pages that don't show the number. Renders nothing. */
export function VisitPing() {
  useEffect(() => {
    loadVisits();
  }, []);
  return null;
}
