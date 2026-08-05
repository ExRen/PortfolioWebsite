import { getTranslations } from "next-intl/server";
import type { Profile } from "@/lib/types";

export async function Footer({
  profile,
  locale,
}: {
  profile: Profile;
  locale: string;
}) {
  return (
    <footer className="footer">
      <span className="footer-text" id="footerText">
        {locale === "id" ? profile.footer_id : profile.footer_en}
      </span>
    </footer>
  );
}
