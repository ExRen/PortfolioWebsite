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
    <section className="sec border-top" id="certifications">
      <div className="sec-hdr">
        <span className="sec-num">02 —</span>
        <h2 className="sec-title">{t("section.certs")}</h2>
      </div>
      <div className="certs-grid" id="certsContainer">
        {items.map((c, i) => (
          <div key={i} className="cert-card">
            <div className="cert-icon">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="6" />
                <path d="M15.5 13.5L17 22l-5-3-5 3 1.5-8.5" />
              </svg>
            </div>
            <div className="cert-body">
              <div className="cert-name">{c.name}</div>
              <div className="cert-issuer">
                {c.issuer} · {c.year}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
