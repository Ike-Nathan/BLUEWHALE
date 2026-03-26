import { Warning } from "../address/types";

export type RoutingInput = {
  destination: string;
  memoType: string;
  memoValue: string | null;
  sourceAccount: string | null;
};

export type KnownMemoType = "none" | "id" | "text" | "hash" | "return";

export type RoutingSource = "muxed" | "memo" | "none";

export interface RoutingResult {
  source: RoutingSource;
  id?: bigint;
  warnings: Warning[];
}

/**
 * Ergonomic helper for TypeScript callers to get a BigInt from the routingId string.
 */
export function routingIdAsBigInt(routingId: string | null): bigint | null {
  return routingId ? BigInt(routingId) : null;
}
