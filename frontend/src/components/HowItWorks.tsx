import { C } from "./Tokens";

export function HowItWorks() {
  const steps = [
    { n: "1", title: "Данные родителя", desc: "Имя, возраст, образование" },
    { n: "2", title: "Тест памяти", desc: "Родитель выполняет задания Mini-Cog" },
    { n: "3", title: "Опрос о повседневной жизни", desc: "Вы отвечаете о привычках и самостоятельности" },
    { n: "4", title: "Персональный отчёт", desc: "Понятный результат с объяснениями" },
    { n: "5", title: "Консультация", desc: "При необходимости — следующий шаг с профессионалом" },
  ];
  const bgs = ["#1B7FC4", "#2AAEE3", "#7CCAED", "#BDE4F6", C.bg];
  const tcs = ["#fff", "#fff", C.text, C.text, C.text];
  return (
    <section id="how" style={{ backgroundColor: C.bg, padding: "72px 32px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 56, alignItems: "start" }} className="two-col-left">
          <h2 style={{ fontSize: "clamp(24px, 3vw, 40px)", fontWeight: 800, color: C.text, lineHeight: 1.15 }}>
            Как это работает
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="two-col">
            {steps.map((s, i) => (
              <div key={s.n} style={{ backgroundColor: bgs[i], borderRadius: 20, padding: "28px 24px", position: "relative", overflow: "hidden", minHeight: 160, border: i === 4 ? `1.5px solid ${C.border}` : "none", gridColumn: i === 4 ? "1 / -1" : undefined }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: tcs[i] }}>{s.title}</h3>
                <p style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.75, color: tcs[i], margin: 0 }}>{s.desc}</p>
                <span style={{ position: "absolute", bottom: 8, right: 16, fontSize: 68, fontWeight: 800, opacity: 0.12, lineHeight: 1, color: i < 2 ? "#fff" : C.blue }}>{s.n}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}