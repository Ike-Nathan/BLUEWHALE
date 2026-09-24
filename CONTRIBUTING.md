# Contributing to Bluewhale

First off, thank you for considering contributing to the Bluewhale! It's people like you that make the Stellar ecosystem a better place for developers.

### How Can I Contribute?

#### Adding Spec Vectors
The most impactful way to contribute is by adding new test vectors to `spec/vectors.json`. If you find an edge case or a tricky address format, follow these steps:
1. Add the case to `spec/vectors.json`.
2. Run `node spec/validate.js` to ensure it meets the schema.
3. Update the TypeScript, Go, and Dart implementations to pass the new vector.

#### Reporting Bugs
*   Check the [Issues](https://github.com/REDISHFISH/BLUEWHALE/issues) to see if the bug has already been reported.
*   If not, open a new issue with a clear title and description, including steps to reproduce the bug.

#### Suggesting Enhancements
*   Open an issue to discuss your idea.
*   Clearly explain why this enhancement would be useful to others.

#### Pull Requests
1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes (`pnpm test`, `go test ./...`, `dart test`).
5. Add an entry under `## [Unreleased]` in the `CHANGELOG.md` of every package you touched (see below).

### Development Setup

```bash
# Install dependencies
pnpm install

# Run the spec validator
node spec/validate.js

# Run tests across all packages
pnpm test
```

### Changelogs & release versioning

Each SDK keeps a `CHANGELOG.md` in [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format:

| Package | Changelog | Version source |
|---------|-----------|----------------|
| `@redishfish/bluewhale-core` | `packages/core-ts/CHANGELOG.md` | `packages/core-ts/package.json` |
| `core-go` | `packages/core-go/CHANGELOG.md` | git tag `packages/core-go/vX.Y.Z` |
| `bluewhale_core` (Dart) | `packages/core-dart/CHANGELOG.md` | `packages/core-dart/pubspec.yaml` |

* Record changes under `## [Unreleased]` using the standard groups
  (`Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, `Security`).
* **Spec updates drive releases.** Any change to `spec/vectors.json` must bump
  `spec_version` (enforced by `scripts/check-spec-version-bump.js`), and every
  SDK is released in lockstep at that version:
  1. Bump `spec_version` in `spec/vectors.json` and `packages/spec/vectors.json`.
  2. Set the same version in `packages/spec/package.json`,
     `packages/core-ts/package.json` and `packages/core-dart/pubspec.yaml`.
  3. In each SDK changelog, move `[Unreleased]` entries into
     `## [X.Y.Z] - YYYY-MM-DD` (noting "Implements spec `X.Y.Z`") and leave an
     empty `## [Unreleased]` section at the top.
  4. After merge, tag the Go module as `packages/core-go/vX.Y.Z`.
* `pnpm spec:sync-check` (`scripts/check-vectors-sync.js`) verifies the
  versions and changelog entries; it runs in CI and in `scripts/release.js`.

### Style Guide
*   **TypeScript**: Follow the existing Prettier/ESLint config.
*   **Go**: Run `go fmt` before committing.
*   **Dart**: Run `dart format` before committing.

### Code of Conduct
Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.
