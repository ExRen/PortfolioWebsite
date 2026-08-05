"use client";

import { useMemo } from "react";
import type { AnalyticsEvent } from "@/lib/types";

export function AnalyticsPanel({ events }: { events: AnalyticsEvent[] }) {
  const stats = useMemo(() => {
    const visitors = new Set(events.map((e) => e.session_id)).size;
    const cvs = events.filter((e) => e.event_type === "cv_download").length;
    const sections: Record<string, number> = {};
    events
      .filter((e) => e.event_type === "section_view")
      .forEach((e) => {
        sections[e.event_value] = (sections[e.event_value] ?? 0) + 1;
      });
    return { visitors, cvs, sections };
  }, [events]);

  return (
    <div>
      <div className="panel-header">
        <h2>Analytics Dashboard</h2>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div className="form-group" style={statCardStyle}>
          <h3 style={statTitleStyle}>Unique Visitors</h3>
          <p style={statValueStyle}>{stats.visitors}</p>
        </div>
        <div className="form-group" style={statCardStyle}>
          <h3 style={statTitleStyle}>Total CV Downloads</h3>
          <p style={statValueStyle}>{stats.cvs}</p>
        </div>
        <div className="form-group" style={statCardStyle}>
          <h3 style={statTitleStyle}>Total Events</h3>
          <p style={statValueStyle}>{events.length}</p>
        </div>
      </div>
      <h3 style={{ marginBottom: 12 }}>Section Views</h3>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>SECTION</th>
              <th>VISITS</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(stats.sections).length === 0 ? (
              <tr>
                <td colSpan={2} style={{ textAlign: "center" }}>
                  No section views recorded
                </td>
              </tr>
            ) : (
              Object.entries(stats.sections)
                .sort((a, b) => b[1] - a[1])
                .map(([sec, n]) => (
                  <tr key={sec}>
                    <td>{sec}</td>
                    <td>{n}</td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
      <h3 style={{ marginTop: 24, marginBottom: 12 }}>Recent Events</h3>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>TYPE</th>
              <th>VALUE</th>
              <th>WHEN</th>
            </tr>
          </thead>
          <tbody>
            {events.slice(0, 50).map((e) => (
              <tr key={e.id}>
                <td>{e.event_type}</td>
                <td>{e.event_value}</td>
                <td>{new Date(e.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const statCardStyle: React.CSSProperties = {
  background: "var(--canvas)",
  border: "1px solid var(--hairline)",
  padding: 16,
  borderRadius: 8,
};
const statTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 14,
  color: "var(--ink-muted-80)",
};
const statValueStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 28,
  fontWeight: 700,
  color: "var(--ink)",
};
