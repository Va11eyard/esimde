import { useEffect, useState, type FormEvent } from "react"
import { C } from "../components/Tokens"
import { ClockTask } from "./ClockTask"
import { FunnelChrome, button, choice, ghost, input, lead, title, wordCard } from "./chrome"
import { createScreening, saveFaq, saveMiniCog, track, type ClockNumber } from "./api"
import { FAQ, FAQ_OPTIONS, WORDS, normalize, sameWords } from "./questions"

type Step = "contact" | "words" | "clock" | "recall" | "branch" | "faq"

const RESUME_KEY = "esimde-resume"

export function ScreeningPage({ creative }: { creative: string }) {
  const [step, setStep] = useState<Step>("contact")
  const [hash, setHash] = useState("")
  const [concern, setConcern] = useState(false)
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [heard, setHeard] = useState(["", "", ""])
  const [recall, setRecall] = useState(["", "", ""])
  const [clock, setClock] = useState<{ numbers: ClockNumber[]; hour: number; minute: number } | null>(null)
  const [faqIndex, setFaqIndex] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])

  useEffect(() => {
    const resume = sessionStorage.getItem(RESUME_KEY)
    if (resume) {
      sessionStorage.removeItem(RESUME_KEY)
      setHash(resume)
      setStep("faq")
      return
    }
    track("cta_click", creative)
  }, [creative])

  useEffect(() => {
    if (step === "words") track("test_started", creative, hash)
  }, [step, creative, hash])

  const submitContact = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setBusy(true)
    setError("")
    try {
      const created = await createScreening({
        creative,
        patient_name: String(form.get("patient_name") ?? ""),
        patient_age: Number(form.get("patient_age") ?? 0),
        buyer_name: String(form.get("buyer_name") ?? ""),
        buyer_phone: String(form.get("buyer_phone") ?? ""),
        buyer_email: String(form.get("buyer_email") ?? ""),
        consent: form.get("consent") === "on",
      })
      setHash(created.hash)
      setStep("words")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось сохранить анкету")
    } finally {
      setBusy(false)
    }
  }

  const checkHeard = () => {
    if (sameWords(heard)) {
      setError("")
      setStep("clock")
      return
    }
    const next = attempts + 1
    setAttempts(next)
    setError(next >= 3 ? "Слова можно повторить только три раза. Покажите их ещё раз и переходите к часам." : "Попросите повторить слова ещё раз.")
  }

  const finishRecall = async () => {
    if (!clock || !hash) return
    setBusy(true)
    setError("")
    try {
      const saved = await saveMiniCog(hash, {
        recalled: recall.map(normalize).filter(Boolean),
        numbers: clock.numbers,
        hour_angle: clock.hour,
        minute_angle: clock.minute,
      })
      setConcern(Boolean(saved.minicog?.concern))
      setStep(saved.minicog?.concern ? "faq" : "branch")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось сохранить тест")
    } finally {
      setBusy(false)
    }
  }

  const finishFaq = async (value: number) => {
    const next = [...answers, value]
    setAnswers(next)
    if (next.length < FAQ.length) {
      setFaqIndex(next.length)
      return
    }
    setBusy(true)
    setError("")
    try {
      await saveFaq(hash, next)
      window.location.hash = `report/${hash}`
    } catch (err) {
      setAnswers(answers)
      setError(err instanceof Error ? err.message : "Не удалось сохранить опрос")
    } finally {
      setBusy(false)
    }
  }

  return (
    <FunnelChrome step={stepLabel(step)}>
        {step === "contact" && (
          <form onSubmit={submitContact}>
            <h1 style={title}>Кому проверяем память</h1>
            <p style={lead}>Данные нужны, чтобы сохранить отчёт и связаться с вами. Тест дальше проходит родитель.</p>
            <Field label="Имя родителя" name="patient_name" />
            <Field label="Возраст родителя" name="patient_age" type="number" />
            <Field label="Ваше имя" name="buyer_name" />
            <Field label="Ваш телефон" name="buyer_phone" type="tel" />
            <Field label="Email, если удобно" name="buyer_email" type="email" optional />
            <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14, lineHeight: 1.45, margin: "8px 0 16px" }}>
              <input name="consent" type="checkbox" required style={{ marginTop: 3 }} />
              <span>Соглашаюсь на обработку имени, телефона и результатов скрининга, чтобы сохранить отчёт. <a href="#privacy" style={{ color: C.blue, fontWeight: 700, textDecoration: "none" }}>Подробнее</a></span>
            </label>
            {error && <ErrorText text={error} />}
            <button style={button} disabled={busy}>{busy ? "Сохраняем…" : "Дальше к тесту"}</button>
          </form>
        )}

        {step === "words" && (
          <section>
            <h1 style={title}>Запомните три слова</h1>
            <p style={lead}>Назовите их родителю и попросите сразу повторить вслух. Можно повторить до трёх раз.</p>
            <div style={{ display: "grid", gap: 8, marginBottom: 16 }}>
              {WORDS.map((word) => <div key={word} style={wordCard}>{word}</div>)}
            </div>
            <p style={lead}>Что получилось повторить?</p>
            {heard.map((value, index) => (
              <input key={index} value={value} onChange={(event) => setHeard(heard.map((item, i) => i === index ? event.target.value : item))} style={input} placeholder={`Слово ${index + 1}`} />
            ))}
            {error && <ErrorText text={error} />}
            {attempts >= 3 ? (
              <button style={button} onClick={() => setStep("clock")}>Перейти к часам</button>
            ) : (
              <button style={button} onClick={checkHeard}>Проверить повтор</button>
            )}
          </section>
        )}

        {step === "clock" && (
          <section>
            <h1 style={title}>Циферблат</h1>
            <p style={lead}>Круг уже нарисован. Родитель расставляет 12 цифр, затем стрелки на 11 часов 10 минут.</p>
            <ClockTask onDone={(numbers, hour, minute) => { setClock({ numbers, hour, minute }); setStep("recall") }} />
          </section>
        )}

        {step === "recall" && (
          <section>
            <h1 style={title}>Какие были три слова?</h1>
            <p style={lead}>Без подсказок. Если слово не вспоминается, оставьте поле пустым.</p>
            {recall.map((value, index) => (
              <input key={index} value={value} onChange={(event) => setRecall(recall.map((item, i) => i === index ? event.target.value : item))} style={input} placeholder={`Слово ${index + 1}`} />
            ))}
            {error && <ErrorText text={error} />}
            <button style={button} disabled={busy} onClick={finishRecall}>{busy ? "Считаем…" : "Узнать результат"}</button>
          </section>
        )}

        {step === "branch" && (
          <section>
            <h1 style={title}>По этому тесту явных признаков не видно</h1>
            <p style={lead}>Продолжайте следить за памятью и повседневными делами. Можно всё равно заполнить короткий опрос о быте: его отвечаете вы, не родитель.</p>
            <Disclaimer />
            <button style={button} onClick={() => setStep("faq")}>Всё равно продолжить</button>
            <button style={{ ...button, background: "#fff", color: C.text, border: `1px solid ${C.border}`, marginTop: 10 }} onClick={() => { window.location.hash = `report/${hash}` }}>
              Открыть отчёт
            </button>
          </section>
        )}

        {step === "faq" && (
          <section>
            <p style={{ color: C.muted, marginTop: 0 }}>Вопрос {faqIndex + 1} из {FAQ.length}</p>
            {concern && faqIndex === 0 && <p style={lead}>По короткому тесту есть повод обсудить память со специалистом. Этот опрос заполняете вы, не родитель.</p>}
            <h1 style={title}>Как родитель справлялся с этим в последний месяц?</h1>
            <p style={lead}>{FAQ[faqIndex]}</p>
            <div style={{ display: "grid", gap: 8 }}>
              {FAQ_OPTIONS.map((option) => (
                <button key={option.value} style={choice} disabled={busy} onClick={() => finishFaq(option.value)}>
                  {option.label}
                </button>
              ))}
            </div>
            {faqIndex > 0 && (
              <button style={{ ...ghost, marginTop: 12 }} onClick={() => { setAnswers(answers.slice(0, -1)); setFaqIndex(faqIndex - 1) }}>
                Назад
              </button>
            )}
            {error && <ErrorText text={error} />}
            <Disclaimer />
          </section>
        )}
    </FunnelChrome>
  )
}

export function resumeFaq(hash: string) {
  sessionStorage.setItem(RESUME_KEY, hash)
  window.location.hash = "screen"
}

function Field({ label, name, type = "text", optional = false }: { label: string; name: string; type?: string; optional?: boolean }) {
  return (
    <label style={{ display: "block", marginBottom: 16, fontSize: 13, fontWeight: 600, color: C.text }}>
      {label}
      <input name={name} type={type} required={!optional} style={input} />
    </label>
  )
}

function Disclaimer() {
  return <p style={{ fontSize: 14, lineHeight: 1.5, color: C.muted }}>Результат скрининга не является медицинским диагнозом. При выявлении факторов риска рекомендуем консультацию специалиста.</p>
}

function ErrorText({ text }: { text: string }) {
  return <p style={{ color: "#B91C1C", fontSize: 14 }}>{text}</p>
}

function stepLabel(step: Step) {
  if (step === "contact") return "Данные"
  if (step === "faq") return "Опрос"
  if (step === "branch") return "Результат"
  return "Тест памяти"
}
