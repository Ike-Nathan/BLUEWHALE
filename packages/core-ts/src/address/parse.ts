import { StrKey } from "@stellar/stellar-sdk";
import { detect } from "./detect";
import { validate } from "./validate";
import { Address, AddressParseError } from "./types";

export function parse(address: string): Address {
  const kind = detect(address);
  
  if (kind === "invalid") {
    throw new AddressParseError(
      "UNKNOWN_PREFIX",
      address,
      "Invalid address"
    );
  }

  if (!validate(address)) {
    throw new AddressParseError(
      "INVALID_CHECKSUM",
      address,
      "Address validation failed"
    );
  }

  const normalizedAddress = address.toUpperCase();

  if (kind === "M") {
    const decoded = StrKey.decodeMed25519PublicKey(normalizedAddress);
    const ed25519 = decoded.subarray(0, 32);
    const idBytes = decoded.subarray(32, 40);

    let muxedId = 0n;
    for (const byte of idBytes) {
      muxedId = (muxedId << 8n) + BigInt(byte);
    }

    const baseG = StrKey.encodeEd25519PublicKey(ed25519);

    return {
      kind,
      address: normalizedAddress,
      baseG,
      muxedId,
    };
  }

  return {
    kind,
    address: normalizedAddress,
  };
}
