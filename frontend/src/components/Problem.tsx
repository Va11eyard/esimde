import { C } from "./Tokens";
import { Btn } from "./Btn";

export function Problem() {
  const cards = [
    { n: "1", title: "Стал чаще переспрашивать", desc: "Повторяет одни и те же вопросы в течение дня" },
    { n: "2", title: "Забывает недавние события", desc: "Не помнит, что было вчера или час назад" },
    { n: "3", title: "Сложности с привычными делами", desc: "Затруднения с готовкой, финансами, лекарствами" },
    { n: "4", title: "Вы не уверены, стоит ли беспокоиться", desc: "Сомневаетесь — нормально это или нет" },
  ];
  const fills = [
    { bg: "#1B7FC4", tc: "#fff" },
    { bg: "#2AAEE3", tc: "#fff" },
    { bg: "#A8D8F0", tc: C.text },
    { bg: "#DCF0FB", tc: C.text },
  ];
  return (
    <section style={{ backgroundColor: C.altBg, padding: "72px 32px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 56, alignItems: "start" }} className="two-col-left">
          <h2 style={{ fontSize: "clamp(24px, 3vw, 40px)", fontWeight: 800, color: C.text, lineHeight: 1.15 }}>
            Изменения памяти не всегда заметны сразу
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="two-col">
            {cards.map((c, i) => (
              <div key={c.n} style={{ backgroundColor: fills[i].bg, color: fills[i].tc, borderRadius: 20, padding: "28px 24px", position: "relative", overflow: "hidden", minHeight: 170 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: "inherit", lineHeight: 1.3 }}>{c.title}</h3>
                <p style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.8, margin: 0, color: "inherit" }}>{c.desc}</p>
                <span style={{ position: "absolute", bottom: 8, right: 16, fontSize: 68, fontWeight: 800, opacity: 0.12, lineHeight: 1, color: i < 2 ? "#fff" : C.blue }}>{c.n}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 48 }}>
          <Btn label="Проверить родителя" />
        </div>
      </div>
    </section>
  );
}