# harness-builder skill

Project-level meta skill for designing and installing minimal useful AI agent harnesses.

## Focus

- Evidence-first harness recommendation; Harness Hypothesis and Harness Recommendation Contract before install.
- Integrated Harness Recommendation Matrix; skills, hooks, MCP, subagents, plugins, commands, and CI/headless automation close named gaps only.
- Proactive Capability Recommendation from `automation_recommendation_guide.md` and `automation_*` references; install still requires `USER CHECKPOINT`.
- Phased installation with per-phase acceptance evidence.
- Existing harness reconciliation before patching.
- Optional read-only subagent orchestration; Research Route for explicit autoresearch.
- Anti-entropy and thin `AGENTS.md` discipline.

## What it does

- Audits a project before agent coding starts.
- Designs a Harness Recommendation Plan with verifiable acceptance criteria.
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
