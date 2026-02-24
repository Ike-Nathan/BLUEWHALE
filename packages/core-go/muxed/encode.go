package muxed

import (
	"encoding/binary"
	"errors"
	"math/big"

	"github.com/stellar-address-kit/core-go/address"
)

var maxUint64 = new(big.Int).SetUint64(^uint64(0))

func EncodeMuxed(baseG string, id string) (string, error) {
	versionByte, pubkey, err := address.DecodeStrKey(baseG)
	if err != nil {
		return "", err
	}

	if versionByte != address.VersionByteG {
		return "", errors.New("invalid base account address")
	}

	idInt := new(big.Int)
	if _, ok := idInt.SetString(id, 10); !ok {
		return "", errors.New("invalid muxed account id")
	}
	if idInt.Sign() < 0 || idInt.Cmp(maxUint64) > 0 {
		return "", errors.New("muxed account id out of uint64 range")
	}

	// M-address payload: 32-byte pubkey followed by 8-byte big-endian uint64 ID.
	payload := make([]byte, 40)
	copy(payload[:32], pubkey)
	binary.BigEndian.PutUint64(payload[32:], idInt.Uint64())

	return address.EncodeStrKey(address.VersionByteM, payload)
}
