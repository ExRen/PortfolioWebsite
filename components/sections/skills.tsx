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
    <section className="sec border-top" id="skills">
      <div className="sec-hdr">
        <span className="sec-num">07 —</span>
        <h2 className="sec-title">{t("section.skills")}</h2>
      </div>
      <div id="skillsContainer">
        {Object.entries(grouped).map(([group, skills]) => (
          <div key={group} className="sg">
            <div className="sg-title">{group}</div>
            <div className="stags">
              {skills.map((s) => (
                <span key={s.id} className={`sk ${s.is_featured ? "f" : ""}`}>
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
