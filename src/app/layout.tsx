import type { Metadata, Viewport } from "next";
import { Caveat, Geist, Geist_Mono } from "next/font/google";
import { Nav } from "@/components/Nav";
import { EyeMode, EyeModeButton } from "@/components/gaze/EyeMode";
import { ContactDock } from "@/components/ContactDock";
import { askDocs } from "@/content/ask";
import { BackdropMap } from "@/components/BackdropMap";
import { Motion } from "@/components/Motion";
import { links } from "@/content/map";
import { layout } from "@/content/map-layout";
import { fadeBootScript } from "@/content/fade";
import { profile } from "@/content/site";
import "./globals.css";

// The life map's shape, laid out once at build time, drifting behind every page
const backdropLayout = layout(1500, 950, 60, true);

const sans = Geist({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });
const hand = Caveat({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-hand", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: { default: profile.name, template: `%s · ${profile.name}` },
  description: profile.lede,
  openGraph: { title: profile.name, description: profile.lede, type: "website" },
};

export const viewport: Viewport = { themeColor: "#f6f5f1" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} ${hand.variable}`} data-side="engineer" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: fadeBootScript }} />
      </head>
      <body>
        <div className="backdrop" aria-hidden="true" />
        <BackdropMap layout={backdropLayout} links={links} />
        <Nav />
        <main>
          <Motion>{children}</Motion>
        </main>
        <footer className="footer">
          <div className="wrap footer-grid">
            <p className="footer-name">
              {profile.name}
              <span className="am" lang="am">{profile.amharic}</span>
            </p>
            <ul className="footer-links">
              <li><a href={`mailto:${profile.email}`}>Email</a></li>
              <li><a href={profile.githubUrl}>GitHub</a></li>
              <li><a href={profile.linkedinUrl}>LinkedIn</a></li>
              <li><a href={profile.whatsappUrl}>WhatsApp</a></li>
              <li><a href={profile.telegramUrl}>Telegram</a></li>
              <li><a href={profile.bookingUrl}>Book a call</a></li>
              <li><EyeModeButton className="eye-link" /></li>
            </ul>
          </div>
        </footer>
        <ContactDock docs={askDocs()} />
        <EyeMode />
      </body>
    </html>
  );
}
