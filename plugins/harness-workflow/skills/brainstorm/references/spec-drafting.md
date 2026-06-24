# Spec Drafting (Phase B)

Enter Phase B only after the Clarification Gate passes and any assumption batch is confirmed.

## Steps

1. **Verification first** — baseline, automated checks, smoke/E2E, negative cases, fresh-evidence requirements, unverifiable items.
2. **Compare 2-3 approaches** — positioning, tradeoffs, failure modes, verification impact. Record rejected options even when one approach is clearly best.
3. **Confirm design segments** — goals/scope, behavior/interfaces, architecture boundaries, verification, non-goals, residual risks. Do not treat silence as approval.
4. **Write Spec** — use `templates/spec.zh-CN.md` for Chinese users and `templates/spec.md` as the English/default template. For other user languages, translate human-facing headings from the default template while preserving protocol tokens in parentheses when useful. Canonical path is `docs/specs/YYYY-MM-DD--<topic>.md`. Do not write Spec to `docs/prd/`, issue bodies, root `plan.md`, or ad-hoc docs just because they already exist. Override only when the current user explicitly names a path or `AGENTS.md` declares a canonical Spec surface, and record the override reason. Complex tasks should include suggested milestones and per-milestone acceptance hints; simple tasks should say why they are not needed.
5. **Self-review** — use `spec-review-checklist.md`; fix TBDs, contradictions, unverifiable success criteria, and hidden capability gaps inline.
6. **Optional durable summary** — only if the selected recovery surface requires it: Spec path, goals/non-goals, constraints, verification strategy, capability gaps, rejected options, residual risks. Do not default to `.harness/` runtime writes or paste the full Spec into state logs.
7. **User review gate** — stop and ask for approval before `plan` or implementation.

## Review Gate Message

```text
Spec written: <docs/specs/YYYY-MM-DD--topic.md or explicit override>
Please review and approve or request changes before I create the implementation plan.
Next skill after approval: plan
```

## Phase B Output

```text
BRAINSTORM SPEC READY

<Spec path label in user's language> / Spec: <docs/specs/YYYY-MM-DD--topic.md or explicit override>
<Question solved label in user's language> / Question solved: <一句话>
<Chosen approach label in user's language> / Chosen approach: <一句话>
<Verification strategy label in user's language> / Verification strategy: <一句话>

<Needs user review label in user's language> / Needs user review:
  - Approve -> plan
  - Request changes -> revise Spec and re-run self-review
  - Pause -> use the selected recovery surface only if needed
```

## Handoff

| Situation | Next skill |
| --- | --- |
| Spec approved, needs planning | `plan` |
| Project harness needs repair | `harness-builder` |
| Missing skills, MCP, hooks, or verification capability | `plan`, then `harness-builder` if execution is affected |
| User pauses before approval | selected recovery surface only |

Do not invoke the next skill before Spec approval.

## Phase B Anti-patterns

- Choosing implementation before verification strategy.
- Writing an Executable Plan inside the Spec.
- Skipping rejected options.
- Hiding capability gaps.
- Treating "sounds good" as Spec approval.

## Done Criteria

- [ ] Clarification Gate passed; blocking dimensions confirmed.
- [ ] 验证策略（Verification strategy）和 2-3 个方案（或 rejected alternatives）已记录。
- [ ] Independent Spec written at `docs/specs/YYYY-MM-DD--<topic>.md`, unless an explicit override was stated.
- [ ] Self-review passed with no blocking checklist items.
- [ ] Recovery-surface summary added only if required.
- [ ] User asked to approve Spec; no `plan` or implementation before approval.
