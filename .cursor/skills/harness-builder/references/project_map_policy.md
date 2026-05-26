# AGENTS.md and Project Map Policy

`AGENTS.md` is the agent's entry point. It should be short, navigational, and enforce project iron laws.

It should not be a full knowledge base. Put long details in `docs/agent/`, local `AGENTS.md`, or project-local skills.

## AGENTS.md maintenance rule

`AGENTS.md` is the stable cross-agent entrypoint. Harness Builder should audit it on every run, but patch it only when durable repo-level facts changed.

Patch `AGENTS.md` for stable facts such as:

- project overview;
- project map;
- stable project iron laws;
- protected paths;
- required reading by task type;
- selected recovery surface pointer;
- verification entrypoint;
- source-of-truth priority.

Do not put these in `AGENTS.md`:

- current active slice;
- temporary task plan;
- session summary;
- stale debugging notes;
- one-off review conclusion;
- long automation catalog;
- unapproved hooks, MCP, subagents, or project-local skills;
- full Research Route runtime state.

Dynamic work state belongs in the selected recovery surface. If an existing `AGENTS.md` contains dynamic state, preserve or migrate that content into the selected recovery surface before removing it from the entrypoint.

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

### 5. Recovery surface

Name the selected recovery surface and the first files to read when work must continue across sessions. Do not imply optional harness files exist unless they were selected or installed.

Example:
```md
## Recovery surface
Selected recovery surface: `.harness/state.md`

Read next:
- `.harness/state.md`: current work state, evidence, risks, and next action
- `.harness/decisions.md`: durable harness decisions
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
