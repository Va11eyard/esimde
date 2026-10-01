package services

import (
	"math"
	"testing"

	"esimde-backend/internal/models"
)

func placeNumber(n int) ClockNumber {
	angle := float64(n%12) * 30 * math.Pi / 180
	const radius = 0.38
	return ClockNumber{
		N: n,
		X: 0.5 + radius*math.Sin(angle),
		Y: 0.5 - radius*math.Cos(angle),
	}
}

func perfectClock() []ClockNumber {
	numbers := make([]ClockNumber, 0, 12)
	for n := 1; n <= 12; n++ {
		numbers = append(numbers, placeNumber(n))
	}
	return numbers
}

func TestMiniCogBranches(t *testing.T) {
	goodClock := MiniCogInput{Numbers: perfectClock(), HourAngle: 335, MinuteAngle: 60}
	badClock := MiniCogInput{Numbers: perfectClock(), HourAngle: 0, MinuteAngle: 0}

	cases := []struct {
		name     string
		words    []string
		clock    MiniCogInput
		concern  bool
		points   int
		recalled int
	}{
		{"three words ignore bad clock", []string{"Банан", "Восход", "Стул"}, badClock, false, 0, 3},
		{"zero words ignore good clock", []string{"яблоко"}, goodClock, true, 2, 0},
		{"two words and good clock", []string{"банан", "стул", "банан"}, goodClock, false, 2, 2},
		{"one word and bad clock", []string{"восход"}, badClock, true, 0, 1},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			in := tc.clock
			in.Recalled = tc.words
			got := ScoreMiniCog(in)
			if got.Concern != tc.concern || got.ClockPoints != tc.points || got.WordsRecalled != tc.recalled {
				t.Fatalf("got %+v", got)
			}
		})
	}
}

func TestScreeningPDF(t *testing.T) {
	age := 74
	score := 6
	screening := &models.Screening{
		PatientName:   "Асия",
		PatientAge:    age,
		BuyerName:     "Ерлан",
		MiniCogDone:   true,
		WordsRecalled: 1,
		ClockPoints:   0,
		Concern:       true,
		FaqScore:      &score,
	}
	bytes, err := GenerateScreeningPDF(screening, "http://127.0.0.1:5174/#report/test")
	if err != nil {
		t.Fatal(err)
	}
	if len(bytes) < 1000 {
		t.Fatalf("pdf too small: %d", len(bytes))
	}
}

func TestFAQScoreSkipsNever(t *testing.T) {
	answers := []int{0, 1, -1, 3, 0, 0, 0, 0, 0, 2}
	sum, _, err := ScoreFAQ(answers)
	if err != nil {
		t.Fatal(err)
	}
	if sum != 6 {
		t.Fatalf("sum %d", sum)
	}
}
