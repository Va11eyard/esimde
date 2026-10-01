import { C } from "./Tokens";

export function WhatWeCheck() {
  return (
    <section id="what" style={{ backgroundColor: C.altBg, padding: "72px 32px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h2 style={{ fontSize: "clamp(22px, 2.8vw, 36px)", fontWeight: 800, color: C.text, marginBottom: 48 }}>Что мы проверяем</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="two-col">
          {/* Memory */}
          <div style={{ backgroundColor: C.bg, borderRadius: 20, padding: "36px 32px", border: `1px solid ${C.border}` }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "rgba(42,174,227,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 3C7.13 3 4 6.13 4 10c0 2.38 1.19 4.47 3 5.74V17a1 1 0 001 1h6a1 1 0 001-1v-1.26C16.81 14.47 18 12.38 18 10c0-3.87-3.13-7-7-7z" stroke={C.blue} strokeWidth="1.5" strokeLinejoin="round"/><path d="M9 18h4" stroke={C.blue} strokeWidth="1.5" strokeLinecap="round"/></svg>
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: C.text, marginBottom: 12 }}>Память</h3>
            <p style={{ fontSize: 15, lineHeight: 1.65, color: C.muted, marginBottom: 24 }}>Используем международно признанный тест <strong style={{ color: C.text }}>Mini-Cog</strong>:</p>
            {["Запомнить 3 слова", "Нарисовать циферблат часов", "Вспомнить слова"].map((t, i) => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", backgroundColor: C.blue, color: "#fff", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</div>
                <span style={{ fontSize: 14, color: C.text }}>{t}</span>
              </div>
            ))}
          </div>
          {/* Independence */}
          <div style={{ backgroundColor: C.bg, borderRadius: 20, padding: "36px 32px", border: `1px solid ${C.border}` }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "rgba(42,174,227,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="6" r="3" stroke={C.blue} strokeWidth="1.5"/><path d="M5 19c0-3.31 2.69-6 6-6s6 2.69 6 6" stroke={C.blue} strokeWidth="1.5" strokeLinecap="round"/></svg>
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: C.text, marginBottom: 12 }}>Повседневная самостоятельность</h3>
            <p style={{ fontSize: 15, lineHeight: 1.65, color: C.muted, marginBottom: 24 }}>Вы отвечаете на вопросы о привычных делах родителя:</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {["Покупки", "Финансы", "Приготовление еды", "Приём лекарств", "Встречи и планы", "Передвижение"].map(t => (
                <div key={t} style={{ backgroundColor: C.altBg, borderRadius: 10, padding: "9px 12px", fontSize: 13, fontWeight: 500, color: C.text, border: `1px solid ${C.border}` }}>{t}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}