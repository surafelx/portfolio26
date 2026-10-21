"use client";

import { useEffect, useRef, useState } from "react";
import { Ask, type AskDoc } from "./Ask";
import { profile } from "@/content/site";

const LINKS = [
  { label: "WhatsApp", detail: profile.phone, href: profile.whatsappUrl, icon: "whatsapp" },
  { label: "Telegram", detail: profile.telegram, href: profile.telegramUrl, icon: "telegram" },
  { label: "Email", detail: profile.email, href: `mailto:${profile.email}`, icon: "mail" },
  { label: "Book a call", detail: "cal.com/surafelx", href: profile.bookingUrl, icon: "calendar" },
  { label: "LinkedIn", detail: "surafelykebede", href: profile.linkedinUrl, icon: "linkedin" },
  { label: "GitHub", detail: "surafelx", href: profile.githubUrl, icon: "github" },
  { label: "CV", detail: "PDF", href: profile.cvUrl, icon: "file" },
] as const;

/** Small line icons, drawn rather than imported, so they follow the pen colour. */
function Icon({ name }: { name: (typeof LINKS)[number]["icon"] | "chat" | "close" }) {
  const p = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const paths: Record<string, React.ReactNode> = {
    whatsapp: <><path {...p} d="M4 20l1.3-3.8A8 8 0 1 1 8 19z" /><path {...p} d="M9 9.5c.3 2 2.5 4.2 4.5 4.5l1.2-1.2 1.8.8-.4 1.6c-3 .6-7.6-4-7-7l1.6-.4.8 1.8z" /></>,
    telegram: <path {...p} d="M21 4L3 11l6 2 2 6 3-4 5 4zM9 13l9-7" />,
    mail: <><rect {...p} x="3" y="5" width="18" height="14" rx="2" /><path {...p} d="M3 7l9 6 9-6" /></>,
    calendar: <><rect {...p} x="3" y="5" width="18" height="16" rx="2" /><path {...p} d="M3 10h18M8 3v4M16 3v4" /></>,
    linkedin: <><rect {...p} x="3" y="3" width="18" height="18" rx="3" /><path {...p} d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7" /></>,
    github: <path {...p} d="M9 19c-4 1.5-4-2-6-2.5m12 4.5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1-.3-3.4 1.3a11.6 11.6 0 0 0-6 0C6.8 2.8 5.8 3.1 5.8 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4.4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />,
    file: <><path {...p} d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path {...p} d="M14 3v5h5M9 13h6M9 17h6" /></>,
    chat: <path {...p} d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12zM8.5 12h.01M12 12h.01M15.5 12h.01" />,
    close: <path {...p} d="M6 6l12 12M18 6L6 18" />,
  };
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

/**
 * The floating button in the corner of every page: Ask me anything, and every way to reach me.
 * Escape or a click outside closes it.
 */
export function ContactDock({ docs }: { docs: AskDoc[] }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const click = (e: MouseEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", key);
    window.addEventListener("mousedown", click);
    return () => {
      window.removeEventListener("keydown", key);
      window.removeEventListener("mousedown", click);
    };
  }, [open]);

  return (
    <div className={`dock${open ? " open" : ""}`} ref={root}>
      {open && (
        <div className="dock-panel" role="dialog" aria-label="Ask me anything, or get in touch">
          <section>
            <p className="label">Ask me anything</p>
            <Ask docs={docs} />
          </section>
          <section>
            <p className="label">Get in touch</p>
            <ul className="dock-links">
              {LINKS.map((l) => (
                <li key={l.label}>
                  <a href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                    <Icon name={l.icon} />
                    <span>
                      <b>{l.label}</b>
                      <small>{l.detail}</small>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="dock-hours">{profile.hours}</p>
          </section>
        </div>
      )}
      <button type="button" className="dock-button" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <Icon name={open ? "close" : "chat"} />
        <span>{open ? "Close" : "Ask or say hi"}</span>
      </button>
    </div>
  );
}
