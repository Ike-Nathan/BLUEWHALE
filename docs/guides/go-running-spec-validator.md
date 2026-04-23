# Running the Spec Validator (Go)

The `stellar-address-kit` aims to provide identical behavior across TypeScript, Go, and Dart. To guarantee this, the project relies on a shared `vectors.json` file located at the root of the repository. 

This JSON file contains hundreds of test cases (valid addresses, invalid formats, boundary values) that every SDK implementation must pass.

This guide shows you how to run and verify the specification validator in the `core-go` environment.

## Prerequisites

Ensure you have a modern version of Go installed (1.20+ is recommended).

Navigate to the Go package directory:
```bash
cd packages/core-go
```

## Executing the Test Suite

The validation logic is baked directly into the Go test suite. It automatically locates the `vectors.json` file in the repository root, unmarshals the test cases, and runs them against the Go implementation of the encoder and decoder.

To run the validator, simply execute:

```bash
go test ./... -v
```

### Expected Output

You should see output indicating that the JSON vectors were loaded and successfully tested.

```text
=== RUN   TestSpecVectors
    validator_test.go:24: Loaded 142 test vectors from ../../vectors.json
=== RUN   TestSpecVectors/Valid_G_Address
=== RUN   TestSpecVectors/Valid_M_Address_Min_ID
=== RUN   TestSpecVectors/Valid_M_Address_Max_ID
...
--- PASS: TestSpecVectors (0.05s)
PASS
ok      github.com/Boxkit-Labs/stellar-address-kit/core-go    0.060s
```

## How the Validator Works in Go

If you inspect the test files (e.g., `validator_test.go`), you will see how it processes the JSON:

```go
package addresskit_test

import (
    "encoding/json"
    "os"
    "testing"
    "path/filepath"
    addresskit "github.com/Boxkit-Labs/stellar-address-kit/core-go"
)

type Vector struct {
    Name        string `json:"name"`
    Address     string `json:"address"`
    IsValid     bool   `json:"is_valid"`
    IsMuxed     bool   `json:"is_muxed"`
    BaseAddress string `json:"base_address,omitempty"`
    ID          uint64 `json:"id,omitempty"`
}

func TestSpecVectors(t *testing.T) {
    // Locate the vectors.json in the repo root
    path := filepath.Join("..", "..", "vectors.json")
    data, err := os.ReadFile(path)
    if err != nil {
        t.Fatalf("Failed to read vectors.json: %v", err)
    }

    var vectors []Vector
    if err := json.Unmarshal(data, &vectors); err != nil {
        t.Fatalf("Failed to parse vectors.json: %v", err)
    }

    for _, v := range vectors {
        t.Run(v.Name, func(t *testing.T) {
            valid := addresskit.IsValid(v.Address)
            if valid != v.IsValid {
                t.Errorf("Expected IsValid=%v, got %v for %s", v.IsValid, valid, v.Address)
            }

            if valid && v.IsMuxed {
                decoded, err := addresskit.DecodeMuxedAddress(v.Address)
                if err != nil {
                    t.Errorf("Failed to decode valid muxed address: %v", err)
                }
                if decoded.BaseAddress != v.BaseAddress {
                    t.Errorf("Expected Base=%s, got %s", v.BaseAddress, decoded.BaseAddress)
                }
                if decoded.ID != v.ID {
                    t.Errorf("Expected ID=%d, got %d", v.ID, decoded.ID)
                }
            }
        })
    }
}
```

## Modifying the Vectors

If you add a new edge case or find a bug:
1. Do **not** modify the Go tests directly to add a specific test case.
2. Instead, add the new test object to the root `vectors.json`.
3. Run the Go test suite again to verify that the implementation handles the new vector correctly.
4. Also, remember to run `pnpm test` (TypeScript) and `dart test` (Dart) to ensure the behavior is consistent across all languages!
