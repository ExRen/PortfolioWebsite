import { getTranslations, getLocale } from "next-intl/server";
import Image from "next/image";

export async function GitHub({ locale }: { locale?: string }) {
  const currentLocale = locale ?? (await getLocale());
  const t = await getTranslations({ locale: currentLocale, namespace: "" });

  return (
    <section className="w-full max-w-[1200px] mx-auto px-4 md:px-6 py-16 relative" id="github">
      <div className="flex items-center gap-2 mb-8">
        <span className="font-label-code text-xs text-primary font-semibold tracking-wider">
          05 — ACTIVITY
        </span>
        <span className="h-0.5 w-6 bg-primary/60" />
        <h2 className="font-headline-lg text-2xl md:text-3xl font-semibold text-fg ml-2">
          {t("section.github")}
        </h2>
      </div>
      <div className="p-6 md:p-8 rounded-3xl liquid-glass-panel grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-4 flex flex-col items-center sm:items-start gap-3 text-center sm:text-left">
          <div className="w-24 h-24 rounded-2xl overflow-hidden relative border border-hairline shadow-md">
            <Image
              src="https://avatars.githubusercontent.com/ExRen?s=400"
              alt="Bima Aryadinata GitHub avatar"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div>
            <h3 className="font-headline-sm text-lg font-semibold text-fg">
              Bima Aryadinata
            </h3>
            <span className="font-label-code text-xs text-primary block mt-0.5">
              @ExRen
            </span>
          </div>
          <p className="font-body-sm text-xs text-text">
            {t("github.bio")}
          </p>
          <a
            href="https://github.com/ExRen"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--surface-chip-translucent)] hover:bg-[var(--surface-chip-translucent)]/80 border border-hairline text-text hover:text-fg font-label-code text-xs transition-all mt-1"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            github.com/ExRen
          </a>
        </div>
        <div className="lg:col-span-8 flex flex-col gap-4 items-center">
          <span className="font-label-code text-xs text-ink-muted-48 font-semibold uppercase tracking-wider self-start">
            {t("github.streakTitle")}
          </span>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full">
            <div className="relative w-full max-w-[495px] overflow-hidden rounded-2xl border border-hairline bg-[var(--surface-chip-translucent)] p-2">
              <Image
                src="https://github-readme-stats.vercel.app/api?username=ExRen&show_icons=true&theme=transparent&text_color=cbd5e1&title_color=f97316&icon_color=f97316&border_color=334155&hide_border=true"
                alt="GitHub stats"
                width={495}
                height={195}
                className="w-full h-auto"
                unoptimized
              />
            </div>
            <div className="relative w-full max-w-[320px] overflow-hidden rounded-2xl border border-hairline bg-[var(--surface-chip-translucent)] p-2">
              <Image
                src="https://streak-stats.demolab.com?user=ExRen&theme=transparent&stroke=334155&background=00000000&ring=f97316&fire=f97316&currStreakNum=f97316&sideNums=cbd5e1&sideTitle=cbd5e1&dates=94a3b8&hide_border=true"
                alt="GitHub streak"
                width={320}
                height={195}
                className="w-full h-auto"
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
