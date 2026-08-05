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
    <section className="sec border-top" id="building">
      <div className="sec-hdr">
        <span className="sec-num">04 —</span>
        <h2 className="sec-title" id="buildingTitle">
          {t("section.building")}
        </h2>
      </div>
      <div className="building-grid" id="buildingGrid">
        {items.map((b, i) => (
          <div key={i} className="edu-card" style={{ flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 8,
                marginBottom: 8,
              }}
            >
              <h3 className="edu-degree" style={{ fontSize: 21, marginBottom: 0 }}>
                {locale === "id" ? b.name_id : b.name_en}
              </h3>
              <span className="p-status">
                {locale === "id" ? b.status_id : b.status_en}
              </span>
            </div>
            <p className="timeline-desc">
              {locale === "id" ? b.description_id : b.description_en}
            </p>
            <div className="timeline-tools" style={{ marginTop: 12 }}>
              {b.stack.map((s, j) => (
                <span key={j} className="tool-tag">
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
