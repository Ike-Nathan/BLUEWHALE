# Examples

This directory contains 11 standalone example projects demonstrating how to integrate the Bluewhale library across different languages, platforms, and use cases.

## Choosing the Right Example

| Example | Language | Use Case | Description |
|---|---|---|---|
| [`go-payment-listener`](#go-payment-listener) | Go | Exchange | Streams Horizon payments and reconciles deposits with structured compliance logging |
| [`go-exchange/contract-deposit-firewall`](#go-exchange--contract-deposit-firewall) | Go | Compliance | Maps routing warnings to deposit decisions: auto-credit, manual review, or quarantine |
| [`ts-backend/exchange-withdrawal-validator`](#ts-backend--exchange-withdrawal-validator) | TypeScript | Exchange | Server-side outbound address validation for withdrawal forms |
| [`ts-backend/bigint-precision-auditor`](#ts-backend--bigint-precision-auditor) | TypeScript | Wallet | Demonstrates BigInt safety for large muxed IDs in Node.js |
| [`react-demo`](#react-demo) | TypeScript / React | Wallet | Interactive UI for address analysis, routing, and compliance warnings |
| [`flutter-demo`](#flutter-demo) | Dart / Flutter | Wallet | Mobile wallet reference with BigInt-safe muxed ID handling on Flutter Web |
| [`dart-wallet/flutter_web_safe_bigint_demo`](#dart-wallet--flutter_web_safe_bigint_demo) | Dart | Wallet | Minimal demo of `SafeRoutingId` and `isWebJsRuntime` precision guards |
| [`conformance-test-vectors`](#conformance-test-vectors) | Dart | Spec | Runs the cross-language normative test vectors against the Dart implementation |
| [`prism-core`](#prism-core) | Rust | Exchange | Rust implementation of the Bluewhale address parser (`prism-core` crate) |
| [`rust-address-fuzzer`](#rust-address-fuzzer) | Rust | Fuzzer | Property-based fuzzer for the `prism-core` Stellar address parser |
| [`django-anchor-router`](#django-anchor-router) | Python | Compliance | Django REST API that classifies deposit addresses and labels compliance risk |

---

## Go

### `go-payment-listener`

A production-grade Horizon streaming daemon that reconciles incoming Stellar payments with internal user accounts. Demonstrates M-address resolution, memo-ID fallback, compliance warning tiers, Prometheus metrics, and graceful shutdown.

**Best for:** Backend exchanges and payment processors that need a reference for robust, observable deposit routing.

```bash
cd go-payment-listener
go run ./cmd/listener --config config.example.yaml
```

Or with Docker:

```bash
cd go-payment-listener
docker compose up
```

---

### `go-exchange / contract-deposit-firewall`

Security-focused deposit filter that maps Bluewhale routing warnings to concrete deposit decisions. Contract-sender deposits are quarantined, redundant-memo deposits are flagged for manual review, and clean muxed deposits are auto-credited.

**Best for:** Compliance and security teams building deposit ingestion pipelines in Go.

```bash
cd go-exchange/contract-deposit-firewall
go run ./cmd/main.go
```

---

## TypeScript

### `ts-backend / exchange-withdrawal-validator`

Express server demonstrating outbound address validation for exchange withdrawal forms. Automatically detects G-, M-, and C-addresses, disables memo fields for muxed addresses, and rejects contract addresses before funds are sent.

**Best for:** Exchange backend engineers adding withdrawal address validation.

```bash
cd ts-backend/exchange-withdrawal-validator
npm install
npx tsx src/server.ts
# open http://localhost:3000
```

---

### `ts-backend / bigint-precision-auditor`

CLI tool that demonstrates how JavaScript's `Number` type silently corrupts Stellar muxed account IDs exceeding `2^53 - 1` (Number.MAX_SAFE_INTEGER), and shows how the Bluewhale library prevents this with `BigInt`.

**Best for:** Node.js developers auditing or migrating existing memo/muxed ID handling.

```bash
cd ts-backend/bigint-precision-auditor
npm install
npx tsx src/main.ts
```

---

### `react-demo`

Interactive React UI for analyzing Stellar addresses in real time. Enter any G-, M-, or C-address and see routing results, compliance warnings, and BigInt safety indicators rendered immediately.

**Best for:** Frontend developers building wallet or exchange deposit UIs.

```bash
cd react-demo
npm install
npm run dev
# open http://localhost:5173
```

---

## Dart / Flutter

### `flutter-demo`

Full Flutter application demonstrating deposit routing in a production-grade mobile wallet. Showcases BigInt-safe muxed ID handling on Flutter Web, BLoC state management, and real-time compliance warning UX.

**Best for:** Flutter developers building Stellar wallets for mobile and web.

```bash
cd flutter-demo
flutter pub get
flutter run -d chrome   # Web (BigInt safety demo)
flutter run             # Android / iOS
```

---

### `dart-wallet / flutter_web_safe_bigint_demo`

Minimal Dart project demonstrating the `SafeRoutingId` wrapper and `isWebJsRuntime` compile-time flag. Shows exactly how precision is preserved for values above `Number.MAX_SAFE_INTEGER` in a browser context.

**Best for:** Dart developers who need a focused, dependency-light reference for the BigInt safety layer.

```bash
cd dart-wallet/flutter_web_safe_bigint_demo
dart pub get
dart run bin/main.dart
```

---

### `conformance-test-vectors`

Runs the shared cross-language normative test vectors (`spec/vectors.json`) against the Dart (`bluewhale_core`) implementation. Use this to verify that a custom Dart wrapper or fork remains spec-compliant.

**Best for:** Contributors verifying spec compliance after modifying the Dart package.

```bash
cd conformance-test-vectors/dart
dart pub get
dart run bin/run.dart
```

---

## Rust

### `prism-core`

A Rust implementation of the Bluewhale Stellar address parser. Provides a `prism_core` library crate plus a `prism-diff` binary for comparing routing results against a reference implementation.

**Best for:** Rust backend developers who need spec-compliant Stellar address parsing.

```bash
cd prism-core
cargo build --release
cargo test
```

---

### `rust-address-fuzzer`

Property-based fuzzer for the `prism-core` address parser. Uses `arbitrary` and `rand` to generate random byte sequences and verify that the parser never panics on unexpected input.

**Best for:** Security engineers fuzzing the Rust parser for robustness and crash safety.

```bash
cd rust-address-fuzzer
cargo run --release
```

---

## Python

### `django-anchor-router`

Django REST API that receives deposit address payloads, classifies each address by type (G / M / C) and routing risk, and returns structured compliance labels. Also ships a standalone CLI (`python-compliance-logger`) for batch CSV annotation.

**Best for:** Python/Django teams building anchor deposit routing or compliance reporting pipelines.

```bash
cd django-anchor-router
pip install -r requirements.txt
python manage.py runserver
```

Batch CSV compliance audit:

```bash
cd ../python-compliance-logger
python3 main.py deposits.csv output.csv
```

---

## Language & Use Case Matrix

| | Exchange | Wallet | Compliance | Fuzzer | Spec |
|---|---|---|---|---|---|
| **Go** | `go-payment-listener`, `go-exchange/contract-deposit-firewall` | — | `go-exchange/contract-deposit-firewall` | — | — |
| **TypeScript** | `ts-backend/exchange-withdrawal-validator` | `ts-backend/bigint-precision-auditor`, `react-demo` | — | — | — |
| **Dart / Flutter** | — | `flutter-demo`, `dart-wallet/flutter_web_safe_bigint_demo` | — | — | `conformance-test-vectors` |
| **Rust** | `prism-core` | — | — | `rust-address-fuzzer` | — |
| **Python** | `django-anchor-router` | — | `django-anchor-router` | — | — |
