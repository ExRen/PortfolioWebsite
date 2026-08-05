import { getTranslations } from "next-intl/server";
import { SiteNavClient } from "./site-nav-client";

export async function SiteNav() {
  const t = await getTranslations("");

  return (
    <SiteNavClient
      labels={{
        hireMe: t("nav.hireMe"),
        about: t("nav.about"),
        projects: t("nav.projects"),
        experience: t("nav.experience"),
        contact: t("nav.contact"),
        language: t("nav.language"),
        theme: t("nav.theme"),
        menu: t("nav.menu"),
        close: t("nav.close"),
      }}
    />
  );
}
