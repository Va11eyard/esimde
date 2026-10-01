import { useState } from "react";
import { C } from "./Tokens";

export function Footer() {
  const [email, setEmail] = useState("");
  return (
    <footer style={{ backgroundColor: C.footerBg, padding: "56px 32px 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Main row */}
        <div style={{ display: "grid", gridTemplateColumns: "200px 1fr auto auto", gap: 48, marginBottom: 40, alignItems: "start" }} className="footer-grid">
          {/* Brand */}
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: C.green, marginBottom: 8 }}>esimde</div>
            <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.5 }}>Платформа когнитивного здоровья</div>
          </div>

          {/* Email sub */}
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 16 }}>Подпишитесь на обновления</div>
            <div style={{ display: "flex", gap: 10 }}>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="Электронная почта"
                style={{ flex: 1, padding: "11px 16px", borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 14, outline: "none", backgroundColor: "#fff", color: C.text, fontFamily: "'Manrope', sans-serif" }}
              />
              <button style={{ backgroundColor: C.blue, color: "#fff", border: "none", padding: "11px 20px", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
                Подписаться
              </button>
            </div>
          </div>

          {/* Contacts */}
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 14 }}>Контакты</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 10 }}>Galamat Group</div>
            {[
              { icon: "✉", text: "galamat.com" },
              { icon: "✉", text: "esimde@galamat.com" },
              { icon: "📞", text: "+7 771 834 75 30" },
            ].map(c => (
              <div key={c.text} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                <span style={{ fontSize: 12 }}>{c.icon}</span>
                <span style={{ fontSize: 13, color: C.muted }}>{c.text}</span>
              </div>
            ))}
          </div>

          {/* Address */}
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 14 }}>Адрес</div>
            <div style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
              <span style={{ fontSize: 14, marginTop: 1 }}>📍</span>
              <span style={{ fontSize: 13, color: C.muted, lineHeight: 1.5 }}>Мәңгілік Ел 20/2,<br />4 этаж</span>
            </div>
          </div>
        </div>

        {/* Bottom nav */}
        <div style={{ borderTop: `1px solid rgba(0,0,0,0.08)`, padding: "20px 0", display: "flex", flexWrap: "wrap", gap: "8px 24px", marginBottom: 0 }}>
          {["О компании", "Услуги и цены", "Условия оплаты", "Возврат и отмена", "Политика конфиденциальности", "Пользовательское соглашение"].map(l => (
            <a key={l} href="#" style={{ fontSize: 13, color: C.muted, textDecoration: "none" }}
              onMouseEnter={e => (e.currentTarget.style.color = C.text)}
              onMouseLeave={e => (e.currentTarget.style.color = C.muted)}>{l}</a>
          ))}
        </div>

        {/* Copyright */}
        <div style={{ borderTop: `1px solid rgba(0,0,0,0.08)`, padding: "16px 0", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <span style={{ fontSize: 12, color: C.light }}>© 2026 ТОО «Galamat Integra». Все права защищены. · Онлайн-скрининг не является медицинской диагностикой.</span>
        </div>
      </div>
    </footer>
  );
}