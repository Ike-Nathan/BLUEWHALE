# rust-address-fuzzer

A coverage-guided fuzz tester for the [`prism-core`](../prism-core) Stellar address parser. It generates and mutates G, M, and C addresses, then exercises the parser looking for panics or correctness violations (e.g. a checksum-corrupted address that still parses as valid).

## Crate dependency

This crate depends on `prism-core` via a relative path:

```toml
prism-core = { path = "../prism-core" }
```

Both crates must be present together. The standard way to work with them is from the workspace root or from either crate directory — Cargo resolves the `../prism-core` path in both cases.

## Building

### From the workspace root (recommended)

```bash
# from repo root
cargo build -p rust-address-fuzzer
```

### From the crate directory

```bash
cd examples/rust-address-fuzzer
cargo build
```

### Release build (enables LTO)

```bash
cargo build --release -p rust-address-fuzzer
# or
cd examples/rust-address-fuzzer && cargo build --release
```

## Running

### Random mode – generate N mutated inputs

```bash
# 100 000 random mutations, reproducible seed
cargo run --release -p rust-address-fuzzer -- --random 100000 --seed 42

# from the crate directory
cd examples/rust-address-fuzzer
cargo run --release -- --random 100000 --seed 42
```

### Corpus mode – replay a saved input list

```bash
cargo run --release -p rust-address-fuzzer -- --corpus path/to/corpus.txt
```

### stdin mode – pipe inputs directly

```bash
echo "GABC..." | cargo run --release -p rust-address-fuzzer -- --stdin
```

### Common flags

| Flag | Description |
|------|-------------|
| `--random <N>` | Generate N mutations from random valid seeds |
| `--corpus <FILE>` | Read newline-delimited inputs from a file |
| `--stdin` | Read newline-delimited inputs from stdin |
| `--seed <U64>` | Fix the PRNG seed for reproducible runs |
| `--max-iterations <N>` | Stop after N iterations (useful with `--random`) |
| `--verbose` / `-v` | Print every result, not just findings |

## Findings

When a panic or correctness violation is detected, the reproducer is written to `examples/rust-address-fuzzer/findings/` as a JSON file. Re-run with the exact seed shown in the output to reproduce:

```bash
cargo run --release -- --random 1 --seed <REPORTED_SEED>
```

## CI

Two workflows cover this crate:

- **`ci-rust.yml`** — runs `cargo test` and `cargo build` on every PR that touches `examples/prism-core/**` or `examples/rust-address-fuzzer/**`.
- **`fuzz.yml`** — runs 100 000 random mutations on every push to `main` and on every PR, uploading any findings as a GitHub Actions artifact.

## License

MIT
