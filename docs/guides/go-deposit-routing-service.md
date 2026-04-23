# Deposit Routing Service Integration (Go)

For backend applications, a common architecture involves running a "deposit routing service" or "worker". This service continuously streams transactions from the Stellar network (via Horizon) for a given pooled account, and routes incoming funds to internal user balances in a database based on the Muxed ID or Memo ID.

This guide demonstrates how to build a robust routing service using the Go implementation of `stellar-address-kit`.

## Prerequisites

Import the `core-go` package into your Go project:

```go
import (
    "log"
    "github.com/stellar/go/clients/horizonclient"
    "github.com/stellar/go/protocols/horizon/operations"
    addresskit "github.com/Boxkit-Labs/stellar-address-kit/core-go"
)
```

## The Routing Worker

We will set up a worker that streams payments for our pooled `G` address.

```go
package main

import (
    "context"
    "fmt"
    "log"

    "github.com/stellar/go/clients/horizonclient"
    "github.com/stellar/go/protocols/horizon/operations"
    addresskit "github.com/Boxkit-Labs/stellar-address-kit/core-go"
)

func main() {
    pooledAddress := "GA7QYNF7SOWQ3GLR2B6RS22TBGZAOR6KLYH4PA5ZAM73A3H4K2HZZSQU"
    
    client := horizonclient.DefaultTestNetClient

    opRequest := horizonclient.OperationRequest{
        ForAccount: pooledAddress,
        Cursor:     "now", // Start listening from current time
    }

    ctx := context.Background()

    // Stream operations
    err := client.StreamPayments(ctx, opRequest, processPayment)
    if err != nil {
        log.Fatalf("Error streaming payments: %v", err)
    }
}
```

## Processing and Reconciling Payments

The `processPayment` callback is where the `stellar-address-kit` shines. We need to extract the routing ID safely and correctly, checking both the Muxed destination and the transaction Memo.

```go
func processPayment(op operations.Operation) {
    payment, ok := op.(operations.Payment)
    if !ok {
        return // Not a payment operation
    }

    var routingID uint64
    var foundID bool

    // 1. Check if the destination is a Muxed Address
    if addresskit.IsMuxed(payment.To) {
        decoded, err := addresskit.DecodeMuxedAddress(payment.To)
        if err != nil {
            log.Printf("Failed to decode muxed address: %v", err)
            return
        }
        routingID = decoded.ID
        foundID = true
    } else {
        // 2. Fallback to checking the transaction memo
        // Note: In a real app, you might need to fetch the transaction details 
        // if the memo isn't included in the operation payload, depending on your horizon query.
        
        // Assuming we have a function to fetch the memo from the tx hash
        memoID, err := fetchTransactionMemoID(payment.TransactionHash) 
        if err == nil {
            routingID = memoID
            foundID = true
        }
    }

    if foundID {
        routeToUserBalance(routingID, payment.Amount, payment.Asset.Code)
    } else {
        handleUnroutedDeposit(payment)
    }
}

func routeToUserBalance(userID uint64, amount string, asset string) {
    // Database logic: UPDATE users SET balance = balance + amount WHERE id = userID
    fmt.Printf("✅ Routed %s %s to User ID: %d\n", amount, asset, userID)
}

func handleUnroutedDeposit(payment operations.Payment) {
    // Escrow logic: Record the transaction hash in an administrative table 
    // for manual review and customer support.
    fmt.Printf("⚠️  Unrouted deposit detected! TxHash: %s\n", payment.TransactionHash)
}

// Dummy helper
func fetchTransactionMemoID(txHash string) (uint64, error) {
    // Query horizon for transaction details and return Memo ID
    return 0, fmt.Errorf("no memo")
}
```

## Key Considerations for Go Backends

1.  **Idempotency:** Horizon streams can sometimes reconnect and replay messages. Always record the `Operation ID` in your database and ensure you do not credit the user twice for the same operation.
2.  **Concurrency:** Go handles concurrent streams beautifully with Goroutines. You can run multiple workers to listen to different pooled accounts or asset streams simultaneously.
3.  **Strict Validation:** Before processing any user-provided addresses for withdrawals, always run them through `addresskit.IsValid(address)`.
