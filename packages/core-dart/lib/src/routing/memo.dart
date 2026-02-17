import '../address/codes.dart';

class NormalizeResult {
  final String? normalized;
  final List<Warning> warnings;

  NormalizeResult({this.normalized, required this.warnings});
}

final BigInt uint64Max = BigInt.parse('18446744073709551615');
final RegExp digitsOnly = RegExp(r'^\d+$');

NormalizeResult normalizeMemoTextId(String s) {
  final warnings = <Warning>[];

  // Step 1, 2, 3: Blank, non-digit
  if (s.isEmpty || !digitsOnly.hasMatch(s)) {
    return NormalizeResult(normalized: null, warnings: warnings);
  }

  // Step 4: Leading zeros
  var normalized = s.replaceFirst(RegExp(r'^0+'), '');
  if (normalized.isEmpty) {
    normalized = '0';
  }

  if (normalized != s) {
    warnings.add(
      Warning(
        code: WarningCode.nonCanonicalRoutingId,
        severity: 'warn',
        message:
            'Memo routing ID had leading zeros. Normalized to canonical decimal.',
        normalization: Normalization(original: s, normalized: normalized),
      ),
    );
  }

  // Step 5: uint64 max
  try {
    final val = BigInt.parse(normalized);
    if (val > uint64Max) {
      return NormalizeResult(normalized: null, warnings: warnings);
    }
  } catch (_) {
    return NormalizeResult(normalized: null, warnings: warnings);
  }

  return NormalizeResult(normalized: normalized, warnings: warnings);
}
