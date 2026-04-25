# Exchange Withdrawal Validator

This example demonstrates outbound address validation for exchange withdrawal forms using stellar-address-kit. It automatically detects G-addresses, M-addresses, and C-addresses, ensuring that memo fields are disabled for muxed addresses and that contract addresses are rejected to prevent permanent loss of funds.

## Quick Start

npm install
npx tsx src/server.ts
open localhost:3000

## Test Scenarios

Paste an M-address to see the memo field automatically disabled.
Paste a C-address (Contract) to see the withdrawal rejected.
Paste a G-address with an ID memo to verify standard routing.

[Back to stellar-address-kit](https://github.com/Boxkit-Labs/stellar-address-kit)
