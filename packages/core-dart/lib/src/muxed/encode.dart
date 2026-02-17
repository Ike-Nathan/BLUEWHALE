import 'dart:typed_data';

class MuxedEncoder {
  static String encodeMuxed(List<int> ed25519, BigInt id) {
    final payload = Uint8List(32 + 8);
    payload.setRange(0, 32, ed25519);

    for (var i = 7; i >= 0; i--) {
      payload[32 + i] = (id & BigInt.from(0xFF)).toInt();
      id = id >> 8;
    }

    // Placeholder for actual StrKey encoding in Dart
    return "MA7...";
  }
}
