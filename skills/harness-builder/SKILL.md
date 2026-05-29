---
name: harness-builder
description: "Project-level Harness Builder for designing or repairing the project workbench and recovery surface: AGENTS.md/CLAUDE.md, project map, project iron laws, verification entry point, reusable skills, justified hooks, subagents, MCP policy, Capability Discovery, and anti-entropy guardrails. Trigger when the user says harness builder, bootstrap, initialize, onboard, build harness, prepare workbench, create project rules, find reusable skills, or repair recovery surface."
---

# Harness Builder

Build or repair the minimal useful **project-level harness** for AI coding agents.

A harness is the repo-local operating system around the agent: project map, Project iron laws, protected paths, verification entry, recovery surface, reusable skills, hooks, MCP policy, subagent policy, audit records, and cleanup discipline. "bootstrap" is only a historical alias.

Default to project-local output. Do not modify user-global config unless explicitly requested.

Harness Builder uses one integrated gap model. Do not create a separate "profile" lane that competes with Capability Discovery. First decide which harness coverage areas are missing, then decide whether files, scripts, skills, hooks, MCP, or subagents are the right way to close each gap.

## 语言策略

- 用户可见文本跟随用户语言；中文用户场景下，Harness 证据、Charter、Coverage Matrix、Capability Discovery、Plan 和 User Checkpoint 使用中文为主的标题和说明。
- 协议稳定优先：协议 token 如 `HARNESS EVIDENCE`、`HARNESS CHARTER`、`USER CHECKPOINT`、`Required / Recommended / Deferred / Rejected`、文件路径、命令、skill 名和安装面标识可保留英文，必要时使用中文标签 + 英文 token。
- 不把 harness 输出硬编码为中文-only；英文用户或其他语言用户按其主要输入语言输出，机器可读 token 保持稳定。
- 渲染或安装 `templates/*.j2` 时，先确定 `target_language` / `user_language`。模板默认英语，中文场景通过语言条件输出中文标签；不要把项目本地 harness 文件无条件写成中文-only。

## When to use

- User asks to bootstrap, initialize, onboard, build harness, create project rules, or repair agent governance.
- Project entry, verification command, recovery surface, protected paths, or capability policy is unclear.
- The repo needs project-local skills, hooks, MCP, subagents, or anti-entropy rules evaluated.
- User explicitly asks for autoresearch, autonomous research, repeated investigation, or method exploration.

Prefer running after `brainstorm` or `plan` when goal, non-goals, success criteria, implementation shape, and verification strategy are known. Direct harness audit is allowed, but still starts from evidence and must still produce a user-visible harness contract before installation.

## Hard rules

- Do not start by generating files.
- Collect repo evidence before questions or installation.
- Ask only questions that change harness design.
- Do not invent acceptance criteria silently. If objective, non-goals, success criteria, or verification strategy are not evidence-backed, ask or route to `brainstorm` / `plan`.
- Do not install a harness until the Harness Charter states what this harness must make possible and how the user will know it worked.
- When a repo already has harness files, reconcile the existing system before adding or replacing anything.
- Audit `AGENTS.md` and the selected recovery surface on every run.
- Patch `AGENTS.md` only when durable repo-level facts changed: project overview, project map, stable iron laws, protected paths, required reading, selected recovery surface pointer, verification entry, or source-of-truth priority.
- Put dynamic state in the selected recovery surface, never in `AGENTS.md`: active slices, temporary plans, session summaries, debugging notes, one-off conclusions, Research Route runtime state, or unapproved automation catalogs.
- Do not install on user silence.
- Add files or capabilities only when they close a named coverage gap.
- Do not add skills, hooks, MCP, subagents, CI, or GC scans as generic "best practice"; bind every one to an uncovered need.
- Treat install packs as implementation assets, not workflow owners. Packs cannot make a coverage row Required, bypass the user checkpoint, overwrite existing files, or install capabilities outside their declared namespace.
- Treat three-file as one backend option, not the workflow identity.
- Keep `AGENTS.md` thin and stable; never mix current active-slice state, one-off conclusions, or stale recovery notes into it.
- Prefer mechanical enforcement for stable architecture boundaries: tests, lint rules, ratchets, and agent-readable errors beat prose-only rules.
- Do not claim the harness works without fresh evidence.
- Use `references/research_route_policy.md` before Research Route work.

Working model:

```text
repo evidence + user intent + existing harness reconciliation
-> Harness Hypothesis
-> Harness Charter
-> Coverage Matrix
-> Capability Discovery for uncovered gaps
-> Capability Shortlist pass for selected rows
-> Pack Selection for selected coverage rows
-> Harness Plan
-> user checkpoint
-> project-local install by phase
-> phase verification and audit records
```

## Mandatory execution gates

These gates are required unless the user explicitly asks for read-only explanation or a narrower single-file task. If skipped, state why.

1. **Question gate**
   - After evidence collection, ask the smallest material question set.
   - Questions must cover missing target outcome, non-goals, acceptance criteria, verification depth, and current source of truth when those are not already clear.
   - If no question is needed, say `No user questions needed` and list evidence-backed assumptions.
   - If fast/deep validation is unclear, ask at least one verification question before writing the Harness Plan.

2. **Harness Charter gate**
   - Before the Harness Plan, state:
     - objective and non-goals for this harness;
     - user-facing acceptance criteria;
     - verification path and evidence location;
     - selected recovery surface and source-of-truth priority;
     - existing harness components to keep, patch, archive, or reject.
   - If any required field is unknown, ask the user or route to `brainstorm` / `plan`; do not fill it with template text.

3. **Coverage Matrix gate**
   - Always produce a single `Required / Recommended / Deferred / Rejected` table across these coverage areas:
     - agent entry and project map;
     - static documentation and durable rules;
     - selected recovery surface;
     - verification entry and deeper checks;
     - architecture boundaries and mechanical enforcement;
     - anti-entropy and stale-state detection;
     - skill fit;
     - hook fit;
     - MCP fit;
     - subagent fit;
     - external research fit;
     - dynamic context: git, diagnostics, CI, logs, or available runtime signals;
     - commit protocol and milestone discipline（当项目需要 tracked milestone commits 时）.
   - commit protocol 默认 `Deferred`，只有项目明确需要 milestone tracking 或多 agent 协作时升为 `Recommended`。
   - For each row, say whether existing artifacts already satisfy it, need patching, need a new install, or should be deferred/rejected.
   - If architecture boundaries are requested or implied, decide whether prose is enough or whether `LAYERS.md`, boundary tests, lint rules, or ratchets are needed.
   - Use `references/coverage_matrix_policy.md`, `references/architecture_enforcement_policy.md`, and `references/anti_entropy.md`.

4. **Capability Discovery gate**
   - Evaluate skills, hooks, MCP, subagents, external research, CI, GC, and helper scripts only after the Coverage Matrix exposes a real gap.
   - Bind every candidate capability to one coverage row. If no row needs it, reject it.
   - Run a `Capability Shortlist pass` for uncovered or weak rows: each candidate must state repo signal, source evidence, freshness, candidate, coverage row, why, install surface, trust boundary, approval needed, risk/cost, fallback, verification probe, and `Required / Recommended / Deferred / Rejected`.
   - Default to 1-2 candidates per capability category; put extra plausible options in `Deferred`.
   - If the user only asked for read-only analysis or recommendations, output a recommendation report only. Do not write files, create install plans, or proceed to Pack Selection.
   - For skill gaps, invoke `$find-skills` / `find-skills` or state `No reusable skill search needed` with reason.
   - For hooks, MCP, subagents, agent config, CI, GC, architecture tools, or recently changed external tool behavior, use targeted web search or state `No web research needed` with reason.
   - Prefer warning/baseline/ratchet behavior for existing projects over strict rules that break the current build.
   - Use `references/capability_signal_policy.md`.

5. **Pack Selection gate**
   - Run only after the Coverage Matrix and Capability Discovery expose a real gap.
   - Available install packs live under `references/packs/`; currently `init_scaffold` is the concrete scaffold pack for AGENTS snippets, architecture docs, boundary tests, linter snippets, CI templates, read-only GC, and security docs.
   - A pack cannot decide that a component is Required; it only implements rows already marked Required or explicitly approved Recommended.
   - Read `references/packs/init_scaffold/adapter.md` and `references/packs/init_scaffold/precedence.md` before using the init scaffold pack.
   - Produce a pack dry-run before installation: target files, create/patch/skip status, coverage-row binding, verification command, and blockers.
   - Reject any pack output that is not bound to exactly one primary coverage row or that duplicates a better existing artifact.
   - Hooks, MCP, subagents, and Research Route remain governed only by their existing policies; the init scaffold pack must not install them.

6. **Verification design gate**
   - Before installation, propose fast default check, deeper smoke/E2E/manual check, evidence location, and unverified risks.
   - If validation command is unknown, ask whether to adopt a conservative default: syntax/import/config smoke, dry-run, or equivalent.
   - For every planned install or patch phase, define phase acceptance: artifact exists plus relevant command/manual evidence, or blocker recorded.

7. **User checkpoint gate**
   - Before writing or installing harness files, show the Harness Plan and ask for approval.
   - Keep the protocol token `USER CHECKPOINT` exact. Render human labels in the user's language. Chinese-user example:

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

8. **Verification gate**
   - After installation, run the selected validation command and phase checks, or state the concrete blocker.
   - No fresh evidence means no ready claim.

9. **Research Graduation gate**
   - Required only when Research Route is used.
   - Before calling research work done, choose a winner or explicit no-winner closeout, declare the merge mode, and record a branch/worktree cleanup checkpoint.
   - After graduation, route through `review` and `cleanup`; research does not directly become done.
   - Use `references/research_graduation_policy.md` and `references/research_entropy_gate.md`.

## Workflow

1. **Collect evidence**
   - Read user intent, `AGENTS.md`/`CLAUDE.md`, README, docs, scripts, tests, CI, git state, existing `.harness/`, `.agents/skills/`, `.codex/`, `.claude/`, protected/generated paths.
   - Detect stack and workbench facts when relevant: language, framework, package manager, build tool, test runner, linter, source roots, import patterns, and available verification commands.
   - Probe dynamic context when cheap and safe: `git status`, recent commits, diagnostics/lint, CI status if available, current recovery state, known broken checks, logs or runtime signals if already exposed.
   - For existing harnesses, identify authoritative vs stale sources and note conflicting claims before planning changes.
   - Optionally invoke `find-skills` early to scan stack-related reusable skills; record results in Capability Discovery instead of installing immediately.
   - Use `scripts/scan_project.py` if useful.

2. **Reconcile existing harness**
   - If harness artifacts already exist, classify each as keep, patch, archive/deprecate, or reject.
   - Name the current source of truth for project rules, active work, evidence, decisions, and next actions.
   - Audit `AGENTS.md` against current repo evidence. Patch it only for stable facts; migrate volatile state into the selected recovery surface before removing it from the entrypoint.
   - Do not create a second recovery surface unless the existing one cannot represent the required semantic fields.
   - Use `references/recovery_surface_policy.md`, `references/anti_entropy.md`, and `references/install_policy.md`.

3. **Form Harness Hypothesis**
   - Summarize known repo facts, dynamic state, known user intent, missing info, questions, assumptions, and course coverage.
   - Use `references/brainstorming_policy.md` and `references/course_alignment.md`.

4. **Choose orchestration mode**
   - Use solo mode for small repos.
   - Recommend read-only subagents only for specific gaps: repo map, verification, risk, skills, research, or plan review.
   - Main agent installs files. See `references/subagent_orchestration.md`.

5. **Build the Coverage Matrix**
   - Classify each coverage area as `Required`, `Recommended`, `Deferred`, or `Rejected`.
   - Record how each selected row will be satisfied: existing artifact, small patch, new project-local file, script, test, lint rule, CI, GC scan, skill, hook, MCP, subagent, or manual practice.
   - Keep hooks, MCP, subagents, and project-local skills inside this matrix; do not evaluate them as a separate shopping list.
   - If user only asked for a narrow coverage area, keep unrelated rows deferred and explain why.

6. **Run Capability Discovery for uncovered gaps and stack signals**
   - For reusable skills, use `find-skills` when a real coverage row needs repeatable workflow knowledge.
   - For hooks/MCP/external agent behavior/CI/GC/architecture tooling, use targeted web search against official docs or mature sources when current external behavior matters.
   - Stack shape may directly produce capability candidates when the signal is concrete; still bind every candidate to one Coverage Matrix row.
   - Run the Capability Shortlist pass after evidence gathering: repo signal -> source evidence -> freshness -> candidate -> coverage row -> why -> install surface -> trust boundary -> approval needed -> risk/cost -> fallback -> verification probe -> classification.
   - Classify each candidate as `Required`, `Recommended`, `Deferred`, or `Rejected` by value, enablement, risk/cost, and fallback.
   - Reject candidates that do not close exactly one named gap or duplicate a simpler file/script/test.
   - In recommendation-only mode, stop at the report and do not write files or install capabilities.
   - Record adopted external research in `.harness/research_notes.md`.
   - See `references/capability_signal_policy.md`, `references/skill_policy.md`, `references/web_research_policy.md`, `references/hook_policy.md`, `references/mcp_policy.md`.

7. **Select install packs for approved coverage rows**
   - If architecture docs, boundary tests, linter snippets, CI, GC, or SECURITY.md are selected, use `references/packs/init_scaffold/adapter.md` to map those needs to concrete scaffold components.
   - Keep the builder core policies authoritative: `coverage_matrix_policy.md`, `install_policy.md`, `verification_policy.md`, `recovery_surface_policy.md`, `anti_entropy.md`, and `architecture_enforcement_policy.md`.
   - Run or present a dry-run before writing. The dry-run must show files that would be created, patched, skipped, deferred, and rejected.
   - Record pack decisions in `.harness/manifest.yaml` and `.harness/decisions.md`.

8. **Handle Research Route only when explicit**
   - Require Goal, Hypothesis, Counter-hypothesis, Baseline, Scope, Metric, Verify, Guard, Budget, Artifact policy, and Stop rule.
   - If incomplete, return to gap-driven questions.
   - If approved, install `templates/research_route`: `docs/research/research_plan.md`, `docs/research/evidence_log.md`, `docs/research/iteration_protocol.md`, `.harness/research_manifest.yaml`.
   - Preserve failed evidence before rollback. Use `git reset --hard` only inside an approved isolated research branch/worktree after evidence is recorded.
   - Before closeout, apply `references/research_graduation_policy.md` and `references/research_entropy_gate.md`.

9. **Choose recovery surface**
   - Options: none, lightweight, three-file, feature-list, existing system.
   - For three-file, map `active_slice` to `task_plan.md`, evidence to `progress.md`, decisions/risks to `findings.md`.
   - Declare semantic field mapping. Do not force file layout. See `references/recovery_surface_policy.md`.

10. **Write Harness Charter and phased Plan**
   - Charter first: objective, non-goals, user-facing acceptance criteria, verification path, evidence location, selected recovery surface, and source-of-truth priority.
   - Then merge evidence, answers, coverage decisions, capability decisions, research, orchestration, recovery surface, and verification design into the Harness Plan.
   - Structure install work as phases. Each phase must have purpose, target files, acceptance criteria, verification evidence, and failure handling.
   - Use `references/coverage_matrix_policy.md`, `references/decision_matrix.md`, `references/verification_policy.md`, and only the specific capability policy needed.

11. **Checkpoint**
   - Emit `USER CHECKPOINT`.
   - Wait for explicit approval unless user already authorized direct changes in this turn.

12. **Install approved project-local components by phase**
   - Install `Required` only unless user approves more.
   - Prefer `AGENTS.md`, `scripts/agent/check.sh`, `docs/agent/*`, `.harness/*`, `.agents/skills/*`, `.codex/*`.
   - For existing harness files, patch only approved sections and record whether old content was kept, moved, or marked stale.
   - When adding architecture boundaries to an existing repo, establish baseline/warn-first behavior before strict enforcement.
   - Hooks remain optional unless they block a concrete high-risk failure that tests or review cannot catch.
   - Use templates instead of hand-creating large boilerplate. See `references/install_policy.md`.

13. **Verify and record**
   - Validate files, frontmatter, JSON/TOML/YAML, hook scripts, and fast check command.
   - Mark each phase `pass`, `blocked`, `skipped`, or `deferred`; do not collapse partial failure into a ready claim.
   - Use `scripts/validate_harness.py` where possible.
   - Update `.harness/manifest.yaml`, `.harness/decisions.md`, `.harness/state.md`, skill inventory, and research notes.
   - Use `references/anti_entropy.md` for cleanup drift.

## 输出契约

Before approved installation:

```text
HARNESS EVIDENCE
EXISTING HARNESS RECONCILIATION
HARNESS QUESTIONS
HARNESS CHARTER
HARNESS COVERAGE MATRIX
CAPABILITY DISCOVERY
PACK SELECTION
PACK DRY RUN
VERIFICATION DESIGN
HARNESS PLAN
USER CHECKPOINT
```

Render localized human labels adjacent to these exact protocol token lines, not by changing the token line itself.

After approved installation:

```text
HARNESS INSTALL REPORT
PACK INSTALL REPORT
PHASE VERIFICATION
RECORDED STATE
NEXT
```

Always state found evidence, unknowns, user questions, charter assumptions, coverage decisions, pack decisions, install/patch/archive/defer/reject decisions, capability value/cost, verification plan, phase status, and skipped-gate reasons.
For each capability recommendation, include repo signal, coverage-row binding, install surface, risk/cost, fallback, and classification.

## Recommended next skill

| Situation | Recommended next skill |
| --- | --- |
| Harness files or capabilities were installed or repaired | `verify` |
| Harness hypothesis exposes unclear goals, non-goals, or success criteria | `brainstorm` |
| Harness plan is approved and first work slice is clear | `implement` |
| Research Route completes | `review`, then `cleanup` |
| Harness verification fails or setup breaks | `diagnose` |
| Harness is current and no implementation is requested | `cleanup` |

## Preservation rule for existing harness-builder assets

When adding install packs, preserve current harness-builder assets unless a user explicitly approves removing or replacing them. In particular, do not drop or weaken:

- `references/harness_subsystems.md`, `references/project_map_policy.md`, or `references/subagent_policy.md`;
- `templates/research_route/*`;
- `templates/agents/*`, `templates/hooks/*`, and `templates/skills/*`;
- `templates/project_context.md.j2`, `templates/workflow.md.j2`, `templates/verification.md.j2`, `templates/reports/verification_report.md.j2`, `templates/risk_register.md.j2`, `templates/features.json.j2`, or `templates/AGENTS.template.md`;
- orchestration, course-alignment, verification status, and open-decision fields in `templates/manifest.yaml.j2` and `templates/state.md.j2`;
- current `scripts/scan_project.py` signals for packaged plugins, Cursor preview, Node script tooling, plugin rules, and evidence-only automation signals.

The `init_scaffold` pack is additive. It must never be treated as a replacement for Research Route, subagent policy, hook policy, project-local skill templates, or the current recovery surface.
