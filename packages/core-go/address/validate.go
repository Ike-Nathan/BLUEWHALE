package address

import "strings"

func Validate(address string, strict bool) bool {
	kind := Detect(address)
	if kind == "invalid" { return false }
	if strict && address != strings.ToUpper(address) { return false }
	return true
}
