# AGENTS.md and Project Map Policy

`AGENTS.md` is the agent's entry point. It should be short, navigational, and enforce project iron laws.

It should not be a full knowledge base. Put long details in `docs/agent/`, local `AGENTS.md`, or project-local skills.

## Required sections for generated AGENTS.md

### 1. Project overview

Briefly state what the project is.

Example:
```md
## Project overview
Python 3.11 FastAPI backend with PostgreSQL 15.
```

### 2. Project map

Tell agents where major things live.

Example:
```md
## Project map
- `src/`: application source
- `tests/`: pytest tests
- `configs/`: runtime and experiment configs
- `scripts/agent/`: agent-facing verification/startup scripts
- `docs/agent/`: project context, workflow, verification, risk notes
- `.harness/`: harness state, manifest, decisions, progress, handoff
- `.agents/skills/`: project-local reusable agent workflows
- `.codex/`: Codex-specific config, hooks, and reviewer agents
```

### 3. Quick start

Include install/test/check commands that are known or mark unknown. Do not invent commands.

### 4. Project iron laws / hard constraints

This is essential. Put non-negotiable project rules here.

Example:
```md
## Project iron laws
- All APIs must use OAuth 2.0 authentication.
- All database queries must use SQLAlchemy 2.0 style.
- All PRs must pass pytest, mypy --strict, and ruff check.
```

Good iron laws are project-specific, stable, testable or reviewable, and high consequence if violated.

Bad iron laws are vague rules like "write good code", volatile details, or rules better handled in a task-specific doc.

### 5. Harness map

Explain the harness itself so agents understand the generated files.

Example:
```md
## Harness map
- `AGENTS.md`: entry rules, project map, and hard constraints
- `docs/agent/project_context.md`: project background and assumptions
- `docs/agent/workflow.md`: how agent sessions should proceed
- `docs/agent/verification.md`: verification strategy
- `scripts/agent/check.sh`: fast verification command
- `.harness/state.md`: current project phase, known gaps, and next step
- `.harness/progress.md`: long-running task progress
- `.harness/session_handoff.md`: restart notes for future sessions
- `.harness/manifest.yaml`: installed harness components
- `.harness/decisions.md`: why harness decisions were made
```

### 6. Required reading by task type

Route agents to focused docs only when relevant.

Example:
```md
## Required reading by task type
- API changes: read `docs/api-patterns.md`
- Database changes: read `docs/database-rules.md`
- Tests: read `docs/testing-standards.md`
- ML experiments: read `docs/agent/verification.md` and relevant project skill
```

### 7. Protected areas

List paths requiring explicit permission.

### 8. Verification

Point to the one fast verification command.

### 9. Definition of Done

State what "done" means: scoped change, checks run or failure reported, state updated for multi-session work, and risks listed.

## Local AGENTS.md

Use local `AGENTS.md` for directory-specific rules:

- `data/AGENTS.md`: raw data and label protection
- `src/envs/AGENTS.md`: RL env API/reward/rollout checks
- `migrations/AGENTS.md`: migration safety
- `frontend/AGENTS.md`: visual/a11y checks
- `infra/AGENTS.md`: cloud/deployment rules

Local files should be short and specific.
