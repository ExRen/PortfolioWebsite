import { getTranslations } from "next-intl/server";
import type { Certification } from "@/lib/types";

export async function Certifications({
  items,
  locale,
}: {
  items: Certification[];
  locale: string;
}) {
  const t = await getTranslations({ locale, namespace: "" });

  return (
    <section className="w-full max-w-[1200px] mx-auto px-4 md:px-6 py-16 relative" id="certifications">
      <div className="flex items-center gap-2 mb-8">
        <span className="font-label-code text-xs text-primary font-semibold tracking-wider">
          02 — CREDENTIALS
        </span>
        <span className="h-0.5 w-6 bg-primary/60" />
        <h2 className="font-headline-lg text-2xl md:text-3xl font-semibold text-fg ml-2">
          {t("section.certs")}
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="certsContainer">
        {items.map((c, i) => (
          <div key={i} className="p-6 rounded-3xl liquid-glass-card flex items-start gap-4 transition-all hover:border-orange-500/40">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-primary">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="6" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.5 13.5L17 22l-5-3-5 3 1.5-8.5" />
              </svg>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="font-headline-sm text-base font-semibold text-fg">
                {c.name}
              </h3>
              <span className="font-label-meta text-xs text-ink-muted-48">
                {c.issuer} · {c.year}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
