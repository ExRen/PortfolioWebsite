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
    <section className="w-full py-16 relative" id="about">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Photo Card */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <div className="relative w-full max-w-sm rounded-3xl overflow-hidden liquid-glass-panel p-2">
              <div className="rounded-2xl overflow-hidden relative aspect-[4/5] w-full">
                {profile.photo_url ? (
                  <Image
                    id="photoImg"
                    src={profile.photo_url}
                    alt="Bima Aryadinata — Informatics Engineer"
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover filter contrast-[1.05]"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-surface-tile-1 flex items-center justify-center text-3xl font-bold text-white">
                    BA
                  </div>
                )}
                <div className="absolute bottom-3 left-3 right-3 p-3.5 rounded-2xl bg-black/75 backdrop-blur-2xl border border-hairline text-white flex items-center justify-between shadow-lg">
                  <div>
                    <span className="font-headline-sm text-sm font-semibold block">
                      Bima Aryadinata
                    </span>
                    <span className="font-label-code text-xs text-text">
                      @ExRen · Universitas Sriwijaya &apos;25
                    </span>
                  </div>
                  <span className="text-primary text-xl">✓</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-4 max-w-sm">
              {pills.map((pill, i) => (
                <span
                  key={i}
                  className="px-3.5 py-1 rounded-full bg-[var(--surface-chip-translucent)] backdrop-blur-xl border border-hairline font-label-code text-xs text-text font-medium"
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column: Bio & Text */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-label-code text-xs text-primary font-semibold tracking-wider">
                  00 — BACKGROUND
                </span>
                <span className="h-0.5 w-6 bg-primary/60" />
              </div>
              <h2 className="font-headline-lg text-2xl md:text-3xl font-semibold text-fg">
                {t("section.about")}
              </h2>
            </div>

            <div className="flex flex-col gap-4 font-body-md text-sm sm:text-base text-text leading-relaxed">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-5 rounded-2xl liquid-glass-card">
                <span className="font-label-code text-xs text-primary font-bold block mb-1">
                  {t("about.card1Title")}
                </span>
                <span className="font-body-sm text-xs text-text">
                  {t("about.card1Desc")}
                </span>
              </div>
              <div className="p-5 rounded-2xl liquid-glass-card">
                <span className="font-label-code text-xs text-emerald-400 font-bold block mb-1">
                  {t("about.card2Title")}
                </span>
                <span className="font-body-sm text-xs text-text">
                  {t("about.card2Desc")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
