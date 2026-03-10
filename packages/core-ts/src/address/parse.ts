import { decodeMuxed } from "../muxed/decode";
import { detect } from "./detect";
import { AddressParseError } from "./errors";
import type { Address } from "./types";

export function parse(address: string): Address {
  const up = address.toUpperCase();
  const kind = detect(up);

  if (kind === "invalid") {
    // Check if it's likely a checksum error or unknown prefix
    const first = up[0];
    if (first === "G" || first === "M" || first === "C") {
      throw new AddressParseError(
        "INVALID_CHECKSUM",
        address,
        "Invalid address checksum",
      );
    }
    throw new AddressParseError("UNKNOWN_PREFIX", address, "Invalid address");
  }

  switch (kind) {
    case "G":
      return { kind: "G", address: up };
    case "C":
      return { kind: "C", address: up };
    case "M": {
      const decoded = decodeMuxed(up);
      return {
        kind: "M",
        address: up,
        baseG: decoded.baseG,
        muxedId: BigInt(decoded.id),
      };
    }
  }
}
