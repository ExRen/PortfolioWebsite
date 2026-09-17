"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";

interface Labels {
  hireMe: string;
  about: string;
  projects: string;
  experience: string;
  contact: string;
  blog: string;
  menu: string;
  close: string;
}

export function MobileMenu({
  open,
  onClose,
  labels,
}: {
  open: boolean;
  onClose: () => void;
  labels: Labels;
}) {
  const menuRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const menu = menuRef.current;
    const focusable = () => Array.from(menu?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    ) ?? []);
    focusable()[0]?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); onClose(); return; }
      if (event.key !== "Tab") return;
      const elements = focusable();
      if (!elements.length) return;
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <div
      ref={menuRef}
      id="mobile-navigation"
      className={`mobile-menu liquid-glass-panel ${open ? "active" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobile-navigation-title"
      hidden={!open}
    >
      <h2 id="mobile-navigation-title" className="sr-only">
        {labels.menu}
      </h2>
      <a href="#about" onClick={onClose}>
        {labels.about}
      </a>
      <a href="#projects" onClick={onClose}>
        {labels.projects}
      </a>
      <a href="#experience" onClick={onClose}>
        {labels.experience}
      </a>
      <a href="#contact" onClick={onClose}>
        {labels.contact}
      </a>
      <Link href={`/${locale}/blog`} onClick={onClose}>
        {labels.blog}
      </Link>
    </div>
  );
}
