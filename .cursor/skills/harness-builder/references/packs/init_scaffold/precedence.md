# Init Scaffold Pack Precedence

Rules are applied in this order:

1. Current user instruction.
2. Current repository evidence.
3. `harness-builder/SKILL.md` mandatory gates.
4. Harness Builder core references:
   - `references/coverage_matrix_policy.md`
   - `references/install_policy.md`
   - `references/verification_policy.md`
   - `references/recovery_surface_policy.md`
   - `references/anti_entropy.md`
   - `references/architecture_enforcement_policy.md`
   - capability policies for skills, hooks, MCP, subagents, web research, and Research Route.
5. `references/packs/init_scaffold/adapter.md`.
6. Init scaffold pack references and templates.

The pack cannot override builder core policy. If a conflict appears, mark the pack component Deferred or Rejected and record the reason in `.harness/decisions.md`.
