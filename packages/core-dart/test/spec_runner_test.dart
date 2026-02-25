import 'dart:convert';
import 'dart:io';

import 'package:test/test.dart';
import 'package:stellar_address_kit/src/address/detect.dart';
import 'package:stellar_address_kit/src/address/validate.dart';
import 'package:stellar_address_kit/src/address/codes.dart';

AddressKind? _kindFromString(String? k) {
  switch (k) {
    case 'G':
      return AddressKind.g;
    case 'M':
      return AddressKind.m;
    case 'C':
      return AddressKind.c;
    default:
      return null;
  }
}

void main() {
  final specFile = File('spec/vectors.json');
  if (!specFile.existsSync()) {
    throw Exception('vectors.json not found; run from repository root');
  }

  final spec = jsonDecode(specFile.readAsStringSync()) as Map<String, dynamic>;
  final cases = spec['cases'] as List<dynamic>;

  group('Vector tests', () {
    for (var c in cases) {
      final module = c['module'] as String;
      final description = c['description'] as String;
      test('[$module] $description', () {
        switch (module) {
          case 'detect':
            final input = c['input'] as Map<String, dynamic>;
            final expected = c['expected'] as Map<String, dynamic>;
            final addr = input['address'] as String;
            final kind = detect(addr);
            final want = _kindFromString(expected['kind'] as String?);
            expect(kind, want);

            // validation should succeed exactly when detection returned a kind
            expect(validate(addr), kind != null);
            // strict mode rejects any string that isn't already uppercase
            if (kind != null) {
              final strictlyValid = validate(addr, strict: true);
              if (addr != addr.toUpperCase()) {
                expect(strictlyValid, isFalse);
              } else {
                expect(strictlyValid, isTrue);
              }
            }
            break;
          // other modules are not implemented in Dart yet
          default:
            // skip
            break;
        }
      });
    }
  });
}

