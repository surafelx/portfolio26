"use client";

import { useEffect, useState } from "react";
import { profile } from "@/content/site";

/** What I'm probably doing right now, going by the clock in Addis. A guess, and it says so. */
function guess(hour: number) {
  if (hour >= 6 && hour < 9) return "coffee, then code";
  if (hour >= 9 && hour < 18) return "building";
  if (hour >= 18 && hour < 23) return "probably making music";
  return "asleep, or live coding";
}

export function Status() {
  const [text, setText] = useState("");
  useEffect(() => {
    const hourFmt = new Intl.DateTimeFormat("en-GB", { hour: "numeric", hourCycle: "h23", timeZone: profile.timeZone });
    const timeFmt = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: profile.timeZone });
    const tick = () => {
      const now = new Date();
      setText(`${timeFmt.format(now).toLowerCase()} in Addis · ${guess(Number(hourFmt.format(now)))}`);
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="status">
      <span className="pulse" aria-hidden="true" />
      <span suppressHydrationWarning>{text || "Addis Ababa · UTC+3"}</span>
    </span>
  );
}
