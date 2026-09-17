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
    <section className="w-full max-w-[1200px] mx-auto px-4 md:px-6 py-16 relative" id="selected-projects">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-label-code text-xs text-primary font-semibold tracking-wider">
              03 — ARCHIVE
            </span>
            <span className="h-0.5 w-6 bg-primary/60" />
          </div>
          <h2 className="font-headline-lg text-2xl md:text-3xl font-semibold text-fg">
            {t("section.projects")}
          </h2>
          <p className="font-body-sm text-sm text-ink-muted-48 mt-1 max-w-lg">
            {t("project.subtitle")}
          </p>
        </div>
      </div>
      <div id="projects">
        <ProjectsClient items={items} locale={locale} />
      </div>
    </section>
  );
}
