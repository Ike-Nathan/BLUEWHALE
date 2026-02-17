import 'codes.dart';

AddressKind detect(String address) {
  if (address.startsWith('G') && address.length == 56) return AddressKind.g;
  if (address.startsWith('M') && address.length == 95) return AddressKind.m;
  if (address.startsWith('C') && address.length == 56) return AddressKind.c;
  return AddressKind.invalid;
}
