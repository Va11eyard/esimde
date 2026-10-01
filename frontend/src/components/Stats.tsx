import { C } from "./Tokens";

export function Stats() {
  const items = [
    { stat: "7 минут", desc: "Короткий онлайн-скрининг без лишних вопросов" },
    { stat: "2 блока", desc: "Тест памяти и опрос о повседневной жизни" },
    { stat: "100%", desc: "Персональный отчёт для вас и вашего врача" },
  ];
  return (
    <section style={{ backgroundColor: C.bg, padding: "72px 32px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h2 style={{ fontSize: "clamp(22px, 2.8vw, 36px)", fontWeight: 800, color: C.text, textAlign: "center", marginBottom: 48 }}>
          Забота о близких — это конкретный шаг
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }} className="three-col">
          {items.map(it => (
            <div key={it.stat} style={{ backgroundColor: C.altBg, borderRadius: 20, padding: "32px 28px", border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: "clamp(32px, 3.5vw, 48px)", fontWeight: 800, color: C.text, marginBottom: 12, letterSpacing: "-1px" }}>{it.stat}</div>
              <p style={{ fontSize: 15, lineHeight: 1.65, color: C.muted, margin: 0 }}>{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}