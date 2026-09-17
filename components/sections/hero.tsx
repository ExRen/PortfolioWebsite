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
    <section className="relative w-full max-w-[1200px] mx-auto px-4 md:px-6 pt-24 pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Live Status Badge */}
          <div className="magnetic-badge inline-flex items-center gap-2 self-start px-4 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-950/40 backdrop-blur-2xl border border-emerald-500/40 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399] animate-pulse" />
            <span className="font-label-meta text-xs uppercase tracking-wider text-emerald-400 font-semibold">
              {badge}
            </span>
          </div>

          <div className="flex flex-col">
            <h1 className="font-display-xl text-4xl sm:text-5xl lg:text-6xl font-semibold text-fg tracking-tight leading-[1.05]">
              {first?.toUpperCase()}
              <br />
              <span className="bg-gradient-to-r from-primary via-orange-500 to-amber-400 bg-clip-text text-transparent">
                {rest.join(" ")?.toUpperCase()}
              </span>
              <span className="text-primary">.</span>
            </h1>
            <p className="font-headline-sm text-lg sm:text-xl text-text font-medium mt-3">
              {tagline}
            </p>
          </div>

          <p className="font-body-lg text-base sm:text-lg text-text max-w-xl leading-relaxed">
            {bio}
          </p>

          {/* Location & Entity Badge */}
          <div className="flex flex-wrap items-center gap-2 text-ink-muted-48">
            <span className="font-label-meta text-xs text-text font-medium">
              📍 {profile.location}
            </span>
            <span className="text-ink-muted-48 font-label-meta text-xs">·</span>
            <span className="font-label-meta text-xs uppercase bg-[var(--surface-chip-translucent)] backdrop-blur-md border border-hairline px-3 py-1 rounded-full text-text font-semibold">
              {t("hero.bumnSec")}
            </span>
          </div>

          {/* Call to Action Cluster */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              className="magnetic-btn px-6 py-3 rounded-full liquid-pill-btn text-white font-body-sm text-sm font-semibold border border-orange-300/40 flex items-center gap-2"
              href="#projects"
            >
              <span>{t("hero.exploreWork")}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </a>
            <a
              className="magnetic-btn px-6 py-3 rounded-full bg-[var(--surface-chip-translucent)] hover:bg-[var(--surface-chip-translucent)]/80 text-fg font-body-sm text-sm font-semibold transition-all backdrop-blur-2xl border border-hairline flex items-center gap-2 hover:text-primary"
              href={`mailto:${profile.contact_email}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>{t("hero.getInTouch")}</span>
            </a>
            {cvUrl ? (
              <Link
                href={`/api/cv/${locale}`}
                className="magnetic-badge px-4 py-3 rounded-full bg-[var(--surface-chip-translucent)] hover:bg-[var(--surface-chip-translucent)]/80 text-text font-label-meta text-xs transition-all backdrop-blur-xl border border-hairline flex items-center gap-1.5 hover:text-fg"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>{t("hero.dossier")}</span>
              </Link>
            ) : (
              <a
                href={fallbackCv}
                target="_blank"
                rel="noopener noreferrer"
                className="magnetic-badge px-4 py-3 rounded-full bg-[var(--surface-chip-translucent)] hover:bg-[var(--surface-chip-translucent)]/80 text-text font-label-meta text-xs transition-all backdrop-blur-xl border border-hairline flex items-center gap-1.5 hover:text-fg"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>{t("hero.dossier")}</span>
              </a>
            )}
          </div>
        </div>

        {/* Right Column: Code Terminal Dark IDE */}
        <div className="lg:col-span-5 w-full">
          <TiltWrapper>
            <div className="rounded-3xl liquid-glass-panel p-6 relative overflow-hidden group transition-all duration-500 hover:shadow-2xl border border-hairline">
              <div className="relative flex items-center justify-between pb-3.5 mb-3.5 border-b border-hairline">
                <div className="flex items-center gap-2.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-rose-500/90 border border-white/20 inline-block" />
                  <span className="w-3.5 h-3.5 rounded-full bg-amber-400/90 border border-white/20 inline-block" />
                  <span className="w-3.5 h-3.5 rounded-full bg-emerald-400/90 border border-white/20 inline-block" />
                  <span className="ml-2 font-label-code text-xs text-text font-semibold tracking-wide">
                    bima.ts
                  </span>
                </div>
                <div className="flex items-center gap-1 px-3 py-0.5 rounded-full bg-[var(--surface-chip-translucent)] backdrop-blur-md border border-hairline">
                  <span className="font-label-meta text-xs text-cyan-400 font-semibold">
                    TS v5.4
                  </span>
                </div>
              </div>
              <TypewriterTerminal codeString={codeString} />
              <div className="relative mt-4 pt-3 border-t border-hairline flex items-center justify-between text-text font-label-code text-[11px]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" /> UTF-8
                </span>
                <span className="font-medium">TypeScript strict · ready</span>
              </div>
            </div>
          </TiltWrapper>
        </div>
      </div>
    </section>
  );
}
