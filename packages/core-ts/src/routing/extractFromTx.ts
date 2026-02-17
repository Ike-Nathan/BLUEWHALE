import { Transaction } from "@stellar/stellar-sdk";
import { RoutingResult } from "./types";
import { extractRouting } from "./extract";

export function extractRoutingFromTx(tx: Transaction): RoutingResult | null {
  const op = tx.operations[0];
  if (!op || op.type !== "payment") return null;

  return extractRouting({
    destination: op.destination,
    memoType: tx.memo.type,
    memoValue: tx.memo.value?.toString() ?? null,
    sourceAccount: tx.source ?? null,
  });
}
