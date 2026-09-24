/**
 * isRoutableAddress() type-guard tests (issue #29).
 *
 * Mirrors the prefix rule enforced by assertRoutableAddress(): only G and M
 * Stellar addresses are valid routing targets.
 */
import { describe, it, expect } from "vitest";
// Imported from the package root on purpose: issue #29 requires the guard
// to be exposed from index, not just its defining module.
import { isRoutableAddress } from "../index";

const G_ADDRESS = "GAYCUYT553C5LHVE2XPW5GMEJT4BXGM7AHMJWLAPZP53KJO7EIQADRSI";

describe("isRoutableAddress", () => {
  it("accepts G-addresses", () => {
    expect(isRoutableAddress(G_ADDRESS)).toBe(true);
  });

  it("accepts M-addresses", () => {
    expect(
      isRoutableAddress(
        "MA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVSGI"
      )
    ).toBe(true);
  });

  it("is case-insensitive and trims whitespace", () => {
    expect(isRoutableAddress("  gaycuyt553c5lhve2xpw5gmejt4bxgm7ahmjwlapzp53kjo7eiqadrsi  ")).toBe(
      true
    );
  });

  it("rejects C-addresses and other prefixes", () => {
    expect(isRoutableAddress("CAYCUYT553C5LHVE2XPW5GMEJT4BXGM7AHMJWLAPZP53KJO7EIQADRSI")).toBe(
      false
    );
    expect(isRoutableAddress("SAYCUYT553C5LHVE2XPW5GMEJT4BXGM7AHMJWLAPZP53KJO7EIQADRSI")).toBe(
      false
    );
  });

  it("rejects empty strings and non-strings without throwing", () => {
    expect(isRoutableAddress("")).toBe(false);
    expect(isRoutableAddress("   ")).toBe(false);
    expect(isRoutableAddress(undefined)).toBe(false);
    expect(isRoutableAddress(null)).toBe(false);
    expect(isRoutableAddress(42)).toBe(false);
  });

  it("is exposed from the package root", () => {
    expect(typeof isRoutableAddress).toBe("function");
    expect(isRoutableAddress(G_ADDRESS)).toBe(true);
  });
});
