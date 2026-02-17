import { ErrorCode, Warning } from "../address/types";

export type RoutingInput = {
  destination: string;
  memoType: string;
  memoValue: string | null;
  sourceAccount: string | null;
};

export type KnownMemoType = "none" | "id" | "text" | "hash" | "return";

export type RoutingResult = {
  destinationBaseAccount: string | null;
  routingId: string | null; // decimal uint64 string — spec level
  routingSource: "muxed" | "memo" | "none";
  warnings: Warning[]; // WarningCode only, always
  destinationError?: {
    // ErrorCode only, when destination unparseable
    code: ErrorCode;
    message: string;
  };
};

/**
 * Ergonomic helper for TypeScript callers to get a BigInt from the routingId string.
 */
export function routingIdAsBigInt(routingId: string | null): bigint | null {
  return routingId ? BigInt(routingId) : null;
}
