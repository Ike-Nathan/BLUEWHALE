package routing

import "github.com/stellar-address-kit/core-go/address"

type Warning struct {
	Code    string `json:"code"`
	Message string `json:"message,omitempty"`
}

const (
	WarningMemoIgnored = "memo_ignored"
)

// RoutingInput represents incoming routing payload data.
type RoutingInput struct {
	SourceAddress string            `json:"sourceAddress"`
	TargetChains  []string          `json:"targetChains"`
	Metadata      map[string]string `json:"metadata,omitempty"`

	// Backward-compatible fields used by current extraction flow.
	Destination   string `json:"destination,omitempty"`
	MemoType      string `json:"memoType,omitempty"`
	MemoValue     string `json:"memoValue,omitempty"`
	SourceAccount string `json:"sourceAccount,omitempty"`
}

// RoutingResult represents routing output data.
type RoutingResult struct {
	ResolvedAddresses map[string]string `json:"resolvedAddresses,omitempty"`
	Success           bool              `json:"success"`
	ErrorMessage      string            `json:"errorMessage,omitempty"`

	// Backward-compatible fields used by current extraction flow.
	DestinationBaseAccount string            `json:"destinationBaseAccount,omitempty"`
	RoutingID              string            `json:"routingId,omitempty"`
	RoutingSource          string            `json:"routingSource,omitempty"`
	Warnings               []Warning         `json:"warnings,omitempty"`
	DestinationError       *DestinationError `json:"destinationError,omitempty"`
}

type DestinationError struct {
	Code    address.ErrorCode `json:"code"`
	Message string            `json:"message"`
}