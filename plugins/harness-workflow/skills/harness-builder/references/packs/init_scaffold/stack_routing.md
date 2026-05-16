# Stack Routing — Decision Tables for Init Scaffold Pack

Use these tables only after Harness Builder selects a coverage row.

## Boundary Test — Import Parser & Pattern

| Stack | Import Pattern | Parser Approach | Test File |
|-------|---------------|-----------------|-----------|
| JS/TS | `import ... from '...'` | Regex or AST (`ts-morph`, babel) | `tests/architecture/boundary.test.ts` |
| Python | `import ...` / `from ... import` | AST (`ast` stdlib) | `tests/architecture/test_boundary.py` |
| Go | `import "..."` | `go/parser` stdlib or regex | `tests/architecture/boundary_test.go` |
| Rust | `use ...` / `mod ...` | Regex or `syn` crate | `tests/architecture/boundary_test.rs` |
| Java/Kotlin | `import ...` | Regex or ArchUnit | `tests/architecture/BoundaryTest.java` |

Error format:

```text
VIOLATION: {file}:{line} imports {target} — {layer} cannot import {target_layer}. See docs/architecture/LAYERS.md
```

## Linter Import Restriction Rules

| Stack | Linter | Rule | Config Location |
|-------|--------|------|-----------------|
| JS/TS | ESLint | `no-restricted-imports` / `import/no-restricted-paths` | `.eslintrc` or `eslint.config.js` |
| Python | Ruff | `banned-api` / tidy-imports style config | `pyproject.toml` |
| Go | golangci-lint | `depguard` | `.golangci.yml` |
| Rust | clippy/module visibility | `pub(crate)` and workspace boundaries | `Cargo.toml` + module structure |
| Java | ArchUnit | `ArchRuleDefinition.noClasses()` | test file |

## CI Job Matrix

| Stack | Lint | Typecheck | Test | Build |
|-------|------|-----------|------|-------|
| JS/TS | `eslint .` | `tsc --noEmit` | `jest` / `vitest` | `next build` / `tsc` |
| Python | `ruff check .` | `mypy .` if typed | `pytest` | `python -m build` if packaged |
| Go | `golangci-lint run` | included in build | `go test ./...` | `go build ./...` |
| Rust | `cargo clippy` | included in build | `cargo test` | `cargo build --release` |
| Java/Kotlin | checkstyle / ktlint | compiled language | `./gradlew test` | `./gradlew build` |

Not every stack needs all jobs. Use the verification coverage row and command validation before rendering CI.
