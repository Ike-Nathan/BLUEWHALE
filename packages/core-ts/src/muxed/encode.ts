import { StrKey } from "@stellar/stellar-sdk";

export function encodeMuxed(baseG: string, id: string): string {
  const pubkey = StrKey.decodeEd25519PublicKey(baseG);
  const payload = Buffer.alloc(32 + 8);

  // Use .set for compatibility between Buffer and Uint8Array
  payload.set(pubkey, 0);

  let idBig = BigInt(id);
  for (let i = 7; i >= 0; i--) {
    payload[32 + i] = Number(idBig & 0xffn);
    idBig >>= 8n;
  }

  return StrKey.encodeMed25519PublicKey(payload);
}
