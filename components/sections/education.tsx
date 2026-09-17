import { getTranslations } from "next-intl/server";
import type { Education } from "@/lib/types";

export async function Education({
  items,
  locale,
}: {
  items: Education[];
  locale: string;
}) {
  const t = await getTranslations({ locale, namespace: "" });

  return (
    <section className="w-full max-w-[1200px] mx-auto px-4 md:px-6 py-16 relative" id="education">
      <div className="flex items-center gap-2 mb-1">
        <span className="font-label-code text-xs text-primary font-semibold tracking-wider">
          01 — EDUCATION
        </span>
        <span className="h-0.5 w-6 bg-primary/60" />
      </div>
      <h2 className="font-headline-lg text-2xl md:text-3xl font-semibold text-fg mb-8">
        {t("section.education")}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="eduContainer">
        {items.map((e) => (
          <div key={e.id} className="p-6 rounded-3xl liquid-glass-card flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 dark:bg-orange-950/60 border border-orange-500/30 text-primary flex items-center justify-center shrink-0">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="font-headline-sm text-base sm:text-lg font-semibold text-fg">
                {locale === "id" ? e.degree_id : e.degree_en}
              </h3>
              <span className="font-body-sm text-sm text-text font-medium">{e.institution}</span>
              <div className="flex flex-wrap items-center gap-2 font-label-code text-xs text-ink-muted-48 mt-1">
                <span>{e.period}</span>
                {e.gpa && (
                  <>
                    <span>·</span>
                    <span className="text-primary font-semibold">GPA: {e.gpa}</span>
                  </>
                )}
                <span>·</span>
                <span>{locale === "id" ? e.location_id : e.location_en}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {(locale === "id" ? e.highlights_id : e.highlights_en).map((h, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full bg-[var(--surface-chip-translucent)] backdrop-blur-md border border-hairline font-label-code text-[11px] text-text font-medium"
                  >
                    {h}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
