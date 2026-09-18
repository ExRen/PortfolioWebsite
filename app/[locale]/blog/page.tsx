import { setRequestLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
import { getPosts, getProfile } from "@/lib/fetcher";
import { SiteNav } from "@/components/nav/site-nav";
import { Footer } from "@/components/sections/footer";
import type { Post } from "@/lib/types";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [posts, profile, t] = await Promise.all([
    getPosts(),
    getProfile(),
    getTranslations({ locale, namespace: "" }),
  ]);

  const localePost = (p: Post) => ({
    title: locale === "id" ? p.title_id : p.title_en,
    excerpt: locale === "id" ? p.excerpt_id : p.excerpt_en,
    date: p.published_at ? new Date(p.published_at).toLocaleDateString(locale === "id" ? "id-ID" : "en-US", { year: "numeric", month: "long", day: "numeric" }) : "",
  });

  return (
    <div className="wrap public-shell page-enter">
      <SiteNav />
      <main className="blog-page">
        <div className="breadcrumb" style={{ marginBottom: 32, fontSize: 14, color: "var(--ink-muted-80)", display: "flex", alignItems: "center", gap: 8 }}>
          <a href={`/${locale}`} className="breadcrumb-link" style={{ color: "var(--ink)", textDecoration: "none" }}>
            Home
          </a>
          <span>/</span>
          <span style={{ color: "var(--ac)" }}>{t("blog.title")}</span>
        </div>
        <div className="sec-hdr">
          <span className="sec-num">09 —</span>
          <h1 className="sec-title">{t("blog.title")}</h1>
        </div>
        <p className="blog-subtitle">
          {t("blog.subtitle")}{" "}
          <a
            href={`/${locale}/blog/rss.xml`}
            target="_blank"
            rel="noopener noreferrer"
            className="blog-rss"
            aria-label={t("blog.rssFeed")}
            title={t("blog.rssFeed")}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M4 11a9 9 0 0 1 9 9" />
              <path d="M4 4a16 16 0 0 1 16 16" />
              <circle cx="5" cy="19" r="1.5" fill="currentColor" stroke="none" />
            </svg>
            <span>RSS</span>
            <span className="sr-only">{t("blog.rssFeed")}</span>
          </a>
        </p>
        {posts.length === 0 ? (
          <p className="blog-empty">{t("blog.empty")}</p>
        ) : (
          <div className="blog-grid">
            {posts.map((p) => {
              const { title, excerpt, date } = localePost(p);
              return (
                <article key={p.id} className="blog-card">
                  <Link href={`/${locale}/blog/${p.slug}`} className="blog-card-link">
                    <h2 className="blog-card-title">{title}</h2>
                    <p className="blog-card-excerpt">{excerpt}</p>
                    <span className="blog-card-meta">
                      {t("blog.publishedOn")} {date} · {t("blog.readMore")}
                    </span>
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </main>
      <Footer profile={profile} locale={locale} />
    </div>
  );
}