---
name: harness-builder
description: "Use when the user asks to bootstrap, initialize, onboard, repair, or recommend a project-level AI-agent workbench: AGENTS/CLAUDE entry, verification, recovery surface, Capability Recommendation, hooks, MCP, subagents, skills, commands, or anti-entropy guardrails."
---

# Harness Builder

Build or repair the minimal useful **project-level harness** for AI coding agents: project map, Project iron laws, protected paths, verification entry, selected recovery surface, reusable skills, hooks, MCP policy, subagent policy, audit records, and cleanup discipline. "bootstrap" is only a historical alias.

Default to project-local output. Do not modify user-global config unless explicitly requested. First pass is always read-only; do not write files, create hooks, add MCP config, install plugins, or create subagents until the user approves concrete actions at `USER CHECKPOINT`.

Use one integrated recommendation model: read repo evidence, explain what would help future agents, then recommend concrete files, scripts, skills, hooks, MCP, subagents, plugins, commands, or CI/headless automation. Capability recommendations are development-workflow aids for this project, not product features to implement.

## Scope boundary

Harness Builder's deliverable is the harness itself — the workbench, recovery surface, verification entry, and Capability Recommendations that serve **future** work on this project. It is not a lane for performing the task that the supplied context describes.

When the user hands you task, feature, bug, or requirement context alongside this skill, treat that context as **evidence** for what harness the project needs, not as a work order to carry out. Use it only to decide which harness artifacts and capabilities to recommend, install, or repair. Do not write feature code, fix the bug, or otherwise complete the described task inside this skill.

Recommending or installing a capability is the deliverable; using that capability to do the work is not. The Capability Recommendation pass selects capabilities that serve the project's workflow — it never becomes the act of executing the task. If the user actually wants the task done, finish the harness (or stop at `No install recommended`) and route to `plan`, `implement`, or `diagnose`.

## 语言策略

- 用户可见文本跟随用户语言；中文用户场景下，Harness 证据、Recommendation Contract、Recommendation Matrix、Capability Recommendations、Plan 和 User Checkpoint 使用中文为主的标题和说明。
- 协议稳定优先：协议 token 如 `HARNESS EVIDENCE`、`HARNESS RECOMMENDATION CONTRACT`、`HARNESS RECOMMENDATION MATRIX`、`USER CHECKPOINT`、`Required / Recommended / Deferred / Rejected`、文件路径、命令、skill 名和安装面标识可保留英文，必要时使用中文标签 + English token。

## When to use

- User asks to bootstrap, initialize, onboard, build harness, create project rules, or repair agent governance.
- Project entry, verification command, recovery surface, protected paths, or capability policy is unclear.
- The repo needs project-local skills, hooks, MCP, subagents, or anti-entropy rules evaluated.
- User explicitly asks for autoresearch, autonomous research, repeated investigation, or method exploration.

Prefer running after `brainstorm` or `plan` when goal, non-goals, success criteria, implementation shape, and verification strategy are known. Direct harness recommendation is allowed. Start from evidence and keep the report easy to read.

## Harness Recommendation Mode

Use one mode: read-only recommendation first, then approved installation. This is not an automation shopping lane; it is a gap-driven workbench design pass.

## Workflow

Recommended flow: use this workflow unless the user asks for a narrower read-only answer or single-file task.

1. **Evidence gate** — Collect repo evidence before questions or installation (`AGENTS.md`/`CLAUDE.md`, README, docs, scripts, tests, CI, git, `.harness/`, skills dirs). Do not start by generating files. Read any supplied task/feature/bug context as harness-design evidence, not as a task to execute. Do not invent acceptance criteria; route unclear goals to `brainstorm` / `plan`. Probe cheap dynamic context (`git status`, diagnostics, CI if available). Optionally use `scripts/scan_project.py`.

2. **Question gate** — Ask only questions that change harness design (target outcome, non-goals, acceptance criteria, verification depth, source of truth). If none needed: `No user questions needed` plus evidence-backed assumptions.

3. **Harness Hypothesis + recommendation contract** — Known facts, dynamic state, intent, missing info, questions, assumptions, objective, non-goals, verification path, evidence basis, selected recovery surface, source-of-truth priority, and existing components to keep/patch/archive/reject. Unknown fields → ask or route; no template filler.

4. **Recommendation table** — One `Required / Recommended / Deferred / Rejected` table across: agent entry and project map; static docs and durable rules; recovery surface; verification entry; architecture boundaries; anti-entropy; skills; hooks; MCP; subagents; plugins; commands/CI/headless automation; external research; dynamic context; commit protocol (default `Deferred`). See `references/recommendation_matrix_policy.md`, `references/architecture_enforcement_policy.md`, `references/anti_entropy.md`, and `references/automation_recommendation_guide.md`.

5. **Capability Recommendation pass** — Bind each candidate to one recommendation row and show enough detail to act: type, recommendation, repo signal, why, install surface, approval needed, fallback, verification probe, and priority/classification. Default 1-2 candidates per relevant category; if the user explicitly asks for setup or installation recommendations, cover MCP, skills, hooks, subagents, plugins, and commands/CI/headless automation with candidates or clear defer/reject reasons. Do not stop at installed/local skills; use `references/capability_discovery_playbook.md`, `automation_recommendation_guide.md`, the `automation_*` references, `$find-skills` / `find-skills`, targeted web search, or local official docs when repo evidence points to ecosystem-specific tools. Record `No reusable skill search needed` or `No web research needed` only with a reason.

6. **Verification design gate** — Fast check, deeper smoke/E2E/manual check, evidence location, unverified risks, and per-phase acceptance before installation.

7. **User checkpoint** — Only ask for approval when there is at least one concrete install, patch, archive, or config action. If there is no action to approve, say `No install recommended` and stop with the recommendation summary.

8. **Approved install phase** — Install or patch only approved project-local items; `Required` only unless the user approves more. Prefer `AGENTS.md`, `scripts/agent/check.sh`, docs, `.harness/*`, `.agents/skills/*`, and templates. Recovery backend options include `none`, `lightweight`, `three-file`, `feature-list`, and `existing`; when using three-file, map `active_slice` to `task_plan.md`, evidence to `progress.md`, and decisions to `findings.md`. Keep higher-risk credential-bearing, write-capable, global, destructive, blocking, or long-running items behind explicit approval.

9. **Verification** — After installation, run validation and phase checks, or record blockers. No fresh evidence → no ready claim.

10. **Research Graduation gate** — Only when Research Route is used. See `references/research_route_policy.md` and `templates/research_route`; preserve failed evidence before `git reset --hard` on isolated research branches only, then route through `review` and `cleanup`.

**Hard rules:** Do not execute the supplied task here. Reconcile existing harness before adding/replacing. Audit `AGENTS.md` every run; patch only stable facts. Dynamic state → recovery surface only (`active_slice`, plans, session notes, Research Route state). Do not create a second recovery surface. Add files or capabilities only when they close a named coverage gap. Keep `AGENTS.md` thin. Prefer mechanical enforcement (tests, lint, ratchets) over prose-only rules. Capability decisions cover skills, hooks, MCP, subagents, external research, CI, GC.

For operational details read only what is needed:

- `references/recommendation_matrix_policy.md` for Harness Recommendation Matrix rows and binding.
- `references/capability_discovery_playbook.md` for precise external/tool recommendations.
- `references/automation_recommendation_guide.md` and `references/automation_*` for candidate fields and install surfaces.
- `references/recovery_surface_policy.md`, `verification_policy.md`, `anti_entropy.md`, and `architecture_enforcement_policy.md` for workbench design details.
- `references/subagent_orchestration.md` and `research_route_policy.md` only when those rows are relevant.

## Output shape

Before approved installation, produce a concise Harness Recommendation Plan:

- codebase profile and evidence summary
- existing harness reconciliation
- Harness Recommendation Matrix
- Capability Recommendation table with priority, type, recommendation, value, install surface, approval needed, fallback, verification probe, and classification
- short notes for deferred/rejected items
- next choices

Use `USER CHECKPOINT` only when asking the user to approve concrete install/patch/archive/config actions. Do not ask `approve / change / stop` for a no-op. After approved installation, report what changed, what verification ran, what remains risky, and the next step.

Minimal checkpoint text:

```text
USER CHECKPOINT
安装项目前，请先确认这个 Harness Recommendation Plan：
请回复：approve / change / stop。
```

## Recommended next skill

| Situation | Recommended next skill |
| --- | --- |
| Harness files or capabilities were installed or repaired | `verify` |
| Harness hypothesis exposes unclear goals, non-goals, or success criteria | `brainstorm` |
| Harness plan is approved and first work slice is clear | `implement` |
| Research Route completes | `review`, then `cleanup` |
| Harness verification fails or setup breaks | `diagnose` |
| Harness is current and no implementation is requested | `cleanup` |
