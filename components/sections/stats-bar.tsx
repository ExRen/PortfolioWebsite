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
    <div className="stats" id="statsContainer">
      {stats.map((s, i) => (
        <div key={i} style={{ display: "contents" }}>
          <div className="stat-item">
            <Counter value={s.value} />
            <div className="stat-l">
              {locale === "id" ? s.label_id : s.label_en}
            </div>
          </div>
          {i < stats.length - 1 && <div className="sdiv" />}
        </div>
      ))}
    </div>
  );
}
