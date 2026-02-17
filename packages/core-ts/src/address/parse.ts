import { detect } from "./detect";
import { ErrorCode, ParseResult } from "./types";

export function parse(address: string): ParseResult {
  const kind = detect(address);
  if (kind === "invalid") {
    return {
      kind: "invalid",
      error: {
        code: "UNKNOWN_PREFIX" as ErrorCode,
        input: address,
        message: "Invalid address",
      },
    };
  }

  const warnings = [];
  if (address !== address.toUpperCase()) {
    warnings.push({
      code: "NON_CANONICAL_ADDRESS" as const,
      severity: "warn" as const,
      message: "Address normalized to uppercase",
      normalization: { original: address, normalized: address.toUpperCase() },
    });
  }

  return { kind, address: address.toUpperCase(), warnings };
}
