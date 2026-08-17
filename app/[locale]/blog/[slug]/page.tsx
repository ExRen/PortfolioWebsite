import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { getPostBySlug, getProfile } from "@/lib/fetcher";
import { SiteNav } from "@/components/nav/site-nav";
import { Footer } from "@/components/sections/footer";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Not Found" };
  return {
    title: locale === "id" ? post.title_id : post.title_en,
    description: locale === "id" ? post.excerpt_id : post.excerpt_en,
    alternates: { canonical: `/blog/${slug}` },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const [post, profile, t] = await Promise.all([
    getPostBySlug(slug),
    getProfile(),
    getTranslations({ locale, namespace: "" }),
  ]);

  if (!post) notFound();

  const title = locale === "id" ? post.title_id : post.title_en;
  const content = locale === "id" ? post.content_id : post.content_en;
  const date = post.published_at
    ? new Date(post.published_at).toLocaleDateString(locale === "id" ? "id-ID" : "en-US", { year: "numeric", month: "long", day: "numeric" })
    : "";

  return (
    <div className="wrap public-shell page-enter">
      <SiteNav />
      <main className="blog-page blog-post">
        <div className="breadcrumb" style={{ marginBottom: 32, fontSize: 14, color: "var(--ink-muted-80)", display: "flex", alignItems: "center", gap: 8 }}>
          <a href={`/${locale}`} className="breadcrumb-link" style={{ color: "var(--ink)", textDecoration: "none" }}>
            Home
          </a>
          <span>/</span>
          <a href={`/${locale}/blog`} className="breadcrumb-link" style={{ color: "var(--ink)", textDecoration: "none" }}>
            {t("blog.title") || "Blog"}
          </a>
          <span>/</span>
          <span style={{ color: "var(--ac)" }}>{title}</span>
        </div>
        <article>
          <header className="blog-post-header">
            <h1 className="blog-post-title">{title}</h1>
            <span className="blog-card-meta">
              {t("blog.publishedOn")} {date}
            </span>
          </header>
          <div className="blog-content">
            <ReactMarkdown
              components={{
                h2: ({ children }) => <h2 className="blog-h2">{children}</h2>,
                h3: ({ children }) => <h3 className="blog-h3">{children}</h3>,
                p: ({ children }) => <p className="blog-p">{children}</p>,
                ul: ({ children }) => <ul className="blog-ul">{children}</ul>,
                ol: ({ children }) => <ol className="blog-ol">{children}</ol>,
                li: ({ children }) => <li className="blog-li">{children}</li>,
                a: ({ children, href }) => (
                  <a href={href} target="_blank" rel="noopener noreferrer" className="blog-a">
                    {children}
                  </a>
                ),
                strong: ({ children }) => <strong>{children}</strong>,
                code: ({ children }) => <code className="blog-code">{children}</code>,
                pre: ({ children }) => <pre className="blog-pre">{children}</pre>,
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </article>
      </main>
      <Footer profile={profile} locale={locale} />
    </div>
  );
}