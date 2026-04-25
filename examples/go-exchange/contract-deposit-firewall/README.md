# Contract Deposit Firewall

This example demonstrates security-oriented deposit filtering using stellar-address-kit's C-address warnings. It maps routing warnings and address types to specific deposit decisions: auto-credit for standard G-addresses, manual review for potential misrouting, or quarantine for contract-based deposits.

## Quick Start

go run ./cmd/main.go

## Warning to Decision Mapping

Warning Name      -> Decision
----------------------------
contract-sender   -> quarantine
memo-ignored      -> manual-review
muxed-account     -> auto-credit
invalid-checksum  -> quarantine

[Back to stellar-address-kit](https://github.com/Boxkit-Labs/stellar-address-kit)
