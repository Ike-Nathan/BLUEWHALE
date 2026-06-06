# Conformance Test Vectors

This directory contains implementations that run the cross-language normative test vectors against various implementations of the Stellar Address Kit.

## Dart

The Dart implementation of the conformance test runner is located in the `dart` subdirectory.

```bash
cd dart
dart pub get
dart run bin/run.dart
```

This ensures that the `stellar_address_kit` Dart package strictly complies with the specification vectors defined in `../../spec/vectors.json`.
