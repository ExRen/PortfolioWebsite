"use client";

import { useState } from "react";
import { login, logout } from "../_actions/auth";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const result = await login(email, password);
      if (!result.ok) {
        setError(result.error ?? "Login failed");
        setBusy(false);
        return;
      }
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setBusy(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="admin-auth-card">
      <h1 className="admin-auth-logo">
        B<span>.</span>ADMIN
      </h1>
      <div className="form-group">
        <label className="form-label">EMAIL</label>
        <input
          className="form-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoFocus
        />
      </div>
      <div className="form-group">
        <label className="form-label">PASSWORD</label>
        <input
          className="form-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error && <div className="admin-auth-error show">{error}</div>}
      <button
        type="submit"
        className="btn btn-primary"
        style={{ width: "100%" }}
        disabled={busy}
      >
        {busy ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
