package address

import "encoding/binary"

// Parse parses a Stellar address string into an Address struct.
//
// The address is decoded exactly once. For M-addresses the base G-address
// and muxed ID are derived from that single decode.
func Parse(input string) (*Address, error) {
	versionByte, payload, raw, err := decodeStrKey(input)
	if err != nil {
		code := ErrUnknownPrefix
		if re, ok := err.(RoutingError); ok {
			code = re.Code
		}
		return nil, RoutingError{
			Code:    code,
			Input:   input,
			Message: err.Error(),
		}
	}

	kind, err := kindForVersionByte(versionByte)
	if err != nil {
		return nil, err
	}

	addr := &Address{
		Kind: kind,
		Raw:  raw,
	}

	if kind == KindM {
		if len(payload) != 40 {
			return nil, errInvalidLength
		}
		baseG, err := EncodeStrKey(VersionByteG, payload[:32])
		if err != nil {
			return nil, err
		}
		addr.BaseG = baseG
		addr.MuxedID = binary.BigEndian.Uint64(payload[32:40])
	}

	return addr, nil
}
