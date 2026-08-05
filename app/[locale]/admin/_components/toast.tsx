"use client";

export function Toast({
  message,
  type,
}: {
  message: string;
  type: "ok" | "err";
}) {
  return (
    <div className={`toast toast-${type}`} role="status">
      {message}
    </div>
  );
}
