# Commit Unit Protocol

Use this reference when an Executable Plan needs milestone commits or multi-stage acceptance.

## Commit Units

A commit unit defines when one milestone is eligible to commit. It is a planning artifact, not a global rule.

Each commit unit includes:

- `scope`: file, feature, behavior, or stage boundary covered by the commit
- `phases`: one or more plan phases bound to this commit
- `preconditions`: implementation complete, review has no Critical finding, and verify is PASS
- `message_hint`: suggested commit message tied to the phase name

## When To Define Commit Units

Define commit units when:

- the task is multi-stage
- more than one agent may work on it
- the user requested commits or PR-ready milestones
- rollback or review boundaries matter

Skip commit units when:

- the task is a tiny patch
- no durable plan is being written
- the repository has a different explicit commit protocol

## Phase Acceptance

Every phase in a multi-stage plan should include:

- `acceptance_criteria`: falsifiable completion conditions
- `verification_commands`: command or manual check list
- `success_definition`: one-sentence statement of done for that phase

Avoid vague criteria such as "finish optimization" or "mostly works".

## Final Integration Claim

For multi-stage or multi-commit work, include `final_integration_claim`.

This claim states what must be true after all stages are combined. Local slice proof is not enough when the final behavior depends on stage integration.

## After Commit

When a milestone commit is made:

- update the selected recovery surface if one exists
- record commit hash and phase status
- keep the next active slice at WIP=1
