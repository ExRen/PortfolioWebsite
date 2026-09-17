"use client";

import { useMemo } from "react";
import type {
  Project,
  Post,
  ContactMessage,
  AnalyticsEvent,
} from "@/lib/types";

function Metric({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string | number;
  sub: string;
  accent: "orange" | "emerald" | "sky" | "violet";
}) {
  return (
    <div className={`adm-metric adm-metric-${accent}`}>
      <span className="adm-metric-value">{value}</span>
      <span className="adm-metric-label">{label}</span>
      <span className="adm-metric-sub">{sub}</span>
    </div>
  );
}

export function OverviewPanel({
  projects,
  posts,
  inquiries,
  analytics,
  onGo,
}: {
  projects: Project[];
  posts: Post[];
  inquiries: ContactMessage[];
  analytics: AnalyticsEvent[];
  onGo: (tab: string) => void;
}) {
  const stats = useMemo(() => {
    const visitors = new Set(analytics.map((e) => e.session_id)).size;
    const cvs = analytics.filter((e) => e.event_type === "cv_download").length;
    return { visitors, cvs, events: analytics.length };
  }, [analytics]);

  const recentInquiries = inquiries.slice(0, 5);

  return (
    <div>
      <div className="panel-header">
        <div>
          <h2>Overview &amp; Analytics</h2>
          <p className="panel-sub">Live content + traffic at a glance</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => onGo("projects")}>
          + New Project
        </button>
      </div>
      <div className="adm-metrics">
        <Metric label="Projects" value={projects.length} sub="case studies live" accent="orange" />
        <Metric label="Inquiries" value={inquiries.length} sub="contact messages" accent="emerald" />
        <Metric label="Visitors" value={stats.visitors} sub="unique sessions" accent="sky" />
        <Metric label="CV Downloads" value={stats.cvs} sub="conversion events" accent="violet" />
        <Metric label="Blog Posts" value={posts.length} sub="dispatches" accent="orange" />
        <Metric label="Total Events" value={stats.events} sub="telemetry rows" accent="sky" />
      </div>
      <div className="adm-cols">
        <div className="adm-card">
          <div className="adm-card-head">
            <h3>Latest inquiries</h3>
            <button className="adm-link" onClick={() => onGo("inquiries")}>
              Open inbox →
            </button>
          </div>
          {recentInquiries.length === 0 ? (
            <p className="adm-muted">No messages yet.</p>
          ) : (
            <ul className="adm-mini-list">
              {recentInquiries.map((m) => (
                <li key={m.id}>
                  <strong>{m.name}</strong>
                  <span>{m.email}</span>
                  <p>{m.message.slice(0, 90)}{m.message.length > 90 ? "…" : ""}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="adm-card">
          <div className="adm-card-head">
            <h3>Projects showcase</h3>
            <button className="adm-link" onClick={() => onGo("projects")}>
              Manage →
            </button>
          </div>
          {projects.length === 0 ? (
            <p className="adm-muted">No projects yet.</p>
          ) : (
            <ul className="adm-mini-list">
              {projects.slice(0, 5).map((p) => (
                <li key={p.id}>
                  <strong>{p.name}</strong>
                  <span>{p.category}{p.status ? ` · ${p.status}` : ""}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
