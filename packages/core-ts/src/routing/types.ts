import { ErrorCode, Warning } from "../address/types";

export type RoutingSource = "muxed" | "memo" | "none";

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
  routingSource: RoutingSource;
  warnings: Warning[]; // WarningCode only, always
  destinationError?: {
    code: ErrorCode;
    message: string;
  };
};

export function routingIdAsBigInt(routingId: string | null): bigint | null {
  return routingId ? BigInt(routingId) : null;
}