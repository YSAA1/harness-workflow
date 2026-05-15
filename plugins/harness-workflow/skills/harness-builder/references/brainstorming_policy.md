# Brainstorming Policy

Harness Builder should not ask a fixed questionnaire.

The purpose of brainstorming is to discover the missing information needed to build the right harness for this project.
It must not turn an unclear user request into a harness template by guessing acceptance criteria.

## Principle

Ask only questions that change the harness design.

Every question must include:

1. why it matters;
2. which harness component it affects;
3. what conservative default will be used if unanswered.

Bad:
```text
What type of project is this?
```

Better:
```text
I see `data/raw/` and `checkpoints/`. Should these be protected from agent edits?
This affects `AGENTS.md` protected paths, possible `data/AGENTS.md`, and the safety hook.
If unanswered, I will mark them protected.
```

## Evidence before questions

Before asking, collect what is already known from:

- user prompt;
- repo scan;
- README and docs;
- existing `AGENTS.md`, `CLAUDE.md`, or equivalent;
- tests, scripts, CI, Makefile, package scripts;
- existing `.harness/`, `.agents/skills/`, `.codex/`, `.claude/`;
- visible protected or generated directories.

## Minimum contract fields

Before a Harness Plan is written, evidence or user answers must cover:

| Field | Why it matters | If missing |
| --- | --- | --- |
| Target outcome | Decides which harness gaps matter | Ask the user or route to `brainstorm` |
| Non-goals | Prevents harness scope creep | Ask or state a conservative exclusion |
| Acceptance criteria | Defines what "harness works" means | Ask; do not invent silently |
| Verification path | Connects harness to fresh evidence | Ask or propose a conservative default for approval |
| Evidence location | Lets future agents recover proof | Choose the selected recovery surface explicitly |
| Source-of-truth priority | Prevents old and new harness files from mixing | Reconcile existing artifacts first |

`No user questions needed` is valid only when these fields are already answered by the user request, approved Spec/Plan, or repo artifacts. List the evidence for each assumption.

## Gap categories

Use these categories to decide what to ask.

### 1. Project rules and iron laws

Missing:
- non-negotiable architecture/security/data rules;
- required style or framework constraints;
- PR acceptance criteria.

Affects:
- `AGENTS.md` project iron laws;
- local `AGENTS.md`;
- docs and skills.

### 2. Repository as system of record

Missing:
- rules currently only in the user's head;
- undocumented workflow;
- hidden ownership or compatibility constraints.

Affects:
- `docs/agent/project_context.md`;
- `AGENTS.md`;
- `.harness/decisions.md`.

### 3. Verification and completion gates

Missing:
- fast check command;
- deeper smoke/e2e/tiny-train/tiny-rollout command;
- what "done" means for different task types.

Affects:
- `scripts/agent/check.sh`;
- `docs/agent/verification.md`;
- Definition of Done.

### 4. State and recovery

Missing:
- whether tasks span sessions;
- current active work;
- known broken checks;
- last good verification.

Affects:
- `.harness/state.md`;
- `.harness/progress.md`;
- `.harness/session_handoff.md`.

### 5. Scope and WIP

Missing:
- whether WIP=1 should be enforced;
- forbidden unrelated refactors;
- task/feature list requirement.

Affects:
- `AGENTS.md`;
- `.harness/features.json` or `.harness/tasks.yaml`;
- workflow docs.

### 6. Initialization and lifecycle

Missing:
- what a fresh agent should do on session start;
- whether an init script is needed;
- what clean state means on session end.

Affects:
- `scripts/agent/init.sh`;
- `docs/agent/workflow.md`;
- `.harness/session_handoff.md`.

### 7. Observability and audit evidence

Missing:
- what evidence must be captured when a task completes;
- what logs/reports are useful;
- how to record why changes are acceptable.

Affects:
- `.harness/reports/`;
- `.harness/decisions.md`;
- verification report template.

### 8. Reusable workflows

Missing:
- high-frequency or high-risk tasks;
- existing skills;
- whether project-specific skills are needed.

Affects:
- `.agents/skills/*`;
- `.harness/skill_inventory.json`.

### 9. External tools and research

Missing:
- whether official docs, GitHub, issue trackers, Figma, Sentry, or MCP are needed;
- whether web research is required for current syntax.

Affects:
- MCP policy/config;
- `.harness/research_notes.md`.

### 10. Entropy control

Missing:
- known bloat in docs, rules, skills, checks, hooks;
- cleanup cadence;
- what should be deleted or deferred.

Affects:
- `references/anti_entropy.md` application;
- repair/garbage-collect mode.

## Harness Hypothesis

End brainstorming with a Harness Hypothesis:

```markdown
# Harness Hypothesis

## Known from repo

## Known from user

## Missing information
| Missing info | Why it matters | Affected harness component | Conservative default |
|---|---|---|---|

## Questions for user

## Assumptions if unanswered

## Course coverage check
```

Do not proceed to installation until the relevant coverage dimensions have been considered.
