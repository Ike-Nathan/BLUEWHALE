package muxed

import (
	"strconv"

	"github.com/stellar/go/strkey"
)

func DecodeMuxed(mAddress string) (string, string, error) {
	pubkey, id, err := strkey.DecodeMuxedAccount(mAddress)
	if err != nil {
		return "", "", err
	}

	baseG, err := strkey.Encode(strkey.VersionByteAccountID, pubkey)
	if err != nil {
		return "", "", err
	}

	return baseG, strconv.FormatUint(id, 10), nil
}
