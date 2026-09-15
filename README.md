<div align="center">

# Harness Workflow

**Task-scoped workflow skills for coding agents — entry, state, verification, recovery and cleanup discipline.**

[![CI](https://github.com/YSAA1/harness-workflow/actions/workflows/ci.yml/badge.svg)](https://github.com/YSAA1/harness-workflow/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

[English](README.md) · [简体中文](README.zh-CN.md) · [YSAA1/harness-workflow](https://github.com/YSAA1/harness-workflow)

**Installs to 20+ agents with one command** — and works with any agent that reads the open `SKILL.md` skills format.

</div>

## Why

Agents fail on process, not intelligence: lost context between sessions, unverified "done" claims, orphaned docs, no recovery path. Harness Workflow turns the [Learn Harness Engineering](docs/harness-method-contract.md) method (C1–C10) into a small set of executable skills:

- **Use only what the task needs** — simple work finishes after focused self-review; complex work adds planning, independent review and durable recovery.
- **Fresh evidence over memory** — ready claims map to actual command output; stale evidence is reused only while relevant code, config and inputs are unchanged.
- **Recovery as a design choice** — one authoritative entry per task/track; `.harness/` only when the work needs it.
- **Cleanup is part of the work** — docs, code leftovers and recovery state are reconciled before handoff, not as optional polish.

![Workflow fit](docs/assets/readme/harness-workflow-figure.png)

## Install

One command — pick your agents, pick your skills (powered by [skills.sh](https://skills.sh)):

```bash
npx skills@latest add YSAA1/harness-workflow
```

- 20+ supported agents: Claude Code, Cursor, Codex, GitHub Copilot, Gemini CLI, OpenCode, Goose, Windsurf, Cline, AMP, Roo, Trae, VS Code, Zed…
- Install the whole workflow or just a few skills (e.g. only `review` + `cleanup`), project-level or global.
- Update later with `npx skills update`. Nothing changes behind your back.

Claude Code users can alternatively install the managed plugin:

```text
/plugin marketplace add YSAA1/harness-workflow
/plugin install harness-workflow@harness-workflow
```

Agents not listed on skills.sh (Grok Build, ZCode, Kimi Code) read the same open `SKILL.md` format — copy `skills/<name>` into `~/.agents/skills/` or the CLI's own skills directory. Full guide: [Install](docs/install.md).

## The workflow

| Skill | Purpose |
| --- | --- |
| `brainstorm` | Material design choices / focused Spec |
| `plan` | Execution dependencies / optional durable plan |
| `implement` | Scoped changes, test-driven at agreed seams, proportional verification |
| `diagnose` | Evidence-based unknown-failure investigation |
| `review` | Review and evidence judgment (`verify` is a trigger alias) |
| `ship` | End-to-end delivery chaining implement, review and cleanup |
| `cleanup` | Task-scoped Knowledge Cleanup |
| `harness-builder` | Cross-surface workbench coordination |
| `find-skills` | Targeted reusable skill discovery |
| `capability-recommender` | Capability Recommender — read-only capability selection |
| `tdd` | Red-green discipline at pre-agreed seams, driven by `implement` |
| `writing-for-agents` | Writing for Agents — write & maintain skills, durable instructions, recovery/state surfaces |

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

The stable C1–C10 contract is in [Harness Method Contract](docs/harness-method-contract.md).

## Development and verification

Edit canonical `skills/`, then verify structure:

```text
node scripts/check-plugin.mjs
bash scripts/agent/check.sh
python -B skills/harness-builder/tests/test_scripts.py
```

These checks establish packaging and specific validator behavior, not a benchmark of model task quality. No default MCP or hooks are installed. See THIRD_PARTY_NOTICES.md for attribution.

## Documentation

| Doc | Contents |
| --- | --- |
| [Harness Method Contract](docs/harness-method-contract.md) | The stable C1–C10 method |
| [CONTEXT](CONTEXT.md) | Domain terms and boundaries |
| [Install guide](docs/install.md) | skills.sh install, Claude Code plugin path, manual copy |

## License

MIT — see [LICENSE](LICENSE).
