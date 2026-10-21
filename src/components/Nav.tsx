"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { pillars, profile } from "@/content/site";
import { Booth } from "./Booth";

export function Nav() {
  const path = usePathname();
  return (
    <header className="nav">
      <div className="wrap nav-bar">
        <Link href="/" className="nav-name">
          <span className="dot" aria-hidden="true" />
          {profile.name}
        </Link>
        <nav aria-label="Sections">
          <ul>
            {pillars.map((p) => {
              const href = `/${p.id}`;
              const active = path === href || path.startsWith(`${href}/`);
              return (
                <li key={p.id}>
                  <Link href={href} aria-current={active ? "page" : undefined}>
                    {p.nav}
                  </Link>
                </li>
              );
            })}
            <li>
              <Link href="/map" aria-current={path === "/map" ? "page" : undefined}>
                Map
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <Booth />
    </header>
  );
}
