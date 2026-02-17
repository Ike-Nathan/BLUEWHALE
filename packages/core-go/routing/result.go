package routing

import (
	"strconv"
	
	"github.com/stellar-address-kit/core-go/address"
)

type MemoType string

const (
	MemoTypeNone   MemoType = "none"
	MemoTypeID     MemoType = "id"
	MemoTypeText   MemoType = "text"
	MemoTypeHash   MemoType = "hash"
	MemoTypeReturn MemoType = "return"
)

type RoutingID struct {
	raw string
}

func (r *RoutingID) String() string {
	if r == nil {
		return ""
	}
	return r.raw
}

func (r *RoutingID) Uint64() (uint64, error) {
	if r == nil {
		return 0, strconv.ErrSyntax
	}
	return strconv.ParseUint(r.raw, 10, 64)
}

func NewRoutingID(s string) *RoutingID {
	return &RoutingID{raw: s}
}

type RoutingInput struct {
	Destination   string
	MemoType      string
	MemoValue     *string
	SourceAccount *string
}

type RoutingResult struct {
	DestinationBaseAccount string
	RoutingID              *RoutingID
	RoutingSource          string // "muxed" | "memo" | "none"
	Warnings               []address.Warning
	DestinationError       *DestinationError
}

type DestinationError struct {
	Code    address.ErrorCode
	Message string
}
