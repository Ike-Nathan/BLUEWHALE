# @redishfish/bluewhale-core (TypeScript)

The TypeScript reference implementation of the Bluewhale for secure deposit routing and address interop.

```bash
npm install @redishfish/bluewhale-core
```

Part of a multi-language suite also available in **[Go](https://github.com/REDISHFISH/BLUEWHALE/tree/main/packages/core-go)** and **[Dart](https://github.com/REDISHFISH/BLUEWHALE/tree/main/packages/core-dart)**.

---

### 📖 Documentation & Guides
- [TypeScript: Reconciling Deposits with Missing Memos](https://github.com/REDISHFISH/BLUEWHALE/blob/main/docs/guides/reconciling-deposits-missing-memo.md)
- [TypeScript: Pooled Accounts & Muxed Deposits](https://github.com/REDISHFISH/BLUEWHALE/blob/main/docs/guides/pooled-accounts-muxed-deposits.md)
- [General: Compatibility Reference](https://github.com/REDISHFISH/BLUEWHALE/blob/main/docs/guides/compatibility-reference.md)

---

## Quick Start

```typescript
import { extractRouting } from '@redishfish/bluewhale-core';

const result = extractRouting({
  destination: 'MA7QYNF7SOWQ3GLR2B6RS22TBGZAOR6KLYH4PA5ZAM73A3H4K2HZZSQUVRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRTD6',
  memoType: 'none',
  memoValue: null,
  sourceAccount: 'GA...'
});

if (!result.destinationError) {
  console.log('Routing ID:', result.routingId); // "123456789"
  console.log('Source:', result.routingSource); // "muxed"
}
```

## Documentation

For full guides, integration examples, and deep dives into the routing logic, see our [comprehensive Guides](https://github.com/REDISHFISH/BLUEWHALE/tree/main/docs/guides).

## License

MIT
