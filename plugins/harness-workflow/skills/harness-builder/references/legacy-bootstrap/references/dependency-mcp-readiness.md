# Dependency / MCP Readiness

Use this during `bootstrap` to make sure implementation can actually run and verify the approved spec.

## Dependency Readiness

1. Detect the stack from real files:
   - Node: `package.json`, lockfile, `vite.config.*`, `next.config.*`, `tsconfig.json`.
   - Python: `pyproject.toml`, `requirements.txt`, `uv.lock`, `poetry.lock`, `pytest.ini`.
   - Rust: `Cargo.toml`, `Cargo.lock`.
   - Go: `go.mod`, `go.sum`.
   - Other: README / Makefile / project-specific setup docs.

2. Identify the project-standard setup command:
   - Prefer README / AGENTS / Makefile commands when they match config files.
   - Otherwise infer the minimal standard command (`npm install`, `uv sync`, `pip install -r requirements.txt`, `cargo fetch`, `go mod download`) and record the inference.

3. Run setup when feasible:
   - If dependencies install successfully, record the command and result in `progress.md`.
   - If network, credentials, system packages, or permissions block setup, record the blocker in `findings.md`.
   - Do not mark tool/environment PASS if dependencies are missing.

4. Confirm at least one baseline command:
   - Run or identify a cheap command such as lint, unit test, build, import check, or smoke.
   - If no command exists, create a clear verification gap for `plan` / `implement`.

## Required vs Recommended Capabilities

Classify every capability as:

- `required`: the current spec/plan cannot be verified without it.
- `recommended`: useful for quality, but not required for this active slice.
- `blocked`: required, but cannot be configured now because of secrets, auth, unavailable service, or policy.

Examples:

- Browser UI active slice with user-visible flow: Playwright test or Playwright MCP is usually `required`.
- API behavior depending on current upstream docs: official docs/search may be `required`.
- GitHub issue acceptance criteria: GitHub / issue tracker MCP may be `required`.
- Long-running training or experiments: external runner/log/metrics integration may be `required`.

## Project-Level MCP Setup

Prefer project-local configuration so other projects are not affected:

- Codex project override: `<project>/.codex/config.toml`.
- Existing project MCP config: `.mcp.json` or repo-specific config, if already used.
- Plugin-local MCP config only when building a plugin, not for ordinary project bootstrap.

Rules:

- Required MCP/capability should be configured during bootstrap when safe.
- Do not write API keys, tokens, passwords, cookies, or private URLs into repo files.
- If auth is needed, write the expected environment variable name and record `blocked until secret provided`.
- Note that MCP/plugin config usually needs a new Codex session.
- After writing config, record the exact file path and enabled/disabled MCP names in `progress.md`.

## Report Fields

Record:

- Dependency setup command and result.
- Baseline command and result.
- Required capabilities: configured / blocked / none.
- Optional recommendations.
- Project MCP config path.
- New-session requirement.
