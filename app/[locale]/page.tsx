import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Education } from "@/components/sections/education";
import { Certifications } from "@/components/sections/certifications";
import { Projects } from "@/components/sections/projects";
import { CurrentlyBuilding } from "@/components/sections/currently-building";
import { GitHub } from "@/components/sections/github";
import { Experience } from "@/components/sections/experience";
import { Skills } from "@/components/sections/skills";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";
import { SiteNav } from "@/components/nav/site-nav";
import { StatsBar } from "@/components/sections/stats-bar";
import { Ticker } from "@/components/sections/ticker";
import {
  getProjects,
  getSkills,
  getExperiences,
  getEducation,
  getProfile,
  getCurrentlyBuilding,
} from "@/lib/fetcher";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [profile, projects, skills, experiences, education, building, t] =
    await Promise.all([
      getProfile(),
      getProjects(),
      getSkills(),
      getExperiences(),
      getEducation(),
      getCurrentlyBuilding(),
      getTranslations({ locale, namespace: "" }),
    ]);

  return (
    <div className="wrap public-shell page-enter">
      <SiteNav />
      <Hero locale={locale} profile={profile} t={t} />
      <Projects items={projects} locale={locale} />
      <StatsBar stats={profile.stats} t={t} locale={locale} />
      <CurrentlyBuilding items={building} locale={locale} />
      <Experience items={experiences} locale={locale} t={t} />
      <About profile={profile} locale={locale} />
      <Education items={education} locale={locale} />
      <Certifications items={profile.certifications} locale={locale} />
      <Skills items={skills} locale={locale} />
      <GitHub />
      <Contact profile={profile} locale={locale} t={t} />
      <Footer profile={profile} locale={locale} />
    </div>
  );
}
