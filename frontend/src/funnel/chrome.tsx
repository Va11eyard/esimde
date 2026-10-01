import type { CSSProperties, ReactNode } from "react"
import { C } from "../components/Tokens"

export function FunnelChrome({ step, children }: { step?: string; children: ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #FAF7F2 0%, #F4F9FC 60%, #E8EFF6 100%)",
        fontFamily: "'Manrope', system-ui, sans-serif",
        color: C.text,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <header style={{ padding: "24px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <a href="#" style={{ textDecoration: "none" }}>
          <div style={{ fontSize: 26, fontWeight: 800, color: C.green, letterSpacing: "-0.5px", lineHeight: 1 }}>esimde</div>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, marginTop: 4 }}>Платформа когнитивного здоровья</div>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {step && <span style={{ fontSize: 13, fontWeight: 600, color: C.muted }}>{step}</span>}
          <a href="#" style={backLink}>← На главную</a>
        </div>
      </header>
      <main style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "8px 16px 48px" }}>
        <div
          style={{
            background: "rgba(255,255,255,0.95)",
            borderRadius: 32,
            padding: "36px 28px",
            width: "100%",
            maxWidth: 460,
            boxShadow: "0 20px 48px rgba(42, 174, 227, 0.08), 0 2px 10px rgba(0,0,0,0.03)",
            border: `1px solid ${C.border}`,
            boxSizing: "border-box",
          }}
        >
          {children}
        </div>
      </main>
    </div>
  )
}

const backLink: CSSProperties = {
  background: "#fff",
  border: `1px solid ${C.border}`,
  padding: "8px 18px",
  borderRadius: 999,
  fontSize: 14,
  fontWeight: 600,
  color: C.text,
  textDecoration: "none",
  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
}

export const title: CSSProperties = {
  fontSize: 28,
  fontWeight: 800,
  letterSpacing: "-0.5px",
  lineHeight: 1.2,
  margin: 0,
  textAlign: "center",
}

export const lead: CSSProperties = {
  fontSize: 14,
  fontWeight: 500,
  lineHeight: 1.55,
  color: C.muted,
  textAlign: "center",
  margin: "8px 0 28px",
}

export const input: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  marginTop: 8,
  padding: "14px 16px",
  borderRadius: 14,
  border: `1px solid ${C.border}`,
  background: "#FAF7F2",
  fontSize: 16,
  color: C.text,
  fontFamily: "inherit",
  outline: "none",
}

export const button: CSSProperties = {
  width: "100%",
  border: "none",
  background: C.blue,
  color: "#fff",
  borderRadius: 999,
  padding: "14px 18px",
  fontWeight: 700,
  fontSize: 15,
  cursor: "pointer",
  fontFamily: "inherit",
  boxShadow: "0 4px 16px rgba(42, 174, 227, 0.3)",
}

export const ghost: CSSProperties = {
  width: "100%",
  border: `1px solid ${C.border}`,
  background: "#fff",
  color: C.text,
  borderRadius: 999,
  padding: "12px 16px",
  fontWeight: 600,
  fontSize: 15,
  cursor: "pointer",
  fontFamily: "inherit",
}

export const choice: CSSProperties = {
  textAlign: "left",
  background: "#FAF7F2",
  border: `1px solid ${C.border}`,
  borderRadius: 16,
  padding: "14px 16px",
  fontSize: 15,
  fontWeight: 600,
  color: C.text,
  cursor: "pointer",
  fontFamily: "inherit",
}

export const wordCard: CSSProperties = {
  background: "#F4F9FC",
  border: `1px solid ${C.border}`,
  borderRadius: 16,
  padding: "16px 18px",
  fontSize: 22,
  fontWeight: 800,
  textAlign: "center",
  color: C.text,
}
