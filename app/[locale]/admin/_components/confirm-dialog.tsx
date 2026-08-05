"use client";

import { useEffect, useRef, useState } from "react";

export function ConfirmModal({
  title,
  message,
  confirmToken,
  confirmLabel = "Confirm",
  danger = true,
  onConfirm,
  onCancel,
}: {
  title: string;
  message: string;
  confirmToken?: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const [inputVal, setInputVal] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  const canConfirm =
    !confirmToken ||
    inputVal.trim().toUpperCase() === confirmToken.toUpperCase();

  return (
    <div className="admin-confirm-overlay" onClick={onCancel}>
      <div
        className="admin-confirm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="confirm-modal-title">{title}</h2>
        <p>{message}</p>

        {confirmToken && (
          <div className="form-group" style={{ marginTop: 16 }}>
            <label className="form-label" style={{ textTransform: "none" }}>
              Type <strong style={{ color: "var(--color-workshop-orange, #d86d3f)" }}>{confirmToken}</strong> to confirm:
            </label>
            <input
              ref={inputRef}
              className="form-input"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={confirmToken}
            />
          </div>
        )}

        <div
          className="admin-confirm-actions"
          style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 20 }}
        >
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className={`btn ${danger ? "btn-danger" : "btn-primary"}`}
            disabled={!canConfirm}
            onClick={() => {
              if (canConfirm) onConfirm();
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
