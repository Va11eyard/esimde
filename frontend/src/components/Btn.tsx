import { useState } from "react";
import { C } from "./Tokens";

export function Btn({ label, outlined, href = "#screen" }: { label: string; outlined?: boolean; href?: string }) {
  const [hov, setHov] = useState(false);
  if (outlined) {
    return (
      <a href={href} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 28px", borderRadius: 999, fontSize: 15, fontWeight: 600, textDecoration: "none", borderWidth: "1.5px", borderStyle: "solid", borderColor: hov ? C.blue : "rgba(17,24,39,0.25)", color: hov ? C.blue : C.text, backgroundColor: "transparent", transition: "all 0.18s" }}>
        {label}
      </a>
    );
  }
  return (
    <a href={href} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "13px 24px 13px 28px", borderRadius: 999, fontSize: 15, fontWeight: 600, textDecoration: "none", backgroundColor: hov ? C.blueDark : C.blue, color: "#fff", transition: "all 0.18s", boxShadow: hov ? "0 6px 20px rgba(42,174,227,0.4)" : "0 3px 12px rgba(42,174,227,0.25)" }}>
      {label}
      <span style={{ width: 28, height: 28, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.22)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <svg width="9" height="11" viewBox="0 0 9 11" fill="none"><path d="M1 1l7 4.5L1 10V1z" fill="white" /></svg>
      </span>
    </a>
  );
}