// packages/core-ts/src/muxed/encode.test.ts
import { describe, it, expect } from 'vitest';
import { encodeMuxed } from './encode';
import vectors from '../../../../spec/vectors.json'; 

describe('encodeMuxed', () => {
  
  // 1. Vector Testing based on actual vectors.json structure
  it('passes all muxed_encode vectors from vectors.json', () => {
    const muxedCases = vectors.cases.filter((c: any) => c.module === 'muxed_encode');

    muxedCases.forEach((testCase: any) => {
      const { gAddress, id } = testCase.input;

      if (testCase.expected.error) {
         expect(() => {
           encodeMuxed(gAddress, BigInt(id));
         }).toThrow();
      } 
      else {
         const result = encodeMuxed(gAddress, BigInt(id));
         expect(result).toBe(testCase.expected.mAddress); 
      }
    });
  });

  // 2. Validation: Invalid G Address
  it('throws if baseG is not a valid G address', () => {
    expect(() => {
      encodeMuxed('INVALID_G_ADDRESS', 123n);
    }).toThrow('Invalid base G address');
  });

  // 3. Validation: Outside uint64 range
  it('throws if id is outside the uint64 range (negative)', () => {
    expect(() => {
      encodeMuxed('GA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVWH4', -1n);
    }).toThrow('ID is outside the uint64 range');
  });

  it('throws if id is outside the uint64 range (exceeds max)', () => {
    const MAX_UINT64 = 18446744073709551615n;
    expect(() => {
      encodeMuxed('GA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVWH4', MAX_UINT64 + 1n);
    }).toThrow('ID is outside the uint64 range');
  });

  // 4. Validation: Strict Type Checking
  it('throws if id is passed as a number instead of bigint', () => {
    expect(() => {
      // @ts-expect-error - Testing runtime validation
      encodeMuxed('GA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVWH4', 123);
    }).toThrow('ID must be a bigint');
  });

});