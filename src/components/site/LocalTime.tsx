"use client";

import { useEffect, useState } from "react";

/** The visitor sees what time it is where Surafel is, which matters for remote hiring. */
export function LocalTime({ timeZone }: { timeZone: string }) {
  const [now, setNow] = useState<string>("");

  useEffect(() => {
    let format: Intl.DateTimeFormat;
    try {
      format = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone });
    } catch {
      return;
    }
    const tick = () => setNow(format.format(new Date()));
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, [timeZone]);

  return <time suppressHydrationWarning>{now || "--:--"}</time>;
}
