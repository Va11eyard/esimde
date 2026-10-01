import { C } from "./Tokens";
import { Btn } from "./Btn";

const headlines: Record<string, { lead: string; accent: string }> = {
  a: {
    lead: "Мама стала повторять одни и те же вопросы?",
    accent: "Проверьте её память онлайн за 7 минут.",
  },
  b: {
    lead: "Папа начал забывать недавние события?",
    accent: "Не ждите, пока станет хуже.",
  },
  c: {
    lead: "Альцгеймер начинается не тогда, когда человек уже ничего не помнит.",
    accent: "Проверьте память близкого человека.",
  },
  default: {
    lead: "Родители стали чаще забывать?",
    accent: "Проверьте их память за 7 минут.",
  },
}

export function Hero({ creative = "default" }: { creative?: string }) {
  const copy = headlines[creative] ?? headlines.default
  return (
    <section style={{ backgroundColor: C.bg, paddingTop: 80 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "64px 32px 72px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }} className="two-col">
        <div>
          <h1 style={{ fontSize: "clamp(36px, 4.5vw, 60px)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-1px", color: C.text, marginBottom: 24 }}>
            {copy.lead}{" "}
            <span style={{ color: C.blue }}>{copy.accent}</span>
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.75, color: C.muted, marginBottom: 36, maxWidth: 460 }}>
            Короткий онлайн-скрининг поможет понять, стоит ли обратить внимание
            на изменения памяти и повседневной самостоятельности родителя.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
            <Btn label="Проверить родителя" />
            <Btn label="Как это работает" outlined href="#how" />
          </div>
          <p style={{ fontSize: 13, color: C.light, lineHeight: 1.5 }}>
            Бесплатно · Онлайн · Конфиденциально. Результат скрининга не является медицинским диагнозом. При выявлении факторов риска рекомендуем консультацию специалиста.
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <PhoneMockup />
        </div>
      </div>
    </section>
  );
}

export function PhoneMockup() {
  return (
    <div style={{ position: "relative", width: 280 }}>
      <div style={{ width: 280, borderRadius: 40, backgroundColor: "#1C2B22", padding: "20px 12px 16px", boxShadow: "0 24px 56px rgba(0,0,0,0.18)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 90, height: 26, backgroundColor: "#1C2B22", borderRadius: "0 0 16px 16px", zIndex: 2 }} />
        <div style={{ backgroundColor: "#F6F8FA", borderRadius: 28, overflow: "hidden", padding: "22px 14px 14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: C.green }}>esimde</span>
          </div>
          <div style={{ backgroundColor: "rgba(42,174,227,0.08)", borderRadius: 12, padding: "10px 12px", marginBottom: 10 }}>
            <p style={{ fontSize: 11, color: C.text, margin: 0, lineHeight: 1.5 }}>Запомните три слова:</p>
            <p style={{ fontSize: 13, fontWeight: 700, color: C.blue, margin: "4px 0 0" }}>яблоко · стол · монета</p>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
            <div style={{ backgroundColor: C.blue, borderRadius: "12px 12px 3px 12px", padding: "8px 12px" }}>
              <p style={{ fontSize: 11, color: "#fff", margin: 0 }}>Запомнил все три ✓</p>
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontSize: 10, color: C.muted }}>Прогресс</span>
              <span style={{ fontSize: 10, fontWeight: 600, color: C.blue }}>3 / 5</span>
            </div>
            <div style={{ height: 5, backgroundColor: "rgba(42,174,227,0.12)", borderRadius: 999 }}>
              <div style={{ height: "100%", width: "60%", backgroundColor: C.blue, borderRadius: 999 }} />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {[{ l: "Память", v: "Норма", c: C.green }, { l: "Внимание", v: "Хорошо", c: C.blue }].map(x => (
              <div key={x.l} style={{ backgroundColor: "#fff", borderRadius: 10, padding: "7px 10px", border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 9, color: C.muted }}>{x.l}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: x.c }}>{x.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", top: -14, right: -22, backgroundColor: "#fff", borderRadius: 14, padding: "7px 14px", boxShadow: "0 4px 16px rgba(0,0,0,0.1)", fontSize: 12, fontWeight: 600, color: C.text, whiteSpace: "nowrap", border: `1px solid ${C.border}` }}>⏱ 7 минут</div>
      <div style={{ position: "absolute", bottom: 28, left: -22, backgroundColor: "#fff", borderRadius: 14, padding: "7px 14px", boxShadow: "0 4px 16px rgba(0,0,0,0.1)", fontSize: 12, fontWeight: 600, color: C.text, whiteSpace: "nowrap", border: `1px solid ${C.border}` }}>🔒 Конфиденциально</div>
    </div>
  );
}