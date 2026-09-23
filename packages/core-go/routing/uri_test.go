package routing

import (
	"testing"
)

func TestExtractRoutingFromURI_ValidPay(t *testing.T) {
	uri := "web+stellar:pay?destination=GAYCUYT553C5LHVE2XPW5GMEJT4BXGM7AHMJWLAPZP53KJO7EIQADRSI&memo=12345&memo_type=MEMO_ID"
	result, params, err := ExtractRoutingFromURI(uri)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if params.Destination != "GAYCUYT553C5LHVE2XPW5GMEJT4BXGM7AHMJWLAPZP53KJO7EIQADRSI" {
		t.Errorf("expected destination, got %s", params.Destination)
	}
	if params.Memo != "12345" {
		t.Errorf("expected memo 12345, got %s", params.Memo)
	}
	if result.DestinationBaseAccount != "GAYCUYT553C5LHVE2XPW5GMEJT4BXGM7AHMJWLAPZP53KJO7EIQADRSI" {
		t.Errorf("expected base account, got %s", result.DestinationBaseAccount)
	}
	if result.RoutingID == nil || result.RoutingID.String() != "12345" {
		t.Errorf("expected routing ID 12345, got %v", result.RoutingID)
	}
}

func TestExtractRoutingFromURI_InvalidScheme(t *testing.T) {
	uri := "https://example.com/pay?destination=GAYCUYT553C5LHVE2XPW5GMEJT4BXGM7AHMJWLAPZP53KJO7EIQADRSI"
	_, _, err := ExtractRoutingFromURI(uri)
	if err != ErrInvalidScheme {
		t.Errorf("expected ErrInvalidScheme, got %v", err)
	}
}

func TestExtractRoutingFromURI_UnsupportedOperation(t *testing.T) {
	uri := "web+stellar:tx?xdr=AAAA"
	_, _, err := ExtractRoutingFromURI(uri)
	if err != ErrUnsupportedOperation {
		t.Errorf("expected ErrUnsupportedOperation, got %v", err)
	}
}

func TestExtractRoutingFromURI_MissingDestination(t *testing.T) {
	uri := "web+stellar:pay?amount=100"
	_, _, err := ExtractRoutingFromURI(uri)
	if err != ErrMissingDestination {
		t.Errorf("expected ErrMissingDestination, got %v", err)
	}
}
