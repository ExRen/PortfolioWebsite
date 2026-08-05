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
    <section className="sec border-top" id="education">
      <div className="sec-hdr">
        <span className="sec-num">01 —</span>
        <h2 className="sec-title">{t("section.education")}</h2>
      </div>
      <div id="eduContainer">
        {items.map((e) => (
          <div key={e.id} className="edu-card">
            <div className="edu-icon">
              <svg viewBox="0 0 24 24">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>
            <div className="edu-body">
              <div className="edu-degree">
                {locale === "id" ? e.degree_id : e.degree_en}
              </div>
              <div className="edu-institution">{e.institution}</div>
              <div className="edu-meta">
                <span className="edu-period">{e.period}</span>
                {e.gpa && <span className="edu-gpa">{e.gpa}</span>}
                <span className="edu-period">
                  · {locale === "id" ? e.location_id : e.location_en}
                </span>
              </div>
              <div className="edu-highlights">
                {(locale === "id" ? e.highlights_id : e.highlights_en).map(
                  (h, i) => (
                    <span key={i} className="edu-tag">
                      {h}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
