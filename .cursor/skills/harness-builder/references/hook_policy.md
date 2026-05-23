# Hook Policy

Hooks are deterministic guardrails. Keep them few and explainable.

Good hooks block destructive commands, edits to protected data/secrets/checkpoints, pasted secrets, missing verification, or log important events.

Bad hooks include long-running training, subjective review, broad formatting that hides diffs, semantic checks better done by tests, or anything that blocks common workflows without a clear reason.

Every installed hook should document event, what it blocks or records, reason, false-positive risk, and repair/disable instructions.

Project-level Harness Builder should recommend narrow hooks more actively when repo signals are clear. Single-task work remains conservative and should not install hooks unless that task needs them.

## Signal-driven candidates

Only recommend hooks after a Coverage Matrix row exposes a concrete guardrail or verification gap.

Good hook signals:

- protected paths such as `.env`, raw data, checkpoints, generated artifacts, deployment files, or user-authored recovery files;
- repeated destructive shell risk that cannot be caught reliably by tests;
- existing fast formatter, linter, typecheck, or verification command that is cheap enough to run as a reminder or narrow post-edit check;
- compliance or audit events that need deterministic logging.

For each hook candidate, include:

- event and trigger scope;
- coverage row binding;
- command or check to run;
- expected false-positive modes;
- repair or disable path;
- fallback if the hook is not installed.

Prefer warning, reminder, or narrow allowlist behavior before blocking. Keep hooks optional unless they prevent a concrete high-risk failure that docs, tests, or review cannot catch.

Default to `Recommended` when the signal is protected paths, a known fast linter/typecheck reminder, a stable verification reminder, or a commit/branch guardrail. Keep `Required` only for concrete high-risk failures that cannot be caught reliably by docs, tests, or review.
