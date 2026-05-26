# Harness Builder Slimming Harness Initialization

> Status: initialized
> Date: 2026-05-26
> Source plan: `docs/plans/2026-05-26--harness-builder-slimming-plan.md`

## HARNESS EVIDENCE

- Branch state: `master...origin/master`.
- HEAD and `origin/master`: `db6ed146049da6b8a93b6d209608a053e1934d24`.
- Existing uncommitted work before this initialization:
  - `docs/specs/2026-05-26--harness-builder-slimming.md`
  - `docs/plans/2026-05-26--harness-builder-slimming-plan.md`
  - `skills/harness-builder/scripts/__pycache__/`
- Current project signals from `scan_project.py`:
  - `node_script_tooling`
  - `codex_plugin`
  - `claude_code_plugin`
  - `cursor_plugin_or_adapter`
  - `harness_workflow_plugin`
- Harness signals:
  - `AGENTS.md`: present
  - `CLAUDE.md`: present
  - `.harness/`: absent
  - repo skills: present
  - Codex / Claude / Cursor plugin manifests: present
  - Cursor preview and rules: present
  - CI: present
- Baseline asset counts:
  - `skills/harness-builder/SKILL.md`: 295 lines
  - `skills/harness-builder/`: 124 files including generated Python cache files
- Baseline verification:
  - `node scripts/check-plugin.mjs`: failed because root `skills/` contained generated Python cache files not present in the packaged plugin.
  - `node scripts/check-claude-code-install.mjs`: passed.
  - `node scripts/check-cursor-install.mjs`: failed because canonical skills and Cursor preview file lists differed.
  - `node scripts/install-cursor.mjs --target . --dry-run`: passed but showed it would copy `scripts/__pycache__/*.pyc` into `.cursor/skills/`.
  - `python skills/harness-builder/scripts/scan_project.py`: passed.
  - `PYTHONPYCACHEPREFIX=/tmp/harness-workflow-pycache python scripts/validate_harness.py` from `skills/harness-builder/`: passed.

## EXISTING HARNESS RECONCILIATION

| Component | Decision | Reason |
| --- | --- | --- |
| `AGENTS.md` | keep | Thin project entry already contains map, verification commands, protected paths, and Definition of Done. |
| `CLAUDE.md` | keep | Existing Claude surface marker; no change needed for this slice. |
| `README.md`, `README.zh-CN.md`, `docs/harness-method-contract.md` | keep | Current public semantics already describe Harness Builder, Coverage Matrix, Capability Discovery, Research Route, and fresh evidence. |
| `docs/specs/2026-05-26--harness-builder-slimming.md` | keep | Approved Spec and source of current objective. |
| `docs/plans/2026-05-26--harness-builder-slimming-plan.md` | keep | Selected planning surface for this task. |
| `.harness/` | reject for this slice | The plan explicitly uses a plan document surface; adding `.harness/` now would create a second recovery surface. |
| `skills/harness-builder/scripts/__pycache__/` | reject/delete as asset | Generated runtime cache, no owner gate or package value. Ignore in git and support-file enumerators. |
| Root / packaged / Cursor skill surfaces | patch | They must remain recursively aligned after support-file filtering and later asset changes. |

## HARNESS QUESTIONS

No user questions needed.

Evidence-backed assumptions:

- The user approved the latest Spec/Plan and asked to start initialization; this permits evidence collection and plan drafting, but future harness installation still requires a `USER CHECKPOINT` approval unless explicitly skipped with exact actions.
- The active slice is the first slimming pass for `harness-builder`, not a generic blank-project scaffold.
- The selected recovery surface is `docs/plans/` plan documents, not `.harness/` or three-file backend.
- Validation depth is the plan's local verification path: plugin checks, Cursor dry-run, Python helper validation, and later generated skill-flow HTML when `SKILL.md` structure changes.

## HARNESS CHARTER

- Objective: initialize the project-local harness work surface for the approved `harness-builder` slimming work by recording current evidence, reconciling existing harness components, and defining asset ownership before any major slimming or deletion.
- Non-goals:
  - Do not create a new `.harness/` tree for this slice.
  - Do not install hooks, MCP, subagents, or user-global configuration.
  - Do not delete or archive core `harness-builder` assets in the initialization step.
  - Do not claim the final slimming work is ready.
- User-facing acceptance criteria:
  - The current repo harness state is recoverable from a durable local artifact.
  - Generated Python caches no longer count as skill package assets or Cursor adapter payload.
  - Retained `harness-builder` assets have an initial ownership/routing contract.
  - Baseline verification failures are either fixed or recorded as blockers.
- Verification path:
  - `node scripts/check-plugin.mjs`
  - `node scripts/check-claude-code-install.mjs`
  - `node scripts/check-cursor-install.mjs`
  - `node scripts/install-cursor.mjs --target . --dry-run`
  - `PYTHONPYCACHEPREFIX=/tmp/harness-workflow-pycache python scripts/validate_harness.py` from `skills/harness-builder/`
- Evidence location:
  - This file for Phase 1-2 initialization evidence.
  - `skills/harness-builder/references/asset-routing.md` for asset ownership.
- Selected recovery surface:
  - Plan document surface under `docs/plans/`.
- Source-of-truth priority:
  - User request -> approved Spec -> executable Plan -> current repo files -> command evidence.

## HARNESS COVERAGE MATRIX

| Coverage area | Classification | Existing status | Action for this initialization |
| --- | --- | --- | --- |
| Agent entry and project map | Required | Satisfied by `AGENTS.md`, README, project docs. | Keep; no patch. |
| Static documentation and durable rules | Required | Satisfied, but new slimming state needs a durable artifact. | Add this initialization artifact under `docs/plans/`. |
| Selected recovery surface | Required | Plan selects `docs/plans/`; `.harness/` absent. | Keep `docs/plans/`; reject `.harness/` for this slice. |
| Verification entry and deeper checks | Required | Commands exist; two failed due generated cache drift. | Patch support-file filtering and rerun checks. |
| Architecture boundaries and mechanical enforcement | Deferred | Not the active gap for this slice. | Defer until asset slimming reaches pack/boundary files. |
| Anti-entropy and stale-state detection | Required | Failure exposed generated cache drift. | Ignore generated Python cache and record it as non-asset. |
| Skill fit | Recommended | Existing helper skills present; no new reusable skill needed. | Use current `harness-builder` and no extra skill install. |
| Hook fit | Rejected | No concrete hook-only risk in this initialization. | Do not install hooks. |
| MCP fit | Rejected | No external context needed; local files answer this task. | Do not install MCP. |
| Subagent fit | Deferred | Useful later for broad asset review, not needed for Phase 1-2. | Defer. |
| External research fit | Rejected | No version-sensitive external behavior involved. | No web research. |
| Dynamic context | Required | Git state and local validation collected. | Record baseline here. |
| Commit protocol and milestone discipline | Recommended | Plan defines commit units. | Defer commit until Phase 1-2 verify is clean. |

## CAPABILITY DISCOVERY

No reusable skill search needed: the active gap is project-local asset ownership and generated cache drift inside the current repo, already covered by the invoked `harness-builder` flow and local scripts.

No web research needed: this initialization uses local plugin manifests, scripts, and validation commands; no current external API or tool behavior is being changed.

| Repo signal | Candidate | Coverage row | Why | Install surface | Risk/cost | Fallback | Classification |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `check-plugin` and `check-cursor-install` failed on generated Python cache drift | Ignore generated Python cache in support-file enumerators and Cursor adapter | Verification entry and anti-entropy | Prevent runtime caches from becoming plugin assets or Cursor payload | `.gitignore`, `scripts/check-*.mjs`, `scripts/install-cursor.mjs` | Low; could hide real files only if extension filter is too broad | Manually delete caches before every check | Required |
| 124 files under `skills/harness-builder/` with many references/templates/scripts | Add an asset ownership/routing contract | Static docs and anti-entropy | Make future slimming decisions auditable and validator-ready | `skills/harness-builder/references/asset-routing.md` | Medium; can become stale if not validated later | Manual PR review only | Required |
| Existing plan requires Phase 1 evidence | Add initialization artifact | Selected recovery surface | Durable recovery point without introducing `.harness/` | `docs/plans/2026-05-26--harness-builder-slimming-harness-init.md` | Low | Rely on chat transcript | Required |

## PACK SELECTION

No install pack selected.

Reason: the gap is not project scaffold creation. The repo already has the plugin harness workbench; this slice initializes the slimming/recovery surface and anti-entropy checks. `init_scaffold` remains available for later approved coverage rows, but using it now would duplicate existing project artifacts.

## PACK DRY RUN

Skipped because no pack is selected.

## VERIFICATION DESIGN

- Fast check:
  - `node scripts/check-plugin.mjs`
  - `node scripts/check-cursor-install.mjs`
- Deeper structure checks:
  - `node scripts/check-claude-code-install.mjs`
  - `node scripts/install-cursor.mjs --target . --dry-run`
  - `PYTHONPYCACHEPREFIX=/tmp/harness-workflow-pycache python scripts/validate_harness.py` from `skills/harness-builder/`
- Evidence location:
  - command output in current run;
  - this initialization artifact for baseline and decisions.
- Unverified risks:
  - The full asset deletion/merge decision is not complete yet.
  - The future ownership validator is not implemented in this initialization step.

## HARNESS PLAN

1. Patch generated-cache handling so Python runtime caches are not treated as skill assets.
2. Add `asset-routing.md` as the ownership contract for current harness-builder assets.
3. Keep the current plan document as the recovery surface; do not create `.harness/`.
4. Run the fast and deeper verification commands.
5. If Phase 1-2 verification passes, proceed next to controller slimming and ownership validator work.

## USER CHECKPOINT

Correction after workflow defect report: "start initializing from the latest Spec and Plan" is not sufficient approval to install files. Future harness-builder runs must stop at this checkpoint and wait for `approve`, unless the current user explicitly says to skip the checkpoint and lists the exact files or actions.

Earlier applied scope that prompted this correction:

- create this initialization artifact;
- create `skills/harness-builder/references/asset-routing.md`;
- patch support-file filtering and Cursor adapter behavior for generated Python caches;
- update `.gitignore`.

## PHASE 3 EXECUTION RECORD

Status: implemented; pending review / verify before milestone commit.

Active slice:

- Slim `skills/harness-builder/SKILL.md` into a controller while preserving behavior-critical gates.

Changes:

- Rewrote root `skills/harness-builder/SKILL.md` as a controller.
- Synchronized the same `SKILL.md` to:
  - `plugins/harness-workflow/skills/harness-builder/SKILL.md`
  - `.cursor/skills/harness-builder/SKILL.md`
- Updated `scripts/generate-skill-flow-html.mjs` so generated review pages understand the English controller sections:
  - `Routing Snapshot`
  - `Workflow Skeleton`
  - `Output Contract`
  - `Mandatory execution gates`
  - `Asset Routing`
- Regenerated `docs/skill-flow-review/*.html`.

Evidence:

- `wc -l skills/harness-builder/SKILL.md`: 225 lines, down from 295.
- `node scripts/generate-skill-flow-html.mjs`: generated 9 HTML files.
- HTML placeholder check for `docs/skill-flow-review/harness-builder.html`: no missing extraction markers.
- `node scripts/check-plugin.mjs`: pass.
- `node scripts/check-claude-code-install.mjs`: pass.
- `node scripts/check-cursor-install.mjs`: pass.
- `node scripts/install-cursor.mjs --target . --dry-run`: pass.
- `PYTHONPYCACHEPREFIX=/tmp/harness-workflow-pycache python scripts/validate_harness.py` from `skills/harness-builder/`: pass.

Not done in this phase:

- No reference/template/script/schema/eval deletion.
- No ownership validator implementation.
- No milestone commit yet; plan requires review + verify before Commit Unit 2.

Next:

- Route this Phase 3 diff through `review`, then `verify`.
- After that, continue to Phase 4 asset consolidation.

## WORKFLOW DEFECT CORRECTION RECORD

Status: implemented; pending review / verify before any milestone commit.

Problem reported by user:

- `brainstorm` and `plan` did not enforce one stable artifact convention.
- A project can have many Specs and Plans, so the default surfaces must be plural directories.
- `harness-builder` treated "start initializing from the latest Spec and Plan" as permission to write files, instead of stopping at the checkpoint.

Changes:

- Moved the current active Spec to `docs/specs/2026-05-26--harness-builder-slimming.md`.
- Moved the current active plan and recovery record to `docs/plans/`.
- Tightened `brainstorm` default output to `docs/specs/YYYY-MM-DD--<topic>.md`, with explicit override only.
- Tightened `plan` default output to `docs/plans/YYYY-MM-DD--<topic>-plan.md`, with explicit override only.
- Tightened `harness-builder` so "start", "initialize", and "build from latest Spec/Plan" authorize evidence collection and plan drafting only, not project file writes.
- Updated root skills, packaged plugin skills, Cursor preview skills, Cursor rules, README, method contract, context docs, routing docs, generated HTML, and `check-plugin.mjs`.

Evidence:

- `node scripts/generate-skill-flow-html.mjs`: generated 9 HTML files.
- Placeholder extraction check across `brainstorm.html`, `plan.html`, and `harness-builder.html`: no missing-output or missing-list markers.
- `node scripts/check-plugin.mjs`: pass.
- `node scripts/check-claude-code-install.mjs`: pass.
- `node scripts/check-cursor-install.mjs`: pass.
- `node scripts/install-cursor.mjs --target . --dry-run`: pass.
- `PYTHONPYCACHEPREFIX=/tmp/harness-workflow-pycache python scripts/validate_harness.py` from `skills/harness-builder/`: pass.
- `git diff --check`: pass.

Review:

- Assessment: PASS.
- Scope: corrective slice only; no new workflow lane, hook, MCP, subagent, user-global config, or alternate recovery backend added.
- Spec/Plan artifact convention: root, packaged plugin, Cursor skills, Cursor rules, README, method contract, context docs, and routing docs now agree on `docs/specs/` and `docs/plans/`.
- Checkpoint gating: root, packaged plugin, Cursor skills, Cursor rules, and `check-plugin.mjs` now reject the old loose authorization semantics.
- Entropy: current 2026-05-26 active artifacts moved out of `docs/prd/`; older `docs/prd/` history remains untouched.

Verification record:

- claim_id: `artifact-surfaces-checkpoint-gate-2026-05-26`
- claim: Spec defaults to plural `docs/specs/`, Plan defaults to plural `docs/plans/`, and Harness Builder does not write project files after a generic "start/init/build from Spec/Plan" request.
- covered_paths:
  - `skills/brainstorm/**`, `skills/plan/SKILL.md`, `skills/harness-builder/SKILL.md`
  - `plugins/harness-workflow/skills/**`
  - `.cursor/skills/**`, `rules/**`, `.cursor/rules/**`
  - `README.md`, `README.zh-CN.md`, `CONTEXT.md`, `docs/harness-method-contract.md`, `docs/skill-routing.md`
  - `docs/specs/`, `docs/plans/`, `scripts/check-plugin.mjs`, `scripts/generate-skill-flow-html.mjs`
- success_criteria:
  - canonical Spec and Plan paths are enforced by skill text and checks: pass.
  - checkpoint write authorization is explicit and regression-checked: pass.
  - root, packaged plugin, and Cursor surfaces stay synchronized: pass.
  - generated review HTML reflects the new contracts: pass.
- skipped_high_value_checks: none for this docs/plugin contract slice.
- unknowns: none for local structural verification; real agent behavior still depends on installed plugin refresh in each client.
- commit_gate: no commit unit for this corrective slice; no commit attempted in this turn.
- ready: yes for this corrective slice; overall slimming project remains in progress.
