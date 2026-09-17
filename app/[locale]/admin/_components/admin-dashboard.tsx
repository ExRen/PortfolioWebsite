"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout } from "../_actions/auth";
import { resyncToDatabase } from "../_actions/seed";
import { ProjectsPanel } from "./panels/projects-panel";
import { SkillsPanel } from "./panels/skills-panel";
import { ExperiencePanel } from "./panels/experience-panel";
import { EducationPanel } from "./panels/education-panel";
import { BuildingPanel } from "./panels/building-panel";
import { ProfilePanel } from "./panels/profile-panel";
import { AnalyticsPanel } from "./panels/analytics-panel";
import { BlogPanel } from "./panels/blog-panel";
import { InquiriesPanel } from "./panels/inquiries-panel";
import { OverviewPanel } from "./panels/overview-panel";
import { Toast } from "./toast";
import { ConfirmModal } from "./confirm-dialog";
import type {
  Project,
  Skill,
  Experience,
  Education,
  Profile,
  CurrentlyBuilding,
  AnalyticsEvent,
  ContactMessage,
  Post,
} from "@/lib/types";

type Tab =
  | "overview"
  | "projects"
  | "experience"
  | "education"
  | "skills"
  | "building"
  | "blog"
  | "inquiries"
  | "profile"
  | "analytics";

const TABS: { id: Tab; label: string; num: string; icon: string }[] = [
  { id: "overview", label: "Overview & Analytics", num: "01", icon: "grid" },
  { id: "projects", label: "Projects & Case Studies", num: "02", icon: "code" },
  { id: "experience", label: "Experience & Creds", num: "03", icon: "badge" },
  { id: "education", label: "Education", num: "04", icon: "cap" },
  { id: "skills", label: "Skills & Stack", num: "05", icon: "chip" },
  { id: "building", label: "Currently Building", num: "06", icon: "hammer" },
  { id: "blog", label: "Blog & Dispatches", num: "07", icon: "pen" },
  { id: "inquiries", label: "Inquiries & Messages", num: "08", icon: "mail" },
  { id: "profile", label: "Settings & SEO", num: "09", icon: "gear" },
  { id: "analytics", label: "Telemetry", num: "10", icon: "chart" },
];

function Icon({ name }: { name: string }) {
  const paths: Record<string, string> = {
    grid: "M4 4h7v7H4zM13 4h7v4h-7zM13 11h7v9h-7zM4 14h7v6H4z",
    code: "m8 8-4 4 4 4M16 8l4 4-4 4",
    badge: "M12 3l2.5 2.5L18 4l-.5 3.5L21 9l-2.5 2L21 13l-3.5 1.5L18 18l-3.5-1.5L12 19l-2.5-2.5L6 18l.5-3.5L3 13l2.5-2L3 9l3.5-1.5L6 4l3.5 1.5z",
    cap: "m12 4 10 4-10 4L2 8zM6 10v4c0 1.5 2.7 3 6 3s6-1.5 6-3v-4M22 8v8",
    chip: "M9 9h6v6H9zM4 4h16v16H4zM12 1v3M12 20v3M1 12h3M20 12h3",
    hammer: "m14 5 5 5M9 4l8 8-4 4-8-8zM9 4l3-1 4 4-1 3M4 20l5-1 1-4-5-1z",
    pen: "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z",
    mail: "M4 6h16v12H4zM4 7l8 6 8-6",
    gear: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19 12a7 7 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1a7 7 0 0 0-2-1.2L14 3h-4l-.5 2.6a7 7 0 0 0-2 1.2l-2.4-1-2 3.4 2 1.6A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.6 2 3.4 2.4-1a7 7 0 0 0 2 1.2L10 21h4l.5-2.6a7 7 0 0 0 2-1.2l2.4 1 2-3.4-2-1.6c.1-.4.1-.8.1-1.2z",
    chart: "M4 20V10M10 20V4M16 20v-8M22 20H2",
  };
  return (
    <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={paths[name] ?? paths.grid} />
    </svg>
  );
}

const VALID_TABS = TABS.map((t) => t.id);

export function AdminDashboard({
  email,
  data,
  locale,
}: {
  email: string;
  data: {
    projects: Project[];
    skills: Skill[];
    experiences: Experience[];
    education: Education[];
    profile: Profile;
    building: CurrentlyBuilding[];
    posts: Post[];
    analytics: AnalyticsEvent[];
    inquiries: ContactMessage[];
  };
  locale: string;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const [confirmAction, setConfirmAction] = useState<"resync" | null>(null);
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);

  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("section") as Tab | null;
    if (value && (VALID_TABS as string[]).includes(value)) {
      setTab(value);
    }
  }, []);

  const switchTab = (t: Tab) => {
    setTab(t);
    const url = new URL(window.location.href);
    url.searchParams.set("section", t);
    window.history.replaceState({}, "", url.toString());
    // Cache buster: revalidate server data on every tab switch so panels
    // never show rows fetched before a migration or an external DB change.
    startTransition(() => {
      refresh();
    });
  };

  const showToast = (msg: string, type: "ok" | "err" = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const refresh = () => router.refresh();

  const onResync = async () => {
    startTransition(async () => {
      const result = await resyncToDatabase();
      if (result.ok) {
        showToast("Database resynced");
        refresh();
      } else {
        showToast(result.error ?? "Resync failed", "err");
      }
    });
  };

  const onLogout = async () => {
    await logout();
    window.location.reload();
  };

  const onExport = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `portfolio-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Exported");
  };

  const onImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const text = await file.text();
      try {
        const parsed = JSON.parse(text);
        showToast(`Imported ${Object.keys(parsed).length} sections (preview only)`);
      } catch {
        showToast("Invalid JSON", "err");
      }
    };
    input.click();
  };

  const active = TABS.find((t) => t.id === tab) ?? TABS[0];
  const changed = () => {
    showToast("Saved");
    refresh();
  };
  const failed = (e: string) => showToast(e, "err");

  return (
    <div className="admin-dash">
      <aside className="adm-side">
        <div>
          <div className="adm-brand">
            <span className="adm-logo" aria-hidden="true">ER</span>
            <span className="adm-brand-text">
              <strong>ExRen Studio</strong>
              <small>CMS · v2.4</small>
            </span>
          </div>
          <div className="adm-status">
            <span className="adm-dot" aria-hidden="true" />
            <span>Terminal Ready</span>
          </div>
          <nav className="adm-nav" aria-label="Admin sections">
            {TABS.map((t) => (
              <button
                key={t.id}
                className={`adm-nav-item ${tab === t.id ? "active" : ""}`}
                onClick={() => switchTab(t.id)}
                role="tab"
                aria-selected={tab === t.id}
              >
                <span className="adm-nav-icon">
                  <Icon name={t.icon} />
                </span>
                <span className="adm-nav-label">{t.label}</span>
                <span className="adm-nav-num">{t.num}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="adm-side-foot">
          <span className="adm-user" title={email}>{email}</span>
          <button className="adm-logout" onClick={onLogout}>
            Terminate Session
          </button>
        </div>
      </aside>

      <div className="adm-main">
        <header className="adm-top">
          <span className="adm-sync">
            <span className="adm-dot" aria-hidden="true" />
            Production Sync: Active
          </span>
          <div className="adm-top-actions">
            <Link href={`/${locale}`} className="btn btn-sm btn-home">
              Live Portfolio
            </Link>
            <button className="btn btn-sm btn-secondary" onClick={onExport}>
              Export
            </button>
            <button className="btn btn-sm btn-secondary" onClick={onImport}>
              Import
            </button>
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => setConfirmAction("resync")}
              disabled={isPending}
              title="Replace all DB data with data.ts"
            >
              Resync
            </button>
            <button className="btn btn-sm btn-danger" onClick={onLogout}>
              Logout
            </button>
          </div>
        </header>

        <main className="adm-content">
          <div className="adm-crumb">
            <span>{active.num}</span>
            <span aria-hidden="true">/</span>
            <span>CMS Orchestrator</span>
            <span aria-hidden="true">/</span>
            <strong>{active.label}</strong>
          </div>

          <div className="tab-panel active">
            {tab === "overview" && (
              <OverviewPanel
                projects={data.projects}
                posts={data.posts}
                inquiries={data.inquiries}
                analytics={data.analytics}
                onGo={(t) => switchTab(t as Tab)}
              />
            )}
            {tab === "projects" && (
              <ProjectsPanel initial={data.projects} locale={locale} onChanged={changed} onError={failed} />
            )}
            {tab === "skills" && (
              <SkillsPanel initial={data.skills} onChanged={changed} onError={failed} />
            )}
            {tab === "experience" && (
              <ExperiencePanel initial={data.experiences} locale={locale} onChanged={changed} onError={failed} />
            )}
            {tab === "education" && (
              <EducationPanel initial={data.education} locale={locale} onChanged={changed} onError={failed} />
            )}
            {tab === "building" && (
              <BuildingPanel initial={data.building} onChanged={changed} onError={failed} />
            )}
            {tab === "blog" && (
              <BlogPanel initial={data.posts} onChanged={changed} onError={failed} />
            )}
            {tab === "inquiries" && <InquiriesPanel initial={data.inquiries} />}
            {tab === "profile" && (
              <ProfilePanel initial={data.profile} locale={locale} onChanged={changed} onError={failed} />
            )}
            {tab === "analytics" && <AnalyticsPanel events={data.analytics} />}
          </div>
        </main>
      </div>

      {toast && <Toast message={toast.msg} type={toast.type} />}
      {confirmAction && (
        <ConfirmModal
          title="Resync Database to Defaults?"
          message="WARNING: This will replace all database content with data.ts defaults!"
          confirmToken="RESYNC"
          confirmLabel="Resync Database"
          danger={true}
          onConfirm={() => {
            setConfirmAction(null);
            void onResync();
          }}
          onCancel={() => setConfirmAction(null)}
        />
      )}
    </div>
  );
}
