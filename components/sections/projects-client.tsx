"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { CATEGORIES } from "@/lib/data";
import type { Project } from "@/lib/types";

export function ProjectsClient({
  items,
  locale,
}: {
  items: Project[];
  locale: string;
}) {
  const t = useTranslations("");
  const [filter, setFilter] = useState<string>("all");
  const [openId, setOpenId] = useState<number | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const handleOpen = (id: number) => {
    triggerRef.current = document.activeElement as HTMLElement | null;
    setOpenId(id);
  };

  const handleClose = () => {
    setOpenId(null);
    requestAnimationFrame(() => triggerRef.current?.focus());
  };

  const visible = useMemo(
    () => (filter === "all" ? items : items.filter((p) => p.category === filter)),
    [items, filter]
  );

  const open = openId ? items.find((p) => p.id === openId) ?? null : null;

  return (
    <>
      <div className="flex items-center flex-wrap gap-2 p-1.5 rounded-full liquid-glass-panel mb-8 self-start" id="filterRow">
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            onClick={() => setFilter(c.key)}
            className={`magnetic-btn filter-btn px-4 py-1.5 rounded-full font-label-code text-xs font-medium transition-all ${
              filter === c.key
                ? "liquid-pill-btn text-white border border-orange-300/40"
                : "bg-[var(--surface-chip-translucent)] text-text hover:text-fg hover:bg-[var(--surface-chip-translucent)]/80 border border-hairline"
            }`}
            aria-pressed={filter === c.key}
            data-filter={c.key}
          >
            {locale === "id" ? c.label_id : c.label_en}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="projects-container">
        {items.map((p) => {
          const hidden = !(filter === "all" || p.category === filter);
          return (
            <ProjectCard
              key={p.id}
              project={p}
              locale={locale}
              hidden={hidden}
              onOpen={() => handleOpen(p.id)}
            />
          );
        })}
      </div>

      {open && (
        <ProjectModal
          project={open}
          locale={locale}
          onClose={handleClose}
        />
      )}
    </>
  );
}

function ProjectCard({
  project: p,
  locale,
  hidden,
  onOpen,
}: {
  project: Project;
  locale: string;
  hidden: boolean;
  onOpen: () => void;
}) {
  const body = (
    <div className="flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="font-label-code text-xs font-semibold text-primary">
            #{String(p.id).padStart(2, "0")}
          </span>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-950/60 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-label-meta text-[11px] font-semibold uppercase">
              {locale === "id" ? p.role_id : p.role_en}
            </span>
            {p.status && locale !== "id" && (
              <span className="px-3 py-1 rounded-full bg-orange-500/10 dark:bg-orange-950/60 border border-orange-500/40 text-primary font-label-meta text-[11px] font-semibold uppercase">
                {p.status}
              </span>
            )}
          </div>
        </div>
        <h3 className="font-headline-sm text-lg font-semibold text-fg group-hover:text-primary transition-colors">
          {p.name}
        </h3>
        <p className="font-body-sm text-xs sm:text-sm text-text mt-2.5 leading-relaxed">
          {locale === "id" ? p.desc_id : p.desc_en}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-hairline flex flex-col gap-3">
        <div className="flex flex-wrap gap-1.5">
          {p.tags.slice(0, 5).map((tag, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-full bg-[var(--surface-chip-translucent)] backdrop-blur-md border border-hairline font-label-code text-[11px] text-text font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between text-ink-muted-48 group-hover:text-primary transition-colors pt-1">
          <span className="font-label-code text-xs font-semibold">
            {tClickDetail(locale)}
          </span>
          <svg className="w-5 h-5 transform group-hover:translate-x-1.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>
      </div>
    </div>
  );

  if (hidden) return null;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="project-card group rounded-3xl liquid-glass-card p-6 flex flex-col justify-between"
      data-category={p.category}
    >
      {p.slug ? (
        <Link href={`/${locale}/projects/${p.slug}`} className="w-full h-full block">
          {body}
        </Link>
      ) : (
        <button type="button" className="w-full h-full text-left cursor-pointer" onClick={onOpen}>
          {body}
        </button>
      )}
    </motion.article>
  );
}

function tClickDetail(locale: string) {
  return locale === "id" ? "Klik untuk detail →" : "View Details →";
}

function ProjectModal({
  project,
  locale,
  onClose,
}: {
  project: Project;
  locale: string;
  onClose: () => void;
}) {
  const t = useTranslations("");
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const focusable = () => Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])') ?? []);
    focusable()[0]?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); onClose(); return; }
      if (event.key !== "Tab") return;
      const elements = focusable(); if (!elements.length) return;
      const first = elements[0], last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => { document.removeEventListener("keydown", onKeyDown); };
  }, [onClose]);

  return (
    <div className="modal-overlay active" role="presentation" onClick={onClose}>
      <div ref={dialogRef} className="modal liquid-glass-panel" role="dialog" aria-modal="true" aria-labelledby="project-modal-title" onClick={(e) => e.stopPropagation()}>
        <div className="modal-close">
          <button className="modal-close-btn" onClick={onClose} title={t("project.close")} aria-label={t("project.close")}>
            <svg viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="modal-body">
          <div className="modal-category">
            {project.category.toUpperCase()} · #{String(project.id).padStart(2, "0")}
          </div>
          <h2 id="project-modal-title" className="modal-title">{project.name}</h2>
          {project.role_en && (
            <div className="modal-role">
              {locale === "id" ? project.role_id : project.role_en}
            </div>
          )}
          {project.highlight && locale !== "id" && (
            <div className="modal-highlight">🏆 {project.highlight}</div>
          )}
          <p className="modal-desc">
            {locale === "id" ? project.detail_id : project.detail_en}
          </p>
          {project.metrics && project.metrics.length > 0 && (
            <div className="modal-tags" style={{ marginBottom: 16 }}>
              {project.metrics.map((m, i) => (
                <span key={i} className="tag" style={{ fontWeight: 600 }}>
                  {m.value} · {locale === "id" ? m.label_id : m.label_en}
                </span>
              ))}
            </div>
          )}
          <div className="modal-tags">
            {project.tags.map((tag, i) => (
              <span key={i} className="tag">
                {tag}
              </span>
            ))}
          </div>
          {project.images && project.images.length > 0 && (
            <div className="modal-gallery-section">
              <div className="modal-gallery-title">
                <svg viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                {t("project.modalGallery")}
              </div>
              <div className="gallery-carousel">
                <div className="gallery-track">
                  {project.images.slice(0, 1).map((src, i) => (
                    <div key={i} className="gallery-slide active">
                      <Image
                        src={src}
                        alt={`${project.name} screenshot ${i + 1}`}
                        width={1200}
                        height={750}
                        style={{ objectFit: "contain" }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <div className="modal-links" style={{ marginTop: 16 }}>
            {project.github_url && (
              <a
                href={project.github_url}
                className="modal-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 24 24">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
                {t("project.github")}
              </a>
            )}
            {project.live_url && (
              <a
                href={project.live_url}
                className="modal-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 24 24">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                {t("project.liveDemo")}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
