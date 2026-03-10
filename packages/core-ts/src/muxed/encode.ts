import { Account, MuxedAccount, StrKey } from "@stellar/stellar-sdk";

const MAX_UINT64 = 18446744073709551615n;

export function encodeMuxed(baseG: string, id: bigint): string {
  if (typeof id !== "bigint") {
    throw new TypeError(`ID must be a bigint, received ${typeof id}`);
  }

  if (!StrKey.isValidEd25519PublicKey(baseG)) {
    throw new Error(`Invalid base G address: ${baseG}`);
  }

  if (id < 0n || id > MAX_UINT64) {
    throw new Error(`ID is outside the uint64 range: ${id.toString()}`);
  }

  const baseAccount = new Account(baseG, "0");
  const muxedAccount = new MuxedAccount(baseAccount, id.toString());

  return muxedAccount.accountId();
}
