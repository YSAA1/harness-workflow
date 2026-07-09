---
name: harness-builder
description: "Use when a project workbench needs bootstrap, repair, or cross-surface recommendation: route entry, recovery, verification, capability, install, and anti-entropy gaps. Thick work goes to capability-recommender, agent-instructions-maintainer, or recovery-surface-builder."
---

# Harness Builder

**Route** the project workbench. This skill is the controller for harness gaps: classify evidence, assign every thick gap an owner helper, synthesize one recommendation matrix, then patch only the approved controller-owned slice.

Deliverable: a usable workbench (entry, selected recovery surface, verification entry, capability decisions, install alignment, anti-entropy).

Treat supplied product/feature/bug context as **evidence** for workbench design, **not as a work order**. Recommending or installing a capability is the deliverable; using that capability to do the work is not. Route actual execution to `plan`, `implement`, or `diagnose`.

Controller contracts: `references/controller_discipline.md`. External research-governance wiring stays outside this plugin.

## Helper Skill routing

| Gap class | Owner | Completion criterion |
| --- | --- | --- |
| Durable instructions (`AGENTS.md`, `CLAUDE.md`, `.claude.md`, rules) | `agent-instructions-maintainer` | That skill's quality report (and approved patch, if writing) is done |
| Recovery backend, work index, state, progress, decisions, session catch-up | `recovery-surface-builder` | Backend + field map proposed; files written only after its USER CHECKPOINT |
| Skills / hooks / MCP / subagents / plugins / CI-headless capability design | `capability-recommender` | Read-only recommendation report produced (no install from that skill) |
| External reusable skill discovery for a known gap | `find-skills` | Candidates ranked; adoption still returns here |
| Verification entry, install-surface alignment, anti-entropy / generated-mirror drift, thin entry pointer | **this skill** | Approved files patched; narrowest check has fresh evidence |

**Helper routing rule:** for every thick gap, read that helper's `SKILL.md` and run its workflow. Do not re-implement the helper inside this skill. If several helpers apply, run them in parallel when independent; merge results into one matrix before USER CHECKPOINT.

## Modes

| Mode | Use when | Scope |
| --- | --- | --- |
| Quick repair | Narrow workbench gap | Controller-owned rows only; omit out-of-scope capability rows |
| Full recommendation | Setup / broad capability ask, or evidence shows multi-area gaps | Full matrix + Helper Skill routing |

Default Quick repair. Escalate to Full when the request or evidence needs it.

## Workflow

1. **Evidence** — Read the relevant subset of entry docs, manifests, README/install docs, skills/rules, scripts/CI, and recovery surfaces. Done when conflicts with user assumptions are stated or cleared.
2. **Boundary** — Separate harness work from the user's real task. Done when this run will not perform that task.
3. **Classify** — Tag each gap: `entry` | `recovery` | `verification` | `capability` | `install` | `generated-mirror` | `anti-entropy`. Done when every in-scope gap has exactly one class.
4. **Helper routing** — Assign owners per the table above; invoke each needed helper to its completion criterion. Done when every thick gap has an owner result or an explicit Deferred/Rejected reason.
5. **Matrix** — Emit `HARNESS RECOMMENDATION MATRIX` (Required / Recommended / Deferred / Rejected) with Evidence, Owner skill, Verification. Done when every proposed change binds to one matrix row and one owner. Policy: `references/recommendation_matrix_policy.md`.
6. **USER CHECKPOINT** — Stop unless the user already approved the exact patch. If No install recommended, there is no action to approve. Done when Approved slice / Files / Validation / Rollback are explicit, or the empty-plan skip is stated.
7. **Controller patch** — Apply only approved **this-skill** rows. Prefer canonical sources, then sync mirrors. For helper-owned rows, either the helper already wrote after its checkpoint, or schedule that helper — do not shadow-write. Install surfaces: `references/install_policy.md`. Placement: `references/decision_matrix.md`.
8. **Verify** — Run the narrowest relevant checks; report fresh evidence. Ready claims still go to `verify`.

## Language

用户可见文本跟随用户语言；未指定时默认中文。协议稳定优先：可用中文标签 + English token（`HARNESS EVIDENCE`、`HARNESS RECOMMENDATION MATRIX`、`USER CHECKPOINT`、`Required` / `Recommended` / `Deferred` / `Rejected`、路径、skill 名）。

## Output shape

```md
## HARNESS EVIDENCE
- Entry:
- Recovery:
- Verification:
- Existing capabilities:

## HARNESS RECOMMENDATION MATRIX
| Priority | Area | Evidence | Recommendation | Owner skill | Verification |
| --- | --- | --- | --- | --- | --- |

## USER CHECKPOINT
- Approved slice:
- Files:
- Validation:
- Rollback:
```

## Read when needed

- Controller contracts (boundary, gates, brownfield, ready): `references/controller_discipline.md`
- Matrix rows / binding: `references/recommendation_matrix_policy.md`
- Install surfaces / approval: `references/install_policy.md`
- Where a requirement belongs: `references/decision_matrix.md`
- Architecture boundaries: `references/architecture_enforcement_policy.md`
- Verification entry shape: `references/verification_policy.md`
- Drift / GC signals: `references/anti_entropy.md`
- Recovery semantics (helper-owned): `../recovery-surface-builder/SKILL.md`
- Instruction audit (helper-owned): `../agent-instructions-maintainer/SKILL.md`
- Capability design (helper-owned): `../capability-recommender/SKILL.md`
- Capability fallback if `capability-recommender` is unavailable: `references/capability_discovery_playbook.md`, `references/automation_recommendation_guide.md`

## Recommended next skill

| Situation | Next |
| --- | --- |
| Capability design only | `capability-recommender` |
| Instruction-file audit/repair only | `agent-instructions-maintainer` |
| Recovery surface only | `recovery-surface-builder` |
| Approved harness change needs active-slice tracking | `plan` |
| Harness change claims ready | `verify` |
| Knowledge / mirror drift after install | `cleanup` |
