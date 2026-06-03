# harness-builder skill

Project-level meta skill for designing and installing minimal useful AI agent harnesses.

## Focus

- Evidence-first harness design; Harness Hypothesis and Harness Charter before install.
- Integrated Coverage Matrix; skills, hooks, MCP, and subagents close named gaps only.
- Proactive Capability Shortlist on strong stack signals (`capability_starter_catalog.md`); install still requires `USER CHECKPOINT`.
- Phased installation with per-phase acceptance evidence.
- Existing harness reconciliation before patching.
- Optional read-only subagent orchestration; Research Route for explicit autoresearch.
- Anti-entropy and thin `AGENTS.md` discipline.

## What it does

- Audits a project before agent coding starts.
- Designs a harness plan with verifiable acceptance criteria.
- Installs project-local `AGENTS.md`, docs, check scripts, state files, hooks, and skills when justified.
- Records manifest and decisions for auditability.

## Installation

Copy `harness-builder/` into `.agents/skills/harness-builder/` (project-local, recommended) or `~/.agents/skills/harness-builder/`.

## Suggested first prompt

```text
请使用 harness-builder。先做 evidence-first 审计和 Harness Hypothesis，不要安装文件。
这是一个 [新/老] 项目，目标是 [目标]。
请根据项目证据判断还缺哪些 harness 能力；必要时建议只读 subagents 加速 discover/review。
```

## Validation

From this directory:

```bash
python scripts/inventory_references.py
python scripts/validate_harness.py
```

From repo root: `node scripts/check-plugin.mjs` and `node scripts/check-cursor-install.mjs`.
