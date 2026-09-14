<div align="center">

# Harness Workflow

**Task-scoped workflow skills for coding agents — entry, state, verification, recovery and cleanup discipline.**

[![CI](https://github.com/YSAA1/harness-workflow/actions/workflows/ci.yml/badge.svg)](https://github.com/YSAA1/harness-workflow/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Plugin](https://img.shields.io/badge/plugin-v0.4.1-blue)](.codex-plugin/plugin.json)

[English](README.md) · [简体中文](README.zh-CN.md) · [YSAA1/harness-workflow](https://github.com/YSAA1/harness-workflow)

![Harness Workflow](docs/assets/readme/harness-workflow-icon.png)

Works with **Codex · Claude Code · Cursor · Grok Build · ZCode · Kimi Code** and any agent that reads the open `SKILL.md` skills format.

</div>

## Why

Agents fail on process, not intelligence: lost context between sessions, unverified "done" claims, orphaned docs, no recovery path. Harness Workflow turns the [Learn Harness Engineering](docs/harness-method-contract.md) method (C1–C10) into a small set of executable skills:

- **Use only what the task needs** — simple work finishes after focused self-review; complex work adds planning, independent review and durable recovery.
- **Fresh evidence over memory** — ready claims map to actual command output; stale evidence is reused only while relevant code, config and inputs are unchanged.
- **Recovery as a design choice** — one authoritative entry per task/track; `.harness/` only when the work needs it.
- **Cleanup is part of the work** — docs, code leftovers and recovery state are reconciled before handoff, not as optional polish.

![Workflow fit](docs/assets/readme/harness-workflow-figure.png)

## Install

### Codex

```text
codex plugin marketplace add YSAA1/harness-workflow
codex plugin add harness-workflow@harness-workflow
```

Details: [Codex installation](docs/install/codex.md).

### Claude Code

Install as a user-scope plugin from the local checkout, or copy individual skills to `~/.claude/skills/`. Details: [Claude Code installation](docs/install/claude-code.md).

### Cursor

The Cursor plugin surface is project-local: the adapter installs `.cursor/rules/` and `.cursor/skills/`, and does not install a Codex plugin or use legacy `.cursorrules`.

```text
node scripts/install-cursor.mjs --target <project> --dry-run
```

Details: [Cursor installation](docs/install/cursor.md).

### Grok Build / ZCode / Kimi Code

All three read the open `SKILL.md` format. One shared copy serves every CLI:

```bash
git clone https://github.com/YSAA1/harness-workflow.git
cd harness-workflow
mkdir -p ~/.agents/skills
for s in harness-builder brainstorm plan implement diagnose review ship cleanup find-skills capability-recommender agent-instructions-maintainer recovery-surface-builder; do
  cp -r "skills/$s" ~/.agents/skills/
done
```

Per-CLI details (user-level dirs, project-level options, verification prompts):

- [Grok Build](docs/install/grok.md) — `~/.grok/skills/` or shared `~/.agents/skills/`
- [ZCode](docs/install/zcode.md) — `~/.zcode/skills/` or shared `~/.agents/skills/`
- [Kimi Code](docs/install/kimi.md) — `~/.kimi/skills/`, project `.kimi/skills/`, or shared `~/.agents/skills/`

Update after `git pull` by re-copying; uninstall by removing the skill directories.

## The workflow

| Skill | Purpose |
| --- | --- |
| `brainstorm` | Material design choices / focused Spec |
| `plan` | Execution dependencies / optional durable plan |
| `implement` | Scoped changes and proportional verification |
| `diagnose` | Evidence-based unknown-failure investigation |
| `review` | Review and evidence judgment (`verify` is a trigger alias) |
| `ship` | End-to-end delivery chaining implement, review and cleanup |
| `cleanup` | Task-scoped Knowledge Cleanup |
| `harness-builder` | Cross-surface workbench coordination |
| `find-skills` | Targeted reusable skill discovery |
| `capability-recommender` | Capability Recommender — read-only capability selection |
| `agent-instructions-maintainer` | Agent Instructions Maintainer — durable rule audit/repair |
| `recovery-surface-builder` | Recovery Surface Builder — existing or selected backend |

Typical flows:

```text
Tiny edit:          implement -> targeted checks + self-review -> done
Authorized task:    ship (= implement -> review -> cleanup)
Unclear feature:    brainstorm -> plan -> harness-builder -> implement -> review -> cleanup
Broken command:     diagnose -> evidence + recommendation (authorized fix -> implement)
Harness audit:      harness-builder -> review -> cleanup
```

## Working behavior

- Already-authorized implementation continues after planning; advice-only requests stay read-only.
- Ask about material choices, not routine implementation decisions. Drafts can make a decision reviewable before asking.
- `review` combines findings and fresh evidence; `verify` is only a trigger alias for it. Applicable checks are reused, not rerun merely at stage boundaries.
- `ship` chains implement, review and cleanup for one authorized end-to-end delivery; it adds no extra gate.
- Independent review is risk-driven; project-required independent approval still applies. Missing required evidence remains unknown.
- Keep one authoritative entry per task/track. Existing trackers do not need a duplicate `.harness` directory.
- Update only affected docs; keep evidence and unrelated changes. No-drift cleanup can make zero edits.

The stable C1–C10 contract is in [Harness Method Contract](docs/harness-method-contract.md). The [2026-09-07 audit](docs/reviews/2026-09-07--astra-workflow-audit.md) records the rationale and verification limits.

## Development and verification

Edit canonical `skills/` and `rules/`, then synchronize the packaged plugin and Cursor mirrors.

```text
node scripts/check-plugin.mjs
node scripts/check-claude-code-install.mjs
node scripts/check-cursor-install.mjs
node scripts/install-cursor.mjs --target . --dry-run
python -B skills/harness-builder/tests/test_scripts.py
```

These checks establish packaging and specific validator behavior, not a benchmark of model task quality. No default MCP or hooks are installed. Historical plans/evaluations remain versioned evidence, not current workflow requirements. See THIRD_PARTY_NOTICES.md for attribution.

## Documentation

| Doc | Contents |
| --- | --- |
| [Harness Method Contract](docs/harness-method-contract.md) | The stable C1–C10 method |
| [CONTEXT](CONTEXT.md) | Domain terms and boundaries |
| Install guides | [Codex](docs/install/codex.md) · [Claude Code](docs/install/claude-code.md) · [Cursor](docs/install/cursor.md) · [Grok Build](docs/install/grok.md) · [ZCode](docs/install/zcode.md) · [Kimi Code](docs/install/kimi.md) |
| [Tutorials](docs/tutorials/) | Usage walkthroughs |

## License

MIT — see [LICENSE](LICENSE).
