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
    <section className="sec border-top" id="experience">
      <div className="sec-hdr">
        <span className="sec-num">06 —</span>
        <h2 className="sec-title">{t("section.experience")}</h2>
      </div>
      <div id="expContainer">
        {professional.length > 0 && (
          <div className="exp-section">
            <h3 className="exp-section-title">
              <svg className="exp-icon" viewBox="0 0 24 24">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
              {t("experience.professional")}
            </h3>
            <Timeline items={professional} locale={locale} />
          </div>
        )}
        {organization.length > 0 && (
          <div className="exp-section">
            <h3 className="exp-section-title">
              <svg className="exp-icon" viewBox="0 0 24 24">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              {t("experience.organization")}
            </h3>
            <Timeline items={organization} locale={locale} />
          </div>
        )}
      </div>
    </section>
  );
}

function Timeline({
  items,
  locale,
}: {
  items: Experience[];
  locale: string;
}) {
  return (
    <div className="timeline">
      {items.map((e, i) => {
        const active = e.period.includes("NOW") || e.period.includes("SEKARANG");
        return (
          <div
            key={e.id}
            className={`timeline-item ${active ? "active" : ""}`}
          >
            <div className="timeline-dot" />
            <div className="timeline-content">
              <div className="timeline-period">{e.period}</div>
              <div className="timeline-title">
                {locale === "id" ? e.title_id : e.title_en}
              </div>
              <div className="timeline-org">
                {e.org} · {locale === "id" ? e.location_id : e.location_en}
              </div>
              <p className="timeline-desc">
                {locale === "id" ? e.desc_id : e.desc_en}
              </p>
              {e.achievement_en && (
                <div className="timeline-achievement">
                  ⭐ {locale === "id" ? e.achievement_id : e.achievement_en}
                </div>
              )}
              {e.tools && e.tools.length > 0 && (
                <div className="timeline-tools">
                  {e.tools.map((tool, j) => (
                    <span key={j} className="tool-tag">
                      {tool}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
