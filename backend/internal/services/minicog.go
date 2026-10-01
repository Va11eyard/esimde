package services

import (
	"math"
	"strings"
)

var MiniCogWords = []string{"банан", "восход", "стул"}

const Disclaimer = "Результат скрининга не является медицинским диагнозом. При выявлении факторов риска рекомендуем консультацию специалиста."

type ClockNumber struct {
	N int     `json:"n"`
	X float64 `json:"x"`
	Y float64 `json:"y"`
}

type MiniCogInput struct {
	Recalled    []string
	Numbers     []ClockNumber
	HourAngle   float64
	MinuteAngle float64
}

type MiniCogScore struct {
	WordsRecalled int    `json:"words_recalled"`
	ClockPoints   int    `json:"clock_points"`
	NumbersOK     bool   `json:"numbers_ok"`
	HandsOK       bool   `json:"hands_ok"`
	Concern       bool   `json:"concern"`
	Summary       string `json:"summary"`
}

func ScoreMiniCog(in MiniCogInput) MiniCogScore {
	found := map[string]bool{}
	for _, word := range in.Recalled {
		normalized := normalizeWord(word)
		for _, canon := range MiniCogWords {
			if normalized == canon {
				found[canon] = true
			}
		}
	}
	words := len(found)
	numbersOK := clockNumbersOK(in.Numbers)
	handsOK := clockHandsOK(in.HourAngle, in.MinuteAngle)
	clock := 0
	if numbersOK && handsOK {
		clock = 2
	}

	concern := false
	switch {
	case words == 3:
		concern = false
	case words == 0:
		concern = true
	default:
		concern = clock == 0
	}

	summary := "По правилам Mini-Cog результат отрицательный: по этому короткому тесту явных признаков не видно. Это не диагноз. За памятью всё равно стоит следить."
	if concern {
		summary = "По правилам Mini-Cog результат положительный: есть повод обсудить память со специалистом. Это не диагноз."
	}

	return MiniCogScore{
		WordsRecalled: words,
		ClockPoints:   clock,
		NumbersOK:     numbersOK,
		HandsOK:       handsOK,
		Concern:       concern,
		Summary:       summary,
	}
}

func ScoreFAQ(answers []int) (int, string, error) {
	if len(answers) != len(FAQQuestions) {
		return 0, "", errFAQ
	}
	sum := 0
	for _, answer := range answers {
		if answer < -1 || answer > 3 {
			return 0, "", errFAQ
		}
		if answer > 0 {
			sum += answer
		}
	}
	return sum, faqSummary(sum), nil
}

func FAQSummary(sum int) string {
	return faqSummary(sum)
}

func faqSummary(sum int) string {
	switch {
	case sum <= 1:
		return "По ответам близкого повседневные дела почти не вызывают затруднений. Это ориентир, не диагноз."
	case sum < 10:
		return "Есть отдельные затруднения в повседневных делах. Это ориентир для разговора со специалистом, не диагноз."
	default:
		return "Затруднения в повседневных делах заметные. Это повод обсудить их на приёме. Не диагноз."
	}
}

var FAQQuestions = []string{
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
}

type faqError string

func (e faqError) Error() string { return string(e) }

const errFAQ = faqError("faq answers must be 10 values from -1 to 3")

func normalizeWord(word string) string {
	word = strings.ToLower(strings.TrimSpace(word))
	return strings.ReplaceAll(word, "ё", "е")
}

func clockNumbersOK(numbers []ClockNumber) bool {
	if len(numbers) != 12 {
		return false
	}
	seen := map[int]bool{}
	for _, number := range numbers {
		if number.N < 1 || number.N > 12 || seen[number.N] {
			return false
		}
		seen[number.N] = true
		dx := number.X - 0.5
		dy := number.Y - 0.5
		radius := math.Hypot(dx, dy)
		if radius < 0.22 || radius > 0.48 {
			return false
		}
		got := angleFromCenter(dx, dy)
		want := float64(number.N%12) * 30
		if angleDelta(got, want) > 20 {
			return false
		}
	}
	return len(seen) == 12
}

func clockHandsOK(hour, minute float64) bool {
	return angleDelta(hour, 335) <= 25 && angleDelta(minute, 60) <= 25
}

func angleFromCenter(dx, dy float64) float64 {
	deg := math.Atan2(dx, -dy) * 180 / math.Pi
	if deg < 0 {
		deg += 360
	}
	return deg
}

func angleDelta(a, b float64) float64 {
	d := math.Mod(a-b, 360)
	if d < 0 {
		d += 360
	}
	if d > 180 {
		d = 360 - d
	}
	return d
}
