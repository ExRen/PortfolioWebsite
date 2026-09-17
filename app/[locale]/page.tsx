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
import LatestPost from "@/components/sections/latest-post";
import { SiteNav } from "@/components/nav/site-nav";
import { StatsBar } from "@/components/sections/stats-bar";
import { Ticker } from "@/components/sections/ticker";
import { MotionSection } from "@/components/motion-section";
import {
  getProjects,
  getSkills,
  getExperiences,
  getEducation,
  getProfile,
  getCurrentlyBuilding,
  getPosts,
} from "@/lib/fetcher";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [profile, projects, skills, experiences, education, building, posts, t] =
    await Promise.all([
      getProfile(),
      getProjects(),
      getSkills(),
      getExperiences(),
      getEducation(),
      getCurrentlyBuilding(),
      getPosts(),
      getTranslations({ locale, namespace: "" }),
    ]);

  return (
    <div className="wrap public-shell page-enter">
      <SiteNav />
      <MotionSection>
        <Hero locale={locale} profile={profile} t={t} />
      </MotionSection>
      <Ticker />
      <MotionSection>
        <Projects items={projects} locale={locale} />
      </MotionSection>
      <MotionSection>
        <StatsBar stats={profile.stats} t={t} locale={locale} />
      </MotionSection>
      <MotionSection>
        <CurrentlyBuilding items={building} locale={locale} />
      </MotionSection>
      <MotionSection>
        <Experience items={experiences} locale={locale} t={t} />
      </MotionSection>
      <MotionSection>
        <About profile={profile} locale={locale} />
      </MotionSection>
      <MotionSection>
        <Education items={education} locale={locale} />
      </MotionSection>
      <MotionSection>
        <Certifications items={profile.certifications} locale={locale} />
      </MotionSection>
      <MotionSection>
        <Skills items={skills} locale={locale} />
      </MotionSection>
      <MotionSection>
        <GitHub locale={locale} />
      </MotionSection>
      <MotionSection>
        <Contact profile={profile} locale={locale} t={t} />
      </MotionSection>
      <MotionSection>
        <LatestPost posts={posts} locale={locale} />
      </MotionSection>
      <Footer profile={profile} locale={locale} />
    </div>
  );
}
