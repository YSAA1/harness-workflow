# Layered failure diagnosis

For `diagnose`. When a failure appears, first locate which layer it belongs to, instead of assuming outright that the code is wrong.

## Task layer

Signals:
- Test expectations conflict with the accepted spec.
- The user's goal changed, but the plan did not.

Handling:
- Go back to `brainstorm` or `plan`.

## Context layer

Signals:
- `AGENTS.md` instructions are stale.
- The project map is wrong.
- The agent enters by the wrong entry point.

Handling:
- `harness-builder` re-establishes the project map and verifies the entry points and the thin `AGENTS.md` pointer.

## Tool / environment layer

Signals:
- Missing dependencies, version mismatches, commands that do not exist.
- Passes locally, fails in CI.
- Missing browser/database/service capabilities.

Handling:
- Record environment facts.
- Minimal reproduction.
- Give a capability recommendation when necessary.

## State layer

Signals:
- Fixtures were modified.
- Stale cache, snapshot, or generated files.
- The selected recovery surface is inconsistent with the git state.

Handling:
- Fix the state first, then re-verify.
- Do not directly change business code to cover up a state problem.

## Verification layer

Signals:
- Mocks shield the real path.
- Unit passes but smoke fails.
- Flaky treated as pass.

Handling:
- Escalate the verification level.
- Record the flaky conditions and the reproduction command.

## Lifecycle / scope layer

Signals:
- Multiple slices are mixed together.
- Drive-by changes introduce new failures.
- Unclosed old tasks contaminate the current task.

Handling:
- `cleanup` or `plan` re-draws the boundary.

## Regression / milestone layer

Signals:
- New failures appear inside the scope of an already-committed milestone.
- Checks that verify once marked PASS now FAIL.
- Later changes broke previously verified behavior.

Handling:
- First confirm which commit introduced the regression (git bisect or diff analysis).
- Check whether the original verify evidence covered the currently failing path.
- After the fix, re-verify the affected milestone scope.
