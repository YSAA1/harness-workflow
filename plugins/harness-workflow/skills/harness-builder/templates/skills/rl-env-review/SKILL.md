---
name: rl-env-review
description: "Use when reviewing RL environments, reset/step APIs, rewards, rollouts, or sim interfaces."
---

# RL Environment Review

## Use when

Use when reviewing RL environments, reset/step APIs, rewards, rollouts, or sim interfaces.

## Checklist

- Check reset/step contract.
- Check observation/action space consistency.
- Review reward termination and truncation logic.
- Require tiny rollout evidence when feasible.

## Output

```markdown
# Finding

# Evidence

# Risks

# Recommended action

# Confidence
```

## Rules

- Do not claim validity without evidence.
- Prefer small reproducible checks.
- Record unresolved risk instead of hiding it.
