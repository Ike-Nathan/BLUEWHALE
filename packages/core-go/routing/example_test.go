package routing

import (
	"fmt"
)

// ExampleExtractRouting shows the basic entry point: pass a destination and a
// routing memo, and read the canonical base account and routing ID back.
func ExampleExtractRouting() {
	result := ExtractRouting(RoutingInput{
		Destination: "GAYCUYT553C5LHVE2XPW5GMEJT4BXGM7AHMJWLAPZP53KJO7EIQADRSI",
		MemoType:    "id",
		MemoValue:   "0012345", // leading zeros are normalized away
	})

	fmt.Println("base:", result.DestinationBaseAccount)
	fmt.Println("routingID:", result.RoutingID)
	fmt.Println("source:", result.RoutingSource)
	for _, w := range result.Warnings {
		fmt.Println("warning:", w.Code, "-", w.Message)
	}

	// Output:
	// base: GAYCUYT553C5LHVE2XPW5GMEJT4BXGM7AHMJWLAPZP53KJO7EIQADRSI
	// routingID: 12345
	// source: memo
	// warning: NON_CANONICAL_ROUTING_ID - Memo routing ID had leading zeros. Normalized to canonical decimal.
}

// ExampleExtractRoutingFromURI parses a SEP-0007 payment URI, the format
// wallets receive from links and QR codes.
func ExampleExtractRoutingFromURI() {
	uri := "web+stellar:pay?destination=GAYCUYT553C5LHVE2XPW5GMEJT4BXGM7AHMJWLAPZP53KJO7EIQADRSI&amount=100&memo=98765&memo_type=MEMO_ID"

	result, params, err := ExtractRoutingFromURI(uri)
	if err != nil {
		fmt.Println("error:", err)
		return
	}

	fmt.Println("destination:", params.Destination)
	fmt.Println("amount:", params.Amount)
	fmt.Println("routingID:", result.RoutingID)
	fmt.Println("source:", result.RoutingSource)

	// Output:
	// destination: GAYCUYT553C5LHVE2XPW5GMEJT4BXGM7AHMJWLAPZP53KJO7EIQADRSI
	// amount: 100
	// routingID: 98765
	// source: memo
}

// ExampleExtractRoutingWithMemoRequirement adds the SEP-0029 check: a fetcher
// says whether the destination requires a memo, and the extractor appends an
// error warning when no routing ID was supplied.
func ExampleExtractRoutingWithMemoRequirement() {
	fetch := func(baseAccount string) (bool, error) {
		// In production this would call Horizon or an indexer.
		return baseAccount == "GAYCUYT553C5LHVE2XPW5GMEJT4BXGM7AHMJWLAPZP53KJO7EIQADRSI", nil
	}

	result := ExtractRoutingWithMemoRequirement(RoutingInput{
		Destination: "GAYCUYT553C5LHVE2XPW5GMEJT4BXGM7AHMJWLAPZP53KJO7EIQADRSI",
		MemoType:    "none",
	}, fetch)

	fmt.Println("routingID set:", result.RoutingID != nil)
	for _, w := range result.Warnings {
		fmt.Println(w.Severity, "-", w.Message)
	}

	// Output:
	// routingID set: false
	// error - Destination account requires a memo, but no routing ID was provided.
}
