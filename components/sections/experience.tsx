import { getTranslations } from "next-intl/server";
import type { Experience } from "@/lib/types";

export async function Experience({
  items,
  locale,
  t,
}: {
  items: Experience[];
  locale: string;
  t: Awaited<ReturnType<typeof getTranslations>>;
}) {
  const professional = items.filter((e) => e.type === "professional");
  const organization = items.filter((e) => e.type === "organization");

  return (
    <section className="w-full max-w-[1200px] mx-auto px-4 md:px-6 py-16 relative" id="experience">
      <div className="flex items-center gap-2 mb-1">
        <span className="font-label-code text-xs text-primary font-semibold tracking-wider">
          06 — TIMELINE
        </span>
        <span className="h-0.5 w-6 bg-primary/60" />
      </div>
      <h2 className="font-headline-lg text-2xl md:text-3xl font-semibold text-fg mb-8">
        {t("section.experience")}
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="expContainer">
        {/* Corporate & Industry Roles */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          <h3 className="font-headline-sm text-lg font-semibold text-fg flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
            <span>{t("experience.professional")}</span>
          </h3>

          <div className="flex flex-col gap-4">
            {professional.map((e) => {
              const active = e.period.includes("NOW") || e.period.includes("SEKARANG");
              return (
                <div
                  key={e.id}
                  className="p-6 rounded-3xl liquid-glass-card relative overflow-hidden flex flex-col justify-between"
                >
                  <div className={`absolute top-0 left-0 bottom-0 w-2 ${active ? "bg-gradient-to-b from-orange-500 via-primary to-amber-500" : "bg-hairline"}`} />
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-2">
                      <span className="font-headline-sm text-base font-semibold text-fg">
                        {locale === "id" ? e.title_id : e.title_en}
                      </span>
                      <span className={`font-label-code text-xs font-semibold px-3 py-1 rounded-full self-start ${active ? "text-primary bg-orange-500/10 dark:bg-orange-950/60 border border-orange-500/40" : "text-text bg-[var(--surface-chip-translucent)] border border-hairline"}`}>
                        {e.period}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-ink-muted-48 font-label-code text-xs mb-3">
                      <span className="text-fg font-medium">{e.org}</span>
                      <span>·</span>
                      <span>{locale === "id" ? e.location_id : e.location_en}</span>
                    </div>

                    <p className="font-body-sm text-xs sm:text-sm text-text leading-relaxed">
                      {locale === "id" ? e.desc_id : e.desc_en}
                    </p>

                    {e.achievement_en && (
                      <div className="mt-3 font-label-code text-xs text-amber-400 font-medium flex items-center gap-1">
                        <span>⭐</span>
                        <span>{locale === "id" ? e.achievement_id : e.achievement_en}</span>
                      </div>
                    )}
                  </div>

                  {e.tools && e.tools.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {e.tools.map((tool, j) => (
                        <span
                          key={j}
                          className="px-3 py-1 rounded-full bg-[var(--surface-chip-translucent)] backdrop-blur-md border border-hairline font-label-code text-[11px] text-text font-medium"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Organization & Community Roles */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          <h3 className="font-headline-sm text-lg font-semibold text-fg flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span>{t("experience.organization")}</span>
          </h3>

          <div className="flex flex-col gap-4">
            {organization.map((e) => (
              <div
                key={e.id}
                className="p-6 rounded-3xl liquid-glass-card flex flex-col gap-2"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-headline-sm text-sm sm:text-base font-semibold text-fg">
                    {locale === "id" ? e.title_id : e.title_en}
                  </span>
                  <span className="font-label-code text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 dark:bg-emerald-950/60 border border-emerald-500/40 px-3 py-1 rounded-full shrink-0">
                    {e.period}
                  </span>
                </div>

                <span className="font-label-code text-xs text-ink-muted-48">
                  {e.org} · {locale === "id" ? e.location_id : e.location_en}
                </span>

                <p className="font-body-sm text-xs sm:text-sm text-text leading-relaxed mt-1">
                  {locale === "id" ? e.desc_id : e.desc_en}
                </p>

                {e.tools && e.tools.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {e.tools.map((tool, j) => (
                      <span
                        key={j}
                        className="px-3 py-1 rounded-full bg-[var(--surface-chip-translucent)] backdrop-blur-md border border-hairline font-label-code text-[11px] text-text font-medium"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
