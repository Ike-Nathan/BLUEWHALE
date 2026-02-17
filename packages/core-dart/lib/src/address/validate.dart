import 'detect.dart';
import 'codes.dart';

bool validate(String address, {bool strict = false}) {
  final kind = detect(address);
  if (kind == AddressKind.invalid) return false;
  if (strict && address != address.toUpperCase()) return false;
  return true;
}
