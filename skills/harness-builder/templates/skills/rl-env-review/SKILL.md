---
name: rl-env-review
description: Review RL environment, reward, reset/step, observation/action space, termination, truncation, seeding, wrappers, and rollout evaluation logic. Use whenever the user touches environment code, reward code, simulator wrappers, policy evaluation, or tiny rollout checks.
---

# RL Environment Review

RL bugs often look like algorithm failures. Review environment semantics before trusting training curves.

## Check

1. API
   - reset/step signatures;
   - observation and action shapes;
   - vectorized environment compatibility;
   - info fields.

2. Termination
   - terminated vs truncated;
   - max episode length;
   - success/failure conditions;
   - early termination.

3. Reward
   - scale;
   - reward hacking;
   - future information;
   - sparse/dense behavior;
   - edge-case tests.

4. Reproducibility
   - seed propagation;
   - train/eval seed separation;
   - deterministic tiny rollout where possible.

5. Tests
   - reset smoke;
   - one-step transition;
   - reward edge cases;
   - tiny rollout.

## Output

- concrete issues;
- files/functions;
- why it matters;
- minimal fix;
- test to add.
