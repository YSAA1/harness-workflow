---
name: harness-builder
description: "Use when the user asks to bootstrap, initialize, onboard, repair, or recommend a project-level AI-agent workbench: project entry, recovery surface, verification gate, capability recommendation, agent instructions, skills, scripts, or anti-entropy guardrails."
---

# Harness Builder

Build or repair the minimal useful project-level harness for AI coding agents. This skill is now the controller: it reads project evidence, classifies the workbench gap, routes thick sub-capabilities to helper skills, and only implements a concrete patch after user approval.

Harness Builder's deliverable is the harness itself: project entry, protected paths, selected recovery surface, verification entry, capability recommendation, install surface consistency, and anti-entropy discipline. It is not a lane for performing the feature, bugfix, or research task described by the user.

External research-governance wiring is intentionally outside this plugin. Do not create research gates, research templates, branch guards, or external research workflow wiring from this skill.

## Helper split

| Helper | Use for | Writes by default |
| --- | --- | --- |
| `capability-recommender` | read-only recommendations for skills, hooks, MCP, subagents, plugins, scripts, CI/headless automation | No |
| `agent-instructions-maintainer` | `AGENTS.md`, `CLAUDE.md`, `.claude.md`, Cursor rules, and durable instruction docs | Only after USER CHECKPOINT |
| `recovery-surface-builder` | work index, active slice, state, progress, decisions, evidence, verification commands, session catch-up | Only after USER CHECKPOINT |
| `find-skills` | discovering reusable external skills for a known capability gap | No install by default |

## Language strategy

- User-visible output follows the user's language; default to Chinese for Chinese requests.
- Stable protocol tokens may stay in English: `HARNESS EVIDENCE`, `HARNESS RECOMMENDATION MATRIX`, `USER CHECKPOINT`, `Required / Recommended / Deferred / Rejected`, command names, file paths, skill names, and install-surface identifiers.

## When to use

- User asks to bootstrap, initialize, onboard, repair, or recommend an agent workbench.
- Project entry, verification command, recovery surface, protected paths, or capability policy is unclear.
- The repo needs project-local skills, scripts, optional hooks/MCP/subagents/plugins, install docs, or anti-entropy checks evaluated.
- A thick skill should be split into callable helper skills and a thinner controller.

## Modes

| Mode | Use when | Default scope |
| --- | --- | --- |
| Quick repair | User asks to repair a narrow workbench gap | entry instructions, recovery pointer, verification entry, generated/mirrored drift, anti-entropy check |
| Full recommendation | User asks for setup/capability recommendations or repo evidence exposes broad workflow gaps | Harness Recommendation Matrix plus helper-skill routing |

Default to Quick repair. Escalate to Full only when the request or evidence needs it.

## Workflow

1. Evidence pass: read actual project surfaces before recommending changes.
2. Boundary check: distinguish harness work from the user's real task. Do not perform the real task in this skill.
3. Gap classification: classify each gap as entry, recovery, verification, capability, install, generated mirror, or anti-entropy.
4. Helper routing: route thick sub-capabilities to `capability-recommender`, `agent-instructions-maintainer`, `recovery-surface-builder`, or `find-skills`.
5. Recommendation matrix: rank Required / Recommended / Deferred / Rejected with evidence, risk, and verification path.
6. USER CHECKPOINT: ask before writing unless the user already approved the exact patch.
7. Install/repair: patch only the approved harness slice. Prefer canonical sources, then sync mirrors.
8. Verify: run the narrowest relevant checks and report fresh evidence.

## Evidence pass checklist

Read only the relevant subset:

- Entry docs: `AGENTS.md`, `CLAUDE.md`, `.claude.md`, `.cursor/rules/`
- Plugin manifests: `.codex-plugin/`, `.claude-plugin/`, `.cursor-plugin/`, marketplace files
- Workflow docs: `README.md`, `README.zh-CN.md`, `CONTEXT.md`, `docs/harness-method-contract.md`, `docs/install/*`
- Skills and rules: `skills/*/SKILL.md`, `rules/*`, `.cursor/skills/*`, packaged plugin mirrors
- Automation: `scripts/*`, CI workflows, generated docs, validation commands
- Recovery surfaces: `.harness/`, issue trackers, specs, plans, ADRs, or project-specific state files

If local evidence conflicts with the user's assumption, stop and explain the conflict.

## Design rules

- Keep durable instruction files thin; active state belongs in the selected recovery surface.
- Do not create root `task_plan.md`, `findings.md`, and `progress.md` by default. Use `recovery-surface-builder` to choose or map the backend.
- Do not add hooks, MCP, subagents, or global config by default. Recommend them only with a concrete gap and rollback path.
- Keep Codex, Claude Code, and Cursor install surfaces semantically aligned.
- Do not hand-edit generated mirrors when a source file and sync path exist.
- Prefer deterministic scripts for checks and agent skills for judgment-heavy workflows.

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

## Recommended next skill

- Use `capability-recommender` for read-only capability design.
- Use `agent-instructions-maintainer` for durable instruction-file updates.
- Use `recovery-surface-builder` for active state, progress, decisions, evidence, and recovery surfaces.
- Use `plan` when the approved harness change needs active-slice management.
- Use `verify` after a harness change claims ready.