import { ErrorCode, Warning, WarningCode, WarningSeverity } from "../address/types";

export type RoutingSource = "muxed" | "memo" | "none";

export type RoutingInput = {
  destination: string;
  memoType: string;
  memoValue: string | null;
  sourceAccount: string | null;
  /**
   * Minimum severity level for warnings to include in the result.
   * Warnings below this threshold are filtered out.
   * Defaults to `'info'` (all warnings are returned).
   */
  minSeverityLevel?: WarningSeverity;
};

export type KnownMemoType = "none" | "id" | "text" | "hash" | "return";

import { SafeRoutingId } from "./safeRoutingId";

export type RoutingResult = {
  destinationBaseAccount: string | null;
  routingId: string | bigint | SafeRoutingId | null;
  routingSource: RoutingSource;
  warnings: Warning[]; // WarningCode only, always
  destinationError?: {
    code: ErrorCode;
    message: string;
  };
};

export type MemoRequirementFetcher = (baseAccount: string) => Promise<boolean>;

export function routingIdAsBigInt(
  routingId: string | bigint | SafeRoutingId | null
): bigint | null {
  if (routingId === null) {
    return null;
  }

  if (routingId instanceof SafeRoutingId) {
    return routingId.toBigInt();
  }

  return typeof routingId === "bigint" ? routingId : BigInt(routingId);
}
export { SafeRoutingId };
