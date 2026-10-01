import { C } from "./Tokens";
import { Btn } from "./Btn";

export function FinalCTA() {
  return (
    <section style={{ backgroundColor: C.bg, padding: "72px 32px 88px" }}>
      <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(26px, 3.5vw, 46px)", fontWeight: 800, color: C.text, lineHeight: 1.15, marginBottom: 18 }}>
          Не ждите, пока сомнения<br />станут тревогой.
        </h2>
        <p style={{ fontSize: 17, lineHeight: 1.75, color: C.muted, marginBottom: 36 }}>
          Проверьте память родителя онлайн — это займёт около 7 минут.
        </p>
        <Btn label="Проверить родителя" />
        <p style={{ marginTop: 18, fontSize: 13, color: C.light }}>Бесплатно · Онлайн · Конфиденциально</p>
      </div>
    </section>
  );
}