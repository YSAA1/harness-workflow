# Executable Plan Contract

Use this reference when writing or reviewing the plan body.

## Required Fields

An Executable Plan must include:

- Objective
- Active slice
- Non-goals
- Success criteria
- Verification path
- Verification path status: `runnable | blocked`
- Required capabilities
- Fallback evidence if full verification is unavailable
- `final_integration_claim` for multi-stage or multi-commit work
- 3-7 phases or work items when the task is multi-step
- Current unique in-progress or next item
- Commit units when milestones matter
- Known risks and blockers
- Handoff to the next skill

## Output Shape

```text
EXECUTABLE PLAN WRITTEN

Planning surface: <docs plan | issue | feature-list | existing | three-file | lightweight>
Artifact: <path | issue | entry id | chat>
Spec source: <path | explicit small-task exception>
Active slice: <one sentence>
Success criteria: <falsifiable conditions>
Verification path status: <runnable | blocked>
Required capabilities: <list>
Fallback evidence: <none | accepted fallback>
Final integration claim: <none | claim>
Next skill: <implement | diagnose | harness-builder | verify>
Reason: <one sentence>
```

## Quality Checks

- Another agent can resume from the artifact without chat history.
- The plan preserves WIP=1.
- Each action has a verification meaning.
- Success criteria are falsifiable.
- The selected planning surface is explicit.
- The next skill is explicit.
- The plan stops at the planning boundary unless the user asked to continue.

## Anti-Patterns

- Using `plan` to keep asking requirement questions.
- Treating three-file backend as the identity of planning.
- Marking multiple phases as in progress.
- Writing a wish list instead of executable steps.
- Discovering verification capability only after implementation.
- Defining commit units without review and verify preconditions.
