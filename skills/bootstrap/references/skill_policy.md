# Skill Policy

Create or reuse skills only for repeated specialized workflows.

## Create a project-local skill when

- the workflow will repeat;
- failure is costly;
- trigger conditions are clear;
- the workflow is too detailed for `AGENTS.md`;
- project-specific context matters;
- the skill can include useful scripts, references, or checklists.

## Reuse an existing skill when

- it is generic;
- the trigger description matches the intended use;
- it does not contain stale project-specific commands;
- it does not conflict with this project's harness.

## Copy and specialize a user/global skill when

- the project should be reproducible for other collaborators;
- the workflow is central to the project;
- project-specific paths, metrics, labels, or risk rules matter.

## Do not create a skill for

- one-off bug fixes;
- basic project overview;
- generic "be careful" advice;
- tasks better handled by tests, hooks, or check scripts;
- workflows with unclear triggers.

## Good ML/RL skills

- `data-leakage-audit`
- `ml-experiment-review`
- `metric-design-review`
- `rl-env-review`
- `reward-function-review`
- `sim2real-deployment-review`
- `offline-rl-dataset-audit`

## Good software engineering skills

- `api-contract-change`
- `database-migration-review`
- `bug-reproduction`
- `test-failure-triage`
- `release-readiness-review`
