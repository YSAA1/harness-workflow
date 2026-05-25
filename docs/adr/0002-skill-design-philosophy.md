# Skill Design Philosophy

We use short workflow skills backed by references, scripts, and evals instead of
large self-contained skill files.

## Context

Harness Workflow has strong process semantics: routing, recovery surfaces,
verification gates, cleanup discipline, and project-local capability decisions.
Putting every policy into every `SKILL.md` makes those semantics easy to load
but expensive in hot context, and it encourages drift between skills.

## Decision

- Keep `SKILL.md` focused on trigger contract, invariants, main workflow,
  output contract, routing, and reference navigation.
- Put detailed checklists, examples, templates, policy matrices, and edge-case
  rules in one-level `references/` files linked from `SKILL.md`.
- Put deterministic or drift-prone checks in scripts when the behavior should be
  mechanically verified.
- Put shared vocabulary in `CONTEXT.md` and `docs/workflow-glossary.md` instead
  of redefining it in every skill.
- Add skill evals and CI checks for routing, output contracts, references, and
  packaged-copy drift before relying on prose discipline alone.

## Consequences

- Skill hot paths stay small enough for routine use.
- Rare policy detail remains discoverable without always loading it.
- Output contracts can be checked consistently across Codex, Claude Code, and
  Cursor surfaces.
- Contributors must update canonical `skills/`, packaged plugin copies, Cursor
  preview copies, and generated review HTML together.
- Shared terms should be added to the glossary when they become stable workflow
  language.
