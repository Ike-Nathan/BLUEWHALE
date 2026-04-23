import { ErrorCode, Warning, WarningCode } from "../address/types";

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
  routingId: string | bigint | null;
  routingSource: RoutingSource;
  warnings: Warning[]; // WarningCode only, always
  destinationError?: {
    code: ErrorCode;
    message: string;
  };
};

export function routingIdAsBigInt(
  routingId: string | bigint | null
): bigint | null {
  if (routingId === null) {
    return null;
  }

  return typeof routingId === "bigint" ? routingId : BigInt(routingId);
}