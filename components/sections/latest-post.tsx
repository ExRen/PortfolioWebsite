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
    <section className="w-full max-w-[1200px] mx-auto px-4 md:px-6 py-16 relative" id="latest-post">
      <div className="flex items-center gap-2 mb-8">
        <span className="font-label-code text-xs text-primary font-semibold tracking-wider">
          09 — INSIGHTS
        </span>
        <span className="h-0.5 w-6 bg-primary/60" />
        <h2 className="font-headline-lg text-2xl md:text-3xl font-semibold text-fg ml-2" id="latestPostTitle">
          {t("blog.latest")}
        </h2>
      </div>
      <Link
        href={`/${locale}/blog/${latest.slug}`}
        className="group p-6 md:p-8 rounded-3xl liquid-glass-card flex flex-col gap-3 transition-all hover:border-orange-500/40 block"
      >
        <div className="flex items-center justify-between text-ink-muted-48 font-label-meta text-xs">
          <span>
            {latest.published_at
              ? new Date(latest.published_at).toLocaleDateString(locale === "id" ? "id-ID" : "en-US", { year: "numeric", month: "long", day: "numeric" })
              : ""}
          </span>
          <span className="text-primary font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
            {t("blog.readMore")}
          </span>
        </div>
        <h3 className="font-headline-sm text-xl md:text-2xl font-semibold text-fg group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="font-body-md text-sm text-text leading-relaxed">
          {excerpt}
        </p>
      </Link>
    </section>
  );
}