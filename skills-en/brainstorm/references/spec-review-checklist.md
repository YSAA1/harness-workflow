# Spec Review Checklist

Use this after writing a brainstorm spec and before asking for user approval.

## Blocking Issues

- Placeholder remains: `TBD`, `TODO`, `[fill me]`, empty required section, or unresolved question.
- Internal contradiction: goals conflict with non-goals, behavior conflicts with constraints, or verification cannot prove the stated success criteria.
- Scope too broad: the spec covers multiple independent subsystems that should become separate specs.
- Ambiguous behavior: two implementers could build different behavior and both claim compliance.
- Missing verification strategy: no baseline, no automated or smoke check, no negative/boundary check, or no fresh-evidence requirement.
- Missing capability gap: the spec assumes browser, docs, issue tracker, external service, hardware, credentials, or human judgment without recording the gap and fallback.
- Unfalsifiable success criteria: "works well", "high quality", "clean", or similar wording without observable evidence.

## Advisory Issues

- Long background that does not affect planning.
- Too many rejected options when one or two are enough.
- Implementation steps appearing in the spec; move those to `plan`.
- Details better stored in code comments, README, or architecture docs after implementation.

## Approval Rule

Approve only when the spec is focused enough for one implementation plan and the verification strategy can realistically produce fresh evidence. Fix blocking issues inline before asking the user to review the spec.
