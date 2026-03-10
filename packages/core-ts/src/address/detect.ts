import { StrKey } from "@stellar/stellar-sdk";

const BASE32_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

function decodeBase32(input: string): Uint8Array {
  const s = input.toUpperCase().replace(/=+$/, "");
  const byteCount = Math.floor((s.length * 5) / 8);
  const result = new Uint8Array(byteCount);
  let buffer = 0;
  let bitsLeft = 0;
  let byteIndex = 0;
  for (const ch of s) {
    const value = BASE32_CHARS.indexOf(ch);
    if (value === -1) throw new Error(`Invalid base32 character: ${ch}`);
    buffer = (buffer << 5) | value;
    bitsLeft += 5;
    if (bitsLeft >= 8) {
      if (byteIndex < byteCount) {
        result[byteIndex++] = (buffer >> (bitsLeft - 8)) & 0xff;
      }
      bitsLeft -= 8;
    }
  }
  return result;
}

function crc16(bytes: Uint8Array): number {
  let crc = 0;
  for (const byte of bytes) {
    crc ^= byte << 8;
    for (let i = 0; i < 8; i++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
    }
  }
  return crc & 0xffff;
}

function isValidStrKey(address: string): boolean {
  try {
    const decoded = decodeBase32(address);
    if (decoded.length < 3) return false;
    const data = decoded.slice(0, decoded.length - 2);
    const checksum =
      decoded[decoded.length - 2] | (decoded[decoded.length - 1] << 8);
    const computed = crc16(data);
    return computed === checksum;
  } catch {
    return false;
  }
}

export function detect(address: string): "G" | "M" | "C" | "invalid" {
  if (!address) return "invalid";
  const up = address.toUpperCase();

  if (!isValidStrKey(up)) return "invalid";

  const prefix = up[0];
  switch (prefix) {
    case "G":
      return "G";
    case "M":
      return "M";
    case "C":
      return "C";
    default:
      return "invalid";
  }
}
