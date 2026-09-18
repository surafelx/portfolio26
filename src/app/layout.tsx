import type { Metadata, Viewport } from "next";
import { Caveat, Geist, Geist_Mono } from "next/font/google";
import { site, settingsCss } from "@/lib/content";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";
import "./sketch.css";

const sans = Geist({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });
const hand = Caveat({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-hand", display: "swap" });

export const metadata: Metadata = {
  title: site.profile.seoTitle || site.profile.shortName,
  description: site.profile.seoDescription,
  openGraph: {
    title: site.profile.seoTitle || site.profile.shortName,
    description: site.profile.seoDescription,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f5f1" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0d0f" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { settings } = site;
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sans.variable} ${mono.variable} ${hand.variable}`}
      data-snap={settings.snapScroll ? "on" : "off"}
      data-motion={settings.animations ? "on" : "off"}
    >
      <head>
        <style dangerouslySetInnerHTML={{ __html: settingsCss(settings) }} />
      </head>
      <body>
        <ThemeProvider defaultTheme={settings.defaultTheme}>
          <div className="backdrop" aria-hidden="true" />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
