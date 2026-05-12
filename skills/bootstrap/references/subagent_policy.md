# Subagent Policy

Subagents are for context isolation, parallel exploration, and independent review.

## Good subagents

Name them by failure mode, not job title:

- `repo_explorer`
- `ml_reviewer`
- `rl_reviewer`
- `security_reviewer`
- `test_triager`
- `blast_radius_reviewer`
- `api_contract_reviewer`

## Avoid

- `senior-engineer`
- `architect`
- `backend-engineer`
- `frontend-engineer`

## Use when

- existing project is large or unfamiliar;
- a diff needs independent review;
- ML/RL validity needs separate scrutiny;
- security or API compatibility is high risk;
- test failure triage benefits from isolated context.

Record installed subagents in `.harness/manifest.yaml` and `.harness/decisions.md`.
