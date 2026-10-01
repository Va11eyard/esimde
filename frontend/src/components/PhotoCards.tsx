import { C } from "./Tokens";
import { Btn } from "./Btn";

export const PHOTO_CARDS = [
  {
    img: "https://images.unsplash.com/photo-1762955911431-4c44c7c3f408?w=600&h=800&fit=crop&auto=format",
    label: "Пройдите короткий скрининг",
    alt: "Взрослый ребёнок помогает пожилому родителю",
  },
  {
    img: "https://images.unsplash.com/photo-1758691461935-202e2ef6b69f?w=600&h=800&fit=crop&auto=format",
    label: "Запишитесь на консультацию",
    alt: "Врач консультирует пожилого пациента",
  },
  {
    img: "https://images.unsplash.com/photo-1739932905525-e2cb4ff57b73?w=600&h=800&fit=crop&auto=format",
    label: "Получите качественную помощь",
    alt: "Пожилая женщина улыбается с опекуном",
  },
];

export function PhotoCards() {
  return (
    <section style={{ backgroundColor: C.altBg, padding: "72px 32px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 40 }} className="photo-grid">
          {PHOTO_CARDS.map(c => (
            <div key={c.label} style={{ borderRadius: 24, overflow: "hidden", position: "relative", aspectRatio: "3/4", backgroundColor: "#CBD5E1" }}>
              <img src={c.img} alt={c.alt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)" }} />
              <div style={{ position: "absolute", bottom: 20, left: 20, right: 20 }}>
                <p style={{ color: "#fff", fontSize: 18, fontWeight: 700, lineHeight: 1.3, margin: 0 }}>{c.label}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Btn label="Проверить родителя" />
        </div>
      </div>
    </section>
  );
}