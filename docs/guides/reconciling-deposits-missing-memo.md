# Reconciling Deposits with Missing Memos

When a deposit arrives with no memo (or an unroutable memo), the `stellar-address-kit` provides operational signals via `WarningCode`.

## The Contract Sender Scenario

A common cause of "missing" memos is a deposit sent from a Soroban contract. Contracts often don't include memos in their internal payment logic.

The library detects this and emits:

- `CONTRACT_SENDER_DETECTED` (Severity: Info)
- `INVALID_DESTINATION` (Severity: Error) - if combined with a C-address destination.

## Operational Responses

| Warning Code               | Severity | Action                               |
| -------------------------- | -------- | ------------------------------------ |
| `MEMO_TEXT_UNROUTABLE`     | `warn`   | Move to manual review queue.         |
| `CONTRACT_SENDER_DETECTED` | `info`   | Informational: sender is a contract. |
| `INVALID_DESTINATION`      | `error`  | **IMMEDIATE ALARM**: Do not credit.  |

## Handling `INVALID_DESTINATION`

If `extractRouting` returns a warning with `severity: 'error'`, your systems should alert your operations team immediately. These are not "maybe" errors; they are definitive integration failures (e.g., someone trying to send a classic payment to a Soroban contract address).
