import { useState } from "react";
import { C } from "./Tokens";

export const FAQS = [
  { q: "Это диагностика Альцгеймера?", a: "Нет. Esimde — это онлайн-скрининг, который помогает понять, стоит ли обратить внимание на изменения памяти. Скрининг не ставит диагнозов и не заменяет осмотр врача." },
  { q: "Кто проходит скрининг?", a: "Скрининг проходят двое: вы (взрослый ребёнок или близкий человек) и родитель. Часть заданий выполняет родитель, часть вопросов отвечаете вы — о его повседневной жизни." },
  { q: "Можно ли показать результат врачу?", a: "Да. Отчёт составлен так, чтобы его можно было взять на приём к неврологу или терапевту. Это поможет врачу быстрее сориентироваться." },
  { q: "Что я получу после прохождения?", a: "Персональный отчёт с оценкой памяти, анализом повседневной самостоятельности и рекомендациями о следующих шагах — понятным языком, без медицинского жаргона." },
  { q: "Что делать, если результат вызывает беспокойство?", a: "Отчёт подскажет конкретные шаги: к какому специалисту обратиться и на что обратить внимание. Мы также предлагаем консультацию специалиста." },
  { q: "Сколько стоит скрининг?", a: "Базовый скрининг бесплатен. Расширенный отчёт с персональными рекомендациями доступен по подписке." },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="faq" style={{ backgroundColor: C.altBg, padding: "72px 32px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h2 style={{ fontSize: "clamp(22px, 2.8vw, 36px)", fontWeight: 800, color: C.text, textAlign: "center", marginBottom: 48 }}>Частые вопросы</h2>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column", gap: 8 }}>
          {FAQS.map((f, i) => (
            <div key={i} style={{ backgroundColor: C.bg, borderRadius: 16, borderWidth: "1px", borderStyle: "solid", borderColor: open === i ? C.blue : C.border, overflow: "hidden", transition: "border-color 0.2s" }}>
              <button onClick={() => setOpen(open === i ? null : i)}
                style={{ width: "100%", textAlign: "left", padding: "18px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, background: "none", border: "none", cursor: "pointer" }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: C.text }}>{f.q}</span>
                <div style={{ width: 28, height: 28, borderRadius: "50%", backgroundColor: open === i ? C.blue : C.altBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s", transform: open === i ? "rotate(45deg)" : "none" }}>
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M5.5 1.5v8M1.5 5.5h8" stroke={open === i ? "#fff" : C.blue} strokeWidth="1.8" strokeLinecap="round" /></svg>
                </div>
              </button>
              {open === i && <div style={{ padding: "0 22px 18px" }}><p style={{ fontSize: 14, lineHeight: 1.75, color: C.muted, margin: 0 }}>{f.a}</p></div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}