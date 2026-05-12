# PRD: Workflow Skill Boundary Refactor

## Problem Statement

Harness Workflow currently exposes too many workflow lanes and binds too much behavior to `state-contract`, `bootstrap`, and the three-file backend. The result is conceptual coupling: workflow skills claim to be backend-independent, but many still directly read or write `task_plan.md`, `progress.md`, and `findings.md`; `state-contract` exists as a separate skill even though recovery surface design belongs to the project harness; `bootstrap` is the canonical project harness construction skill but still uses an initialization-oriented name; `resume` and `save-session` duplicate recovery behavior that should be provided by `AGENTS.md`, living docs, and the selected recovery surface.

The user needs this plugin to become a cleaner set of independent workflow skills. Each skill should focus on its own job, work without a mandatory global sequence, and use project recovery artifacts only when the current task actually requires durable state.

## Goals

- Rename the canonical project harness construction skill from `bootstrap` to **Harness Builder**.
- Remove `state-contract`, `resume`, and `save-session` as exposed skills.
- Preserve the useful ideas from removed skills by migrating them into Harness Builder references, Cleanup references, and project documentation.
- Make `brainstorm` produce a **Spec**, not workflow state.
- Make `plan` produce an **Executable Plan**, not three files by default.
- Make `cleanup` focus on **Knowledge Cleanup**: preventing stale docs, bloated `AGENTS.md`, inconsistent generated artifacts, and recovery surface drift.
- Keep the three-file backend available as one possible workflow state backend, but stop treating it as the conceptual dependency of every skill.
- Update plugin metadata, validation scripts, generated HTML, README, Method Contract, AGENTS.md, and relevant templates so they all describe the same model.

## Solution

Refactor the plugin around five durable concepts already recorded in `CONTEXT.md` and ADR 0001:

- **Harness Builder**: designs or repairs project-level harness and recovery surface.
- **Skill Independence**: each workflow skill can run based on task conditions, not a fixed global sequence.
- **Spec**: the output of `brainstorm`.
- **Executable Plan**: the output of `plan`.
- **Knowledge Cleanup**: the purpose of `cleanup`.

The implementation should remove old skill lanes instead of preserving them as legacy entries. Compatibility should be handled through trigger wording where appropriate, not by keeping old skill directories visible.

## User Stories

1. As a plugin user, I want `harness-builder` to be the visible project harness skill, so that the name matches its real responsibility.
2. As a plugin user, I want `bootstrap` to remain only as a historical alias or trigger word, so that old wording still routes correctly without preserving the old concept.
3. As a plugin user, I want `state-contract` removed as a skill, so that state backend selection is not a separate workflow lane.
4. As a plugin user, I want recovery surface design to belong to Harness Builder, so that recovery is treated as project harness design.
5. As a plugin user, I want `resume` removed as a skill, so that normal session recovery is driven by `AGENTS.md` and living project documents.
6. As a plugin user, I want `save-session` removed as a skill, so that handoff hygiene is part of cleanup and the recovery policy instead of a separate lane.
7. As a plugin user, I want `brainstorm` to produce an independent spec, so that it can work before any state backend exists.
8. As a plugin user, I want `brainstorm` to avoid default writes to `findings.md` or `progress.md`, so that it remains portable across projects.
9. As a plugin user, I want `plan` to produce an executable plan artifact, so that planning is not synonymous with three-file setup.
10. As a plugin user, I want `plan` to write three-file state only when the selected recovery surface uses that backend.
11. As a plugin user, I want `implement` to read only the context it needs, so that implementation is not blocked by missing three-file state when the task is otherwise clear.
12. As a plugin user, I want `diagnose` to focus on reproduction, hypothesis, root cause, fix, and evidence, so that debugging does not depend on a specific state backend.
13. As a plugin user, I want `review` to check correctness, scope, design risk, and missing tests, so that review is not confused with documentation cleanup.
14. As a plugin user, I want `verify` to gather fresh evidence for a concrete claim, so that readiness is based on current commands or checks.
15. As a plugin user, I want `cleanup` to reconcile docs with code and generated artifacts, so that project knowledge does not rot.
16. As a future agent, I want `AGENTS.md` to stay thin and rule-focused, so that I can quickly understand project constraints without reading a changelog.
17. As a future agent, I want README, docs, generated HTML, manifest prompts, and validation scripts to agree, so that I do not get contradictory workflow guidance.
18. As a maintainer, I want deleted skill content migrated into focused references, so that useful recovery and backend policy guidance is not lost.
19. As a maintainer, I want validation to fail when old exposed skill names reappear, so that the simplified model does not regress.
20. As a maintainer, I want generated skill-flow HTML rebuilt from the new flow, so that review artifacts reflect the actual plugin shape.
21. As a maintainer, I want a clean Git commit after the refactor, so that the structural migration can be reviewed and reverted as one unit.

## Implementation Decisions

- The exposed skill set should become: `harness-builder`, `brainstorm`, `plan`, `implement`, `diagnose`, `review`, `verify`, and `cleanup`.
- `bootstrap` should be renamed to `harness-builder` at the skill identity level, not merely in prose.
- `bootstrap` should remain in descriptions as an alias or trigger word only.
- `state-contract`, `resume`, and `save-session` should be deleted as exposed skill directories.
- Backend taxonomy from `state-contract` should migrate into Harness Builder references as recovery surface policy.
- Useful resume and save-session checklist material should migrate into Harness Builder recovery policy and Cleanup knowledge cleanup policy.
- `brainstorm` should remove the default Workflow State Contract section and replace it with a small persistence note: write a spec first; record summaries only if the current recovery surface asks for it.
- `plan` should remove three-file identity language and define its output as an executable plan.
- `plan` should support multiple storage targets: plan document, issue, feature-list entry, existing project system, or three-file backend.
- `cleanup` should be rewritten around knowledge freshness, anti-rot, anti-bloat, and reader-specific documentation layers, using `neat-freak` as the reference model.
- `review`, `verify`, `implement`, and `diagnose` should reference semantic inputs such as spec, executable plan, evidence log, recovery surface, and project docs rather than hard-coded three-file paths.
- `scripts/check-plugin.mjs` should validate the new required skill set and new terminology.
- `scripts/generate-skill-flow-html.mjs` should remove `state-contract`, `resume`, and `save-session` from the skill order and route map.
- Generated HTML in `docs/skill-flow-review/` should be regenerated, not hand-edited.
- `.codex-plugin/plugin.json` should describe Harness Builder and the simplified skill set.
- `README.md`, `docs/harness-method-contract.md`, `AGENTS.md`, `CONTEXT.md`, and ADRs should use the same canonical terms.

## Module And File Change Plan

### Plugin Manifest

Update the plugin manifest so the default prompts no longer mention `state-contract`, `resume`, `save-session`, or `bootstrap` as canonical skills. The prompt should direct users toward Harness Builder for project harness and recovery surface work, Brainstorm for specs, Plan for executable plans, Verify for fresh evidence, and Cleanup for knowledge cleanup.

### Skill Directory Structure

Rename the active `bootstrap` skill to `harness-builder`. Remove `state-contract`, `resume`, and `save-session` directories after migrating useful content. Do not keep legacy skill directories because visible legacy entries would preserve the old mental model.

### Harness Builder

Harness Builder should own project-level harness responsibilities:

- project map and thin `AGENTS.md`
- recovery surface selection and repair
- recovery policy
- verification entry point
- project-local skills
- hooks, subagents, and MCP policy when justified
- capability recommendations
- anti-entropy guardrails

It must not become a mandatory step before or after Brainstorm or Plan. It should be invoked when project-level workbench, recovery surface, verification entry, or capability setup is unclear.

### Brainstorm

Brainstorm should be rewritten around independent spec creation:

- Inputs: user idea, existing docs, code, issues, README, context glossary, and relevant constraints.
- Output: a spec document in a project-appropriate location.
- No default writes to three-file state.
- No default dependency on Harness Builder.
- Route to Plan only after the spec is approved.
- Route to Harness Builder only when project-level context or recovery surface gaps block good spec work.

### Plan

Plan should become a write-plan style skill:

- Input: approved spec or sufficiently clear user request.
- Output: an executable plan.
- Default output should not be three files.
- It should write into the selected project planning surface: docs plan, issue, feature list, existing system, or three-file backend.
- It should stop after producing the plan unless the user asks to continue.
- It should route conditionally: Harness Builder if project workbench is unclear, Implement if ready, Diagnose if failures are already known.

### Implement

Implement should focus on making scoped changes:

- Read the current spec, executable plan, or user request.
- Respect project recovery surface if present.
- Do not require `task_plan.md`.
- Record durable notes only when required by the selected recovery surface.
- Route repeated failures to Diagnose.
- Route stable work to Review and Verify.

### Diagnose

Diagnose should focus on failure analysis:

- reproduce
- minimize
- hypothesize
- instrument
- name root cause
- apply minimal fix
- rerun fresh evidence

It should record root cause and dead ends in the selected recovery surface if one exists, but should not require `findings.md`.

### Review

Review should check:

- correctness
- scope discipline
- design risk
- missing tests
- mismatch with spec or executable plan

It should not serve as the main documentation synchronization pass. Documentation drift can be a review finding, but Cleanup owns reconciliation.

### Verify

Verify should gather fresh evidence for a specific claim:

- static checks
- build
- typecheck
- lint
- unit tests
- integration tests
- smoke or E2E checks when relevant
- documented capability gaps when evidence is insufficient

It should not depend on `progress.md`; it should use current commands and any available evidence source.

### Cleanup

Cleanup should be refactored using the `neat-freak` model:

- start with size and bloat checks for `AGENTS.md`, README, docs, and recovery artifacts
- enumerate project docs before deciding what to change
- compare code, docs, generated artifacts, README, AGENTS, and recovery surface
- delete or migrate historical narration from `AGENTS.md`
- keep `AGENTS.md` as a thin rulebook
- keep docs reader-facing and current
- update generated artifacts only through generators
- record unresolved doc drift as explicit follow-up
- avoid behavior changes unless the user asked for cleanup to include them

Cleanup should absorb the useful handoff hygiene from `save-session`, but without becoming a separate pause/resume lane.

### Method Contract

Update the contract so the stable principles are not tied to removed skill names. In particular:

- C2 should refer to repository artifacts and recovery surface, not only workflow state.
- C3 should continue to protect thin `AGENTS.md`.
- C4 should refer to Harness Builder, not bootstrap.
- C5 should refer to executable plans and scoped work.
- C8 and C9 should make Knowledge Cleanup explicit.
- C10 should preserve backend decoupling as a principle, not a `state-contract` skill.

### README And AGENTS.md

Rewrite the public workflow map:

- remove `state-contract`, `resume`, and `save-session`
- introduce Harness Builder as the canonical project harness skill
- describe Brainstorm, Plan, Implement, Diagnose, Review, Verify, and Cleanup with their independent responsibilities
- document that three-file state is optional
- document the default verification command
- keep `AGENTS.md` concise and rule-focused

### Validation Scripts

Update checks to enforce the new model:

- required skills list uses `harness-builder`
- removed skills are absent
- docs do not advertise `state-contract`, `resume`, or `save-session` as active skills
- `bootstrap` is allowed only as alias/history, not canonical active skill
- three-file templates may exist if still used as backend templates, but validation must not treat them as global dependency
- generated HTML exists for active skills only

### Skill Flow HTML

Regenerate the HTML review pages from the new skill graph. The primary view should show conditional routes, not a mandatory linear sequence.

## Testing Decisions

- Run `node scripts/check-plugin.mjs` after structural changes.
- Run `node scripts/generate-skill-flow-html.mjs` whenever skill names, route maps, or `SKILL.md` structures change.
- Run `node scripts/check-plugin.mjs` again after regeneration.
- Verify removed skill names do not appear as active required skills in plugin manifest, check script, generated flow, README, Method Contract, or AGENTS.md.
- Verify old terms may appear only as historical aliases, ADR context, or legacy archive references.
- Verify every active `SKILL.md` has valid frontmatter and matching skill name.
- Verify generated HTML pages exist for active skills and do not exist for deleted skills unless intentionally retained as historical docs.
- Good tests for this project should check external plugin behavior and documentation consistency rather than internal wording details.
- The check script should be the main regression test for plugin shape.

## Out of Scope

- Changing user-global Codex configuration.
- Publishing or installing the plugin into the local Codex marketplace.
- Adding hooks, MCP config, or subagents as part of this refactor.
- Rewriting the legacy bootstrap archive beyond updating references needed to avoid active-skill confusion.
- Implementing a full issue tracker workflow.
- Changing the actual project memory system outside this repository.
- Removing the three-file backend templates entirely.

## Acceptance Criteria

- `harness-builder` is the canonical active skill name.
- `bootstrap` is no longer an active skill name, except as historical alias wording.
- `state-contract`, `resume`, and `save-session` are no longer exposed as skills.
- Useful state backend and recovery guidance has been migrated into Harness Builder and Cleanup references.
- Brainstorm documentation describes spec output and does not default to workflow state writes.
- Plan documentation describes executable plan output and does not default to three-file creation.
- Cleanup documentation centers on knowledge cleanup and documentation freshness.
- Review, Verify, Implement, and Diagnose use recovery-surface-aware wording instead of hard-coded three-file dependency.
- README, Method Contract, AGENTS.md, plugin manifest, validation script, flow generator, and generated HTML agree.
- `node scripts/generate-skill-flow-html.mjs` succeeds.
- `node scripts/check-plugin.mjs` succeeds.
- A Chinese Git commit records the completed refactor.

## Further Notes

This PRD intentionally removes exposed workflow lanes rather than preserving compatibility directories. The migration should reduce conceptual load even if it requires a larger first refactor.

The issue tracker was not configured in this repository during PRD creation, so this PRD is stored as a local project document under `docs/prd/`.
