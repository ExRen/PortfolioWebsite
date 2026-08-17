import { getTranslations } from "next-intl/server";
import Link from "next/link";
import type { Profile } from "@/lib/types";
import { TiltWrapper } from "@/components/tilt-wrapper";
import { TypewriterTerminal } from "@/components/typewriter-terminal";

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
  const cvUrl = locale === "id" ? profile.cv_url_id : profile.cv_url_en;
  const fallbackCv = "https://drive.google.com/uc?export=download&id=1unGvRsjpPhCzYG6-r62v4P2XJSfpDiqM";

  const codeString = `const developer = {
  name: "${profile.hero_name.replace("\n", " ")}",
  role: "Full-Stack & AI Builder",
  skills: ["Next.js", "TypeScript", "Python", "NestJS"],
  status: "Building enterprise software & AI"
};`;

  return (
    <header className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <div className="badge hero-anim">
            <span className="sdot" />
            <span>{badge}</span>
          </div>
          <h1 className="hero-name hero-anim">
            {first}
            <br />
            {rest.join(" ")}
            <span className="ac">.</span>
          </h1>
          <p className="hero-tagline hero-info-anim">{tagline}</p>
          <p className="hero-bio hero-info-anim">{bio}</p>
          <div className="hero-meta hero-info-anim">
            <span className="loc-badge">{profile.location}</span>
          </div>
          <div className="hero-cta hero-info-anim">
            <a href="#projects" className="cta-btn cta-primary">
              {t("hero.viewProjects")}
            </a>
            {cvUrl ? (
              <Link href={`/api/cv/${locale}`} className="cta-btn cta-secondary">
                {t("hero.downloadCv")}
              </Link>
            ) : (
              <a
                href={fallbackCv}
                className="cta-btn cta-secondary"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("hero.downloadCv")}
              </a>
            )}
          </div>
        </div>

        <div className="hero-visual hero-info-anim relative z-10">
          <TiltWrapper>
            <div className="code-terminal cursor-default shadow-xl">
              <div className="terminal-header">
                <span className="dot red" />
                <span className="dot yellow" />
                <span className="dot green" />
                <span className="terminal-title">bima.ts</span>
              </div>
              <TypewriterTerminal codeString={codeString} />
            </div>
          </TiltWrapper>
        </div>
      </div>
    </header>
  );
}
