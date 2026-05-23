# Skill Policy

Create or reuse skills only for repeated specialized workflows.

Create a project-local skill when the workflow will repeat, failure is costly, triggers are clear, the workflow is too detailed for `AGENTS.md`, project-specific context matters, and the skill can include useful scripts, references, or checklists.

Do not create a skill for one-off bug fixes, basic overview, generic caution, tasks better handled by tests/hooks/check scripts, or workflows with unclear triggers.

Project-level Harness Builder should default repeated workflow skills and project-level domain skills to `Recommended` when repo signals show recurrence. Single-task work remains conservative and should not create a skill for a one-off need.

## Invocation mode

Every skill candidate must declare invocation mode:

| Mode | Use when |
| --- | --- |
| `user-only` | The skill has side effects, triggers commits/deploys/releases, changes external systems, sends messages, or should run only on explicit user request. |
| `agent-only` | The skill is background policy, review knowledge, or domain guidance that the agent may load when relevant but the user should not invoke as a command. |
| `both` | The skill is safe as a user command and as agent-invoked guidance. |

Default side-effecting skills to `user-only`. Do not let model-invoked skills silently write files, call external services, or alter repo state unless the Harness Plan explicitly approves that behavior.

Bind every proposed skill to a Coverage Matrix row and include repo signal, why, install surface, risk/cost, fallback, and classification as defined in `capability_signal_policy.md`.

Good ML/RL skills include `data-leakage-audit`, `ml-experiment-review`, `metric-design-review`, `rl-env-review`, `reward-function-review`, `sim2real-deployment-review`, and `offline-rl-dataset-audit`.
