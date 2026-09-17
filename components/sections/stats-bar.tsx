import { getTranslations } from "next-intl/server";
import { Counter } from "@/components/counter";
import type { ProfileStat } from "@/lib/types";

export async function StatsBar({
  stats,
  t,
  locale,
}: {
  stats: ProfileStat[];
  t: Awaited<ReturnType<typeof getTranslations>>;
  locale: string;
}) {
  return (
    <section className="w-full py-8 relative">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {stats.map((s, i) => (
            <div
              key={i}
              className="flex flex-col p-5 rounded-2xl liquid-glass-card hover:border-primary/50 group"
            >
              <div className="flex items-baseline gap-1">
                <span className="font-headline-lg text-2xl sm:text-3xl font-semibold text-primary">
                  <Counter value={s.value} />
                </span>
              </div>
              <span className="font-headline-sm text-sm sm:text-base font-semibold text-fg mt-1">
                {locale === "id" ? s.label_id : s.label_en}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
