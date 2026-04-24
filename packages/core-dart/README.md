# stellar-address-kit (Dart)

The Dart/Flutter implementation of the Stellar Address Kit. 

This package provides a robust way to handle Stellar addresses (G, M, and C) and extract routing identifiers from incoming payments in mobile and web applications.

## Features

- **Address Detection**: Correct identifying G, M, and C addresses.
- **Muxed Support**: Safe encoding and decoding of M-addresses.
- **Routing Logic**: Reconcile incoming payments using Muxed IDs or Memos.
- **Validator Compliance**: Verified against a cross-language test suite (`vectors.json`).

## Installation

Add this to your `pubspec.yaml`:

```yaml
dependencies:
  stellar_address_kit: ^1.0.1
```

## Quick Start

```dart
import 'package:stellar_address_kit/stellar_address_kit.dart';

void main() {
  final address = 'GA7QYNF7SOWQ3GLR2B6RS22TBGZAOR6KLYH4PA5ZAM73A3H4K2HZZSQU';
  
  if (validate(address)) {
    final kind = detect(address);
    print('Address kind: $kind');
    
    final parsed = StellarAddress.parse(address);
    print('Base G address: ${parsed.baseG}');
  }
}
```

## Examples

### Simple Dart Example
A basic example can be found in the [example/](example/) folder.

### Full Flutter Demo
For a complete integration in a Flutter application, including UI components for displaying deposit addresses and handling incoming payments, check out the [flutter-demo](../../examples/flutter-demo) in the root repository.

## Documentation

For deep dives into Flutter implementation and web BigInt considerations, see our [comprehensive Guides](https://github.com/Boxkit-Labs/stellar-address-kit/tree/main/docs/guides).

## License

MIT
