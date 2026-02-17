# Migrating from Memo IDs to Muxed IDs

This guide outlines the strategy for moving your exchange or wallet from a memo-based routing system to muxed accounts (M-addresses).

## Strategy 1: The "Accept Both" Phase (Recommended)

During the migration period, your system should accept both routing methods. The `stellar-address-kit` makes this trivial by abstracting the source.

```typescript
const result = extractRouting(input);

// result.routingId is the decimal string regardless of source
// result.routingSource identifies if it was 'muxed' or 'memo'
```

## Database Schema Implications

Muxed IDs are 64-bit unsigned integers. Ensure your database column can store these (e.g., `BIGINT UNSIGNED` in MySQL, `numeric` or `bigint` in PostgreSQL).

## Cutover Steps

1. **Update SDK**: Ensure your Stellar SDK supports M-addresses.
2. **Library Integration**: Integrate `stellar-address-kit`.
3. **Internal Exposure**: Start exposing M-addresses to users as their deposit address.
4. **Monitoring**: Watch for `MEMO_PRESENT_WITH_MUXED` warnings—these indicate senders using both forms simultaneously.
