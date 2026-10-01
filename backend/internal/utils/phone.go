package utils

import "regexp"

// NormalizePhone removes all non-digit characters and converts leading 8 to 7 for Kazakhstan numbers
func NormalizePhone(phone string) string {
	if phone == "" {
		return ""
	}
	re := regexp.MustCompile(`\D`)
	digits := re.ReplaceAllString(phone, "")
	if len(digits) == 11 && digits[0] == '8' {
		digits = "7" + digits[1:]
	}
	return digits
}
