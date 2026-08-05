import { getTranslations } from "next-intl/server";
import Image from "next/image";
import type { Profile } from "@/lib/types";

export async function About({
  profile,
  locale,
}: {
  profile: Profile;
  locale: string;
}) {
  const t = await getTranslations({ locale, namespace: "" });
  const paragraphs = locale === "id" ? profile.about_id : profile.about_en;
  const pills = locale === "id" ? profile.pills_id : profile.pills_en;

  return (
    <section className="sec border-top" id="about">
      <div className="sec-hdr">
        <span className="sec-num">00 —</span>
        <h2 className="sec-title">{t("section.about")}</h2>
      </div>
      <div className="about-grid">
        <div className="photo-wrap">
          <div className="photo-frame">
            {profile.photo_url ? (
              <Image
                id="photoImg"
                src={profile.photo_url}
                alt="Bima Aryadinata — Informatics Engineer"
                fill
                sizes="160px"
                style={{ objectFit: "cover" }}
                unoptimized
              />
            ) : (
              <div className="photo-placeholder" id="photoPlaceholder">
                <span className="ph-initials">BA</span>
              </div>
            )}
          </div>
        </div>
        <div>
          <div className="about-text">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div className="about-pills">
            {pills.map((pill, i) => (
              <span key={i} className="apill">
                {pill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
