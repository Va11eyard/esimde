package services

import (
	"bytes"
	"fmt"
	"os"
	"path/filepath"

	"esimde-backend/internal/models"

	"github.com/jung-kurt/gofpdf"
)

func GenerateScreeningPDF(screening *models.Screening, shareURL string) ([]byte, error) {
	pdf := gofpdf.New("P", "mm", "A4", "")
	pdf.AddUTF8Font("Noto", "", fontFile("NotoSans-Regular.ttf"))
	pdf.AddUTF8Font("Noto", "B", fontFile("NotoSans-Bold.ttf"))
	pdf.SetAutoPageBreak(true, 16)
	pdf.AddPage()

	pdf.SetFont("Noto", "B", 18)
	pdf.MultiCell(0, 9, "Esimde — отчёт скрининга памяти", "", "L", false)
	pdf.Ln(2)
	pdf.SetFont("Noto", "", 11)
	pdf.MultiCell(0, 6, Disclaimer, "", "L", false)
	pdf.Ln(4)

	pdf.SetFont("Noto", "", 12)
	pdf.MultiCell(0, 7, fmt.Sprintf("Пациент: %s, %d лет", screening.PatientName, screening.PatientAge), "", "L", false)
	pdf.MultiCell(0, 7, fmt.Sprintf("Контакт: %s", screening.BuyerName), "", "L", false)
	pdf.MultiCell(0, 7, fmt.Sprintf("Дата: %s", screening.CreatedAt.Format("02.01.2006 15:04")), "", "L", false)
	pdf.Ln(3)

	pdf.SetFont("Noto", "B", 14)
	pdf.MultiCell(0, 8, "Mini-Cog", "", "L", false)
	pdf.SetFont("Noto", "", 12)
	if !screening.MiniCogDone {
		pdf.MultiCell(0, 7, "Тест не завершён.", "", "L", false)
	} else {
		clock := "с ошибкой или без оценки (0 баллов)"
		if screening.ClockPoints == 2 {
			clock = "без ошибок (2 балла)"
		}
		pdf.MultiCell(0, 7, fmt.Sprintf("Вспомнено слов: %d из 3.", screening.WordsRecalled), "", "L", false)
		pdf.MultiCell(0, 7, "Часы: "+clock, "", "L", false)
		label := "Отрицательный: по этому тесту явных признаков не видно."
		if screening.Concern {
			label = "Положительный: есть повод обсудить память со специалистом."
		}
		pdf.MultiCell(0, 7, label, "", "L", false)
	}
	pdf.Ln(3)

	pdf.SetFont("Noto", "B", 14)
	pdf.MultiCell(0, 8, "Повседневная активность (FAQ)", "", "L", false)
	pdf.SetFont("Noto", "", 12)
	if screening.FaqScore == nil {
		pdf.MultiCell(0, 7, "Опрос близкого не заполнен.", "", "L", false)
	} else {
		pdf.MultiCell(0, 7, fmt.Sprintf("Сумма: %d из 30. Вариант «никогда не делал(а)» даёт 0 баллов.", *screening.FaqScore), "", "L", false)
		pdf.MultiCell(0, 7, faqSummary(*screening.FaqScore), "", "L", false)
	}
	pdf.Ln(4)
	pdf.SetFont("Noto", "", 11)
	pdf.MultiCell(0, 6, "Ссылка на отчёт: "+shareURL, "", "L", false)
	pdf.Ln(2)
	pdf.MultiCell(0, 6, "Очный приём с лицензированными методиками проводит врач в клинике. Этот отчёт их не заменяет.", "", "L", false)

	var buf bytes.Buffer
	if err := pdf.Output(&buf); err != nil {
		return nil, err
	}
	return buf.Bytes(), nil
}

func fontFile(name string) string {
	for _, dir := range []string{"fonts", filepath.Join("..", "..", "fonts")} {
		path := filepath.Join(dir, name)
		if _, err := os.Stat(path); err == nil {
			return path
		}
	}
	return filepath.Join("fonts", name)
}
