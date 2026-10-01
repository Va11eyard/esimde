export type MiniCogResult = {
  words_recalled: number
  clock_points: number
  concern: boolean
  summary: string
}

export type Screening = {
  hash: string
  creative: string
  patient_name: string
  patient_age: number
  buyer_name: string
  status: string
  minicog?: MiniCogResult
  faq?: { score: number; summary: string }
  disclaimer: string
  share_url: string
  pdf_url: string
  whatsapp_url: string
}

export type ClockNumber = { n: number; x: number; y: number }

export function creativeFromLocation() {
  const value = new URLSearchParams(window.location.search).get("c")
  if (value === "a" || value === "b" || value === "c") return value
  return "default"
}

export async function track(event: string, creative: string, screeningHash = "") {
  try {
    await fetch("/api/v1/funnel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, creative, screening_hash: screeningHash }),
    })
  } catch {
    // Funnel counts should not block the screening.
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch("/api/v1" + path, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  })
  if (!response.ok) {
    let detail = "Не удалось сохранить данные"
    try {
      const body = await response.json()
      if (body.detail) detail = body.detail
    } catch {
      // keep the fallback
    }
    throw new Error(detail)
  }
  return response.json()
}

export function createScreening(body: {
  creative: string
  buyer_name: string
  buyer_phone: string
  buyer_email: string
  patient_name: string
  patient_age: number
  consent: boolean
}) {
  return request<Screening>("/screenings", { method: "POST", body: JSON.stringify(body) })
}

export function saveMiniCog(hash: string, body: {
  recalled: string[]
  numbers: ClockNumber[]
  hour_angle: number
  minute_angle: number
}) {
  return request<Screening>(`/screenings/${hash}/minicog`, { method: "POST", body: JSON.stringify(body) })
}

export function saveFaq(hash: string, answers: number[]) {
  return request<Screening>(`/screenings/${hash}/faq`, {
    method: "POST",
    body: JSON.stringify({ answers }),
  })
}

export function getScreening(hash: string) {
  return request<Screening>(`/screenings/${hash}`)
}
