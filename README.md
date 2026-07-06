[简体中文](README.zh-CN.md)

<p align="center">
  <img src="docs/assets/readme/harness-workflow-icon.png" alt="Harness Workflow icon" width="108">
</p>

<h1 align="center">Harness Workflow</h1>

<p align="center">
  <strong>Context-aware agent workbench for real repositories.</strong>
</p>

<p align="center">
  Give Codex, Claude Code, and Cursor enough repo evidence, requirement context, recovery state, and verification discipline to work on projects that do not fit in one chat.
</p>

<p align="center">
  <a href="https://github.com/YSAA1/harness-workflow/actions/workflows/ci.yml"><img src="https://github.com/YSAA1/harness-workflow/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
</p>

<p align="center">
  <a href="#quick-start">Quick start</a> ·
  <a href="#why-this-exists">Why this exists</a> ·
  <a href="#what-makes-it-different">What is different</a> ·
  <a href="#helper-skills">Helper skills</a> ·
  <a href="#skill-map">Skill map</a> ·
  <a href="docs/install/codex.md">Codex</a> ·
  <a href="docs/install/claude-code.md">Claude Code</a> ·
  <a href="docs/install/cursor.md">Cursor</a>
</p>

<p align="center">
  <img src="docs/assets/readme/harness-workflow-figure.png" alt="Harness Workflow context-aware agent workbench infographic">
</p>

> More context and more repo evidence produce a better harness. `harness-builder` is usually useful after `brainstorm` or `plan`, when the agent knows what is being built and what must be proven.

<p align="center">
  <img src="docs/assets/readme/harness-fit-figure.png" alt="From global bloat to project-fit harness infographic">
</p>

## Quick start

Install the plugin, then enter the lane that matches the current project state.

```bash
codex plugin marketplace add YSAA1/harness-workflow
```

For Claude Code:

```bash
claude plugin marketplace add YSAA1/harness-workflow
claude plugin install harness-workflow@harness-workflow
```

For Cursor project-local use:

```bash
node scripts/install-cursor.mjs --target .
node scripts/check-cursor-install.mjs
```

The adapter installs `.cursor/rules/` and `.cursor/skills/`; this repo checks in the same Cursor preview surface, including `find-skills`, `capability-recommender`, `agent-instructions-maintainer`, and `recovery-surface-builder`. It does not depend on legacy `.cursorrules`. See [docs/install/cursor.md](docs/install/cursor.md).

Codex reads this repository as a GitHub marketplace, then installs the actual plugin package from `plugins/harness-workflow/`. The root `skills/` directory remains the canonical editing surface; `node scripts/check-plugin.mjs` verifies that the packaged copy has not drifted.

## Why this exists

Most open-source agent workflows describe a nice sequence: gather requirements, write a plan, change code, review, verify. That sequence helps, but it leaves several hard parts underspecified.

Real repositories have stale docs, missing tests, unclear ownership, dirty git state, local conventions, broken setup commands, and long tasks that survive context compaction. A generic checklist cannot decide which recovery surface, verification path, skill, hook, or MCP server belongs in that repo.

Harness Workflow is built around that gap. It gives the agent separate lanes for thinking, planning, implementation, diagnosis, verification, cleanup, and project harness construction. The point is not to force every task into a heavy process. The point is to make the process fit the evidence.

## The pain it fixes

Harness engineering can sound abstract: "build a better operating environment around the agent." The hard part is turning that idea into files, checks, rules, and recovery state that actually help the next coding session.

Three common failure modes show up again and again:

| Pain | What usually happens | What this plugin does instead |
| --- | --- | --- |
| "Harness engineering" stays theoretical | The team likes the idea, but nobody knows what to create first. | `harness-builder` turns the idea into concrete project artifacts: project map, thin rules, check scripts, recovery surface, capability decisions, and cleanup policy. |
| Every project gets the same global setup | Users install all skills, MCP servers, hooks, memories, and rules globally. Context gets noisy, tools fight each other, and small projects inherit irrelevant process. | The plugin pushes project-fit decisions: adopt what this repo needs, defer what might help later, reject what adds cost without signal. |
| Agents finish work but leave entropy behind | Tests may pass, but docs lie, temp files remain, state is stale, and the next agent has to rediscover the same facts. | `verify` requires fresh evidence, and `cleanup` keeps README, generated artifacts, recovery state, and handoff knowledge aligned. |

## Harness engineering in practice

The harness is not one giant prompt. It is the operating environment around the model:

- **Instructions**: thin `AGENTS.md` or `CLAUDE.md`, project iron laws, protected paths, and task-type reading pointers.
- **State**: none, lightweight, `.harness/` directory, feature list, issue tracker, or an existing project system.
- **Feedback**: fast checks, smoke tests, tiny runs, screenshots, logs, and current verification evidence.
- **Tools**: scripts, project-local skills, targeted MCP, justified hooks, and subagents only when they pay for their cost.
- **Cleanup**: anti-entropy rules so sessions close with accurate docs, clear next state, and no misleading residue.

The 12-lesson harness checklist is folded into [`harness-builder`](skills/harness-builder/SKILL.md) (Harness Hypothesis step) and [`recommendation_matrix_policy.md`](skills/harness-builder/references/recommendation_matrix_policy.md) as a practical recommendation guide. It asks whether capable agents can still fail here, what the harness around the model should contain, which repo files become the system of record, how to keep root instructions thin, when long-running work needs continuity, what a fresh agent should do before implementation, how to constrain scope, whether a feature list is useful, what gates prevent premature victory, where smoke/e2e checks belong, what observability should be captured, and what clean state every session must leave.

That checklist is not a mandatory artifact list. It is a decision framework. A small CLI library may only need a thin map and one check command. An ML experiment repo may need tiny-run verification, data leakage review, run metadata, and stricter recovery state. A frontend app may need browser smoke checks and design review. Different projects need different harnesses.

## What makes it different

| Difference | What it means in practice |
| --- | --- |
| Context-aware harness building | `harness-builder` should consume a brainstormed spec or executable plan when one exists, plus real repository evidence. It is not a blank template generator. |
| Harness contract before install | Before writing harness files, `harness-builder` must state the objective, non-goals, acceptance criteria, verification path, evidence location, recovery surface, and how existing harness files will be kept, patched, archived, or rejected. |
| One recommendation matrix | Instructions, recovery, verification, architecture boundaries, anti-entropy, dynamic context, and extra capabilities are judged in one table. Skills, MCP, hooks, subagents, plugins, commands, CI, and GC are installed only when they close a named gap. |
| Repo truth before workflow ceremony | The agent checks docs, source layout, tests, git state, existing rules, and setup commands before it claims the project is ready. |
| Recovery as a design choice | Some work needs no durable state. Some needs `.harness/recovery_policy.md` + `work_index.md`. Multi-session work uses full `.harness/` (`state.md`, `progress.md`, `decisions.md`). Some should reuse an issue tracker or existing docs. |
| Capability fit, not capability hoarding | Skills, MCP servers, hooks, subagents, plugins, commands, CI/headless automation, recovery surfaces, and instruction surfaces are judged as separate recommendation rows. Capability Recommendation should be a readable table: priority, type, recommendation, repo signal, value, install surface, approval needed, fallback, verification probe, and classification. Add source/freshness/trust/risk detail only when it changes the decision. The bundled helper skills separate skill discovery, capability recommendation, instruction maintenance, and recovery-surface construction. Recommendation requests stay read-only until `USER CHECKPOINT`. |
| Helper skills keep the builder thin | `capability-recommender` and `agent-instructions-maintainer` are adapted from official Anthropic plugin skills; `recovery-surface-builder` extracts recovery work from `harness-builder` and adopts planning-with-files persistence without forcing root three-file state. |`n| Fresh evidence for ready claims | `verify` is the only ready gate. It ties every "done" claim to current evidence: tests, build output, smoke checks, screenshots, manual checks, or a clearly stated reason verification is blocked. |
| Cleanup before handoff | The workflow treats stale README text, leftover generated files, unclear state, and missing recovery notes as part of the work, not as optional polish. |

## Where `harness-builder` fits

`harness-builder` is the lane that creates or repairs the project workbench: `AGENTS.md` or `CLAUDE.md`, project map, verification entry point, recovery surface, local rules, and justified optional capabilities.

It should not silently turn a vague request into a harness. If the target outcome, non-goals, acceptance criteria, or verification strategy are unclear, it asks the user or routes back to `brainstorm` / `plan`. If a project already has a harness, it reconciles the old sources before adding new ones so stale state does not mix with the new request.

For repo initialization, it borrows the useful discipline of phased setup without adding a separate mode system: discovery first, thin entry, docs as system of record, verification entry, optional architecture enforcement, optional read-only drift scans, and optional hooks. Each phase needs acceptance evidence or an explicit blocker.

Recommended order:

| Project state | Better route |
| --- | --- |
| The request is fuzzy or still has tradeoffs | `brainstorm -> plan -> harness-builder -> implement` |
| The request is clear, but the repo workbench is missing | `plan -> harness-builder -> implement` |
| The repo has a harness, but current truth is unclear or stale | `harness-builder -> verify -> cleanup` |
| The repo already has a fresh harness and a known check path | Skip `harness-builder`; go to `implement`, `diagnose`, or `verify` |
| The task is specifically to audit, repair, or create agent governance | Use `harness-builder` directly, but still start with evidence collection and gap-driven questions |
| The task is tiny | Do the tiny task and verify it; do not create ceremony |

This placement matters. A useful harness depends on the current goal, non-goals, risk, verification strategy, and repository shape. Without that context, the agent can only install a plausible template.

## Helper skills

Harness Workflow has eight active workflow lanes. Helper skills are top-level callable skills, but they are not extra lanes and are not hidden internal subroutines.

| Helper | Purpose | Source |
| --- | --- | --- |
| `capability-recommender` | Read-only recommendations for skills, hooks, MCP, subagents, plugins, scripts, CI/headless automation, and other agent workbench capabilities. | Adapted from Anthropic's official `claude-automation-recommender`. |
| `agent-instructions-maintainer` | Audit and patch durable agent instruction files such as `AGENTS.md`, `CLAUDE.md`, `.claude.md`, `.claude.local.md`, and Cursor rules after approval. | Adapted from Anthropic's official `claude-md-improver`. |
| `recovery-surface-builder` | Choose, create, or repair recovery surfaces: work index, active state, progress, decisions, evidence, verification commands, and session catch-up. | Extracted from `harness-builder`, with planning-with-files persistence discipline. |
| `find-skills` | Discover reusable external skills for a known capability gap. | Local helper. |

External research-governance wiring has been removed from this plugin. Use a separate plugin or project-specific workflow for that policy.
## Skill map

| Skill | Use it when | What it should leave behind | Recommended next |
| --- | --- | --- | --- |
| `brainstorm` | The goal, boundary, tradeoff, or success criteria is not clear enough to plan. | A focused spec: goals, non-goals, options considered, success criteria, and verification strategy. | `plan`, or `harness-builder` for direct harness work |
| `plan` | The spec or user request is clear enough to choose a first executable slice. | A plan in the selected planning surface, with active slice, `verification_path_status`, required capabilities, fallback evidence, final integration claim, and Markdown checkbox work items that can be checked off as progress is made. | `harness-builder` when the workbench or proof path is blocked; `verify` for proof-only work; otherwise `implement` |
| `harness-builder` | The repo lacks a reliable workbench, recovery surface, verification entry point, or capability decision. | A minimal project-local harness plan and approved installed components, grounded in repo evidence. | `verify`, then `implement` or `cleanup` |
| `implement` | One slice is scoped and the workbench is clear enough to change files. | A small scoped change, with local checks as implementation feedback or a clear reason checks cannot run. It does not declare ready. | `review` for meaningful changes; `verify` for tiny changes |
| `diagnose` | A build, test, lint, typecheck, CI run, or runtime behavior fails without a known root cause. | Reproduction, one tested hypothesis, root cause, minimal fix, and regression evidence. | `implement` for the fix, or `verify` when already fixed |
| `review` | A meaningful change looks stable and needs structural scrutiny before a ready claim. | Adversarial findings about correctness, missed tests, docs drift, scope creep, entropy, and residual risk. Meaningful diffs should try an isolated reviewer before fallback. It does not replace verification. | `verify` on pass or verify fast-path; `implement` or `diagnose` on findings |
| `verify` | The agent wants to say the work is ready. | A structured verification record tied to the exact success criteria, latest change, commands, skipped checks, unknowns, and ready verdict. | `cleanup` on pass; `diagnose` or `harness-builder` on gaps |
| `cleanup` | Work is done, blocked, abandoned, or being handed off. | Updated project knowledge, removed leftovers, and a recovery state the next agent can read. | stop, or reopen with `plan` / `implement` for explicit follow-up |
| `capability-recommender` | The repo needs read-only capability recommendations. | Official-derived recommendation report for skills, hooks, MCP, subagents, plugins, scripts, and CI/headless automation. | `harness-builder` or `implement` after approval |`n| `agent-instructions-maintainer` | Durable agent instructions need audit or repair. | Official-derived quality report and targeted patch plan for `AGENTS.md`, `CLAUDE.md`, and Cursor rules. | `verify` after an approved patch |`n| `recovery-surface-builder` | Active state, progress, evidence, or recovery is missing or drifting. | Backend choice, field map, and `.harness` or existing-surface repair plan. | `plan`, `verify`, or `cleanup` depending on state |`n| `find-skills` | The current task may benefit from an existing reusable skill. | Search and quality checks before recommending or installing a skill. | `harness-builder` when adopting a project capability |`n
## Common routes

```text
Tiny edit:
implement -> verify

Unclear feature:
brainstorm -> plan -> harness-builder -> implement -> review -> verify -> cleanup

Clear task in an unfamiliar repo:
plan -> harness-builder -> implement -> review -> verify

Broken command:
diagnose -> implement -> verify

Harness audit or repair:
harness-builder -> verify -> cleanup

```

The lanes can loop. If verification discovers a missing browser runner, external API, local skill, or recovery gap, route that gap back to `harness-builder` instead of burying it inside implementation.

## Install

### Codex

```bash
codex plugin marketplace add YSAA1/harness-workflow
```

Then install `harness-workflow` from the Codex plugin directory. Run the repo check when editing this project:

```bash
node scripts/check-plugin.mjs
```

More details: [docs/install/codex.md](docs/install/codex.md).

### Claude Code

```bash
claude plugin marketplace add YSAA1/harness-workflow
claude plugin install harness-workflow@harness-workflow
```

Use the namespaced commands:

```text
/harness-workflow:harness-builder
```

More details: [docs/install/claude-code.md](docs/install/claude-code.md).

### Cursor

When Cursor plugin installation is available, use the Cursor plugin flow:

```text
/add-plugin harness-workflow
```

For project-local use, copy the rules and skills into the target repo:

```bash
node scripts/install-cursor.mjs --target .
node scripts/check-cursor-install.mjs
```

More details: [docs/install/cursor.md](docs/install/cursor.md).

## Check this repo

```bash
bash scripts/agent/check.sh
```

The agent check wraps the default local structure checks:

```bash
node scripts/check-plugin.mjs
node scripts/check-claude-code-install.mjs
node scripts/check-cursor-install.mjs
node scripts/install-cursor.mjs --target . --dry-run
```

When the Claude Code CLI is installed, CI also runs `claude plugin validate .`.

## Repository layout

| Path | Purpose |
| --- | --- |
| `skills/*/SKILL.md` | Canonical workflow skill source. |
| `skills/*/references/` | Extra checklists and policy notes loaded only when needed. |
| `plugins/harness-workflow/` | Codex-installable plugin package used by the GitHub marketplace. |
| `.codex-plugin/` | Codex plugin metadata. |
| `.claude-plugin/` | Claude Code plugin metadata and marketplace entry. |
| `.cursor-plugin/`, `rules/`, `.cursor/rules/` | Cursor plugin and project-rule adapter surface. |
| `docs/assets/readme/` | README icon and imagegen infographic PNG assets. |
| `docs/install/` | Install notes for each supported agent surface. |
| `docs/integrations/` | Notes for optional external workflow integrations such as SkillOpt. |
| `scripts/agent/check.sh` | Agent-facing fast verification entry. |
| `scripts/check-*.mjs` | Consistency and recognition checks. |

## License

MIT.
