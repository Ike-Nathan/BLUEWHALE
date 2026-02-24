import 'dart:convert';
import 'dart:io';
import 'package:test/test.dart';
import 'package:stellar_address_kit/stellar_address_kit.dart';

void main() {
  final vectorsFile = File('../../spec/vectors.json');
  if (!vectorsFile.existsSync()) {
    print('Warning: vectors.json not found at ${vectorsFile.absolute.path}');
    return;
  }
  
  final vectorsJson = jsonDecode(vectorsFile.readAsStringSync());
  final cases = vectorsJson['cases'] as List;

  group('Vector tests', () {
    for (final c in cases) {
      if (c['module'] == 'muxed_encode') {
        test('[muxed_encode] ${c['description']}', () {
          final gAddress = c['input']['gAddress'] as String;
          final id = BigInt.parse(c['input']['id'] as String);
          final expectedM = c['expected']['mAddress'] as String;

          final result = MuxedAddress.encode(baseG: gAddress, id: id);
          expect(result, equals(expectedM));
        });
      }
    }
  });
}
