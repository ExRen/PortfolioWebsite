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
import { ProfilePanel } from "./panels/profile-panel";
import { AnalyticsPanel } from "./panels/analytics-panel";
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
} from "@/lib/types";

type Tab = "projects" | "skills" | "experience" | "education" | "profile" | "analytics";

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
    analytics: AnalyticsEvent[];
  };
  locale: string;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("projects");
  const [confirmAction, setConfirmAction] = useState<"resync" | null>(null);
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);

  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("section") as Tab | null;
    if (value && ["projects", "skills", "experience", "education", "profile", "analytics"].includes(value)) {
      setTab(value);
    }
  }, []);

  const switchTab = (t: Tab) => {
    setTab(t);
    const url = new URL(window.location.href);
    url.searchParams.set("section", t);
    window.history.replaceState({}, "", url.toString());
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

  return (
    <div className="admin-dash">
      <header className="admin-header">
        <Link href={`/${locale}`} className="logo">
          B<span>.</span>ADMIN
        </Link>
        <div className="admin-actions">
          <span className="admin-user">{email}</span>
          <Link href={`/${locale}`} className="btn btn-sm btn-home">
            Home
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

      <div className="admin-tabs">
        {(
          [
            "projects",
            "skills",
            "experience",
            "education",
            "profile",
            "analytics",
          ] as Tab[]
        ).map((t) => (
          <button
            key={t}
            className={`tab-btn ${tab === t ? "active" : ""}`}
            onClick={() => switchTab(t)}
            role="tab"
            aria-selected={tab === t}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="tab-panel active">
        {tab === "projects" && (
          <ProjectsPanel
            initial={data.projects}
            locale={locale}
            onChanged={() => {
              showToast("Saved");
              refresh();
            }}
            onError={(e) => showToast(e, "err")}
          />
        )}
        {tab === "skills" && (
          <SkillsPanel
            initial={data.skills}
            onChanged={() => {
              showToast("Saved");
              refresh();
            }}
            onError={(e) => showToast(e, "err")}
          />
        )}
        {tab === "experience" && (
          <ExperiencePanel
            initial={data.experiences}
            locale={locale}
            onChanged={() => {
              showToast("Saved");
              refresh();
            }}
            onError={(e) => showToast(e, "err")}
          />
        )}
        {tab === "education" && (
          <EducationPanel
            initial={data.education}
            locale={locale}
            onChanged={() => {
              showToast("Saved");
              refresh();
            }}
            onError={(e) => showToast(e, "err")}
          />
        )}
        {tab === "profile" && (
          <ProfilePanel
            initial={data.profile}
            locale={locale}
            onChanged={() => {
              showToast("Saved");
              refresh();
            }}
            onError={(e) => showToast(e, "err")}
          />
        )}
        {tab === "analytics" && <AnalyticsPanel events={data.analytics} />}
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
