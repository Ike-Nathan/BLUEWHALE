import '../address/detect.dart';
import '../address/codes.dart';
import '../exceptions.dart';
import 'encode.dart';

/// Class for handling Stellar Muxed Addresses (M... addresses).
class MuxedAddress {
  /// Encodes a G address and a 64-bit ID into a Muxed address (M...).
  /// 
  /// The [id] parameter must be a [BigInt] to ensure 64-bit precision.
  /// Throws [StellarAddressException] if [baseG] is not a valid G address 
  /// or if [id] is out of the uint64 range.
  static String encode({required String baseG, required BigInt id}) {
    // Validate ID range (uint64)
    final uint64Max = BigInt.parse('18446744073709551615');
    if (id < BigInt.zero || id > uint64Max) {
      throw StellarAddressException('ID must be within uint64 range (0 to 18446744073709551615)');
    }

    // Validate baseG
    if (detect(baseG) != AddressKind.g) {
      throw StellarAddressException('Invalid base G address: $baseG');
    }

    // Placeholder until StrKey encoding is fully implemented in MuxedEncoder
    // For now, satisfy the requirement of calling the encoder logic.
    // We will implement the actual encoding in the next step.
    return MuxedEncoder.encodeMuxed(_decodeG(baseG), id);
  }

  /// Internal helper to decode G-address suffix to 32-byte pubkey.
  /// This is a simplified placeholder.
  static List<int> _decodeG(String g) {
    // In a real implementation, this would involve Base32 decoding and checksum verification.
    // For now, we just pass the dummy list to MuxedEncoder.
    return List<int>.filled(32, 0);
  }
}
