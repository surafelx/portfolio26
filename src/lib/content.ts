import raw from "../../content/site.json";
import { siteSchema, type Site } from "./schema";

/**
 * The published content. Imported at build time so the public site is fully static and fast.
 * A save from /admin rewrites content/site.json: locally the dev server reloads straight away,
 * on Vercel the GitHub commit triggers a rebuild.
 */
export const site: Site = siteSchema.parse(raw);

function luminance(hex: string): number {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Picks white or near-black text for a button, whichever has more contrast on the accent colour. */
export function accentInk(hex: string): string {
  const bg = luminance(hex);
  const dark = luminance("#0b0c0e");
  const onWhite = 1.05 / (bg + 0.05);
  const onDark = (bg + 0.05) / (dark + 0.05);
  return onDark > onWhite ? "#0b0c0e" : "#ffffff";
}

/** Theme tokens that come from settings. Values are validated hex/ints, so interpolation is safe. */
export function settingsCss(s: Site["settings"]): string {
  const grain = (s.texture / 100).toFixed(2);
  return [
    `html:root{--accent:${s.accentLight};--accent-ink:${accentInk(s.accentLight)};--grain:${grain}}`,
    `@media (prefers-color-scheme: dark){html:root:not([data-theme="light"]){--accent:${s.accentDark};--accent-ink:${accentInk(s.accentDark)}}}`,
    `html:root[data-theme="dark"]{--accent:${s.accentDark};--accent-ink:${accentInk(s.accentDark)}}`,
  ].join("\n");
}
