"use client";

import { useEffect, useRef, useState } from "react";

export function EditorDialog({
  title,
  isDirty = false,
  isSaving = false,
  saveError = null,
  onClose,
  onSave,
  children,
}: {
  title: string;
  isDirty?: boolean;
  isSaving?: boolean;
  saveError?: string | null;
  onClose: () => void;
  onSave: () => void;
  children: React.ReactNode;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Focus first input inside dialog on mount
    const firstInput = dialogRef.current?.querySelector<HTMLElement>(
      "input, select, textarea, button:not(.editor-close)"
    );
    firstInput?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isDirty) {
          if (confirm("Discard unsaved changes?")) onClose();
        } else {
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDirty, onClose]);

  const handleClose = () => {
    if (isDirty && !confirm("Discard unsaved changes?")) return;
    onClose();
  };

  return (
    <div className="editor-overlay active" onClick={handleClose}>
      <div
        ref={dialogRef}
        className="editor-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="editor-dialog-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="editor-header">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h3 id="editor-dialog-title">{title}</h3>
            {isDirty && <span className="dirty-badge">Unsaved changes</span>}
          </div>
          <button className="editor-close" onClick={handleClose} aria-label="Close dialog">
            ×
          </button>
        </div>

        <div className="editor-body">
          {saveError && <div className="editor-error-banner" role="alert">{saveError}</div>}
          {children}
        </div>

        <div className="editor-footer">
          <button className="btn btn-secondary" onClick={handleClose} disabled={isSaving}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={onSave}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
