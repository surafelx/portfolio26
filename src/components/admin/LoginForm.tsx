"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const body = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(body.error ?? "Sign-in failed.");
        return;
      }
      router.refresh();
    } catch {
      setError("Couldn't reach the server. Check that the site is running.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="admin-login">
      <form className="login-card" onSubmit={submit}>
        <span className="label">Site settings</span>
        <h1>Sign in to edit your site</h1>
        {configured ? (
          <>
            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              required
            />
            {error && (
              <p className="error" role="alert">
                {error}
              </p>
            )}
            <button className="btn" type="submit" disabled={busy || !password}>
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </>
        ) : (
          <p>
            Settings are locked because no password is set. Add <code>ADMIN_PASSWORD</code> to <code>.env.local</code> on your machine, or to
            the project&apos;s environment variables on Vercel, then restart.
          </p>
        )}
        <a className="back" href="/">
          ← Back to the site
        </a>
      </form>
    </main>
  );
}
