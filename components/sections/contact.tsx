import { getTranslations } from "next-intl/server";
import { ContactForm } from "./contact-form";
import type { Profile } from "@/lib/types";

export async function Contact({
  profile,
  locale,
  t,
}: {
  profile: Profile;
  locale: string;
  t: Awaited<ReturnType<typeof getTranslations>>;
}) {
  const ctaHtml = locale === "id" ? profile.contact_cta_id : profile.contact_cta_en;

  return (
    <section className="w-full py-20 relative" id="contact">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6">
        <div className="flex items-center gap-2 mb-8">
          <span className="font-label-code text-xs text-primary font-semibold tracking-wider">
            08 — CONTACT
          </span>
          <span className="h-0.5 w-6 bg-primary/60" />
          <h2 className="font-headline-lg text-2xl md:text-3xl font-semibold text-fg ml-2">
            {t("section.contact")}
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div
              className="font-headline-lg text-2xl md:text-3xl font-bold text-fg leading-snug [&>span]:text-primary"
              id="ctaText"
              dangerouslySetInnerHTML={{ __html: ctaHtml }}
            />
            <div className="flex flex-col gap-3" id="contactLinks">
              <a
                href={`mailto:${profile.contact_email}`}
                className="p-4 rounded-2xl liquid-glass-card flex items-center gap-3 text-text hover:text-primary transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <span className="font-label-code text-xs sm:text-sm font-medium truncate">{profile.contact_email}</span>
              </a>
              <a
                href={profile.contact_linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl liquid-glass-card flex items-center gap-3 text-text hover:text-primary transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </div>
                <span className="font-label-code text-xs sm:text-sm font-medium">LinkedIn</span>
              </a>
              <a
                href={profile.contact_github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl liquid-glass-card flex items-center gap-3 text-text hover:text-primary transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                  </svg>
                </div>
                <span className="font-label-code text-xs sm:text-sm font-medium">GitHub</span>
              </a>
              {profile.contact_portfolio && (
                <a
                  href={profile.contact_portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl liquid-glass-card flex items-center gap-3 text-text hover:text-primary transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                    </svg>
                  </div>
                  <span className="font-label-code text-xs sm:text-sm font-medium">
                    {locale === "id" ? "Portofolio" : "Portfolio"}
                  </span>
                </a>
              )}
            </div>
          </div>
          <div className="lg:col-span-7">
            <ContactForm locale={locale} />
          </div>
        </div>
      </div>
    </section>
  );
}
