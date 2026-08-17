"use client";

import { useState } from "react";
import { createPost, updatePost, deletePost } from "../../_actions/crud";
import type { Post } from "@/lib/types";
import { EditorDialog } from "../editor-dialog";
import { ConfirmModal } from "../confirm-dialog";

const empty: Post = {
  id: 0,
  slug: "",
  title_en: "",
  title_id: "",
  excerpt_en: "",
  excerpt_id: "",
  content_en: "",
  content_id: "",
  cover_image: "",
  published_at: null,
  updated_at: null,
};

export function BlogPanel({
  initial,
  onChanged,
  onError,
}: {
  initial: Post[];
  onChanged: () => void;
  onError: (msg: string) => void;
}) {
  const [editing, setEditing] = useState<Post | null>(null);
  const [deleting, setDeleting] = useState<Post | null>(null);

  return (
    <div>
      <div className="panel-header">
        <h2>Blog Posts</h2>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setEditing({ ...empty, id: 0 })}
        >
          + Add Post
        </button>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>SLUG</th>
              <th>TITLE (EN)</th>
              <th>PUBLISHED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {initial.length === 0 ? (
              <tr>
                <td colSpan={5} className="empty-state">
                  <div className="empty-state-content">
                    <p>No posts found.</p>
                    <span className="empty-state-sub">
                      Fallback posts from lib/data.ts show on the blog while this table is empty.
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              initial.map((post) => (
                <tr key={post.id}>
                  <td>{post.id}</td>
                  <td>{post.slug}</td>
                  <td>{post.title_en}</td>
                  <td>
                    {post.published_at
                      ? new Date(post.published_at).toLocaleDateString()
                      : "—"}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => setEditing(post)}
                    >
                      Edit
                    </button>{" "}
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => setDeleting(post)}
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
          title={`Delete Post "${deleting.title_en}"?`}
          message="Are you sure you want to delete this post? This action cannot be undone."
          confirmToken="DELETE"
          confirmLabel="Delete Post"
          danger={true}
          onConfirm={async () => {
            const id = deleting.id;
            setDeleting(null);
            const r = await deletePost(id);
            if (r.ok) onChanged();
            else onError(r.error ?? "Delete failed");
          }}
          onCancel={() => setDeleting(null)}
        />
      )}
      {editing && (
        <PostEditor
          post={editing}
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

function PostEditor({
  post,
  onClose,
  onSaved,
  onError,
}: {
  post: Post;
  onClose: () => void;
  onSaved: () => void;
  onError: (m: string) => void;
}) {
  const isNew = post.id === 0;
  const [p, setP] = useState<Post>({ ...post });
  const [busy, setBusy] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const updateField = (updater: (prev: Post) => Post) => {
    setP(updater);
    setIsDirty(true);
  };

  const save = async () => {
    setBusy(true);
    setSaveError(null);
    const now = new Date().toISOString();
    const payload = isNew
      ? { ...p, published_at: p.published_at ?? now, updated_at: now }
      : { ...p, updated_at: now };
    const r = isNew
      ? await createPost({ ...payload, id: Math.floor(Math.random() * 1e9) })
      : await updatePost(p.id, payload);
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
      title={isNew ? "Add Post" : `Edit Post #${p.id}`}
      isDirty={isDirty}
      isSaving={busy}
      saveError={saveError}
      onClose={onClose}
      onSave={save}
    >
      <div className="form-group">
        <label className="form-label">SLUG (url path, e.g. my-post)</label>
        <input
          className="form-input"
          value={p.slug}
          onChange={(e) => updateField((prev) => ({ ...prev, slug: e.target.value.trim() }))}
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">TITLE (EN)</label>
          <input
            className="form-input"
            value={p.title_en}
            onChange={(e) => updateField((prev) => ({ ...prev, title_en: e.target.value }))}
          />
        </div>
        <div className="form-group">
          <label className="form-label">TITLE (ID)</label>
          <input
            className="form-input"
            value={p.title_id}
            onChange={(e) => updateField((prev) => ({ ...prev, title_id: e.target.value }))}
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">EXCERPT (EN)</label>
          <textarea
            className="form-textarea"
            rows={2}
            value={p.excerpt_en}
            onChange={(e) => updateField((prev) => ({ ...prev, excerpt_en: e.target.value }))}
          />
        </div>
        <div className="form-group">
          <label className="form-label">EXCERPT (ID)</label>
          <textarea
            className="form-textarea"
            rows={2}
            value={p.excerpt_id}
            onChange={(e) => updateField((prev) => ({ ...prev, excerpt_id: e.target.value }))}
          />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">CONTENT MARKDOWN (EN)</label>
        <textarea
          className="form-textarea"
          rows={12}
          style={{ fontFamily: "monospace" }}
          value={p.content_en}
          onChange={(e) => updateField((prev) => ({ ...prev, content_en: e.target.value }))}
        />
      </div>
      <div className="form-group">
        <label className="form-label">CONTENT MARKDOWN (ID)</label>
        <textarea
          className="form-textarea"
          rows={12}
          style={{ fontFamily: "monospace" }}
          value={p.content_id}
          onChange={(e) => updateField((prev) => ({ ...prev, content_id: e.target.value }))}
        />
      </div>
    </EditorDialog>
  );
}