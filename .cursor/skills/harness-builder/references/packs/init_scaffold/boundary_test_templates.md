# Boundary Test Templates

This pack provides known-violations baseline format and skeletons. Use only when `architecture_enforcement_policy.md` selects Test or Lint+Test level.

## Known violations format

File: `tests/architecture/known-violations.json`

```json
[
  {
    "file": "src/components/UserCard.tsx",
    "line": 5,
    "imports": "src/services/userService",
    "from_layer": "components",
    "to_layer": "services",
    "reason": "Legacy coupling — tracked for removal"
  }
]
```

Rules:

- one entry per violation;
- identity is `file` + `imports`;
- existing repos establish baseline first;
- new violations fail or warn according to approved policy;
- baseline may shrink, not grow without explicit approval.

Templates live under `templates/packs/init_scaffold/boundary/`.
