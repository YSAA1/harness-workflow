# Harness Builder Execution Gates

These gates are required unless the user explicitly asks for read-only explanation or a narrower single-file task. If skipped, state why.

## 1. Question Gate

After evidence collection, ask the smallest material question set.

Questions must cover missing target outcome, non-goals, acceptance criteria, verification depth, and current source of truth when those are not already clear.

If no question is needed, say `No user questions needed` and list evidence-backed assumptions. If fast/deep validation is unclear, ask at least one verification question before writing the Harness Plan.

## 2. Harness Charter Gate

Before the Harness Plan, state:

- objective and non-goals for this harness
- user-facing acceptance criteria
- verification path and evidence location
- selected recovery surface and source-of-truth priority
- existing harness components to keep, patch, archive, or reject

If any required field is unknown, ask the user or route to `brainstorm` / `plan`; do not fill it with template text.

## 3. Coverage Matrix Gate

Always produce one `Required / Recommended / Deferred / Rejected` table across these coverage areas:

- agent entry and project map
- static documentation and durable rules
- selected recovery surface
- verification entry and deeper checks
- architecture boundaries and mechanical enforcement
- anti-entropy and stale-state detection
- skill fit
- hook fit
- MCP fit
- subagent fit
- external research fit
- dynamic context: git, diagnostics, CI, logs, or available runtime signals
- commit protocol and milestone discipline when the project needs tracked milestone commits

Commit protocol defaults to `Deferred`. Raise it to `Recommended` only when milestone tracking or multi-agent collaboration needs it.

For each row, say whether existing artifacts already satisfy it, need patching, need a new install, or should be deferred/rejected.

Use `coverage_matrix_policy.md`, `architecture_enforcement_policy.md`, and `anti_entropy.md`.

## 4. Capability Discovery Gate

Evaluate skills, hooks, MCP, subagents, external research, CI, GC, and helper scripts only after the Coverage Matrix exposes a real gap.

Bind every candidate capability to one coverage row. If no row needs it, reject it.

For uncovered or weak rows, run a Capability Shortlist pass:

- repo signal
- candidate
- coverage row
- why
- install surface
- risk/cost
- fallback
- `Required / Recommended / Deferred / Rejected`

For skill gaps, invoke `find-skills` or state `No reusable skill search needed` with reason.

For hooks, MCP, subagents, agent config, CI, GC, architecture tools, or recently changed external tool behavior, use targeted web search or state `No web research needed` with reason.

Use `capability_signal_policy.md`.

## 5. Pack Selection Gate

Run only after the Coverage Matrix and Capability Discovery expose a real gap.

Available install packs live under `references/packs/`; currently `init_scaffold` is the concrete scaffold pack for AGENTS snippets, architecture docs, boundary tests, linter snippets, CI templates, read-only GC, and security docs.

A pack cannot decide that a component is Required. It only implements rows already marked Required or explicitly approved Recommended.

Read `packs/init_scaffold/adapter.md` and `packs/init_scaffold/precedence.md` before using the init scaffold pack.

Produce a pack dry-run before installation:

- target files
- create/patch/skip status
- coverage-row binding
- verification command
- blockers

Reject pack output that is not bound to exactly one primary coverage row or duplicates a better existing artifact.

## 6. Verification Design Gate

Before installation, propose:

- fast default check
- deeper smoke/E2E/manual check
- evidence location
- unverified risks

If validation command is unknown, ask whether to adopt a conservative default: syntax/import/config smoke, dry-run, or equivalent.

For every planned install or patch phase, define phase acceptance: artifact exists plus relevant command/manual evidence, or blocker recorded.

## 7. User Checkpoint Gate

Before writing or installing harness files, show the Harness Plan and ask for approval.

Use this checkpoint text:

```text
USER CHECKPOINT
Approve this Harness Plan before I install project-local files:
- Charter:
- Coverage:
- Install:
- Patch existing:
- Archive/deprecate:
- Defer:
- Reject:
- Verification:
Reply approve / change / stop.
```

## 8. Verification Gate

After installation, run the selected validation command and phase checks, or state the concrete blocker.

No fresh evidence means no ready claim.

## 9. Research Graduation Gate

Required only when Research Route is used.

Before calling research work done:

- choose a winner or explicit no-winner closeout
- declare merge mode
- record a branch/worktree cleanup checkpoint
- route through `review` and `cleanup`

Research does not directly become done. Use `research_graduation_policy.md` and `research_entropy_gate.md`.
