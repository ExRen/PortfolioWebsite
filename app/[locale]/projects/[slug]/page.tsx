import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
import Image from "next/image";
import { getProjectBySlug, getProjects, getProfile } from "@/lib/fetcher";
import { SiteNav } from "@/components/nav/site-nav";
import { Footer } from "@/components/sections/footer";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Not Found" };
  const title = locale === "id" ? project.name : project.name;
  const description = locale === "id" ? project.desc_id : project.desc_en;
  return {
    title,
    description,
    alternates: {
      canonical: `/projects/${slug}`,
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const [project, projects, profile, t] = await Promise.all([
    getProjectBySlug(slug),
    getProjects(),
    getProfile(),
    getTranslations({ locale, namespace: "" }),
  ]);

  if (!project) notFound();

  const ordered = [...projects].sort(
    (a, b) => (a.sort_order ?? a.id) - (b.sort_order ?? b.id)
  );
  const idx = ordered.findIndex((p) => p.slug === project.slug && p.id === project.id);
  const prev = idx > 0 ? ordered[idx - 1] : null;
  const next = idx >= 0 && idx < ordered.length - 1 ? ordered[idx + 1] : null;

  const detail = locale === "id" ? project.detail_id : project.detail_en;
  const role = locale === "id" ? project.role_id : project.role_en;

  return (
    <div className="wrap public-shell page-enter">
      <SiteNav />
      <main className="blog-page project-page">
        <Link href={`/${locale}#projects`} className="blog-back">
          ← {t("project.back")}
        </Link>
        <article>
          <header className="blog-post-header">
            <div className="modal-category">
              {project.category.toUpperCase()} · #{String(project.id).padStart(2, "0")}
            </div>
            <h1 className="blog-post-title">{project.name}</h1>
            {role && <div className="modal-role">{role}</div>}
            {project.highlight && locale !== "id" && (
              <div className="modal-highlight">🏆 {project.highlight}</div>
            )}
            {project.status && locale !== "id" && (
              <span className="p-status" style={{ marginTop: 8 }}>
                {project.status}
              </span>
            )}
          </header>

          <p className="modal-desc">{detail}</p>

          {project.metrics && project.metrics.length > 0 && (
            <div className="case-metrics">
              {project.metrics.map((m, i) => (
                <div key={i} className="case-metric liquid-glass-card">
                  <span className="case-metric-value">{m.value}</span>
                  <span className="case-metric-label">
                    {locale === "id" ? m.label_id : m.label_en}
                  </span>
                </div>
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
              <div className="project-gallery-grid">
                {project.images.map((src, i) => (
                  <Image
                    key={src}
                    src={src}
                    alt={`${project.name} screenshot ${i + 1}`}
                    width={1200}
                    height={750}
                    loading={i === 0 ? undefined : "lazy"}
                    style={{ objectFit: "contain", width: "100%", height: "auto" }}
                  />
                ))}
              </div>
            </div>
          )}

          {(prev || next) && (
            <nav className="case-pager" aria-label="More case studies">
              {prev ? (
                <Link href={`/${locale}/projects/${prev.slug ?? prev.id}`} className="case-pager-link">
                  <span aria-hidden="true">←</span>
                  <span>{prev.name}</span>
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link href={`/${locale}/projects/${next.slug ?? next.id}`} className="case-pager-link case-pager-next">
                  <span>{next.name}</span>
                  <span aria-hidden="true">→</span>
                </Link>
              ) : (
                <span />
              )}
            </nav>
          )}

          <div className="case-cta liquid-glass-panel">
            <span className="case-cta-text">
              {locale === "id" ? "Punya proyek serupa?" : "Have a similar project?"}
            </span>
            <span className="case-cta-actions">
              <Link href={`/${locale}#contact`} className="modal-link">
                {t("hero.getInTouch")}
              </Link>
              <Link href={`/api/cv/${locale}`} className="modal-link">
                {t("hero.dossier")}
              </Link>
            </span>
          </div>

          <div className="modal-links" style={{ marginTop: 24 }}>
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
        </article>
      </main>
      <Footer profile={profile} locale={locale} />
    </div>
  );
}