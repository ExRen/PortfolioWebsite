import { getTranslations } from "next-intl/server";
import { getLocale } from "next-intl/server";
import type { Profile } from "@/lib/types";

export async function Hero({
  locale,
  profile,
  t,
}: {
  locale: string;
  profile: Profile;
  t: Awaited<ReturnType<typeof getTranslations>>;
}) {
  const tagline = locale === "id" ? profile.hero_tagline_id : profile.hero_tagline_en;
  const bio = locale === "id" ? profile.hero_bio_id : profile.hero_bio_en;
  const badge = locale === "id" ? profile.badge_id : profile.badge_en;

  const [first, ...rest] = profile.hero_name.split("\n");

  return (
    <header className="hero">
      <h1 className="hero-name hero-anim">
        {first}
        <br />
        {rest.join(" ")}
        <span className="ac">.</span>
      </h1>
      <div className="hero-info-anim">
        <div className="badge">
          <span className="sdot" />
          <span>{badge}</span>
        </div>
        <p className="hero-tagline">{tagline}</p>
        <p className="hero-bio">{bio}</p>
        <span className="loc-badge">{profile.location}</span>
        <div className="hero-cta">
          <a href="#projects" className="cta-btn cta-primary">
            {t("hero.viewProjects")}
          </a>
          <a
            href="https://drive.google.com/uc?export=download&id=1unGvRsjpPhCzYG6-r62v4P2XJSfpDiqM"
            className="cta-btn cta-secondary"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("hero.downloadCv")}
          </a>
        </div>
      </div>
    </header>
  );
}
