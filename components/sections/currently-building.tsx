import { getTranslations } from "next-intl/server";
import type { CurrentlyBuilding } from "@/lib/types";

export async function CurrentlyBuilding({
  items,
  locale,
}: {
  items: CurrentlyBuilding[];
  locale: string;
}) {
  const t = await getTranslations({ locale, namespace: "" });

  return (
    <section className="w-full max-w-[1200px] mx-auto px-4 md:px-6 py-16 relative" id="building">
      <div className="flex items-center gap-2 mb-8">
        <span className="font-label-code text-xs text-primary font-semibold tracking-wider">
          04 — IN PROGRESS
        </span>
        <span className="h-0.5 w-6 bg-primary/60" />
        <h2 className="font-headline-lg text-2xl md:text-3xl font-semibold text-fg ml-2" id="buildingTitle">
          {t("section.building")}
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="buildingGrid">
        {items.map((b, i) => (
          <div key={i} className="p-6 rounded-3xl liquid-glass-card flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center justify-between gap-4 mb-2">
                <h3 className="font-headline-sm text-lg font-semibold text-fg">
                  {locale === "id" ? b.name_id : b.name_en}
                </h3>
                <span className="px-3 py-1 rounded-full bg-orange-500/10 dark:bg-orange-950/60 border border-orange-500/40 text-primary font-label-meta text-[11px] font-semibold uppercase shrink-0">
                  {locale === "id" ? b.status_id : b.status_en}
                </span>
              </div>
              <p className="font-body-sm text-xs sm:text-sm text-text leading-relaxed">
                {locale === "id" ? b.description_id : b.description_en}
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-3 border-t border-hairline">
              {b.stack.map((s, j) => (
                <span
                  key={j}
                  className="px-3 py-1 rounded-full bg-[var(--surface-chip-translucent)] backdrop-blur-md border border-hairline font-label-code text-[11px] text-text font-medium"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
