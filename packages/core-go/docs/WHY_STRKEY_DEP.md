# Why we depend on `stellar/go/strkey`

This implementation uses `github.com/stellar/go/strkey` for StrKey encoding and decoding — the same library used throughout the Stellar Go ecosystem. We do not reimplement StrKey primitives.

Our value-add is the `extractRouting` logic and shared spec compliance above these primitives. For any Stellar Go shop, this library adds zero new dependencies.
