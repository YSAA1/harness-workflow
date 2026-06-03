# Harness Builder integration notes

Harness Builder is the sole controller for project harness design and install.

## Core references

- `recommendation_matrix_policy.md`, `recovery_surface_policy.md`, `architecture_enforcement_policy.md`
- `install_policy.md`, `verification_policy.md`, `anti_entropy.md`, `decision_matrix.md`
- `automation_recommendation_guide.md`, `automation_*` references
- `subagent_orchestration.md`, `research_route_policy.md`

## Templates

- User-facing: `templates/*.j2` (language-adaptive)
- Hooks: `templates/hooks/*.j2`
- Research Route: `templates/research_route/*.j2`

## Removed (slim v5)

- `init_scaffold` install pack (`references/packs/`, `templates/packs/`, `install_pack.py`, `render_harness.py`)
- Separate `skill_policy`, `hook_policy`, `mcp_policy`, `web_research_policy` (merged into `automation_recommendation_guide.md` and category-specific `automation_*` references)
- `templates/agents/*`, `templates/skills/*`, `AGENTS.template.md`
- `harness_subsystems.md`, `project_map_policy.md`, `course_alignment.md`, `brainstorming_policy.md`

## Safety

- Do not install on user silence; USER CHECKPOINT required.
- User-level MCP/hooks need explicit approval.
- Capability Recommendation binds every candidate to one recommendation row.
