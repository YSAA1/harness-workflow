# Harness Builder Init Scaffold Integration Notes

## Design

Harness Builder remains the sole controller. Imported harness-init assets live only under:

- `references/packs/init_scaffold/`
- `templates/packs/init_scaffold/`

No imported harness-init file is placed in root `references/`.

## Non-regression intent

Existing core policy files remain present:

- `coverage_matrix_policy.md`
- `recovery_surface_policy.md`
- `architecture_enforcement_policy.md`
- `install_policy.md`
- `verification_policy.md`
- `anti_entropy.md`
- `decision_matrix.md`
- `capability_signal_policy.md`
- `skill_policy.md`
- `hook_policy.md`
- `mcp_policy.md`
- `subagent_orchestration.md`
- `web_research_policy.md`
- `research_route_policy.md`
- `brainstorming_policy.md`
- `course_alignment.md`

## Added gates

- Pack Selection gate.
- Pack dry-run output.
- Pack install report output.
- Capability Shortlist pass for signal-bound recommendations.

## Added safety

- Pack cannot bypass USER CHECKPOINT.
- Pack cannot make rows Required.
- Pack cannot overwrite existing files.
- Pack cannot install hooks/MCP/subagents/Research Route.
- CI command safety validation added.
- GC templates are read-only/report-only.
