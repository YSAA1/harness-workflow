# Source-of-Truth Tiers

Prevent doc drift and multi-task inconsistency by separating **what kind of truth** each artifact holds. Harness Builder must declare tiers in `AGENTS.md`; dynamic task state must never live in Tier 1.

## Tiers

| Tier | Name | Examples | Update cadence | Agent rule |
| --- | --- | --- | --- | --- |
| **T1** | Durable entry | `AGENTS.md`, iron laws, verification entry, tier declaration | Rare — harness-builder / cleanup | Read every session; **never** store active slice here |
| **T2** | Domain language | `CONTEXT.md`, `docs/adr/` | When terms or hard decisions resolve | Glossary only in CONTEXT |
| **T3** | Task registry | `.harness/work_index.md` (**Required** when recovery ≠ `none`) | Each task start/close | Exactly one `active` unless parallel declared |
| **T4** | Active work | Spec/Plan under `docs/`, `.harness/state.md` | During active slice | Superseded tasks linked from T3 |
| **T5** | Evidence | test output, CI, commit log, `.harness/progress.md` | Continuous | Fresh evidence beats stale prose |
| **T6** | Generated | skill-flow HTML, codegen | Regenerator only | Never hand-edit |

## Conflict Resolution

1. T5 fresh evidence → 2. T4 active work → 3. T3 Work Index → 4. T2 domain → 5. T1 entry → 6. T6 generated

Never treat an old plan path in `AGENTS.md` as current work if T3 points elsewhere.

## AGENTS.md Rules

**Belongs in T1:** map, iron laws, verification, tier table, pointer to `.harness/work_index.md`

**Must not be in T1:** current task title, active slice, links to one task's Spec/Plan as global entry

## Harness Builder Checklist

- [ ] Tiers in `AGENTS.md`
- [ ] `.harness/recovery_policy.md` + `.harness/work_index.md` when recovery ≠ `none`
- [ ] Old task pointers removed from `AGENTS.md`
