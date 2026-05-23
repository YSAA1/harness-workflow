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
- `research_critic`
- `failure_analyst`

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

Project-level Harness Builder should default `repo_explorer` to `Recommended` for large or unfamiliar repos, and default security, API contract, ML/RL, research, or failure-analysis reviewers to `Recommended` when those risks are signaled. Single-task work remains conservative and should keep subagents read-only unless the user explicitly approves more.
