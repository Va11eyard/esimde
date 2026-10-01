import { useState, type PointerEvent } from "react"
import type { ClockNumber } from "./api"
import { C } from "../components/Tokens"
import { button, ghost } from "./chrome"

type Hand = "hour" | "minute"

export function ClockTask({ onDone }: { onDone: (numbers: ClockNumber[], hour: number, minute: number) => void }) {
  const [numbers, setNumbers] = useState<ClockNumber[]>([])
  const [hint, setHint] = useState("")
  const [hour, setHour] = useState(0)
  const [minute, setMinute] = useState(0)
  const [hand, setHand] = useState<Hand>("hour")
  const next = numbers.length + 1

  const place = (event: PointerEvent<SVGSVGElement>) => {
    const point = toNorm(event.currentTarget, event.clientX, event.clientY)
    if (next <= 12) {
      const dx = point.x - 0.5
      const dy = point.y - 0.5
      const radius = Math.hypot(dx, dy)
      if (radius < 0.22 || radius > 0.48) {
        setHint("Нажмите ближе к ободу круга, не в центр и не снаружи.")
        return
      }
      setHint("")
      setNumbers([...numbers, { n: next, x: point.x, y: point.y }])
      return
    }
    const angle = angleOf(point.x, point.y)
    if (hand === "hour") setHour(angle)
    else setMinute(angle)
  }

  return (
    <div>
      <p style={{ fontSize: 16, lineHeight: 1.5, color: C.text, marginTop: 0 }}>
        {next <= 12
          ? `Попросите родителя расставить цифры. Сейчас место для цифры ${next}.`
          : "Поставьте стрелки на 11:10. Сначала часовую, потом минутную."}
      </p>
      <svg
        viewBox="0 0 300 300"
        style={{ width: "100%", maxWidth: 360, touchAction: "none", background: "#fff", borderRadius: 24 }}
        onPointerDown={place}
      >
        <circle cx="150" cy="150" r="120" fill="#F4F9FC" stroke={C.border} strokeWidth="3" />
        <circle cx="150" cy="150" r="4" fill={C.text} />
        {numbers.map((number) => (
          <text key={number.n} x={number.x * 300} y={number.y * 300} textAnchor="middle" dominantBaseline="middle" fontSize="18" fontWeight="700" fill={C.text}>
            {number.n}
          </text>
        ))}
        {next > 12 && (
          <>
            <line x1="150" y1="150" x2={handTip(hour, 78).x} y2={handTip(hour, 78).y} stroke={C.blue} strokeWidth="6" strokeLinecap="round" />
            <line x1="150" y1="150" x2={handTip(minute, 104).x} y2={handTip(minute, 104).y} stroke={C.text} strokeWidth="4" strokeLinecap="round" />
          </>
        )}
      </svg>
      {hint && <p style={{ color: "#B45309", fontSize: 14 }}>{hint}</p>}
      {next <= 12 ? (
        <button type="button" onClick={() => setNumbers(numbers.slice(0, -1))} disabled={numbers.length === 0} style={{ ...ghost, marginTop: 12 }}>
          Убрать последнюю цифру
        </button>
      ) : (
        <>
          <p style={{ fontSize: 14, color: C.muted, textAlign: "center" }}>
            Сейчас стрелки показывают примерно {clockLabel(hour, minute)}. Нужно 11:10.
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" onClick={() => setHand("hour")} style={{ ...(hand === "hour" ? button : ghost), width: "auto", flex: 1 }}>Часовая</button>
            <button type="button" onClick={() => setHand("minute")} style={{ ...(hand === "minute" ? button : ghost), width: "auto", flex: 1 }}>Минутная</button>
          </div>
          <button type="button" onClick={() => onDone(numbers, hour, minute)} style={{ ...button, marginTop: 16 }}>
            Часы готовы
          </button>
        </>
      )}
    </div>
  )
}

function toNorm(svg: SVGSVGElement, clientX: number, clientY: number) {
  const point = svg.createSVGPoint()
  point.x = clientX
  point.y = clientY
  const matrix = svg.getScreenCTM()
  if (!matrix) return { x: 0.5, y: 0.5 }
  const local = point.matrixTransform(matrix.inverse())
  return { x: local.x / 300, y: local.y / 300 }
}

function angleOf(x: number, y: number) {
  const deg = Math.atan2(x - 0.5, -(y - 0.5)) * 180 / Math.PI
  return deg < 0 ? deg + 360 : deg
}

function handTip(angle: number, length: number) {
  const rad = angle * Math.PI / 180
  return { x: 150 + length * Math.sin(rad), y: 150 - length * Math.cos(rad) }
}

function clockLabel(hourAngle: number, minuteAngle: number) {
  const minutes = Math.round(minuteAngle / 6) % 60
  let hour = Math.round(hourAngle / 30) % 12
  if (hour === 0) hour = 12
  return `${hour}:${String(minutes).padStart(2, "0")}`
}
