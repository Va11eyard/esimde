import { C } from "./Tokens";
import { Btn } from "./Btn";

export function ResultPreview() {
  return (
    <section id="result" style={{ backgroundColor: C.bg, padding: "72px 32px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h2 style={{ fontSize: "clamp(22px, 2.8vw, 36px)", fontWeight: 800, color: C.text, marginBottom: 12, textAlign: "center" }}>Как выглядит результат</h2>
        <p style={{ fontSize: 16, color: C.muted, textAlign: "center", marginBottom: 48 }}>Понятный отчёт — можно взять на приём к врачу</p>
        <div style={{ maxWidth: 660, margin: "0 auto", backgroundColor: C.bg, borderRadius: 24, overflow: "hidden", boxShadow: "0 8px 40px rgba(0,0,0,0.09)", border: `1px solid ${C.border}` }}>
          <div style={{ backgroundColor: C.blue, padding: "20px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", marginBottom: 2 }}>Отчёт · Esimde</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>Предварительный результат</div>
            </div>
            <div style={{ backgroundColor: "rgba(255,255,255,0.18)", borderRadius: 999, padding: "5px 14px", fontSize: 12, color: "#fff", fontWeight: 500 }}>Не диагноз</div>
          </div>
          <div style={{ padding: 28, display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { label: "Память", tag: "Норма", tagBg: "rgba(40,168,101,0.1)", tagColor: "#28A865", barW: "75%", barColor: "#28A865", desc: "Три слова вспомнены верно. Часы нарисованы без ошибок." },
              { label: "Повседневная самостоятельность", tag: "Внимание", tagBg: "rgba(234,179,8,0.12)", tagColor: "#B45309", barW: "45%", barColor: "#F59E0B", desc: "Выявлены изменения в ведении финансов и приёме лекарств." },
            ].map(r => (
              <div key={r.label} style={{ borderRadius: 14, padding: 18, border: `1px solid ${C.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{r.label}</span>
                  <span style={{ backgroundColor: r.tagBg, color: r.tagColor, borderRadius: 999, padding: "4px 12px", fontSize: 12, fontWeight: 600 }}>{r.tag}</span>
                </div>
                <div style={{ height: 7, backgroundColor: C.altBg, borderRadius: 999, marginBottom: 10 }}>
                  <div style={{ height: "100%", width: r.barW, backgroundColor: r.barColor, borderRadius: 999 }} />
                </div>
                <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>{r.desc}</p>
              </div>
            ))}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { label: "На что обратить внимание", val: "Управление финансами, самостоятельность в быту" },
                { label: "Что делать дальше", val: "Рекомендуем консультацию невролога" },
              ].map(c => (
                <div key={c.label} style={{ backgroundColor: C.altBg, borderRadius: 12, padding: "14px 16px", border: `1px solid ${C.border}` }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.text, marginBottom: 5 }}>{c.label}</div>
                  <p style={{ fontSize: 12, color: C.muted, margin: 0, lineHeight: 1.5 }}>{c.val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}><Btn label="Проверить родителя" /></div>
      </div>
    </section>
  );
}