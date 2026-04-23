# stellar_address_kit (Dart)

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
  stellar_address_kit: ^1.0.0
```

## Quick Start

```dart
import 'package:stellar_address_kit/stellar_address_kit.dart';

void main() {
  final address = 'GA7QYNF7SOWQ3GLR2B6RS22TBGZAOR6KLYH4PA5ZAM73A3H4K2HZZSQU';
  
  if (AddressValidator.isValid(address)) {
    final kind = AddressDetector.detect(address);
    print('Address kind: $kind');
  }
}
```

## Documentation

For deep dives into Flutter implementation and web BigInt considerations, see the [Guides](https://github.com/Boxkit-Labs/stellar-address-kit/tree/main/docs/guides).

## License

MIT
