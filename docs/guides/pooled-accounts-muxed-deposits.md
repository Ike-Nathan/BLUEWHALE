# Supporting Pooled Accounts with Muxed Deposits

This guide covers the transition from memo-based deposit routing to muxed account routing (CAP-0027).

## The Muxed Advantage

Muxed accounts (M-addresses) allow you to identify sub-accounts without relying on the memo field. This reduces routing failures caused by missing or incorrect memos.

## Integration Flow

When using the `stellar-address-kit`, your integration layer becomes simpler:

```typescript
import { extractRouting } from "stellar-address-kit";

const result = extractRouting({
  destination: payment.destination,
  memoType: tx.memo.type,
  memoValue: tx.memo.value ?? null,
  sourceAccount: tx.source ?? null,
});

if (result.routingSource === "muxed") {
  // Deposit routed via the M-address ID.
  creditAccount(result.destinationBaseAccount, result.routingId);
}
```

## Before vs After

### Before (Memo-only)

1. Check if destination is your base G-address.
2. Check if memo is present and correct type.
3. Parse memo string manually.

### After (With `stellar-address-kit`)

1. Call `extractRouting(input)`.
2. Check `result.routingSource` (can be `muxed` or `memo`).
3. If `none`, flag for review.
