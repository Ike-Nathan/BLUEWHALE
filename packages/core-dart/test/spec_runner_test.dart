import 'dart:convert';
import 'dart:io';
import 'package:test/test.dart';

void main() {
  final file = File('../../spec/vectors.json');

  if (!file.existsSync()) {
    fail('Expected packages/spec/vectors.json but file was not found.');
  }

  final Map<String, dynamic> json =
      jsonDecode(file.readAsStringSync()) as Map<String, dynamic>;

  final List<dynamic> cases = json['cases'] as List<dynamic>;

  group('Spec Runner (vectors.json)', () {
    for (final dynamic c in cases) {
      final Map<String, dynamic> caseData =
          c as Map<String, dynamic>;

      final String description =
          caseData['description']?.toString() ??
              'Unnamed vector';

      group(description, () {
        test('executes spec vector', () {
          // REQUIRED by issue: parse muxed IDs using BigInt.parse()
          if (caseData.containsKey('input')) {
            final input =
                caseData['input'] as Map<String, dynamic>;

            if (input.containsKey('id') &&
                input['id'] != null) {
              final BigInt id =
                  BigInt.parse(input['id'].toString());

              expect(id, isA<BigInt>());
            }
          }

          // Intentionally fail — correct starting state
          fail(
            'Vector "$description" is not implemented yet. '
            'Implement encoding/decoding logic to satisfy this test.',
          );
        });
      });
    }
  });
}