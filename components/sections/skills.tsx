import { getTranslations } from "next-intl/server";
import type { Skill } from "@/lib/types";

export async function Skills({
  items,
  locale,
}: {
  items: Skill[];
  locale: string;
}) {
  const t = await getTranslations({ locale, namespace: "" });

  const grouped = items.reduce<Record<string, Skill[]>>((acc, s) => {
    if (!acc[s.group_name]) acc[s.group_name] = [];
    acc[s.group_name].push(s);
    return acc;
  }, {});

  return (
    <section className="w-full max-w-[1200px] mx-auto px-4 md:px-6 py-16 relative" id="skills">
      <div className="flex items-center gap-2 mb-8">
        <span className="font-label-code text-xs text-primary font-semibold tracking-wider">
          07 — CAPABILITIES
        </span>
        <span className="h-0.5 w-6 bg-primary/60" />
        <h2 className="font-headline-lg text-2xl md:text-3xl font-semibold text-fg ml-2">
          {t("section.skills")}
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="skillsContainer">
        {Object.entries(grouped).map(([group, skills]) => (
          <div key={group} className="p-6 rounded-3xl liquid-glass-card flex flex-col gap-4">
            <h3 className="font-label-code text-xs uppercase tracking-wider text-primary font-bold">
              {group}
            </h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <span
                  key={s.id}
                  className={`px-3 py-1.5 rounded-full font-label-code text-xs transition-all border ${
                    s.is_featured
                      ? "liquid-pill-btn text-white font-medium border-orange-300/30"
                      : "bg-[var(--surface-chip-translucent)] backdrop-blur-md border-hairline text-text hover:text-fg hover:border-hairline"
                  }`}
                >
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
