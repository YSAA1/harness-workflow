# Harness Subsystems

Use this model to diagnose what the project lacks. Do not treat the components as mandatory; choose the smallest artifact that closes the real gap.

## 1. Instructions — controllability

Problem: the agent does not know project rules, boundaries, or where to start.

Artifacts:
- `AGENTS.md`
- local/subdirectory `AGENTS.md`
- `docs/agent/workflow.md`
- protected paths
- project iron laws

Use when a fresh agent would not know repo structure, there are hard project rules, directory-specific rules differ, or the user worries about agent overreach.

Avoid giant root instruction files, vague rules like "be careful", and duplicating long docs inside `AGENTS.md`.

## 2. Verification — verifiability

Problem: the agent claims success without evidence.

Artifacts:
- `scripts/agent/check.sh`
- `scripts/agent/smoke.sh`
- unit tests, lint, typecheck
- tiny train/eval/rollout for ML/RL

The default check must be fast, local, and safe. Do not put long training, production deploys, cloud writes, or destructive migrations into the default check.

## 3. State — recoverability

Problem: the agent loses context between sessions.

Artifacts:
- `.harness/state.md`
- `.harness/progress.md`
- `.harness/session_handoff.md`
- `docs/agent/project_context.md`

Use when work spans sessions, a new agent must resume later, or chat history is unreliable as memory.

## 4. Scope — anti-overreach

Problem: the agent starts unrelated refactors or changes too much at once.

Artifacts:
- current task section in `.harness/state.md`
- feature/task list
- Definition of Done
- explicit non-goals
- protected path policy

Avoid letting agents rewrite requirements or tests to declare success.

## 5. Lifecycle — repeatable session routine

Problem: every session starts differently and ends without handoff.

Artifacts:
- `scripts/agent/init.sh`
- startup checklist
- end-of-session checklist
- `.harness/session_handoff.md`

Use when sessions are long, multiple agents/tools work on the repo, or the project has baseline checks.

## 6. Auditability

Problem: nobody knows why a harness component exists.

Artifacts:
- `.harness/manifest.yaml`
- `.harness/decisions.md`
- `.harness/skill_inventory.json`
- `.harness/research_notes.md`

Use when installing hooks, skills, MCP, subagents, making project rules, adopting web-researched patterns, or rejecting tempting but risky components.

## 7. Sustainability — anti-entropy

Problem: the harness becomes a new source of bloat.

Artifacts:
- repair mode
- garbage-collect mode
- `decisions.md`
- manifest review
- split fast/full checks

Rule: add the smallest component that prevents a known failure. Delete components that no longer carry weight.
