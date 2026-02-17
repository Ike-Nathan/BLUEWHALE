# Compatibility Reference

| Scenario                      | `routingSource` | Warnings                          | Recommended Action           |
| ----------------------------- | --------------- | --------------------------------- | ---------------------------- |
| M address, no memo            | `muxed`         | —                                 | Route via muxed ID           |
| M address + routing memo      | `muxed`         | `MEMO_PRESENT_WITH_MUXED` (warn)  | Route muxed, log/investigate |
| G + `MEMO_ID`                 | `memo`          | —                                 | Route via memo ID            |
| G + `MEMO_TEXT` numeric       | `memo`          | —                                 | Route via parsed ID          |
| G + `MEMO_TEXT` leading zeros | `memo`          | `NON_CANONICAL_ROUTING_ID` (warn) | Route normalized, log        |
| G + `MEMO_TEXT` non-numeric   | `none`          | `MEMO_TEXT_UNROUTABLE` (warn)     | Manual review                |
| **C address as destination**  | `none`          | `INVALID_DESTINATION` (error)     | **REFUSE / ALERT**           |

## Glossary

- **G address**: Classic Stellar account address (e.g., `GA7...`).
- **M address**: Muxed account address (e.g., `MA7...`).
- **C address**: Soroban contract address (e.g., `CA7...`).
- **routingSource**: How the ID was found (`muxed`, `memo`, or `none`).
- **ErrorCode**: Fatal parsing error (e.g., `INVALID_CHECKSUM`).
- **WarningCode**: Operational signal (e.g., `NON_CANONICAL_ADDRESS`).
