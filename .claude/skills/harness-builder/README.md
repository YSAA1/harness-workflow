# harness-builder skill

A project-level meta skill for designing and installing minimal useful AI agent harnesses.

## v3 focus

v3 adds:

- evidence-first, gap-driven brainstorm;
- Harness Hypothesis before Harness Plan;
- Learn Harness Engineering course alignment checklist;
- optional subagent orchestration for read-only discovery, research, and plan review;
- explicit rule: subagents read/research/review, main agent writes;
- stronger anti-entropy and clean-state thinking.

## What it does

- Audits a project before agent coding starts.
- Identifies missing information needed to build the right harness.
- Designs a harness plan.
- Installs project-local AGENTS.md, docs, check scripts, state files, skills, hooks, and reviewer agents when justified.
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
