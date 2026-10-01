package services

import (
	"bytes"
	"fmt"
	"esimde-backend/internal/models"

	"github.com/jung-kurt/gofpdf"
)

func GenerateTestPDFReport(test *models.Test) ([]byte, error) {
	pdf := gofpdf.New("P", "mm", "A4", "")
	pdf.AddPage()
	pdf.SetFont("Arial", "B", 18)

	// Header
	pdf.CellFormat(190, 10, "Esimde - Neurocognitive Screening Report", "0", 1, "C", false, 0, "")
	pdf.Ln(10)

	pdf.SetFont("Arial", "", 12)
	pdf.CellFormat(190, 8, fmt.Sprintf("Report Hash: %s", test.Hash.String()), "0", 1, "L", false, 0, "")
	pdf.CellFormat(190, 8, fmt.Sprintf("Date: %s", test.CreatedAt.Format("02.01.2006 15:04")), "0", 1, "L", false, 0, "")

	if test.User != nil {
		pdf.CellFormat(190, 8, fmt.Sprintf("Patient: %s", test.User.FullName()), "0", 1, "L", false, 0, "")
	}

	pdf.Ln(10)
	pdf.SetFont("Arial", "B", 14)
	pdf.CellFormat(190, 10, "Screening Results (Mini-Cog)", "B", 1, "L", false, 0, "")
	pdf.Ln(5)

	pdf.SetFont("Arial", "", 12)
	pdf.CellFormat(190, 8, "Assessment: Completed", "0", 1, "L", false, 0, "")

	pdf.Ln(15)
	pdf.SetFont("Arial", "I", 10)
	pdf.MultiCell(190, 6, "Note: This report is a preliminary online screening tool and does not replace professional medical evaluation by a licensed physician.", "0", "L", false)

	var buf bytes.Buffer
	err := pdf.Output(&buf)
	if err != nil {
		return nil, err
	}

	return buf.Bytes(), nil
}
