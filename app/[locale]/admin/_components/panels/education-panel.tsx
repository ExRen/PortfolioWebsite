"use client";

import { useState } from "react";
import {
  createEducation,
  updateEducation,
  deleteEducation,
} from "../../_actions/crud";
import type { Education } from "@/lib/types";
import { EditorDialog } from "../editor-dialog";
import { ConfirmModal } from "../confirm-dialog";

const empty: Education = {
  id: 0,
  sort_order: 1,
  degree_en: "",
  degree_id: "",
  institution: "",
  location_en: "",
  location_id: "",
  period: "",
  gpa: "",
  highlights_en: [],
  highlights_id: [],
};

export function EducationPanel({
  initial,
  locale: _locale,
  onChanged,
  onError,
}: {
  initial: Education[];
  locale: string;
  onChanged: () => void;
  onError: (m: string) => void;
}) {
  const [editing, setEditing] = useState<Education | null>(null);
  const [deletingEdu, setDeletingEdu] = useState<Education | null>(null);

  return (
    <div>
      <div className="panel-header">
        <h2>Education</h2>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setEditing({ ...empty, id: 0 })}
        >
          + Add Education
        </button>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>DEGREE</th>
              <th>INSTITUTION</th>
              <th>PERIOD</th>
              <th>GPA</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {initial.map((e) => (
              <tr key={e.id}>
                <td>{e.id}</td>
                <td>{e.degree_en}</td>
                <td>{e.institution}</td>
                <td>{e.period}</td>
                <td>{e.gpa}</td>
                <td>
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => setEditing(e)}
                  >
                    Edit
                  </button>{" "}
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => setDeletingEdu(e)}
                  >
                    Del
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {deletingEdu && (
        <ConfirmModal
          title={`Delete Education "${deletingEdu.degree_en}"?`}
          message="Are you sure you want to delete this education entry?"
          confirmToken="DELETE"
          confirmLabel="Delete Education"
          danger={true}
          onConfirm={async () => {
            const id = deletingEdu.id;
            setDeletingEdu(null);
            const r = await deleteEducation(id);
            if (r.ok) onChanged();
            else onError(r.error ?? "Delete failed");
          }}
          onCancel={() => setDeletingEdu(null)}
        />
      )}
      {editing && (
        <EducationEditor
          education={editing}
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

function EducationEditor({
  education,
  onClose,
  onSaved,
  onError,
}: {
  education: Education;
  onClose: () => void;
  onSaved: () => void;
  onError: (m: string) => void;
}) {
  const isNew = education.id === 0;
  const [e, setE] = useState<Education>({ ...education });
  const [hiEn, setHiEn] = useState(e.highlights_en.join("\n"));
  const [hiId, setHiId] = useState(e.highlights_id.join("\n"));
  const [busy, setBusy] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const updateField = (updater: (prev: Education) => Education) => {
    setE(updater);
    setIsDirty(true);
  };

  const save = async () => {
    setBusy(true);
    setSaveError(null);
    const cleaned: Education = {
      ...e,
      highlights_en: hiEn.split("\n").map((s) => s.trim()).filter(Boolean),
      highlights_id: hiId.split("\n").map((s) => s.trim()).filter(Boolean),
    };
    const r = isNew
      ? await createEducation({ ...cleaned, id: Math.floor(Math.random() * 1e9) })
      : await updateEducation(e.id, cleaned);
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
      title={isNew ? "Add Education" : `Edit Education #${e.id}`}
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
          <label className="form-label">PERIOD</label>
          <input
            className="form-input"
            value={e.period}
            onChange={(ev) => updateField((prev) => ({ ...prev, period: ev.target.value }))}
          />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">INSTITUTION</label>
        <input
          className="form-input"
          value={e.institution}
          onChange={(ev) => updateField((prev) => ({ ...prev, institution: ev.target.value }))}
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">DEGREE (EN)</label>
          <input
            className="form-input"
            value={e.degree_en}
            onChange={(ev) => updateField((prev) => ({ ...prev, degree_en: ev.target.value }))}
          />
        </div>
        <div className="form-group">
          <label className="form-label">DEGREE (ID)</label>
          <input
            className="form-input"
            value={e.degree_id}
            onChange={(ev) => updateField((prev) => ({ ...prev, degree_id: ev.target.value }))}
          />
        </div>
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
        <label className="form-label">GPA</label>
        <input
          className="form-input"
          value={e.gpa}
          onChange={(ev) => updateField((prev) => ({ ...prev, gpa: ev.target.value }))}
        />
      </div>
      <div className="form-group">
        <label className="form-label">HIGHLIGHTS (EN, one per line)</label>
        <textarea
          className="form-textarea"
          rows={4}
          value={hiEn}
          onChange={(ev) => {
            setHiEn(ev.target.value);
            setIsDirty(true);
          }}
        />
      </div>
      <div className="form-group">
        <label className="form-label">HIGHLIGHTS (ID, one per line)</label>
        <textarea
          className="form-textarea"
          rows={4}
          value={hiId}
          onChange={(ev) => {
            setHiId(ev.target.value);
            setIsDirty(true);
          }}
        />
      </div>
    </EditorDialog>
  );
}
