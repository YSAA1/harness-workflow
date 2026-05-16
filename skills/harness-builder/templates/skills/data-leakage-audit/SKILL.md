---
name: data-leakage-audit
description: "Use when reviewing datasets, train/eval splits, features, labels, or preprocessing for leakage risk."
---

# Data Leakage Audit

## Use when

Use when reviewing datasets, train/eval splits, features, labels, or preprocessing for leakage risk.

## Checklist

- Check label leakage and target-derived features.
- Check train/validation/test isolation.
- Check temporal/user/group split correctness.
- Record uncertainty and required follow-up evidence.

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
