package address

import (
	"github.com/stellar/go/strkey"
)

func Detect(address string) string {
	if strkey.IsValidEd25519PublicKey(address) { return "G" }
	if strkey.IsValidMed25519PublicKey(address) { return "M" }
	if strkey.IsValidContract(address) { return "C" }
	return "invalid"
}
