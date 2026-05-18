# harness-builder skill

A project-level meta skill for designing and installing minimal useful AI agent harnesses.

## v3 focus

v3 adds:

- evidence-first, gap-driven brainstorm;
- Harness Hypothesis before Harness Plan;
- Harness Charter before installation: objective, non-goals, acceptance criteria, verification, evidence location, recovery surface, and existing-harness decisions;
- integrated Coverage Matrix before capability installation, so skills, hooks, MCP, subagents, CI, and GC close named gaps instead of forming a separate shopping list;
- signal-bound Capability Shortlist rows before recommending or installing skills, hooks, MCP, subagents, or helper scripts;
- phased installation with acceptance evidence or explicit blockers for each phase;
- existing harness reconciliation before patching so old state does not mix with a new request;
- Learn Harness Engineering course alignment checklist;
- optional subagent orchestration for read-only discovery, research, and plan review;
- explicit rule: subagents read/research/review, main agent writes;
- Research Route policy for explicit autoresearch and open-ended method exploration;
- stronger anti-entropy and clean-state thinking.

## What it does

- Audits a project before agent coding starts.
- Identifies missing information needed to build the right harness.
- Designs a harness plan.
- Negotiates or states user-facing acceptance criteria before installing files.
- Reconciles existing harness artifacts as keep, patch, archive/deprecate, or reject.
- Distinguishes static rules from dynamic context and records both in the selected recovery surface.
- Recommends mechanical architecture enforcement and read-only drift scans only when they close real gaps.
- Installs project-local AGENTS.md, docs, check scripts, state files, skills, hooks, and reviewer agents when justified.
- Installs project-local Research Route artifacts when the user explicitly asks for autoresearch or repeated research exploration.
- Records manifest and decisions for auditability.
- Supports repair, upgrade, and garbage collection to prevent harness entropy.

## Installation

Copy the `harness-builder/` directory into one of:

- project-local: `.agents/skills/harness-builder/`
- user-level: `~/.agents/skills/harness-builder/`

Project-local is recommended when the harness builder itself should be versioned with the repo.

## Suggested first prompt

```text
请使用 harness-builder。先做 evidence-first brainstorm 和 Harness Hypothesis，不要安装文件。
这是一个 [新/老] 项目，目标是 [目标]。
请根据项目证据和 Learn Harness Engineering 的思想，判断还缺哪些信息才能设计 harness。
如有必要，推荐是否使用只读 subagents 加速 discover/research/review。
```


## v4 init scaffold pack integration

This version keeps Harness Builder as the only controller and adds a namespaced `init_scaffold` install pack.

The pack provides concrete scaffold assets from harness-init, but it is not a second workflow and must not be invoked before the Harness Charter, Coverage Matrix, Capability Discovery, and User Checkpoint gates. The builder core references remain authoritative; the pack only implements approved coverage rows.

Pack namespace:

```text
references/packs/init_scaffold/
templates/packs/init_scaffold/
```

Use `scripts/render_harness.py --pack init_scaffold --dry-run` to preview pack output and `scripts/install_pack.py --pack init_scaffold --approved-plan-id <id>` only after explicit approval.
