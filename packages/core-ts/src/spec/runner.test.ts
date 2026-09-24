import { describe, it, expect } from "vitest";
import { vectors } from "@redishfish/bluewhale-spec";
import {
  detect,
  encodeMuxed,
  decodeMuxed,
  extractRouting,
  extractRoutingFromURI,
} from "../index";
import { ExtractRoutingError } from "../routing/extract";

function normalizeRoutingId(value: any): string | null {
  if (value === null || value === undefined) return null;
  return typeof value === "bigint" ? value.toString() : String(value);
}

describe("Normative Vector Tests", () => {
  vectors.cases.forEach((c: any) => {
    it(`[${c.module}] ${c.description}`, () => {
      switch (c.module) {
        case "detect": {
          const kind = detect(c.input.address);
          expect(kind).toBe(c.expected.kind);
          break;
        }
        case "muxed_encode": {
          const baseG = c.input.base_g ?? c.input.gAddress;
          const mAddress = encodeMuxed(baseG, BigInt(c.input.id));
          expect(mAddress).toBe(c.expected.mAddress);
          break;
        }
        case "muxed_decode": {
          if (c.expected.expected_error) {
            expect(() => decodeMuxed(c.input.mAddress)).toThrow();
          } else {
            const result = decodeMuxed(c.input.mAddress);
            expect(result.baseG).toBe(c.expected.base_g);
            expect(result.id).toBe(BigInt(c.expected.id));
          }
          break;
        }
        case "extract_routing": {
          const input = c.input as any;
          const routingInput = {
            destination: input.destination,
            memoType: input.memoType,
            memoValue: input.memoValue || null,
            sourceAccount: input.sourceAccount || null,
          };
          if (routingInput.destination.startsWith("C")) {
            expect(() => extractRouting(routingInput)).toThrow(ExtractRoutingError);
            break;
          }

          const result = extractRouting(routingInput);
          expect(result.destinationBaseAccount).toBe(
            c.expected.destinationBaseAccount
          );
          expect(normalizeRoutingId(result.routingId)).toBe(
            normalizeRoutingId(c.expected.routingId)
          );
          expect(result.routingSource).toBe(c.expected.routingSource);
          expect(result.warnings).toEqual(c.expected.warnings);
          break;
        }
        case "extract_from_uri": {
          const result = extractRoutingFromURI(c.input.uri);
          expect(result.success).toBe(c.expected.success);
          if (c.expected.success && result.success) {
            expect(result.routing.destinationBaseAccount).toBe(
              normalizeExpectedBaseAccount(c.expected.routing.destinationBaseAccount)
            );
            expect(normalizeRoutingId(result.routing.routingId)).toBe(
              normalizeRoutingId(c.expected.routing.routingId)
            );
            expect(result.routing.routingSource).toBe(c.expected.routing.routingSource);
            expect(result.routing.warnings).toEqual(c.expected.routing.warnings);
          } else if (!c.expected.success && !result.success) {
            expect(result.code).toBe(c.expected.code);
          }
          break;
        }
      }
    });
  });
});
