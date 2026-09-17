"use client";

import { useMemo, useState } from "react";
import type { ContactMessage } from "@/lib/types";

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export function InquiriesPanel({ initial }: { initial: ContactMessage[] }) {
  const [q, setQ] = useState("");
  const items = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return initial;
    return initial.filter((m) =>
      `${m.name} ${m.email} ${m.message}`.toLowerCase().includes(needle)
    );
  }, [initial, q]);

  return (
    <div>
      <div className="panel-header">
        <div>
          <h2>Inquiries &amp; Messages</h2>
          <p className="panel-sub">
            {initial.length} message{initial.length === 1 ? "" : "s"} via contact form
          </p>
        </div>
        <div className="adm-search">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, email, or message..."
            aria-label="Search inquiries"
          />
        </div>
      </div>
      {items.length === 0 ? (
        <div className="adm-empty">
          <p>No messages found.</p>
          <span>New contact-form submissions will appear here.</span>
        </div>
      ) : (
        <ul className="adm-inbox">
          {items.map((m) => (
            <li key={m.id} className="adm-msg">
              <div className="adm-msg-head">
                <span className="adm-avatar" aria-hidden="true">
                  {(m.name || "?").trim().charAt(0).toUpperCase()}
                </span>
                <div className="adm-msg-meta">
                  <strong>{m.name}</strong>
                  <span>{m.email}</span>
                </div>
                <span className="adm-chip">{(m.locale || "en").toUpperCase()}</span>
                <time>{fmtDate(m.created_at)}</time>
              </div>
              <p className="adm-msg-body">{m.message}</p>
              <div className="adm-msg-actions">
                <a
                  className="btn btn-sm btn-secondary"
                  href={`mailto:${encodeURIComponent(m.email)}?subject=${encodeURIComponent(`Re: portfolio inquiry from ${m.name}`)}`}
                >
                  Reply
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
