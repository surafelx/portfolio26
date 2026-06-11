"use client";

import { useEffect } from "react";
import { getCalApi } from "@calcom/embed-react";
import { motion } from "framer-motion";
import { CalendarClock } from "lucide-react";
import { CAL_LINK } from "@/lib/links";

export const ScheduleCall = () => {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi();
      cal("ui", {
        theme: "dark",
        styles: { branding: { brandColor: "#1a9dff" } },
      });
    })();
  }, []);

  return (
    <div className="terminal-border bg-card/50 p-4">
      <h2 className="text-lg text-primary terminal-glow mb-3 flex items-center gap-2">
        <CalendarClock size={18} />
        Schedule a Call
      </h2>
      <p className="text-foreground/80 leading-relaxed mb-4 text-sm">
        Prefer to talk it through? Pick a time that works for you and I'll send a calendar invite.
      </p>
      <motion.button
        data-cal-link={CAL_LINK}
        data-cal-config='{"theme":"dark"}'
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 font-medium hover:brightness-110 transition-all"
      >
        <CalendarClock size={16} />
        <span>Book a time</span>
      </motion.button>
    </div>
  );
};
