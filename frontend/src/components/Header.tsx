import { useState } from "react";
import { C } from "./Tokens";
import { Btn } from "./Btn";

const SHOW_LOGIN = false

export const NAV = [
  { label: "О нас", href: "#" },
  { label: "Как это работает", href: "#how" },
  { label: "Что проверяем", href: "#what" },
  { label: "Вопросы", href: "#faq" },
];

interface HeaderProps {
  onLoginClick?: () => void;
}

export function Header({ onLoginClick }: HeaderProps) {
  const [open, setOpen] = useState(false);
  return (
    <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, backgroundColor: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="#" style={{ textDecoration: "none" }}>
          <span style={{ fontSize: 22, fontWeight: 800, color: C.green, letterSpacing: "-0.5px" }}>esimde</span>
        </a>

        <nav style={{ display: "flex", gap: 32 }} className="hdr-nav">
          {NAV.map(l => (
            <a key={l.label} href={l.href} style={{ fontSize: 14, fontWeight: 500, color: C.muted, textDecoration: "none" }}
              onMouseEnter={e => (e.currentTarget.style.color = C.text)}
              onMouseLeave={e => (e.currentTarget.style.color = C.muted)}>{l.label}</a>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }} className="hdr-nav">
          {SHOW_LOGIN && (
            <a href="#login" onClick={(e) => { e.preventDefault(); onLoginClick?.(); }} style={{ fontSize: 14, fontWeight: 600, color: C.text, textDecoration: "none", cursor: "pointer" }}>Войти</a>
          )}
          <Btn label="Проверить родителя" />
        </div>

        <button onClick={() => setOpen(!open)} className="hdr-burger"
          style={{ background: "none", border: "none", cursor: "pointer", padding: 8, display: "none" }}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            {open
              ? <path d="M4 4l14 14M18 4L4 18" stroke={C.text} strokeWidth="1.8" strokeLinecap="round" />
              : <path d="M3 6h16M3 11h16M3 16h16" stroke={C.text} strokeWidth="1.8" strokeLinecap="round" />}
          </svg>
        </button>
      </div>

      {open && (
        <div style={{ padding: "12px 24px 20px", borderTop: `1px solid ${C.border}`, display: "flex", flexDirection: "column", gap: 14 }}>
          {NAV.map(l => <a key={l.label} href={l.href} onClick={() => setOpen(false)} style={{ fontSize: 15, fontWeight: 500, color: C.text, textDecoration: "none" }}>{l.label}</a>)}
          <div style={{ paddingTop: 8, borderTop: `1px solid ${C.border}` }}><Btn label="Проверить родителя" /></div>
        </div>
      )}
    </header>
  );
}