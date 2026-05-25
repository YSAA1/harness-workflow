# Harness Builder Workflow Protocol

Use this reference for the detailed harness-building procedure after the top-level `SKILL.md` has selected `harness-builder`.

## Working Model

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

## Detailed Workflow

1. **Collect evidence**
   - Read user intent, `AGENTS.md`/`CLAUDE.md`, README, docs, scripts, tests, CI, git state, existing `.harness/`, `.agents/skills/`, `.codex/`, `.claude/`, protected/generated paths.
   - Detect stack and workbench facts when relevant: language, framework, package manager, build tool, test runner, linter, source roots, import patterns, and available verification commands.
   - Probe dynamic context when cheap and safe: `git status`, recent commits, diagnostics/lint, CI status if available, current recovery state, known broken checks, logs or runtime signals if already exposed.
   - For existing harnesses, identify authoritative vs stale sources and note conflicting claims before planning changes.
   - Optionally invoke `find-skills` early to scan stack-related reusable skills; record results in Capability Discovery instead of installing immediately.
   - Use `scripts/scan_project.py` if useful.

2. **Reconcile existing harness**
   - Classify artifacts as keep, patch, archive/deprecate, or reject.
   - Name the current source of truth for project rules, active work, evidence, decisions, and next actions.
   - Do not create a second recovery surface unless the existing one cannot represent the required semantic fields.
   - Use `recovery_surface_policy.md`, `anti_entropy.md`, and `install_policy.md`.

3. **Form Harness Hypothesis**
   - Summarize repo facts, dynamic state, user intent, missing info, questions, assumptions, and course coverage.
   - Use `brainstorming_policy.md` and `course_alignment.md`.

4. **Choose orchestration mode**
   - Use solo mode for small repos.
   - Recommend read-only subagents only for specific gaps: repo map, verification, risk, skills, research, or plan review.
   - Main agent installs files. See `subagent_orchestration.md`.

5. **Build the Coverage Matrix**
   - Classify each row as `Required`, `Recommended`, `Deferred`, or `Rejected`.
   - Record how selected rows will be satisfied.
   - Keep hooks, MCP, subagents, and project-local skills inside the matrix.
   - If the user asked for a narrow coverage area, keep unrelated rows deferred and explain why.

6. **Run Capability Discovery**
   - Use `find-skills` only when a real coverage row needs repeatable workflow knowledge.
   - Use targeted web search for hooks, MCP, external agent behavior, CI, GC, and architecture tooling when current behavior matters.
   - Bind every candidate to one Coverage Matrix row.
   - Classify each candidate by value, enablement, risk/cost, and fallback.
   - In recommendation-only mode, stop at the report and do not write files.
   - Record adopted external research in `.harness/research_notes.md`.

7. **Select install packs**
   - If architecture docs, boundary tests, linter snippets, CI, GC, or `SECURITY.md` are selected, use `packs/init_scaffold/adapter.md`.
   - Keep core policies authoritative: `coverage_matrix_policy.md`, `install_policy.md`, `verification_policy.md`, `recovery_surface_policy.md`, `anti_entropy.md`, and `architecture_enforcement_policy.md`.
   - Run or present a dry-run before writing.
   - Record pack decisions in `.harness/manifest.yaml` and `.harness/decisions.md`.

8. **Handle Research Route only when explicit**
   - Require Goal, Hypothesis, Counter-hypothesis, Baseline, Scope, Metric, Verify, Guard, Budget, Artifact policy, and Stop rule.
   - If incomplete, return to gap-driven questions.
   - If approved, install `templates/research_route`.
   - Preserve failed evidence before rollback.
   - Use `git reset --hard` only inside an approved isolated research branch/worktree after evidence is recorded.
   - Before closeout, apply `research_graduation_policy.md` and `research_entropy_gate.md`.

9. **Choose recovery surface**
   - Options: none, lightweight, three-file, feature-list, existing system.
   - For three-file, map `active_slice` to `task_plan.md`, evidence to `progress.md`, decisions/risks to `findings.md`.
   - Declare semantic field mapping. Do not force file layout.

10. **Write Harness Charter and phased Plan**
    - Charter first: objective, non-goals, user-facing acceptance criteria, verification path, evidence location, selected recovery surface, and source-of-truth priority.
    - Then merge evidence, answers, coverage decisions, capability decisions, research, orchestration, recovery surface, and verification design into the Harness Plan.
    - Structure install work as phases. Each phase needs purpose, target files, acceptance criteria, verification evidence, and failure handling.

11. **Checkpoint**
    - Emit `USER CHECKPOINT`.
    - Wait for explicit approval unless user already authorized direct changes in this turn.

12. **Install approved project-local components by phase**
    - Install `Required` only unless the user approves more.
    - Prefer `AGENTS.md`, `scripts/agent/check.sh`, `docs/agent/*`, `.harness/*`, `.agents/skills/*`, `.codex/*`.
    - For existing harness files, patch only approved sections.
    - Establish baseline/warn-first behavior before strict architecture enforcement in existing repos.
    - Use templates instead of hand-creating large boilerplate.

13. **Verify and record**
    - Validate files, frontmatter, JSON/TOML/YAML, hook scripts, and fast check command.
    - Mark each phase `pass`, `blocked`, `skipped`, or `deferred`.
    - Use `scripts/validate_harness.py` where possible.
    - Update `.harness/manifest.yaml`, `.harness/decisions.md`, `.harness/state.md`, skill inventory, and research notes.
    - Use `anti_entropy.md` for cleanup drift.

## Output Contract

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

## Preservation Rule

When adding install packs, preserve current harness-builder assets unless a user explicitly approves removing or replacing them.

Do not drop or weaken:

- `references/harness_subsystems.md`, `references/project_map_policy.md`, or `references/subagent_policy.md`
- `templates/research_route/*`
- `templates/agents/*`, `templates/hooks/*`, and `templates/skills/*`
- `templates/project_context.md.j2`, `templates/workflow.md.j2`, `templates/verification.md.j2`, `templates/reports/verification_report.md.j2`, `templates/risk_register.md.j2`, `templates/features.json.j2`, or `templates/AGENTS.template.md`
- orchestration, course-alignment, verification status, and open-decision fields in `templates/manifest.yaml.j2` and `templates/state.md.j2`
- current `scripts/scan_project.py` signals for packaged plugins, Cursor preview, Node script tooling, plugin rules, and evidence-only automation signals

The `init_scaffold` pack is additive. It is not a replacement for Research Route, subagent policy, hook policy, project-local skill templates, or the current recovery surface.
