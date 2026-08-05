"use client";

import { useState } from "react";
import {
  createExperience,
  updateExperience,
  deleteExperience,
} from "../../_actions/crud";
import type { Experience } from "@/lib/types";
import { EditorDialog } from "../editor-dialog";
import { ConfirmModal } from "../confirm-dialog";

const empty: Experience = {
  id: 0,
  sort_order: 1,
  type: "professional",
  period: "",
  title_en: "",
  title_id: "",
  org: "",
  location_en: "",
  location_id: "",
  desc_en: "",
  desc_id: "",
  achievement_en: "",
  achievement_id: "",
  tools: [],
};

export function ExperiencePanel({
  initial,
  locale: _locale,
  onChanged,
  onError,
}: {
  initial: Experience[];
  locale: string;
  onChanged: () => void;
  onError: (m: string) => void;
}) {
  const [editing, setEditing] = useState<Experience | null>(null);
  const [deletingExp, setDeletingExp] = useState<Experience | null>(null);

  return (
    <div>
      <div className="panel-header">
        <h2>Experience</h2>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setEditing({ ...empty, id: 0 })}
        >
          + Add Experience
        </button>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>TITLE</th>
              <th>ORG</th>
              <th>TYPE</th>
              <th>PERIOD</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {initial.map((e) => (
              <tr key={e.id}>
                <td>{e.id}</td>
                <td>{e.title_en}</td>
                <td>{e.org}</td>
                <td>{e.type}</td>
                <td>{e.period}</td>
                <td>
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => setEditing(e)}
                  >
                    Edit
                  </button>{" "}
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => setDeletingExp(e)}
                  >
                    Del
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {deletingExp && (
        <ConfirmModal
          title={`Delete Experience "${deletingExp.title_en}"?`}
          message="Are you sure you want to delete this experience record?"
          confirmToken="DELETE"
          confirmLabel="Delete Experience"
          danger={true}
          onConfirm={async () => {
            const id = deletingExp.id;
            setDeletingExp(null);
            const r = await deleteExperience(id);
            if (r.ok) onChanged();
            else onError(r.error ?? "Delete failed");
          }}
          onCancel={() => setDeletingExp(null)}
        />
      )}
      {editing && (
        <ExperienceEditor
          experience={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            onChanged();
          }}
          onError={onError}
        />
      )}
    </div>
  );
}

function ExperienceEditor({
  experience,
  onClose,
  onSaved,
  onError,
}: {
  experience: Experience;
  onClose: () => void;
  onSaved: () => void;
  onError: (m: string) => void;
}) {
  const isNew = experience.id === 0;
  const [e, setE] = useState<Experience>({ ...experience });
  const [toolsText, setToolsText] = useState(e.tools.join(", "));
  const [busy, setBusy] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const updateField = (updater: (prev: Experience) => Experience) => {
    setE(updater);
    setIsDirty(true);
  };

  const save = async () => {
    setBusy(true);
    setSaveError(null);
    const cleaned: Experience = {
      ...e,
      tools: toolsText
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
    const r = isNew
      ? await createExperience({ ...cleaned, id: Math.floor(Math.random() * 1e9) })
      : await updateExperience(e.id, cleaned);
    setBusy(false);
    if (r.ok) {
      setIsDirty(false);
      onSaved();
    } else {
      const err = r.error ?? "Save failed";
      setSaveError(err);
      onError(err);
    }
  };

  return (
    <EditorDialog
      title={isNew ? "Add Experience" : `Edit Experience #${e.id}`}
      isDirty={isDirty}
      isSaving={busy}
      saveError={saveError}
      onClose={onClose}
      onSave={save}
    >
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">SORT ORDER</label>
          <input
            className="form-input"
            type="number"
            value={e.sort_order}
            onChange={(ev) =>
              updateField((prev) => ({ ...prev, sort_order: parseInt(ev.target.value) || 1 }))
            }
          />
        </div>
        <div className="form-group">
          <label className="form-label">TYPE</label>
          <select
            className="form-select"
            value={e.type}
            onChange={(ev) =>
              updateField((prev) => ({ ...prev, type: ev.target.value as Experience["type"] }))
            }
          >
            <option value="professional">Professional</option>
            <option value="organization">Organization</option>
          </select>
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">PERIOD</label>
        <input
          className="form-input"
          value={e.period}
          onChange={(ev) => updateField((prev) => ({ ...prev, period: ev.target.value }))}
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">TITLE (EN)</label>
          <input
            className="form-input"
            value={e.title_en}
            onChange={(ev) => updateField((prev) => ({ ...prev, title_en: ev.target.value }))}
          />
        </div>
        <div className="form-group">
          <label className="form-label">TITLE (ID)</label>
          <input
            className="form-input"
            value={e.title_id}
            onChange={(ev) => updateField((prev) => ({ ...prev, title_id: ev.target.value }))}
          />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">ORG</label>
        <input
          className="form-input"
          value={e.org}
          onChange={(ev) => updateField((prev) => ({ ...prev, org: ev.target.value }))}
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">LOCATION (EN)</label>
          <input
            className="form-input"
            value={e.location_en}
            onChange={(ev) => updateField((prev) => ({ ...prev, location_en: ev.target.value }))}
          />
        </div>
        <div className="form-group">
          <label className="form-label">LOCATION (ID)</label>
          <input
            className="form-input"
            value={e.location_id}
            onChange={(ev) => updateField((prev) => ({ ...prev, location_id: ev.target.value }))}
          />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">DESCRIPTION (EN)</label>
        <textarea
          className="form-textarea"
          rows={3}
          value={e.desc_en}
          onChange={(ev) => updateField((prev) => ({ ...prev, desc_en: ev.target.value }))}
        />
      </div>
      <div className="form-group">
        <label className="form-label">DESCRIPTION (ID)</label>
        <textarea
          className="form-textarea"
          rows={3}
          value={e.desc_id}
          onChange={(ev) => updateField((prev) => ({ ...prev, desc_id: ev.target.value }))}
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">ACHIEVEMENT (EN)</label>
          <textarea
            className="form-textarea"
            rows={2}
            value={e.achievement_en}
            onChange={(ev) =>
              updateField((prev) => ({ ...prev, achievement_en: ev.target.value }))
            }
          />
        </div>
        <div className="form-group">
          <label className="form-label">ACHIEVEMENT (ID)</label>
          <textarea
            className="form-textarea"
            rows={2}
            value={e.achievement_id}
            onChange={(ev) =>
              updateField((prev) => ({ ...prev, achievement_id: ev.target.value }))
            }
          />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">TOOLS (comma separated)</label>
        <input
          className="form-input"
          value={toolsText}
          onChange={(ev) => {
            setToolsText(ev.target.value);
            setIsDirty(true);
          }}
        />
      </div>
    </EditorDialog>
  );
}
