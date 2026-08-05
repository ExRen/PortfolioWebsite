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
    <section className="sec border-top" id="contact">
      <div className="sec-hdr">
        <span className="sec-num">08 —</span>
        <h2 className="sec-title">{t("section.contact")}</h2>
      </div>
      <div className="contact-layout">
        <div className="contact-left">
          <div
            className="cname"
            id="ctaText"
            dangerouslySetInnerHTML={{ __html: ctaHtml }}
          />
          <div className="clinks" id="contactLinks">
            <a href={`mailto:${profile.contact_email}`} className="cl">
              <svg viewBox="0 0 24 24">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              {profile.contact_email}
            </a>
            <a
              href={profile.contact_linkedin}
              className="cl"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 24 24">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
              LinkedIn
            </a>
            <a
              href={profile.contact_github}
              className="cl"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 24 24">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
              GitHub
            </a>
            {profile.contact_portfolio && (
              <a
                href={profile.contact_portfolio}
                className="cl"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 24 24">
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
                {locale === "id" ? "Portofolio" : "Portfolio"}
              </a>
            )}
          </div>
        </div>
        <div className="contact-right">
          <ContactForm locale={locale} />
        </div>
      </div>
    </section>
  );
}
