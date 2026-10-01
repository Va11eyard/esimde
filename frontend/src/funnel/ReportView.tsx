import { useEffect, useState, type CSSProperties } from "react"
import { C } from "../components/Tokens"
import { getScreening, track, type Screening } from "./api"
import { resumeFaq } from "./ScreeningPage"
import { FunnelChrome, button, ghost, title } from "./chrome"

export function ReportView({ hash, creative }: { hash: string; creative: string }) {
  const [report, setReport] = useState<Screening | null>(null)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let alive = true
    getScreening(hash)
      .then((data) => {
        if (!alive) return
        setReport(data)
        track("report_viewed", data.creative || creative, hash)
      })
      .catch((err: Error) => {
        if (alive) setError(err.message)
      })
    return () => {
      alive = false
    }
  }, [hash, creative])

  if (error) return <FunnelChrome><p>{error}</p></FunnelChrome>
  if (!report) return <FunnelChrome><p style={{ textAlign: "center", color: C.muted }}>Собираем отчёт…</p></FunnelChrome>

  return (
    <FunnelChrome step="Отчёт">
      <p style={{ color: C.muted, marginTop: 0, textAlign: "center", fontSize: 14, fontWeight: 600 }}>Пациент: {report.patient_name}, {report.patient_age} лет</p>
      <h1 style={title}>Результат скрининга</h1>
      {report.minicog && (
        <section style={card}>
          <h2 style={h2}>Mini-Cog</h2>
          <p>Вспомнено слов: {report.minicog.words_recalled} из 3</p>
          <p>Часы: {report.minicog.clock_points} из 2 баллов</p>
          <p>{report.minicog.summary}</p>
        </section>
      )}
      {report.faq ? (
        <section style={card}>
          <h2 style={h2}>Повседневные дела</h2>
          <p>Сумма FAQ: {report.faq.score} из 30</p>
          <p>{report.faq.summary}</p>
        </section>
      ) : (
        <section style={card}>
          <p>Опрос о повседневных делах ещё не заполнен. Его проходит близкий человек, не родитель.</p>
          <button type="button" style={{ ...button, marginTop: 8 }} onClick={() => resumeFaq(report.hash)}>Заполнить опрос</button>
        </section>
      )}
      <p style={disclaimer}>{report.disclaimer}</p>
      <div style={{ display: "grid", gap: 10 }}>
        <a href={report.pdf_url} style={{ ...button, textAlign: "center", textDecoration: "none" }}>Скачать PDF</a>
        <button type="button" style={ghost} onClick={() => copy(report.share_url, setCopied)}>
          {copied ? "Ссылка скопирована" : "Скопировать ссылку для врача"}
        </button>
        <a
          href={report.whatsapp_url}
          style={{ ...ghost, textAlign: "center", textDecoration: "none" }}
          target="_blank"
          rel="noreferrer"
          onClick={() => track("whatsapp_click", report.creative, report.hash)}
        >
          Записаться в WhatsApp
        </a>
      </div>
      <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.5 }}>
        В сообщении будет ссылка на отчёт, без баллов. Отправьте её только врачу. Если номер клиники ещё не задан, WhatsApp попросит выбрать чат.
      </p>
    </FunnelChrome>
  )
}

async function copy(value: string, setCopied: (value: boolean) => void) {
  await navigator.clipboard.writeText(value)
  setCopied(true)
}

const h2: CSSProperties = { fontSize: 18, margin: "0 0 8px" }
const card: CSSProperties = { background: "#F4F9FC", border: `1px solid ${C.border}`, borderRadius: 20, padding: 20, margin: "16px 0" }
const disclaimer: CSSProperties = { fontSize: 13, lineHeight: 1.5, color: C.muted }
