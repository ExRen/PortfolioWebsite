"use client";

import { useState } from "react";
import {
  createSkill,
  updateSkill,
  deleteSkill,
} from "../../_actions/crud";
import type { Skill } from "@/lib/types";
import { EditorDialog } from "../editor-dialog";
import { ConfirmModal } from "../confirm-dialog";

const empty: Skill = {
  id: 0,
  group_name: "Frontend",
  name: "",
  is_featured: false,
  sort_order: 1,
};

export function SkillsPanel({
  initial,
  onChanged,
  onError,
}: {
  initial: Skill[];
  onChanged: () => void;
  onError: (m: string) => void;
}) {
  const [editing, setEditing] = useState<Skill | null>(null);

  const grouped = initial.reduce<Record<string, Skill[]>>((acc, s) => {
    if (!acc[s.group_name]) acc[s.group_name] = [];
    acc[s.group_name].push(s);
    return acc;
  }, {});

  return (
    <div>
      <div className="panel-header">
        <h2>Skills &amp; Tools</h2>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setEditing({ ...empty, id: 0 })}
        >
          + Add Skill
        </button>
      </div>
      {Object.entries(grouped).map(([group, skills]) => (
        <div key={group} className="sg">
          <div className="sg-title">{group}</div>
          <div className="stags">
            {skills.map((s) => (
              <span
                key={s.id}
                className={`sk ${s.is_featured ? "f" : ""}`}
                onClick={() => setEditing(s)}
                style={{ cursor: "pointer" }}
                title="Click to edit"
              >
                {s.name}
              </span>
            ))}
          </div>
        </div>
      ))}
      {editing && (
        <SkillEditor
          skill={editing}
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

function SkillEditor({
  skill,
  onClose,
  onSaved,
  onError,
}: {
  skill: Skill;
  onClose: () => void;
  onSaved: () => void;
  onError: (m: string) => void;
}) {
  const isNew = skill.id === 0;
  const [s, setS] = useState<Skill>({ ...skill });
  const [busy, setBusy] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const updateField = (updater: (prev: Skill) => Skill) => {
    setS(updater);
    setIsDirty(true);
  };

  const save = async () => {
    setBusy(true);
    setSaveError(null);
    const r = isNew
      ? await createSkill({ ...s, id: Math.floor(Math.random() * 1e9) })
      : await updateSkill(s.id, s);
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

  const remove = async () => {
    setBusy(true);
    const r = await deleteSkill(s.id);
    setBusy(false);
    if (r.ok) onSaved();
    else onError(r.error ?? "Delete failed");
  };

  return (
    <>
      <EditorDialog
        title={isNew ? "Add Skill" : `Edit Skill #${s.id}`}
        isDirty={isDirty}
        isSaving={busy}
        saveError={saveError}
        onClose={onClose}
        onSave={save}
      >
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">GROUP</label>
            <input
              className="form-input"
              value={s.group_name}
              onChange={(e) => updateField((prev) => ({ ...prev, group_name: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label className="form-label">SORT ORDER</label>
            <input
              className="form-input"
              type="number"
              value={s.sort_order}
              onChange={(e) =>
                updateField((prev) => ({ ...prev, sort_order: parseInt(e.target.value) || 1 }))
              }
            />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">NAME</label>
          <input
            className="form-input"
            value={s.name}
            onChange={(e) => updateField((prev) => ({ ...prev, name: e.target.value }))}
          />
        </div>
        <div className="form-group">
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={s.is_featured}
              onChange={(e) => updateField((prev) => ({ ...prev, is_featured: e.target.checked }))}
            />{" "}
            FEATURED
          </label>
        </div>
        {!isNew && (
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--hairline)" }}>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => setShowConfirmDelete(true)}
              disabled={busy}
            >
              Delete Skill
            </button>
          </div>
        )}
      </EditorDialog>

      {showConfirmDelete && (
        <ConfirmModal
          title={`Delete Skill "${s.name}"?`}
          message="Are you sure you want to delete this skill?"
          confirmToken="DELETE"
          confirmLabel="Delete Skill"
          danger={true}
          onConfirm={() => {
            setShowConfirmDelete(false);
            void remove();
          }}
          onCancel={() => setShowConfirmDelete(false)}
        />
      )}
    </>
  );
}
