export const WORDS = ["Банан", "Восход", "Стул"]

export const FAQ = [
  "Оплата счетов, выписывание чеков, ведение бюджета",
  "Работа с документами, налоговыми и финансовыми бумагами",
  "Самостоятельные покупки: одежда, продукты, товары для дома",
  "Игры на логику или навык, хобби",
  "Разогреть воду, сделать чай или кофе, выключить плиту",
  "Приготовить полноценный обед",
  "Следить за текущими новостями и событиями",
  "Понять передачу, книгу или статью и обсудить её",
  "Помнить о встречах, семейных событиях, праздниках и приёме лекарств",
  "Самостоятельно передвигаться по городу за пределами своего района",
]

export const FAQ_OPTIONS = [
  { value: 0, label: "Справляется самостоятельно" },
  { value: 1, label: "Справляется, но с затруднением" },
  { value: 2, label: "Нужна помощь" },
  { value: 3, label: "Не может выполнять сам" },
  { value: -1, label: "Никогда не делал(а) этого" },
]

export function sameWords(typed: string[]) {
  const wanted = new Set(WORDS.map(normalize))
  const got = typed.map(normalize).filter(Boolean)
  if (new Set(got).size !== got.length) return false
  return got.length === wanted.size && got.every((word) => wanted.has(word))
}

export function normalize(word: string) {
  return word.trim().toLowerCase().replaceAll("ё", "е")
}
