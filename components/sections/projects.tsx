import { getTranslations } from "next-intl/server";
import { CATEGORIES } from "@/lib/data";
import { ProjectsClient } from "./projects-client";
import type { Project } from "@/lib/types";

export async function Projects({
  items,
  locale,
}: {
  items: Project[];
  locale: string;
}) {
  const t = await getTranslations({ locale, namespace: "" });

  return (
    <section className="sec border-top" id="projects">
      <div className="sec-hdr">
        <span className="sec-num">03 —</span>
        <h2 className="sec-title">{t("section.projects")}</h2>
      </div>
      <ProjectsClient items={items} locale={locale} />
    </section>
  );
}
