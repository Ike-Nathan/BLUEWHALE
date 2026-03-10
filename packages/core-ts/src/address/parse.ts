import { decodeMuxed } from "../muxed/decode";
import { detect } from "./detect";
import { AddressParseError } from "./errors";
import type { Address } from "./types";

export function parse(address: string): Address {
  const kind = detect(address);

  if (kind === "invalid") {
    throw new AddressParseError("UNKNOWN_PREFIX", address, "Invalid address");
  }

  const up = address.toUpperCase();

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
