import { describe, it, expect } from "vitest";
import { parse } from "./parse";
import { AddressParseError } from "./types";

describe("parse", () => {
  describe("G addresses", () => {
    it("should parse a valid G address", () => {
      const address = "GBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFSHONUCEOASW7QC7OX2H";
      const result = parse(address);
      
      expect(result.kind).toBe("G");
      expect(result.address).toBe(address);
      expect(result.baseG).toBeUndefined();
      expect(result.muxedId).toBeUndefined();
    });

    it("should normalize lowercase G address to uppercase", () => {
      const address = "gbrpyhil2ci3fnq4bxlfmndlfjunpu2hy3zmfshonuceoasw7qc7ox2h";
      const result = parse(address);
      
      expect(result.kind).toBe("G");
      expect(result.address).toBe(address.toUpperCase());
    });

    it("should parse a valid G address with mixed case", () => {
      const address = "GbRpYhIl2Ci3FnQ4BxLfMnDlFjUnPu2Hy3ZmFsHoNuCeOaSw7Qc7Ox2H";
      const result = parse(address);
      
      expect(result.kind).toBe("G");
      expect(result.address).toBe(address.toUpperCase());
    });
  });

  describe("M addresses", () => {
    it("should parse a valid M address and decode baseG and muxedId", () => {
      const mAddress = "MAAAAAAAAAAAAAB7BQ2L7E5NBWMXDUCMZSIPOBKRDSBYVLMXGSSKF6YNPIB7Y77ITKNOG";
      const result = parse(mAddress);
      
      expect(result.kind).toBe("M");
      expect(result.address).toBe(mAddress);
      expect(result.baseG).toBe("GBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFSHONUCEOASW7QC7OX2H");
      expect(result.muxedId).toBe(123n);
    });

    it("should parse M address with muxedId as bigint", () => {
      const mAddress = "MAAAAAAAAAAAAAB7BQ2L7E5NBWMXDUCMZSIPOBKRDSBYVLMXGSSKF6YNPIB7Y77ITKNOG";
      const result = parse(mAddress);
      
      expect(typeof result.muxedId).toBe("bigint");
      expect(result.muxedId).toBe(123n);
    });

    it("should parse M address with large muxedId (2^53+1 canary)", () => {
      const mAddress = "MAAAAAAAAH4XQORSAAAAAAAAAAAAB7BQ2L7E5NBWMXDUCMZSIPOBKRDSBYVLMXGSSKF6YNPIB7Y77ITKNOG";
      const result = parse(mAddress);
      
      expect(result.kind).toBe("M");
      expect(result.muxedId).toBe(9007199254740993n);
      expect(result.baseG).toBe("GBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFSHONUCEOASW7QC7OX2H");
    });

    it("should parse M address with max uint64 muxedId", () => {
      const mAddress = "MAAAAAAAP////////////////////7BQ2L7E5NBWMXDUCMZSIPOBKRDSBYVLMXGSSKF6YNPIB7Y77ITKNOG";
      const result = parse(mAddress);
      
      expect(result.kind).toBe("M");
      expect(result.muxedId).toBe(18446744073709551615n);
      expect(result.baseG).toBe("GBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFSHONUCEOASW7QC7OX2H");
    });

    it("should normalize lowercase M address to uppercase", () => {
      const mAddress = "maaaaaaaaaaaaab7bq2l7e5nbwmxducmzsipobkrdsbyvlmxgsskf6ynpib7y77itknog";
      const result = parse(mAddress);
      
      expect(result.kind).toBe("M");
      expect(result.address).toBe(mAddress.toUpperCase());
      expect(result.baseG).toBeDefined();
      expect(result.muxedId).toBeDefined();
    });

    it("should parse M address with muxedId of 0", () => {
      const mAddress = "MAAAAAAAAAAAAAAAB7BQ2L7E5NBWMXDUCMZSIPOBKRDSBYVLMXGSSKF6YNPIB7Y77ITKNOG";
      const result = parse(mAddress);
      
      expect(result.kind).toBe("M");
      expect(result.muxedId).toBe(0n);
      expect(result.baseG).toBe("GBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFSHONUCEOASW7QC7OX2H");
    });
  });

  describe("C addresses", () => {
    it("should parse a valid C address", () => {
      const address = "CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD2KM";
      const result = parse(address);
      
      expect(result.kind).toBe("C");
      expect(result.address).toBe(address);
      expect(result.baseG).toBeUndefined();
      expect(result.muxedId).toBeUndefined();
    });

    it("should normalize lowercase C address to uppercase", () => {
      const address = "caaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaad2km";
      const result = parse(address);
      
      expect(result.kind).toBe("C");
      expect(result.address).toBe(address.toUpperCase());
    });
  });

  describe("error cases", () => {
    it("should throw AddressParseError for invalid address with unknown prefix", () => {
      const invalidAddress = "INVALID_ADDRESS";
      
      expect(() => parse(invalidAddress)).toThrow(AddressParseError);
      
      try {
        parse(invalidAddress);
      } catch (error) {
        expect(error).toBeInstanceOf(AddressParseError);
        expect((error as AddressParseError).code).toBe("UNKNOWN_PREFIX");
        expect((error as AddressParseError).input).toBe(invalidAddress);
        expect((error as AddressParseError).message).toBe("Invalid address");
      }
    });

    it("should throw AddressParseError for seed key (S prefix)", () => {
      const seedKey = "SBZVMB74W5CWLWHLMIUBJD3JXWQGBU4QSI6YZFG5CKJLQX5YFZZXCVQN";
      
      expect(() => parse(seedKey)).toThrow(AddressParseError);
      
      try {
        parse(seedKey);
      } catch (error) {
        expect(error).toBeInstanceOf(AddressParseError);
        expect((error as AddressParseError).code).toBe("UNKNOWN_PREFIX");
      }
    });

    it("should throw AddressParseError for federation address", () => {
      const fedAddress = "alice*stellar.org";
      
      expect(() => parse(fedAddress)).toThrow(AddressParseError);
      
      try {
        parse(fedAddress);
      } catch (error) {
        expect(error).toBeInstanceOf(AddressParseError);
        expect((error as AddressParseError).code).toBe("UNKNOWN_PREFIX");
      }
    });

    it("should throw AddressParseError for empty string", () => {
      expect(() => parse("")).toThrow(AddressParseError);
      
      try {
        parse("");
      } catch (error) {
        expect(error).toBeInstanceOf(AddressParseError);
        expect((error as AddressParseError).code).toBe("UNKNOWN_PREFIX");
      }
    });

    it("should throw AddressParseError for G address with invalid checksum", () => {
      const invalidChecksum = "GBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFSHONUCEOASW7QC7OX2X";
      
      expect(() => parse(invalidChecksum)).toThrow(AddressParseError);
      
      try {
        parse(invalidChecksum);
      } catch (error) {
        expect(error).toBeInstanceOf(AddressParseError);
        expect((error as AddressParseError).code).toBe("INVALID_CHECKSUM");
        expect((error as AddressParseError).input).toBe(invalidChecksum);
      }
    });

    it("should throw AddressParseError for random string", () => {
      const randomString = "not_an_address_at_all";
      
      expect(() => parse(randomString)).toThrow(AddressParseError);
    });

    it("should have correct error name", () => {
      try {
        parse("INVALID");
      } catch (error) {
        expect((error as AddressParseError).name).toBe("AddressParseError");
      }
    });
  });

  describe("edge cases", () => {
    it("should handle address with whitespace by throwing error", () => {
      const addressWithSpace = " GBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFSHONUCEOASW7QC7OX2H ";
      
      expect(() => parse(addressWithSpace)).toThrow(AddressParseError);
    });

    it("should handle very short string", () => {
      expect(() => parse("G")).toThrow(AddressParseError);
    });

    it("should handle string with correct length but wrong prefix", () => {
      expect(() => parse("X".repeat(56))).toThrow(AddressParseError);
    });
  });
});
