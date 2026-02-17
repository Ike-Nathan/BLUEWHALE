"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  decodeMuxed: () => decodeMuxed,
  detect: () => detect,
  encodeMuxed: () => encodeMuxed,
  extractRouting: () => extractRouting,
  extractRoutingFromTx: () => extractRoutingFromTx,
  normalizeMemoTextId: () => normalizeMemoTextId,
  parse: () => parse,
  routingIdAsBigInt: () => routingIdAsBigInt,
  validate: () => validate
});
module.exports = __toCommonJS(index_exports);

// src/address/detect.ts
var import_stellar_sdk = require("@stellar/stellar-sdk");
function detect(address) {
  if (import_stellar_sdk.StrKey.isValidEd25519PublicKey(address)) return "G";
  if (import_stellar_sdk.StrKey.isValidMed25519PublicKey(address)) return "M";
  if (import_stellar_sdk.StrKey.isValidContract(address)) return "C";
  return "invalid";
}

// src/address/validate.ts
function validate(address, options) {
  const kind = detect(address);
  if (kind === "invalid") return false;
  if (options?.strict && address !== address.toUpperCase()) return false;
  return true;
}

// src/address/parse.ts
function parse(address) {
  const kind = detect(address);
  if (kind === "invalid") {
    return {
      kind: "invalid",
      error: {
        code: "UNKNOWN_PREFIX",
        input: address,
        message: "Invalid address"
      }
    };
  }
  const warnings = [];
  if (address !== address.toUpperCase()) {
    warnings.push({
      code: "NON_CANONICAL_ADDRESS",
      severity: "warn",
      message: "Address normalized to uppercase",
      normalization: { original: address, normalized: address.toUpperCase() }
    });
  }
  return { kind, address: address.toUpperCase(), warnings };
}

// src/muxed/encode.ts
var import_stellar_sdk2 = require("@stellar/stellar-sdk");
function encodeMuxed(baseG, id) {
  const pubkey = import_stellar_sdk2.StrKey.decodeEd25519PublicKey(baseG);
  const payload = Buffer.alloc(32 + 8);
  payload.set(pubkey, 0);
  let idBig = BigInt(id);
  for (let i = 7; i >= 0; i--) {
    payload[32 + i] = Number(idBig & 0xffn);
    idBig >>= 8n;
  }
  return import_stellar_sdk2.StrKey.encodeMed25519PublicKey(payload);
}

// src/muxed/decode.ts
var import_stellar_sdk3 = require("@stellar/stellar-sdk");
function decodeMuxed(mAddress) {
  const decoded = import_stellar_sdk3.StrKey.decodeMed25519PublicKey(mAddress);
  const ed25519 = decoded.subarray(0, 32);
  const idBytes = decoded.subarray(32, 40);
  let id = 0n;
  for (const byte of idBytes) {
    id = (id << 8n) + BigInt(byte);
  }
  return {
    baseG: import_stellar_sdk3.StrKey.encodeEd25519PublicKey(ed25519),
    id: id.toString()
  };
}

// src/routing/extract.ts
function extractRouting(input) {
  const parsed = parse(input.destination);
  if (parsed.kind === "invalid") {
    return {
      destinationBaseAccount: null,
      routingId: null,
      routingSource: "none",
      warnings: [],
      destinationError: {
        code: parsed.error.code,
        message: parsed.error.message
      }
    };
  }
  if (parsed.kind === "C") {
    return {
      destinationBaseAccount: null,
      routingId: null,
      routingSource: "none",
      warnings: [
        {
          code: "INVALID_DESTINATION",
          severity: "error",
          message: "C address is not a valid destination",
          context: { destinationKind: "C" }
        }
      ]
    };
  }
  if (parsed.kind === "M") {
    const { baseG, id } = decodeMuxed(parsed.address);
    return {
      destinationBaseAccount: baseG,
      routingId: id,
      routingSource: "muxed",
      warnings: parsed.warnings
    };
  }
  return {
    destinationBaseAccount: parsed.address,
    routingId: null,
    routingSource: "none",
    warnings: parsed.warnings
  };
}

// src/routing/extractFromTx.ts
function extractRoutingFromTx(tx) {
  const op = tx.operations[0];
  if (!op || op.type !== "payment") return null;
  return extractRouting({
    destination: op.destination,
    memoType: tx.memo.type,
    memoValue: tx.memo.value?.toString() ?? null,
    sourceAccount: tx.source ?? null
  });
}

// src/routing/types.ts
function routingIdAsBigInt(routingId) {
  return routingId ? BigInt(routingId) : null;
}

// src/routing/memo.ts
var UINT64_MAX = BigInt("18446744073709551615");
function normalizeMemoTextId(s) {
  const warnings = [];
  if (s.length === 0 || !/^\d+$/.test(s)) {
    return { normalized: null, warnings };
  }
  let normalized = s.replace(/^0+/, "");
  if (normalized === "") {
    normalized = "0";
  }
  if (normalized !== s) {
    warnings.push({
      code: "NON_CANONICAL_ROUTING_ID",
      severity: "warn",
      message: "Memo routing ID had leading zeros. Normalized to canonical decimal.",
      normalization: { original: s, normalized }
    });
  }
  try {
    const val = BigInt(normalized);
    if (val > UINT64_MAX) {
      return { normalized: null, warnings };
    }
  } catch {
    return { normalized: null, warnings };
  }
  return { normalized, warnings };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  decodeMuxed,
  detect,
  encodeMuxed,
  extractRouting,
  extractRoutingFromTx,
  normalizeMemoTextId,
  parse,
  routingIdAsBigInt,
  validate
});
