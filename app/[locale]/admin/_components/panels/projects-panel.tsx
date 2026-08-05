"use client";

import { useState } from "react";
import {
  createProject,
  updateProject,
  deleteProject,
  uploadProjectImage,
  deleteProjectImage,
} from "../../_actions/crud";
import type { Project } from "@/lib/types";
import { EditorDialog } from "../editor-dialog";
import { ConfirmModal } from "../confirm-dialog";

const empty: Project = {
  id: 0,
  sort_order: 1,
  category: "fullstack",
  name: "",
  role_en: "",
  role_id: "",
  desc_en: "",
  desc_id: "",
  detail_en: "",
  detail_id: "",
  tags: [],
  status: "",
  github_url: "",
  live_url: "",
  images: [],
};

export function ProjectsPanel({
  initial,
  locale: _locale,
  onChanged,
  onError,
}: {
  initial: Project[];
  locale: string;
  onChanged: () => void;
  onError: (msg: string) => void;
}) {
  const [editing, setEditing] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);

  return (
    <div>
      <div className="panel-header">
        <h2>Projects</h2>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setEditing({ ...empty, id: 0 })}
        >
          + Add Project
        </button>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>NAME</th>
              <th>CAT</th>
              <th>TAGS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {initial.length === 0 ? (
              <tr>
                <td colSpan={5} className="empty-state">
                  <div className="empty-state-content">
                    <p>No projects found.</p>
                    <span className="empty-state-sub">Click "+ Add Project" to create your first one.</span>
                  </div>
                </td>
              </tr>
            ) : (
              initial.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>{p.tags.slice(0, 4).join(", ")}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => setEditing(p)}
                    >
                      Edit
                    </button>{" "}
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => setDeletingProject(p)}
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
      {deletingProject && (
        <ConfirmModal
          title={`Delete Project "${deletingProject.name}"?`}
          message="Are you sure you want to delete this project? This action cannot be undone."
          confirmToken="DELETE"
          confirmLabel="Delete Project"
          danger={true}
          onConfirm={async () => {
            const id = deletingProject.id;
            setDeletingProject(null);
            const r = await deleteProject(id);
            if (r.ok) onChanged();
            else onError(r.error ?? "Delete failed");
          }}
          onCancel={() => setDeletingProject(null)}
        />
      )}
      {editing && (
        <ProjectEditor
          project={editing}
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

function ProjectEditor({
  project,
  onClose,
  onSaved,
  onError,
}: {
  project: Project;
  onClose: () => void;
  onSaved: () => void;
  onError: (m: string) => void;
}) {
  const isNew = project.id === 0;
  const [p, setP] = useState<Project>({ ...project });
  const [tagsText, setTagsText] = useState(p.tags.join(", "));
  const [busy, setBusy] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const updateField = (updater: (prev: Project) => Project) => {
    setP(updater);
    setIsDirty(true);
  };

  const save = async () => {
    setBusy(true);
    setSaveError(null);
    const cleaned: Project = {
      ...p,
      tags: tagsText
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
    const r = isNew
      ? await createProject({ ...cleaned, id: Math.floor(Math.random() * 1e9) })
      : await updateProject(p.id, cleaned);
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

  const onUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (isNew) {
      onError("Save the project first, then add images");
      return;
    }
    const fd = new FormData();
    fd.append("file", file);
    const r = await uploadProjectImage(p.id, fd);
    if (r.ok && r.url) {
      updateField((prev) => ({ ...prev, images: [...(prev.images ?? []), r.url!] }));
    } else {
      onError(r.error ?? "Upload failed");
    }
  };

  const removeImage = async (url: string) => {
    const r = await deleteProjectImage(p.id, url);
    if (r.ok) {
      updateField((prev) => ({ ...prev, images: (prev.images ?? []).filter((u) => u !== url) }));
    } else {
      onError(r.error ?? "Delete failed");
    }
  };

  return (
    <EditorDialog
      title={isNew ? "Add Project" : `Edit Project #${p.id}`}
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
            value={p.sort_order}
            onChange={(e) =>
              updateField((prev) => ({ ...prev, sort_order: parseInt(e.target.value) || 1 }))
            }
          />
        </div>
        <div className="form-group">
          <label className="form-label">CATEGORY</label>
          <select
            className="form-select"
            value={p.category}
            onChange={(e) =>
              updateField((prev) => ({ ...prev, category: e.target.value as Project["category"] }))
            }
          >
            <option value="ai">AI / ML</option>
            <option value="fullstack">Full-Stack</option>
            <option value="tools">Tools</option>
          </select>
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">NAME</label>
        <input
          className="form-input"
          value={p.name}
          onChange={(e) => updateField((prev) => ({ ...prev, name: e.target.value }))}
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">ROLE (EN)</label>
          <input
            className="form-input"
            value={p.role_en}
            onChange={(e) => updateField((prev) => ({ ...prev, role_en: e.target.value }))}
          />
        </div>
        <div className="form-group">
          <label className="form-label">ROLE (ID)</label>
          <input
            className="form-input"
            value={p.role_id}
            onChange={(e) => updateField((prev) => ({ ...prev, role_id: e.target.value }))}
          />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">SHORT DESC (EN)</label>
        <textarea
          className="form-textarea"
          rows={3}
          value={p.desc_en}
          onChange={(e) => updateField((prev) => ({ ...prev, desc_en: e.target.value }))}
        />
      </div>
      <div className="form-group">
        <label className="form-label">SHORT DESC (ID)</label>
        <textarea
          className="form-textarea"
          rows={3}
          value={p.desc_id}
          onChange={(e) => updateField((prev) => ({ ...prev, desc_id: e.target.value }))}
        />
      </div>
      <div className="form-group">
        <label className="form-label">DETAIL (EN)</label>
        <textarea
          className="form-textarea"
          rows={5}
          value={p.detail_en}
          onChange={(e) => updateField((prev) => ({ ...prev, detail_en: e.target.value }))}
        />
      </div>
      <div className="form-group">
        <label className="form-label">DETAIL (ID)</label>
        <textarea
          className="form-textarea"
          rows={5}
          value={p.detail_id}
          onChange={(e) => updateField((prev) => ({ ...prev, detail_id: e.target.value }))}
        />
      </div>
      <div className="form-group">
        <label className="form-label">TAGS (comma separated)</label>
        <input
          className="form-input"
          value={tagsText}
          onChange={(e) => {
            setTagsText(e.target.value);
            setIsDirty(true);
          }}
        />
      </div>
      <div className="form-group">
        <label className="form-label">STATUS</label>
        <input
          className="form-input"
          value={p.status ?? ""}
          onChange={(e) => updateField((prev) => ({ ...prev, status: e.target.value }))}
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">GITHUB URL</label>
          <input
            className="form-input"
            value={p.github_url}
            onChange={(e) => updateField((prev) => ({ ...prev, github_url: e.target.value }))}
          />
        </div>
        <div className="form-group">
          <label className="form-label">LIVE URL</label>
          <input
            className="form-input"
            value={p.live_url}
            onChange={(e) => updateField((prev) => ({ ...prev, live_url: e.target.value }))}
          />
        </div>
      </div>
      {!isNew && (
        <div className="form-group">
          <label className="form-label">DOCUMENTATION IMAGES</label>
          <input
            type="file"
            accept="image/*"
            onChange={onUploadImage}
            className="form-input"
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
              gap: 8,
              marginTop: 8,
            }}
          >
            {(p.images ?? []).map((url) => (
              <div key={url} style={{ position: "relative" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt=""
                  style={{
                    width: "100%",
                    height: 90,
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  style={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                  }}
                  onClick={() => removeImage(url)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </EditorDialog>
  );
}
