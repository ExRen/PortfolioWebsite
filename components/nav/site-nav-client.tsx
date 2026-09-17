"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useTheme } from "@/components/theme-provider";
import { MobileMenu } from "./mobile-menu";
import { NavHighlight } from "./nav-highlight";

interface Labels {
  hireMe: string;
  about: string;
  projects: string;
  experience: string;
  contact: string;
  blog: string;
  language: string;
  theme: string;
  menu: string;
  close: string;
}

export function SiteNavClient({ labels }: { labels: Labels }) {
  const { theme, toggleTheme } = useTheme();
  const locale = useLocale();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);

  const closeMenu = () => {
    setMenuOpen(false);
    requestAnimationFrame(() => menuTriggerRef.current?.focus());
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const isId = locale === "id";
  const otherLocale = isId ? "en" : "id";
  const otherLocaleLabel = isId ? "EN" : "ID";

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-center pt-4 px-4 md:px-12">
        <nav className="w-full max-w-[1200px] h-14 rounded-full liquid-glass-panel px-4 md:px-5 flex items-center justify-between transition-all duration-300">
          <div className="flex items-center gap-3">
            <Link href={`/${locale}`} className="logo flex items-center gap-2 group">
              <span className="font-headline-sm text-body-sm font-semibold tracking-tight text-fg group-hover:text-primary transition-colors">
                Bima Aryadinata
              </span>
              <span className="font-label-meta text-label-code text-ink-muted-48 hidden sm:inline-block">
                (@ExRen)
              </span>
            </Link>
          </div>
          <div className="nav-right flex items-center gap-2">
            <ul className="nav-links hidden lg:flex items-center gap-1 p-1 rounded-full bg-[var(--surface-chip-translucent)] border border-hairline">
              <li>
                <a href="#about" className="px-3 py-1.5 rounded-full font-body-sm text-body-sm text-text hover:text-fg hover:bg-[var(--surface-chip-translucent)]/80 transition-all">
                  {labels.about}
                </a>
              </li>
              <li>
                <a href="#projects" className="px-3 py-1.5 rounded-full font-body-sm text-body-sm text-text hover:text-fg hover:bg-[var(--surface-chip-translucent)]/80 transition-all">
                  {labels.projects}
                </a>
              </li>
              <li>
                <a href="#experience" className="px-3 py-1.5 rounded-full font-body-sm text-body-sm text-text hover:text-fg hover:bg-[var(--surface-chip-translucent)]/80 transition-all">
                  {labels.experience}
                </a>
              </li>
              <li>
                <a href="#contact" className="px-3 py-1.5 rounded-full font-body-sm text-body-sm text-text hover:text-fg hover:bg-[var(--surface-chip-translucent)]/80 transition-all">
                  {labels.contact}
                </a>
              </li>
              <li>
                <Link href={`/${locale}/blog`} className="px-3 py-1.5 rounded-full font-body-sm text-body-sm text-text hover:text-fg hover:bg-[var(--surface-chip-translucent)]/80 transition-all">
                  {labels.blog}
                </Link>
              </li>
            </ul>
            <div className="nav-controls flex items-center gap-2">
              <a
                href="#contact"
                className="magnetic-btn hidden sm:inline-flex items-center justify-center px-4 py-1.5 rounded-full liquid-pill-btn text-white font-body-sm text-body-sm font-medium border border-orange-300/40"
              >
                {labels.hireMe}
              </a>
              <Link
                href={`/${otherLocale}`}
                className="magnetic-badge lang-btn px-2.5 py-1 rounded-full bg-[var(--surface-chip-translucent)] hover:bg-[var(--surface-chip-translucent)]/80 border border-hairline text-body-sm text-fg flex items-center gap-1"
                title={`${labels.language}: ${otherLocaleLabel}`}
                aria-label={`${labels.language}: ${otherLocaleLabel}`}
                hrefLang={otherLocale}
              >
                <span className="lang-flag">{isId ? "🇬🇧" : "🇮🇩"}</span>
                <span className="font-label-meta text-xs font-semibold">{otherLocaleLabel}</span>
              </Link>
              <button
                className="magnetic-badge theme-btn p-2 rounded-full bg-[var(--surface-chip-translucent)] hover:bg-[var(--surface-chip-translucent)]/80 border border-hairline text-fg flex items-center justify-center"
                onClick={toggleTheme}
                title={`${labels.theme}: ${theme === "light" ? "dark" : "light"}`}
                aria-label={`${labels.theme}: ${theme === "light" ? "dark" : "light"}`}
              >
                <svg className="icon-moon w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
                <svg className="icon-sun w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="2" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="5.64" />
                </svg>
              </button>
              <button
                ref={menuTriggerRef}
                className={`hamburger lg:hidden ${menuOpen ? "active" : ""}`}
                onClick={() => (menuOpen ? closeMenu() : setMenuOpen(true))}
                aria-label={menuOpen ? labels.close : labels.menu}
                aria-expanded={menuOpen}
                aria-controls="mobile-navigation"
              >
                <span />
                <span />
                <span />
              </button>
            </div>
          </div>
          <NavHighlight />
        </nav>
      </header>
      <MobileMenu open={menuOpen} onClose={closeMenu} labels={labels} />
    </>
  );
}
