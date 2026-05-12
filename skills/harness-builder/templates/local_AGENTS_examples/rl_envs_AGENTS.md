# src/envs/AGENTS.md

Environment changes require:

- reset/step API checks;
- observation/action shape checks;
- terminated vs truncated semantics review;
- reward edge-case tests when reward logic changes;
- tiny rollout verification.

Do not trust training curves until environment semantics are verified.
