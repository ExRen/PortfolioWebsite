import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: 64, marginBottom: 16 }}>404</h1>
      <p style={{ fontSize: 20, color: "var(--ink-muted-80)", marginBottom: 24 }}>
        Page not found
      </p>
      <Link
        href="/en"
        className="cta-btn cta-primary"
        style={{ marginTop: 8 }}
      >
        Back to home
      </Link>
    </div>
  );
}
