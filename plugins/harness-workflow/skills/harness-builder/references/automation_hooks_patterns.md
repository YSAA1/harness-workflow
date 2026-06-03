# Automation Hooks Patterns

Hooks run deterministic commands in response to agent or editor events. Recommend them when they prevent repeated mistakes or provide fast feedback that prose instructions do not reliably enforce.

Derived from Anthropic `claude-code-setup` 1.0.0 and adapted for Codex / Claude Code / Cursor surfaces. See `automation_recommendation_attribution.md`.

**Note**: These are common hook patterns. Use targeted web search or local official docs to find hooks for tools/frameworks not listed here.

## Placement Surfaces

| Surface | Typical placement | Notes |
| --- | --- | --- |
| Codex | project docs/scripts or supported project hook config | verify current Codex hook support before writing config |
| Claude Code | `.claude/settings.json` hooks | PreToolUse, PostToolUse, Notification, Stop |
| Cursor | project rules, extension/task config, or `.cursor/` surfaces | Cursor hook semantics vary; use project scripts as fallback |

Do not install hooks on recommendation alone. Blocking, mutating, global, or long-running hooks need explicit approval.

## Auto-formatting

| Signal | Hook | Event | Value |
| --- | --- | --- | --- |
| `.prettierrc`, `prettier.config.js` | Prettier format changed JS/TS files | PostToolUse Edit/Write | keeps formatting stable |
| ESLint config | ESLint autofix changed JS/TS files | PostToolUse Edit/Write | catches lint drift |
| `pyproject.toml` with Black/isort | format Python files | PostToolUse Edit/Write | consistent Python formatting |
| Ruff config | `ruff format` / `ruff check --fix` | PostToolUse Edit/Write | fast Python lint/format |
| `go.mod` | `gofmt` changed Go files | PostToolUse Edit/Write | standard Go formatting |
| `Cargo.toml` | `cargo fmt` / `rustfmt` | PostToolUse Edit/Write | standard Rust formatting |

Fallback: document formatter command in `scripts/agent/check.sh` or README.

## Type and Test Feedback

| Signal | Hook | Event | Value |
| --- | --- | --- | --- |
| `tsconfig.json` | `tsc --noEmit` or project typecheck | PostToolUse Edit/Write or Stop | catches type drift |
| `pyrightconfig.json`, mypy config | pyright/mypy | PostToolUse Edit/Write or Stop | catches Python type errors |
| Jest/Vitest config | run related tests | PostToolUse Edit/Write or Stop | fast regression feedback |
| pytest config/tests | run related pytest | PostToolUse Edit/Write or Stop | fast regression feedback |
| Playwright config | targeted E2E smoke | Stop/manual gate | verifies UI flows |

Keep post-edit checks fast. Move slow checks to Stop, CI, or manual verification.

## Protection Hooks

| Signal | Hook | Event | Value |
| --- | --- | --- | --- |
| `.env`, credentials, secrets | block direct edits or require approval | PreToolUse Edit/Write | prevents secret exposure |
| lock files | block direct manual edits | PreToolUse Edit/Write | forces package manager changes |
| protected generated files | block direct edits | PreToolUse Edit/Write | prevents stale generated artifacts |
| destructive shell risk | block `rm -rf`, force push, prod deploy | PreToolUse Bash | reduces irreversible damage |
| main branch push risk | block push to protected branches | PreToolUse Bash | protects repo state |

Every protection hook needs a repair/disable path and false-positive policy.

## Notification Hooks

| Signal | Hook | Event | Value |
| --- | --- | --- | --- |
| multitasking | permission prompt alert | Notification | avoid missed approvals |
| long idle waits | idle prompt alert | Notification | know when input is needed |
| auth flows | auth success notice | Notification | confirm setup progress |

## Harness Workflow Hooks

| Signal | Hook | Template hint |
| --- | --- | --- |
| repeated verification omissions | verification reminder | `templates/hooks/verification_reminder.py.j2` |
| destructive command risk | destructive shell blocker | `templates/hooks/block_destructive_shell.py.j2` |
| protected paths | protected-path guard | `templates/hooks/protected_paths.py.j2` |
| Research Route branch discipline | research branch push guard | `templates/hooks/research_branch_push_guard.py.j2` |
| milestone commit protocol | commit trailer enforcer | `templates/hooks/commit_trailer_enforcer.py.j2` |
| audit trail | command/event logger | `templates/hooks/research_iteration_logger.py.j2` |

## Reject Hooks When

- The hook is subjective review or planning.
- It runs long jobs on every edit.
- It mutates broad file sets and hides diffs.
- It needs secrets without clear owner and rotation policy.
- It blocks normal recovery with no documented bypass.
- The same outcome is better handled by tests, lint, CI, or a one-line check script.
