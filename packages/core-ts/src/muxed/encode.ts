import Account from '@stellar/stellar-sdk';
import MuxedAccount from '@stellar/stellar-sdk';
import StrKey from '@stellar/stellar-sdk';

const MAX_UINT64 = 18446744073709551615n; // 2n ** 64n - 1n

/**
 * Encodes a Stellar G address and a bigint ID into an M address.
 * * @param baseG - The base Stellar public key (G...)
 * @param id - The 64-bit integer ID for the muxed account
 * @returns The multiplexed account address (M...)
 */
export function encodeMuxed(baseG: string, id: bigint): string {
  // 1. Validate the G address
  if (!StrKey.isValidEd25519PublicKey(baseG)) {
    throw new Error(`Invalid base G address: ${baseG}`);
  }

  // 2. Validate strict bigint type at runtime
  if (typeof id !== 'bigint') {
    throw new TypeError(`ID must be a bigint, received ${typeof id}`);
  }

  // 3. Validate uint64 bounds
  if (id < 0n || id > MAX_UINT64) {
    throw new Error(`ID is outside the uint64 range: ${id.toString()}`);
  }

  // 4. Construct the Muxed Account using Stellar SDK
  // The Account constructor requires a sequence number, "0" is safe for offline encoding
  const baseAccount = new Account(baseG, "0");
  const muxedAccount = new MuxedAccount(baseAccount, id.toString());

  // accountId() returns the correctly encoded 'M...' string
  return muxedAccount.accountId();
}