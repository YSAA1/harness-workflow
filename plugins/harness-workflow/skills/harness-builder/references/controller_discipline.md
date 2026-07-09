# Controller Discipline

Controller-owned contracts for `harness-builder`. Helper-owned detail lives in the helper skills; this file keeps the boundary phrases the controller must obey.

## Task context vs harness deliverable

Treat supplied product/feature/bug context as **evidence** for workbench design, **not as a work order**.
Recommending or installing a capability is the deliverable; using that capability to do the user's real work is not.
Route actual execution to `plan`, `implement`, or `diagnose`.

## Recommendation vs install

The first phase is read-only: analyze and recommend; do not write harness files until approval.
Approved install phase starts only after `USER CHECKPOINT`.
If the matrix is empty or every row is Deferred/Rejected: state **No install recommended** — there is **no action to approve** (skip an empty USER CHECKPOINT).

## Evidence and question gates

**Evidence gate:** Collect repo evidence before questions or installation. Do not start by generating files.
**Question gate:** Ask only questions that change harness design. Prefer evidence-backed assumptions when safe.
When no design-changing question remains: **No user questions needed**.
Unclear goals route back to `brainstorm` / `plan`.

## Brownfield reconcile

Reconcile existing harness before adding components.
Classify each existing component as keep/patch/archive/reject.
Do not create a second recovery surface when one already works.
Prefer patching existing mechanisms over creating parallel ones.

## Recovery routing (controller view)

Recovery-class gaps route to `recovery-surface-builder`. Controller still enforces:
- Hot recovery docs are bounded indexes, not append-only reports.
- Status/check/selftest scripts are views/probes, not state stores.
- Dynamic task state belongs on the selected recovery surface, not in `AGENTS.md`.
- Probe cheap dynamic context at session start when relevant: `git status`, diagnostics, CI if available.

## External research boundary

External research-governance wiring is intentionally outside this plugin. Do not create research gates, research templates, branch guards, or external research workflow wiring from this skill.
It is not a lane for performing the feature, bug fix, or research task described by the user.

## Ready claims

Ready claims require fresh evidence after the relevant changes. No fresh evidence → not ready; route ready proof to `verify`.
