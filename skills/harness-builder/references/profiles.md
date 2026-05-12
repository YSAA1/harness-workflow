# Harness Profiles

Profiles are starting points, not rigid templates. Always adapt based on repo evidence and the Harness Hypothesis.

## Profile 0: exploratory

For tiny experiments and demos.

Required:
- `AGENTS.md`
- `scripts/agent/check.sh`
- `docs/agent/project_context.md`
- `.harness/manifest.yaml`

Usually solo orchestration.

Avoid:
- MCP
- subagents
- many skills
- strict hooks

## Profile 1: standard-dev

For normal active projects.

Required:
- Profile 0
- project map and project iron laws in `AGENTS.md`
- `docs/agent/workflow.md`
- `docs/agent/verification.md`
- `.harness/state.md`
- `.harness/decisions.md`

Recommended:
- simple safety hook if protected paths exist

## Profile 2: ml-experiment

For ML projects.

Required:
- Profile 1
- data/leakage rules
- tiny train/eval or dry-run verification
- `docs/agent/risk_register.md`

Recommended skills:
- `data-leakage-audit`
- `ml-experiment-review`
- `metric-design-review`

Consider subagents:
- `verification_scout`
- `risk_scout`
- `skill_scout`
- `ml_reviewer`

## Profile 3: rl-robotics

For RL, robotics, humanoid control, sim-to-real.

Required:
- Profile 2
- tiny rollout verification if possible
- env reset/step and reward review rules
- sim/deploy boundary documentation

Recommended skills:
- `rl-env-review`
- `reward-function-review`
- `sim2real-deployment-review`

Consider subagents:
- `repo_scout`
- `verification_scout`
- `risk_scout`
- `rl_reviewer`

## Profile 4: legacy-safe

For existing projects with unknown conventions.

Required:
- conservative `AGENTS.md`
- weak but safe `check.sh`
- protected paths
- baseline failure report
- repo audit report

Recommended:
- `parallel_readonly`
- `repo_scout`
- `verification_scout`
- `risk_scout`
- `skill_scout`
- reviewer subagent
- stricter safety hook

## Profile 5: production-sensitive

For production systems or high-risk data.

Required:
- Profile 4
- strong project iron laws
- approval-first external tool policy
- release/deployment checklist
- security review

Recommended:
- `review_before_install`
- `security_reviewer`
- read-only MCP only unless approved

Avoid:
- write-operation MCP by default
- automatic production deploys
- broad agent permissions
