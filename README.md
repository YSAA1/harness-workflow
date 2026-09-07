# Harness Workflow

[简体中文](README.zh-CN.md) · [YSAA1/harness-workflow](https://github.com/YSAA1/harness-workflow)

![Harness Workflow](docs/assets/readme/harness-workflow-icon.png)

Task-scoped workflows for Codex, Claude Code and Cursor. Use only the structure that improves the current task: simple work can finish after focused self-review; complex work can add planning, independent review and durable recovery.

## Skills

| Skill | Purpose |
| --- | --- |
| `agent-instructions-maintainer` | Agent Instructions Maintainer — durable rule audit/repair |
| `brainstorm` | Material design choices / optional Spec |
| `capability-recommender` | Capability Recommender — read-only capability selection |
| `cleanup` | Task-scoped Knowledge Cleanup |
| `diagnose` | Evidence-based unknown-failure investigation |
| `find-skills` | Targeted reusable skill discovery |
| `harness-builder` | Cross-surface workbench coordination |
| `implement` | Scoped changes and proportional verification |
| `plan` | Execution dependencies / optional durable plan |
| `recovery-surface-builder` | Recovery Surface Builder — existing or selected backend |
| `review` | Review and evidence judgment |
| `verify` | Compatibility alias to review |

## Working behavior

- Already-authorized implementation continues after planning; advice-only requests stay read-only.
- Ask about material choices, not routine implementation decisions. Drafts can make a decision reviewable before asking.
- `review` combines findings and evidence; `verify` is an alias. Applicable checks are reused, not rerun merely at stage boundaries.
- Independent review is risk-driven; project-required independent approval still applies. Missing required evidence remains unknown.
- Keep one authoritative entry per task/track. Existing trackers do not need a duplicate .harness directory.
- Update only affected docs; keep evidence and unrelated changes. No-drift cleanup can make zero edits.

The stable C1–C10 contract is in [Harness Method Contract](docs/harness-method-contract.md). The [2026-09-07 audit](docs/reviews/2026-09-07--astra-workflow-audit.md) records the rationale and verification limits.

## Installation

Codex: follow [Codex installation](docs/install/codex.md), starting with `codex plugin marketplace add YSAA1/harness-workflow`, then `codex plugin add harness-workflow@harness-workflow`.
Local development can register the local marketplace root before reinstalling. Keep current user invocation policies; this update does not enable explicit-only skills implicitly.

Claude Code: use the [Claude Code plugin instructions](docs/install/claude-code.md).

Cursor plugin: see [Cursor installation](docs/install/cursor.md). The project-local adapter installs `.cursor/rules/` and `.cursor/skills/`; it does not install a Codex plugin or use legacy `.cursorrules`.
Run `node scripts/install-cursor.mjs --target <project> --dry-run` before an authorized project adapter update.

## Development and verification

Edit canonical `skills/` and `rules/`, synchronize the packaged plugin and Cursor mirrors, then regenerate flow pages when the skill source changes.

```text
node scripts/generate-skill-flow-html.mjs
node scripts/check-plugin.mjs
node scripts/check-claude-code-install.mjs
node scripts/check-cursor-install.mjs
node scripts/install-cursor.mjs --target . --dry-run
python -B skills/harness-builder/tests/test_scripts.py
```

These checks establish packaging and specific validator behavior, not a benchmark of model task quality. No default MCP or hooks are installed.
Historical plans/evaluations remain versioned evidence, not current workflow requirements. See THIRD_PARTY_NOTICES.md for attribution.
