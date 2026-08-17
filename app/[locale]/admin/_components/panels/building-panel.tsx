"use client";

import { useState } from "react";
import {
  createBuilding,
  updateBuilding,
  deleteBuilding,
} from "../../_actions/crud";
import type { CurrentlyBuilding } from "@/lib/types";
import { EditorDialog } from "../editor-dialog";
import { ConfirmModal } from "../confirm-dialog";

const empty: CurrentlyBuilding = {
  id: 0,
  sort_order: 1,
  name_en: "",
  name_id: "",
  description_en: "",
  description_id: "",
  status_en: "",
  status_id: "",
  stack: [],
};

export function BuildingPanel({
  initial,
  onChanged,
  onError,
}: {
  initial: CurrentlyBuilding[];
  onChanged: () => void;
  onError: (msg: string) => void;
}) {
  const [editing, setEditing] = useState<CurrentlyBuilding | null>(null);
  const [deleting, setDeleting] = useState<CurrentlyBuilding | null>(null);

  return (
    <div>
      <div className="panel-header">
        <h2>Currently Building</h2>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setEditing({ ...empty, id: 0 })}
        >
          + Add Item
        </button>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>NAME (EN)</th>
              <th>STATUS (EN)</th>
              <th>STACK</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {initial.length === 0 ? (
              <tr>
                <td colSpan={5} className="empty-state">
                  <div className="empty-state-content">
                    <p>No items found.</p>
                    <span className="empty-state-sub">
                      The public section falls back to the defaults in lib/data.ts while this
                      table is empty. Click "+ Add Item" to take control.
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              initial.map((b) => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>{b.name_en}</td>
                  <td>{b.status_en}</td>
                  <td>{b.stack.join(", ")}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => setEditing(b)}
                    >
                      Edit
                    </button>{" "}
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => setDeleting(b)}
                    >
                      Del
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {deleting && (
        <ConfirmModal
          title={`Delete "${deleting.name_en}"?`}
          message="Are you sure you want to delete this item? This action cannot be undone."
          confirmToken="DELETE"
          confirmLabel="Delete Item"
          danger={true}
          onConfirm={async () => {
            const id = deleting.id!;
            setDeleting(null);
            const r = await deleteBuilding(id);
            if (r.ok) onChanged();
            else onError(r.error ?? "Delete failed");
          }}
          onCancel={() => setDeleting(null)}
        />
      )}
      {editing && (
        <BuildingEditor
          item={editing}
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

function BuildingEditor({
  item,
  onClose,
  onSaved,
  onError,
}: {
  item: CurrentlyBuilding;
  onClose: () => void;
  onSaved: () => void;
  onError: (m: string) => void;
}) {
  const isNew = item.id === 0;
  const [b, setB] = useState<CurrentlyBuilding>({ ...item });
  const [stackText, setStackText] = useState(b.stack.join(", "));
  const [busy, setBusy] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const updateField = (updater: (prev: CurrentlyBuilding) => CurrentlyBuilding) => {
    setB(updater);
    setIsDirty(true);
  };

  const save = async () => {
    setBusy(true);
    setSaveError(null);
    const cleaned: CurrentlyBuilding = {
      ...b,
      stack: stackText
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
    const r = isNew
      ? await createBuilding({ ...cleaned, id: Math.floor(Math.random() * 1e9) })
      : await updateBuilding(b.id!, cleaned);
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

  const setLang = (k: "name" | "description" | "status", lang: "en" | "id", v: string) =>
    updateField((prev) => ({ ...prev, [`${k}_${lang}`]: v }));

  return (
    <EditorDialog
      title={isNew ? "Add Item" : `Edit Item #${b.id}`}
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
            value={b.sort_order}
            onChange={(e) =>
              updateField((prev) => ({ ...prev, sort_order: parseInt(e.target.value) || 1 }))
            }
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">NAME (EN)</label>
          <input
            className="form-input"
            value={b.name_en}
            onChange={(e) => setLang("name", "en", e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">NAME (ID)</label>
          <input
            className="form-input"
            value={b.name_id}
            onChange={(e) => setLang("name", "id", e.target.value)}
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">DESCRIPTION (EN)</label>
          <textarea
            className="form-textarea"
            rows={3}
            value={b.description_en}
            onChange={(e) => setLang("description", "en", e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">DESCRIPTION (ID)</label>
          <textarea
            className="form-textarea"
            rows={3}
            value={b.description_id}
            onChange={(e) => setLang("description", "id", e.target.value)}
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">STATUS (EN)</label>
          <input
            className="form-input"
            value={b.status_en}
            onChange={(e) => setLang("status", "en", e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">STATUS (ID)</label>
          <input
            className="form-input"
            value={b.status_id}
            onChange={(e) => setLang("status", "id", e.target.value)}
          />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">STACK (comma separated)</label>
        <input
          className="form-input"
          value={stackText}
          onChange={(e) => {
            setStackText(e.target.value);
            setIsDirty(true);
          }}
        />
      </div>
    </EditorDialog>
  );
}