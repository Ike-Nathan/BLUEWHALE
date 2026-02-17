import 'dart:typed_data';

class MuxedDecoder {
  static Map<String, dynamic> decodeMuxed(Uint8List payload) {
    final ed25519 = payload.sublist(0, 32);
    final idBytes = payload.sublist(32, 40);

    var id = BigInt.zero;
    for (final byte in idBytes) {
      id = (id << 8) + BigInt.from(byte);
    }

    return {'ed25519': ed25519, 'id': id.toString()};
  }
}
