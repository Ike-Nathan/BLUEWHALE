package address

import "strings"

func Parse(input string) ParseResult {
	kind := Detect(input)
	if kind == "invalid" {
		return ParseResult{Kind: "invalid", Err: &AddressError{Code: ErrUnknownPrefix, Input: input, Message: "Invalid address"}}
	}

	warnings := []Warning{}
	if input != strings.ToUpper(input) {
		warnings = append(warnings, Warning{
			Code:     WarnNonCanonicalAddress,
			Severity: "warn",
			Message:  "Address normalized to uppercase",
			Normalization: &Normalization{Original: input, Normalized: strings.ToUpper(input)},
		})
	}

	return ParseResult{Kind: kind, Address: strings.ToUpper(input), Warnings: warnings}
}
