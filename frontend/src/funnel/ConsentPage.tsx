import { C } from "../components/Tokens"
import { FunnelChrome, button, lead, title } from "./chrome"

export function ConsentPage() {
  return (
    <FunnelChrome>
      <h1 style={title}>Согласие на обработку данных</h1>
      <p style={{ ...lead, textAlign: "left" }}>Для бесплатного скрининга мы сохраняем имя родителя, возраст, ваше имя, телефон, email, если вы его указали, и результаты Mini-Cog и опроса о повседневных делах.</p>
      <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.55 }}>Данные нужны, чтобы собрать отчёт и дать ссылку. Ссылку вы отправляете врачу сами. В тексте WhatsApp нет баллов.</p>
      <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.55 }}>Результат скрининга не является медицинским диагнозом. При выявлении факторов риска рекомендуем консультацию специалиста.</p>
      <a href="#screen" style={{ ...button, display: "block", textAlign: "center", textDecoration: "none", marginTop: 8 }}>Вернуться к анкете</a>
    </FunnelChrome>
  )
}
