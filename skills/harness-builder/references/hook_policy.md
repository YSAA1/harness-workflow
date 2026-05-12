# Hook Policy

Hooks are deterministic guardrails. Keep them few and explainable.

## Good hooks

- block destructive commands;
- block edits to protected data/secrets/checkpoints;
- scan prompts for pasted secrets;
- remind about missing verification;
- log important events.

## Bad hooks

- long-running training;
- subjective code review;
- broad automatic formatting that hides diffs;
- complex semantic checks better done by tests;
- anything that blocks common workflows without a clear reason.

## Default protected patterns

- `data/raw/`
- `.env`
- private keys
- `checkpoints/`
- `runs/`
- `outputs/`
- production configs
- destructive git commands
- `rm -rf`

## Hook documentation

Every installed hook should document:

- event;
- what it blocks or records;
- reason;
- false-positive risk;
- repair/disable instructions.
