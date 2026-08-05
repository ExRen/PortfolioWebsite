import { setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/server-boundary";
import { LoginForm } from "./_components/login-form";
import { AdminDashboard } from "./_components/admin-dashboard";
import {
  getProjects,
  getSkills,
  getExperiences,
  getEducation,
  getProfile,
  getCurrentlyBuilding,
} from "@/lib/fetcher";
import { getAnalytics } from "./_actions/analytics";

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="admin-auth">
        <LoginForm />
      </div>
    );
  }
  try { await requireAdmin(); } catch { return <LoginForm />; }

  const [projects, skills, experiences, education, profile, building, analytics] =
    await Promise.all([
      getProjects(),
      getSkills(),
      getExperiences(),
      getEducation(),
      getProfile(),
      getCurrentlyBuilding(),
      getAnalytics(),
    ]);

  return (
    <AdminDashboard
      email={user.email ?? ""}
      data={{
        projects,
        skills,
        experiences,
        education,
        profile,
        building,
        analytics,
      }}
      locale={locale}
    />
  );
}
