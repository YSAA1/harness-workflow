# Harness Method Contract

This contract defines C1–C10 for the seven workflow entrypoints and five helpers. They are tools chosen by task need, not a mandatory pipeline.

## C1 Harness As System
Improve the actual repository context, verification and recovery gaps. A capable agent does not need generic reasoning instructions or every tool installed.

## C2 Repository As Truth
Use current code, configuration and artifacts for factual claims. Evidence can correct stale state; it cannot override instruction hierarchy, authorization or agreed acceptance requirements.

## C3 Thin Instruction Surface
AGENTS.md holds stable contracts and navigation. Put task state in the existing recovery surface and detailed procedures in relevant references. Avoid duplicate rules and permanent session logs.

## C4 Workbench When Needed
Use harness-builder only for real workbench gaps. A narrow repair needs a scoped diff and check, not a full matrix. Broader work may use a Harness Recommendation Matrix and Helper Skill routing.
Audit/recommendation requests stay read-only. Explicit repair/setup/optimization requests authorize scoped reversible work; USER CHECKPOINT applies only to genuinely missing authorization or material unresolved decisions. It is not repeated by each helper.

## C5 Scoped Work
One authoritative entry per task/track. Independent tasks can run concurrently; a new plan does not complete or abandon another task. Respect user scope and existing uncommitted changes.
Plans capture actionable work, acceptance and dependencies; use the existing tracker format or Markdown checkboxes. Simple work needs no formal plan. Continue already authorized implementation after planning; stop when the user requested only a plan.

## C6 Relevant Evidence
`review` combines substantive review and fresh evidence judgment; `verify` is its compatibility alias. Low-risk work can finish after implement self-review and relevant checks.
Evidence stays valid until related code, configuration, environment or input changes. Do not rerun because the skill changed or a commit occurred. Required criteria map to pass/fail/unknown; unknown or unresolved blocking findings prevent the corresponding ready claim.
Use independent read-only review when useful and available, or required by project/user. Tool unavailability alone is not proof of poor quality; disclose any unmet independence requirement.

## C7 Capability Fit
Recommend only capabilities that fill a demonstrated gap. Existing tools can be sufficient; zero recommendations is valid. No quotas by category, popularity thresholds, fixed model family or blanket hook installation.
Required / Recommended / Deferred / Rejected are recommendation classes, not authorization. Verify current tool facts using primary sources when necessary, and preserve target runtime and installation scope.

## C8 Artifact Freshness
Update docs and generated artifacts affected by this task. Use generators for generated output, sync canonical skills to packaged and Cursor surfaces, and avoid rebuilding unchanged artifacts unnecessarily.

## C9 Knowledge Cleanup
Cleanup supports done, blocked, abandoned and handoff states. No drift permits zero changes. Retain verification/reproduction evidence; delete only confirmed disposable task-owned scratch. Cleanup completion does not mean the underlying task passed.

## C10 Backend Decoupling
Recovery options: none, lightweight, harness, feature-list, existing. Only harness defaults to .harness; other backends do not require it or a Bash wrapper. Reuse meaningful existing plans, issues and trackers.

## Skill responsibility map

| Skill | Responsibility |
| --- | --- |
| `agent-instructions-maintainer` | Agent Instructions Maintainer — durable rule audit/repair |
| `brainstorm` | Material design choices / optional Spec |
| `capability-recommender` | Capability Recommender — read-only capability selection |
| `cleanup` | Task-scoped Knowledge Cleanup |
| `diagnose` | Evidence-based unknown-failure investigation |
| `find-skills` | Targeted reusable skill discovery |
| `harness-builder` | Cross-surface workbench coordination |
| `implement` | Scoped changes and proportional verification |
| `plan` | Execution dependencies / optional durable plan |
| `recovery-surface-builder` | Recovery Surface Builder — existing or selected backend |
| `review` | Review and evidence judgment |
| `verify` | Compatibility alias to review |
