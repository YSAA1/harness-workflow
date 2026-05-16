# Hook Policy

Hooks are deterministic guardrails. Keep them few and explainable.

Good hooks block destructive commands, edits to protected data/secrets/checkpoints, pasted secrets, missing verification, or log important events.

Bad hooks include long-running training, subjective review, broad formatting that hides diffs, semantic checks better done by tests, or anything that blocks common workflows without a clear reason.

Every installed hook should document event, what it blocks or records, reason, false-positive risk, and repair/disable instructions.
