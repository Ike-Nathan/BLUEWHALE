package muxed

import (
	"math/big"
	"github.com/stellar/go/strkey"
)

func EncodeMuxed(baseG string, id string) (string, error) {
	pubkey, err := strkey.Decode(strkey.VersionByteAccountID, baseG)
	if err != nil {
		return "", err
	}
	
	idInt := new(big.Int)
	idInt.SetString(id, 10)
	
	return strkey.EncodeMuxedAccount(pubkey, idInt.Uint64())
}
