package routing

import (
	"encoding/json"
	"testing"

	"github.com/REDISHFISH/BLUEWHALE/packages/core-go/address"
)

func TestRoutingIDUnmarshalJSONPreservesUint64Number(t *testing.T) {
	t.Parallel()

	payload := []byte(`{"id":18446744073709551615}`)
	var body struct {
		ID RoutingID `json:"id"`
	}

	if err := json.Unmarshal(payload, &body); err != nil {
		t.Fatalf("json.Unmarshal() error = %v", err)
	}

	if got := body.ID.String(); got != "18446744073709551615" {
		t.Fatalf("RoutingID.String() = %q, want %q", got, "18446744073709551615")
	}

	gotUint64, err := body.ID.Uint64()
	if err != nil {
		t.Fatalf("RoutingID.Uint64() error = %v", err)
	}

	if gotUint64 != ^uint64(0) {
		t.Fatalf("RoutingID.Uint64() = %d, want %d", gotUint64, ^uint64(0))
	}
}

func TestRoutingIDUnmarshalJSONAcceptsQuotedDecimalString(t *testing.T) {
	t.Parallel()

	payload := []byte(`{"id":"18446744073709551615"}`)
	var body struct {
		ID RoutingID `json:"id"`
	}

	if err := json.Unmarshal(payload, &body); err != nil {
		t.Fatalf("json.Unmarshal() error = %v", err)
	}

	if got := body.ID.String(); got != "18446744073709551615" {
		t.Fatalf("RoutingID.String() = %q, want %q", got, "18446744073709551615")
	}
}

func TestRoutingIDUnmarshalJSONRejectsInvalidNumbers(t *testing.T) {
	t.Parallel()

	testCases := []string{
		`{"id":18446744073709551616}`,
		`{"id":-1}`,
		`{"id":1.5}`,
		`{"id":"not-a-number"}`,
	}

	for _, payload := range testCases {
		payload := payload
		t.Run(payload, func(t *testing.T) {
			t.Parallel()

			var body struct {
				ID RoutingID `json:"id"`
			}

			if err := json.Unmarshal([]byte(payload), &body); err == nil {
				t.Fatalf("json.Unmarshal(%s) error = nil, want non-nil", payload)
			}
		})
	}
}

// RoutingResult is the JSON shape the other SDKs and the spec vectors read, so
// its empty form is part of the contract: fields that were never set must not
// come back as empty strings.
func TestRoutingResultMarshalsEmptyFieldsAway(t *testing.T) {
	t.Parallel()

	encoded, err := json.Marshal(RoutingResult{})
	if err != nil {
		t.Fatalf("json.Marshal(RoutingResult{}) error = %v", err)
	}

	const want = `{"success":false}`
	if got := string(encoded); got != want {
		t.Errorf("json.Marshal(RoutingResult{}) = %s, want %s", got, want)
	}
}

func TestDestinationErrorOmitsEmptyFields(t *testing.T) {
	t.Parallel()

	tests := []struct {
		name           string
		result         RoutingResult
		wantCode       bool
		wantMessage    bool
		wantErrorField bool
	}{
		{
			name:           "no error at all",
			result:         RoutingResult{Success: true},
			wantErrorField: false,
		},
		{
			name: "code without a message",
			result: RoutingResult{
				DestinationError: &DestinationError{Code: address.ErrUnknownPrefix},
			},
			wantErrorField: true,
			wantCode:       true,
			wantMessage:    false,
		},
		{
			name: "code and message",
			result: RoutingResult{
				DestinationError: &DestinationError{
					Code:    address.ErrUnknownPrefix,
					Message: "unrecognised destination prefix",
				},
			},
			wantErrorField: true,
			wantCode:       true,
			wantMessage:    true,
		},
	}

	for _, tt := range tests {
		tt := tt
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()

			encoded, err := json.Marshal(tt.result)
			if err != nil {
				t.Fatalf("json.Marshal() error = %v", err)
			}

			var decoded map[string]any
			if err := json.Unmarshal(encoded, &decoded); err != nil {
				t.Fatalf("json.Unmarshal(%s) error = %v", encoded, err)
			}

			raw, present := decoded["destinationError"]
			if present != tt.wantErrorField {
				t.Fatalf("destinationError present = %v, want %v (json: %s)", present, tt.wantErrorField, encoded)
			}
			if !tt.wantErrorField {
				return
			}

			errFields, ok := raw.(map[string]any)
			if !ok {
				t.Fatalf("destinationError is %T, want an object (json: %s)", raw, encoded)
			}

			if _, ok := errFields["code"]; ok != tt.wantCode {
				t.Errorf("destinationError.code present = %v, want %v (json: %s)", ok, tt.wantCode, encoded)
			}
			if _, ok := errFields["message"]; ok != tt.wantMessage {
				t.Errorf("destinationError.message present = %v, want %v (json: %s)", ok, tt.wantMessage, encoded)
			}
		})
	}
}
