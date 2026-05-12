# Learn Harness Engineering Alignment

Use this file as a coverage checklist. The goal is not to generate every artifact. The goal is to explicitly consider each harness engineering dimension and adopt, defer, or reject it for the current project.

## L01 — Capable agents still fail

Question:
- Which harness layer is most likely to fail here: task specification, context visibility, environment setup, verification feedback, or state continuity?

Outputs:
- likely failure layer in Harness Hypothesis;
- controls matched to failure layer.

## L02 — What a harness actually is

Question:
- Which project-specific systems must exist around the model: instructions, tools/scripts, environment, state, feedback, permissions?

Outputs:
- harness subsystem diagnosis;
- Required / Recommended components.

## L03 — Repository as system of record

Question:
- Which important rules currently exist only in the user's head or chat history?

Outputs:
- `AGENTS.md`;
- `docs/agent/project_context.md`;
- `.harness/decisions.md`.

## L04 — One giant instruction file fails

Question:
- What belongs in root `AGENTS.md`, what belongs in docs, local AGENTS, skills, or scripts?

Outputs:
- project map;
- project iron laws;
- harness map;
- required reading by task type;
- local AGENTS recommendations.

## L05 — Long-running tasks lose continuity

Question:
- Does future work need repo-local state and handoff?

Outputs:
- `.harness/state.md`;
- `.harness/progress.md`;
- `.harness/session_handoff.md`.

## L06 — Initialization needs its own phase

Question:
- What should a fresh agent do before implementation?

Outputs:
- `docs/agent/workflow.md`;
- optional `scripts/agent/init.sh`;
- AGENTS "Start here" section.

## L07 — Agents overreach and under-finish

Question:
- How should scope be constrained and completion prevented from drifting?

Outputs:
- WIP/scope rules;
- protected paths;
- Definition of Done;
- task/feature list if needed.

## L08 — Feature lists are harness primitives

Question:
- Does the project need a machine-readable feature/task list with behavior, verification command, and status?

Outputs:
- optional `.harness/features.json`;
- optional `.harness/tasks.yaml`;
- status update rules.

## L09 — Agents declare victory too early

Question:
- What external checks must pass before an agent can claim done?

Outputs:
- `scripts/agent/check.sh`;
- completion gates;
- verification evidence requirements.

## L10 — End-to-end testing changes results

Question:
- Which core flow needs a smoke/e2e/tiny-run check beyond unit tests?

Outputs:
- `scripts/agent/smoke.sh`;
- ML tiny train/eval;
- RL tiny rollout;
- backend/API smoke path.

## L11 — Observability belongs inside the harness

Question:
- What evidence should be captured during task execution and verification?

Outputs:
- `.harness/reports/`;
- verification report notes;
- failure summaries;
- optional session log.

## L12 — Every session must leave a clean state

Question:
- What clean state must a session leave behind?

Outputs:
- session handoff;
- progress update;
- no stale temporary files;
- last known verification;
- anti-entropy cleanup policy.

## Coverage table template

Use this in Harness Hypothesis or Harness Plan:

```markdown
| Course dimension | Adopt / Defer / Reject | Harness artifact | Reason |
|---|---|---|---|
| Repository as system of record | Adopt | AGENTS.md, docs/agent | User has implicit project rules |
| Feature list | Defer | .harness/features.json | Project is still exploratory |
```
