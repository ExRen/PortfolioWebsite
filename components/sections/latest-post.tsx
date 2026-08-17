import { getTranslations } from "next-intl/server";
import Link from "next/link";
import type { Post } from "@/lib/types";

export default async function LatestPost({
  posts,
  locale,
}: {
  posts: Post[];
  locale: string;
}) {
  if (posts.length === 0) return null;

  const t = await getTranslations({ locale, namespace: "" });
  const latest = posts[0];
  const title = locale === "id" ? latest.title_id : latest.title_en;
  const excerpt = locale === "id" ? latest.excerpt_id : latest.excerpt_en;

  return (
    <section className="sec border-top" id="latest-post">
      <div className="sec-hdr">
        <span className="sec-num">09 —</span>
        <h2 className="sec-title" id="latestPostTitle">
          {t("blog.latest")}
        </h2>
      </div>
      <Link href={`/${locale}/blog/${latest.slug}`} className="blog-card-flat">
        <h3 className="blog-card-title">{title}</h3>
        <p className="blog-card-excerpt">{excerpt}</p>
        <span className="blog-card-meta">
          {latest.published_at
            ? new Date(latest.published_at).toLocaleDateString(locale === "id" ? "id-ID" : "en-US", { year: "numeric", month: "long", day: "numeric" })
            : ""}{" "}
          · {t("blog.readMore")}
        </span>
      </Link>
    </section>
  );
}