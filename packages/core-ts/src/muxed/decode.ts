import { StrKey } from "@stellar/stellar-sdk";

export function decodeMuxed(mAddress: string): { baseG: string; id: string } {
  const decoded = StrKey.decodeMed25519PublicKey(mAddress);
  const ed25519 = decoded.subarray(0, 32);
  const idBytes = decoded.subarray(32, 40);

  // Convert 8 bytes to big-endian uint64 string
  let id = 0n;
  for (const byte of idBytes) {
    id = (id << 8n) + BigInt(byte);
  }

  return {
    baseG: StrKey.encodeEd25519PublicKey(ed25519),
    id: id.toString(),
  };
}
