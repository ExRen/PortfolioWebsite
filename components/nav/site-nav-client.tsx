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
      <nav>
        <Link href={`/${locale}`} className="logo">
          PORTOFOLIO
        </Link>
        <div className="nav-right">
          <ul className="nav-links">
            <li>
              <a href="#about">{labels.about}</a>
            </li>
            <li>
              <a href="#projects">{labels.projects}</a>
            </li>
            <li>
              <a href="#experience">{labels.experience}</a>
            </li>
            <li><a href="#contact">{labels.contact}</a></li>
            <li>
              <Link href={`/${locale}/blog`}>{labels.blog}</Link>
            </li>
            <li>
              <a
                href="mailto:bimaaryadinata01@gmail.com"
                className="nav-hire"
              >
                {labels.hireMe}
              </a>
            </li>
          </ul>
          <div className="nav-controls">
            <Link
              href={`/${otherLocale}`}
              className="lang-btn"
              title={`${labels.language}: ${otherLocaleLabel}`}
              aria-label={`${labels.language}: ${otherLocaleLabel}`}
              hrefLang={otherLocale}
            >
              <span className="lang-flag">
                {isId ? "🇬🇧" : "🇮🇩"}
              </span>
              <span>{otherLocaleLabel}</span>
            </Link>
            <button
              className="theme-btn"
              onClick={toggleTheme}
              title={`${labels.theme}: ${theme === "light" ? "dark" : "light"}`}
              aria-label={`${labels.theme}: ${theme === "light" ? "dark" : "light"}`}
            >
              <svg className="icon-moon" viewBox="0 0 24 24">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
              <svg className="icon-sun" viewBox="0 0 24 24">
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
              className={`hamburger ${menuOpen ? "active" : ""}`}
              onClick={() => menuOpen ? closeMenu() : setMenuOpen(true)}
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
      <MobileMenu open={menuOpen} onClose={closeMenu} labels={labels} />
    </>
  );
}
