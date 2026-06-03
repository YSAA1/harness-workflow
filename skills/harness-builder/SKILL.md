---
name: harness-builder
description: "Project-level Harness Builder for designing or repairing the project workbench and recovery surface: AGENTS.md/CLAUDE.md, project map, project iron laws, verification entry point, reusable skills, justified hooks, subagents, MCP policy, Capability Discovery, and anti-entropy guardrails. Trigger when the user says harness builder, bootstrap, initialize, onboard, build harness, prepare workbench, create project rules, find reusable skills, or repair recovery surface."
---

# Harness Builder

Build or repair the minimal useful **project-level harness** for AI coding agents: project map, Project iron laws, protected paths, verification entry, recovery surface, reusable skills, hooks, MCP policy, subagent policy, audit records, and cleanup discipline. "bootstrap" is only a historical alias.

Default to project-local output. Do not modify user-global config unless explicitly requested.

One integrated gap model: decide which harness coverage areas are missing, then whether files, scripts, skills, hooks, MCP, or subagents close each gap. No separate profile lane competing with Capability Discovery.

## 语言策略

- 用户可见文本跟随用户语言；中文用户场景下，Harness 证据、Charter、Coverage Matrix、Capability Discovery、Plan 和 User Checkpoint 使用中文为主的标题和说明。
- 协议稳定优先：协议 token 如 `HARNESS EVIDENCE`、`HARNESS CHARTER`、`USER CHECKPOINT`、`Required / Recommended / Deferred / Rejected`、文件路径、命令、skill 名和安装面标识可保留英文，必要时使用中文标签 + 英文 token。
- 不把 harness 输出硬编码为中文-only；英文用户或其他语言用户按其主要输入语言输出，机器可读 token 保持稳定。
- 渲染 `templates/*.j2` 时，先确定 `target_language` / `user_language`。模板默认英语，中文场景通过语言条件输出中文标签；不要把项目本地 harness 文件无条件写成中文-only。

## When to use

- User asks to bootstrap, initialize, onboard, build harness, create project rules, or repair agent governance.
- Project entry, verification command, recovery surface, protected paths, or capability policy is unclear.
- The repo needs project-local skills, hooks, MCP, subagents, or anti-entropy rules evaluated.
- User explicitly asks for autoresearch, autonomous research, repeated investigation, or method exploration.

Prefer running after `brainstorm` or `plan` when goal, non-goals, success criteria, implementation shape, and verification strategy are known. Direct harness audit is allowed, but still starts from evidence and must produce a user-visible harness contract before installation.

## Mandatory execution gates

Unless the user asks for read-only explanation or a narrower single-file task, run these gates in order. If skipped, state why.

1. **Evidence gate** — Collect repo evidence before questions or installation (`AGENTS.md`/`CLAUDE.md`, README, docs, scripts, tests, CI, git, `.harness/`, skills dirs). Do not start by generating files. Do not invent acceptance criteria; route unclear goals to `brainstorm` / `plan`. Optionally use `scripts/scan_project.py`.

2. **Question gate** — Ask only questions that change harness design (target outcome, non-goals, acceptance criteria, verification depth, source of truth). If none needed: `No user questions needed` plus evidence-backed assumptions.

3. **Harness Charter gate** — Before the Harness Plan: objective, non-goals, user-facing acceptance criteria, verification path, evidence location, selected recovery surface, source-of-truth priority, and existing components to keep/patch/archive/reject. Unknown fields → ask or route; no template filler.

4. **Coverage Matrix gate** — One `Required / Recommended / Deferred / Rejected` table across: agent entry and project map; static docs and durable rules; recovery surface; verification entry; architecture boundaries; anti-entropy; skill/hook/MCP/subagent/external-research fit; dynamic context; commit protocol (default `Deferred`). See `references/coverage_matrix_policy.md`, `references/architecture_enforcement_policy.md`, `references/anti_entropy.md`.

5. **Capability Discovery gate** — Only after real gaps. Bind every candidate capability to one coverage row. Run **Capability Shortlist pass** (repo signal → source evidence → freshness → candidate → coverage row → why → install surface → trust boundary → approval → risk/cost → fallback → verification probe → classification). Default 1–2 candidates per category; defer extras. On strong stack signals, **actively recommend** low-risk project-local candidates as `Recommended`; **Do not install on user silence**. For skills: `$find-skills` / `find-skills` or `No reusable skill search needed` with reason. For hooks/MCP/subagents/CI when external behavior matters: **targeted web search** or `No web research needed` with reason. Read `references/capability_signal_policy.md` and `references/capability_starter_catalog.md`. If the user explicitly asks for capability, automation, setup, or install recommendations, switch to **Full Recommendation Mode**: read `references/automation_recommendation_guide.md` plus the relevant `automation_*` references, output a broader read-only recommendation report, and include install surface, approval boundary, fallback, and verification probe for each candidate.

6. **Verification design gate** — Fast check, deeper smoke/E2E/manual check, evidence location, unverified risks, and per-phase acceptance before installation.

7. **User checkpoint gate** — Show Harness Plan; wait for approval unless this turn already authorized direct changes.

```text
USER CHECKPOINT
安装项目前，请先确认这个 Harness Plan：
- 章程 / Charter:
- 覆盖矩阵 / Coverage:
- 新增安装 / Install:
- 修补现有文件 / Patch existing:
- 归档或降级 / Archive/deprecate:
- 暂缓 / Defer:
- 拒绝 / Reject:
- 验证 / Verification:
请回复：approve / change / stop。
```

8. **Verification gate** — After installation, run validation and phase checks, or record blockers. No fresh evidence → no ready claim.

9. **Research Graduation gate** — Only when Research Route is used. See `references/research_route_policy.md`; then `review` and `cleanup`.

**Hard rules (apply throughout):** Reconcile existing harness before adding/replacing. Audit `AGENTS.md` every run; patch only stable facts (overview, map, iron laws, protected paths, required reading, recovery pointer, verification entry). Dynamic state → recovery surface only (`active_slice`, plans, session notes, Research Route state). Do not create a second recovery surface. Add files or capabilities only when they close a named coverage gap. Keep `AGENTS.md` thin. Prefer mechanical enforcement (tests, lint, ratchets) over prose-only rules. Capability decisions cover skills, hooks, MCP, subagents, external research, CI, GC. Use `references/research_route_policy.md` before Research Route work.

Working model:

```text
repo evidence + user intent + existing harness reconciliation
-> Harness Hypothesis -> Harness Charter -> Coverage Matrix
-> Capability Discovery -> Harness Plan -> USER CHECKPOINT
-> project-local install by phase -> phase verification and audit records
```

## Workflow

1. **Collect evidence** — Read user intent and repo surfaces; detect stack and verification commands; probe cheap dynamic context (`git status`, diagnostics, CI if available). For existing harnesses, classify authoritative vs stale sources.
2. **Reconcile** — Keep/patch/archive/reject existing artifacts; name source of truth; migrate volatile state out of `AGENTS.md`. See `references/recovery_surface_policy.md`, `references/anti_entropy.md`, `references/install_policy.md`.
3. **Harness Hypothesis** — Known facts, dynamic state, intent, missing info, questions, assumptions; map gaps to coverage areas (12-lesson harness checklist: where capable agents still fail, what belongs in repo truth, thin entry, continuity, scope, gates, smoke, observability, clean session end).
4. **Orchestration** — Solo for small repos; read-only **subagent** only for mapped gaps. Main agent installs. See `references/subagent_orchestration.md`.
5. **Coverage Matrix** — Classify each area; record how each selected row will be satisfied.
6. **Capability Discovery** — Shortlist pass; stack signals from `capability_starter_catalog.md`; for explicit recommendation/setup requests, use Full Recommendation Mode and the `automation_*` reference library; record external research in `.harness/research_notes.md` when used.
7. **Research Route** (explicit only) — Goal, Hypothesis, Counter-hypothesis, Baseline, Scope, Metric, Verify, Guard, Budget, Artifact policy, Stop rule. If approved, install `templates/research_route/*`. Preserve failed evidence before `git reset --hard` on isolated research branches only.
8. **Recovery surface** — none, lightweight, three-file, feature-list, or existing; map `active_slice` → `task_plan.md`, evidence → `progress.md`, decisions → `findings.md` when using three-file.
9. **Charter + phased Plan** — Merge coverage, capabilities, recovery, verification into Harness Plan with per-phase acceptance.
10. **Checkpoint** — Emit `USER CHECKPOINT`; wait for `approve / change / stop`.
11. **Install by phase** — `Required` only unless user approves more; prefer `AGENTS.md`, `scripts/agent/check.sh`, `docs/agent/*`, `.harness/*`, `.agents/skills/*`. Use `templates/` for boilerplate; hooks optional unless they block concrete high-risk failures tests cannot catch.
12. **Verify and record** — `scripts/validate_harness.py` when useful; update `.harness/manifest.yaml`, `.harness/decisions.md`, `.harness/state.md`; anti-entropy per `references/anti_entropy.md`.

## 输出契约

Before approved installation:

```text
HARNESS EVIDENCE
EXISTING HARNESS RECONCILIATION
HARNESS QUESTIONS
HARNESS CHARTER
HARNESS COVERAGE MATRIX
CAPABILITY DISCOVERY
VERIFICATION DESIGN
HARNESS PLAN
USER CHECKPOINT
```

After approved installation:

```text
HARNESS INSTALL REPORT
PHASE VERIFICATION
RECORDED STATE
NEXT
```

Render localized labels adjacent to protocol token lines, not by changing the token lines.

Always state evidence, unknowns, questions, charter assumptions, coverage decisions, install/patch/archive/defer/reject, capability value/cost, verification plan, phase status, and skipped-gate reasons.

## Recommended next skill

| Situation | Recommended next skill |
| --- | --- |
| Harness files or capabilities were installed or repaired | `verify` |
| Harness hypothesis exposes unclear goals, non-goals, or success criteria | `brainstorm` |
| Harness plan is approved and first work slice is clear | `implement` |
| Research Route completes | `review`, then `cleanup` |
| Harness verification fails or setup breaks | `diagnose` |
| Harness is current and no implementation is requested | `cleanup` |
