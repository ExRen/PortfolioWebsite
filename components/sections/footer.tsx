import { getTranslations } from "next-intl/server";
import type { Profile } from "@/lib/types";

export async function Footer({
  profile,
  locale,
}: {
  profile: Profile;
  locale: string;
}) {
  const t = await getTranslations({ locale, namespace: "" });
  return (
    <footer className="w-full py-8 border-t border-hairline bg-[var(--canvas-parchment)] backdrop-blur-md mt-16">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="font-label-meta text-xs text-ink-muted-48 text-center sm:text-left" id="footerText">
          {locale === "id" ? profile.footer_id : profile.footer_en}
        </span>
        <span className="flex items-center gap-3">
          <a
            href={`/${locale}/blog/rss.xml`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-label-code text-xs text-ink-muted-48 hover:text-primary transition-colors"
            aria-label={t("blog.rssFeed")}
            title={t("blog.rssFeed")}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M4 11a9 9 0 0 1 9 9" />
              <path d="M4 4a16 16 0 0 1 16 16" />
              <circle cx="5" cy="19" r="1.5" fill="currentColor" stroke="none" />
            </svg>
          </a>
          <span className="font-label-code text-xs text-primary font-semibold">
            Next.js 15 · TypeScript · Supabase
          </span>
        </span>
      </div>
    </footer>
  );
}
