import { Transaction } from '@stellar/stellar-sdk';

declare function detect(address: string): "G" | "M" | "C" | "invalid";

declare function validate(address: string, options?: {
    strict?: boolean;
}): boolean;

type ErrorCode = "INVALID_CHECKSUM" | "INVALID_LENGTH" | "INVALID_BASE32" | "REJECTED_SEED_KEY" | "REJECTED_PREAUTH" | "REJECTED_HASH_X" | "FEDERATION_ADDRESS_NOT_SUPPORTED" | "UNKNOWN_PREFIX";
type WarningCode = "NON_CANONICAL_ADDRESS" | "NON_CANONICAL_ROUTING_ID" | "MEMO_IGNORED_FOR_MUXED" | "MEMO_PRESENT_WITH_MUXED" | "CONTRACT_SENDER_DETECTED" | "MEMO_TEXT_UNROUTABLE" | "MEMO_ID_INVALID_FORMAT" | "UNSUPPORTED_MEMO_TYPE" | "INVALID_DESTINATION";
type Warning = {
    code: "NON_CANONICAL_ADDRESS" | "NON_CANONICAL_ROUTING_ID";
    severity: "warn";
    message: string;
    normalization: {
        original: string;
        normalized: string;
    };
} | {
    code: "INVALID_DESTINATION";
    severity: "error";
    message: string;
    context: {
        destinationKind: "C";
    };
} | {
    code: "UNSUPPORTED_MEMO_TYPE";
    severity: "warn";
    message: string;
    context: {
        memoType: "hash" | "return" | "unknown";
    };
} | {
    code: Exclude<WarningCode, "NON_CANONICAL_ADDRESS" | "NON_CANONICAL_ROUTING_ID" | "INVALID_DESTINATION" | "UNSUPPORTED_MEMO_TYPE">;
    severity: "info" | "warn" | "error";
    message: string;
};
type ParseResult = {
    kind: "G" | "M" | "C";
    address: string;
    warnings: Warning[];
} | {
    kind: "invalid";
    error: {
        code: ErrorCode;
        input: string;
        message: string;
    };
};

declare function parse(address: string): ParseResult;

declare function encodeMuxed(baseG: string, id: string): string;

declare function decodeMuxed(mAddress: string): {
    baseG: string;
    id: string;
};

type RoutingInput = {
    destination: string;
    memoType: string;
    memoValue: string | null;
    sourceAccount: string | null;
};
type KnownMemoType = "none" | "id" | "text" | "hash" | "return";
type RoutingResult = {
    destinationBaseAccount: string | null;
    routingId: string | null;
    routingSource: "muxed" | "memo" | "none";
    warnings: Warning[];
    destinationError?: {
        code: ErrorCode;
        message: string;
    };
};
/**
 * Ergonomic helper for TypeScript callers to get a BigInt from the routingId string.
 */
declare function routingIdAsBigInt(routingId: string | null): bigint | null;

declare function extractRouting(input: RoutingInput): RoutingResult;

declare function extractRoutingFromTx(tx: Transaction): RoutingResult | null;

type NormalizeResult = {
    normalized: string | null;
    warnings: Warning[];
};
/**
 * Normalizes a potential routing ID from MEMO_TEXT or MEMO_ID.
 *
 * Rules:
 * 1. Whitespace: not trimmed. " 42 " -> unroutable.
 * 2. Empty string -> unroutable.
 * 3. Any non-digit character (-, ., e, space) -> unroutable.
 * 4. All digits. Strip leading zeros -> canonical form.
 * 5. Canonical form exceeds uint64 max -> unroutable.
 */
declare function normalizeMemoTextId(s: string): NormalizeResult;

export { type ErrorCode, type KnownMemoType, type NormalizeResult, type ParseResult, type RoutingInput, type RoutingResult, type Warning, type WarningCode, decodeMuxed, detect, encodeMuxed, extractRouting, extractRoutingFromTx, normalizeMemoTextId, parse, routingIdAsBigInt, validate };
