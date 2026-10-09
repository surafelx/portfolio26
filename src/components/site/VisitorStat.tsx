"use client";

import { useEffect, useState } from "react";
import { loadVisits } from "@/lib/live-client";
import type { Visits } from "@/lib/visits";

/** The visitor count in the header. Appears once the number is known; stays out of the way until then. */
export function VisitorStat() {
  const [visits, setVisits] = useState<Visits | null>(null);
  useEffect(() => {
    loadVisits().then(setVisits);
  }, []);
  if (!visits || visits.total <= 0) return null;
  return (
    <li className="live" title={visits.today > 0 ? `${visits.today.toLocaleString("en-US")} today` : undefined}>
      <b>{visits.total.toLocaleString("en-US")}</b>
      <span>{visits.total === 1 ? "visitor" : "visitors"}</span>
    </li>
  );
}
