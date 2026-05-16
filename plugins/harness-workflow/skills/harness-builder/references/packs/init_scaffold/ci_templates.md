# CI Templates

Use only when the Verification entry row selects CI.

## Command validation

Before substituting discovered commands into CI YAML `run:` fields, validate them.

Allow known build/test/lint tools and `&&` between known-safe commands. Reject or ask about commands containing:

- `|`
- `;`
- `$()`
- backticks
- `>>`
- `curl`
- `wget`
- `eval`
- `exec`

All GitHub Actions `uses:` references should be SHA-pinned with a tag comment for auditability.

Templates live under `templates/packs/init_scaffold/ci/`.
