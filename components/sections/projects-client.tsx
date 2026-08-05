"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
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
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const visible = useMemo(
    () => (filter === "all" ? items : items.filter((p) => p.category === filter)),
    [items, filter]
  );

  const open = openId ? items.find((p) => p.id === openId) ?? null : null;

  return (
    <>
      <div className="filter-row" id="filterRow">
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            onClick={() => setFilter(c.key)}
            className={`fb ${filter === c.key ? "active" : ""}`}
            aria-pressed={filter === c.key}
            data-filter={c.key}
          >
            {locale === "id" ? c.label_id : c.label_en}
          </button>
        ))}
      </div>
      <div className="pgrid" id="projectGrid">
        {items.map((p) => {
          const hidden = !(filter === "all" || p.category === filter);
            return (
              <motion.button
                key={p.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
                whileTap={{ y: -1 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={`pc ${hidden ? "filter-hide" : "filter-show"}`}
                data-category={p.category}
                onClick={(event) => { triggerRef.current = event.currentTarget; setOpenId(p.id); }}
                type="button"
              >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="p-num">#{String(p.id).padStart(2, "0")}</span>
                <span className="p-role">
                  {locale === "id" ? p.role_id : p.role_en}
                </span>
                {p.status && locale !== "id" && <span className="p-status">{p.status}</span>}
              </div>
              <div className="p-name">{p.name}</div>
              <div className="p-desc">
                {locale === "id" ? p.desc_id : p.desc_en}
              </div>
              <div className="p-tags">
                {p.tags.slice(0, 5).map((tag, i) => (
                  <span key={i} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="p-arrow">
                <svg viewBox="0 0 24 24">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>
            </motion.button>
          );
        })}
      </div>

      {open && (
        <ProjectModal
          project={open}
          locale={locale}
          triggerRef={triggerRef}
          onClose={() => setOpenId(null)}
        />
      )}
    </>
  );
}

function ProjectModal({
  project,
  locale,
  onClose,
  triggerRef,
}: {
  project: Project;
  locale: string;
  onClose: () => void;
  triggerRef: React.MutableRefObject<HTMLButtonElement | null>;
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
    return () => { document.removeEventListener("keydown", onKeyDown); triggerRef.current?.focus(); };
  }, [onClose, triggerRef]);

  return (
    <div className="modal-overlay active" role="presentation" onClick={onClose}>
      <div ref={dialogRef} className="modal" role="dialog" aria-modal="true" aria-labelledby="project-modal-title" onClick={(e) => e.stopPropagation()}>
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
