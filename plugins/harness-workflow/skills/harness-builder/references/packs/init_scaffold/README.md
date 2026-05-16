# Init Scaffold Pack

This pack contains concrete scaffold assets adapted from `harness-init` for use by `harness-builder`.

It is not a standalone workflow. Harness Builder remains the controller. Use this pack only after Evidence, Existing Harness Reconciliation, Harness Charter, Coverage Matrix, Capability Discovery, Verification Design, and User Checkpoint have selected and approved the relevant coverage rows.

## Provides

- Stack routing for boundary tests, linter snippets, CI, GC, and optional pre-commit decision support.
- Architecture layer examples.
- Boundary test skeletons and known-violations baseline/ratchet format.
- CI and GC starter templates with command-safety and report-only rules.
- SECURITY.md template with secret-exclusion rules.
- Golden principles and ExecPlan reference material.

## Does not own

- Whether anything is Required.
- User approval.
- Existing harness reconciliation.
- Hooks, MCP, subagents, or Research Route.
- Overwriting existing files.
