from __future__ import annotations


SUSPICIOUS_COMMAND_TOKENS = ["|", ";", "$(", "`", ">>", "curl", "wget", "eval", "exec"]
CORE_REFERENCES = [
    "recommendation_matrix_policy.md",
    "recovery_surface_policy.md",
    "install_policy.md",
    "verification_policy.md",
    "capability_discovery_playbook.md",
    "automation_recommendation_guide.md",
    "automation_mcp_servers.md",
    "automation_hooks_patterns.md",
    "automation_subagent_templates.md",
    "automation_skills_reference.md",
    "automation_plugins_reference.md",
    "automation_commands_reference.md",
    "automation_recommendation_attribution.md",
    "subagent_orchestration.md",
]
CONDITIONAL_REFERENCES = [
    "anti_entropy.md",
    "architecture_enforcement_policy.md",
    "decision_matrix.md",
]
CORE_TEMPLATES = [
    "templates/AGENTS.md.j2",
    "templates/check.sh.j2",
    "templates/manifest.yaml.j2",
    "templates/state.md.j2",
    "templates/decisions.md.j2",
    "templates/verification.md.j2",
]
CONDITIONAL_TEMPLATES = [
    "templates/project_context.md.j2",
    "templates/workflow.md.j2",
    "templates/progress.md.j2",
    "templates/session_handoff.md.j2",
    "templates/features.json.j2",
    "templates/risk_register.md.j2",
    "templates/reports/verification_report.md.j2",
    "templates/commit_convention.md.j2",
]
OPTIONAL_TEMPLATE_GLOBS = [
    "templates/hooks/*.j2",
]
FORBIDDEN_REFERENCES = [
    "capability_signal_policy.md",
    "capability_starter_catalog.md",
    "coverage_matrix_policy.md",
    "project_map_policy.md",
    "harness_subsystems.md",
    "skill_policy.md",
    "hook_policy.md",
    "mcp_policy.md",
    "web_research_policy.md",
    "subagent_policy.md",
    "brainstorming_policy.md",
    "course_alignment.md",
    "research_graduation_policy.md",
    "research_entropy_gate.md",
]
REMOVED_ASSETS = {
    "references/packs": "references/packs/ should not exist after init_scaffold removal",
    "templates/packs": "templates/packs/ should not exist after init_scaffold removal",
    "scripts/install_pack.py": "scripts/install_pack.py should be removed",
    "scripts/render_harness.py": "scripts/render_harness.py should be removed with the init_scaffold pack renderer",
    "evals/pack_integration_evals.json": (
        "evals/pack_integration_evals.json should be removed with the init_scaffold pack"
    ),
    "schemas/coverage_matrix.schema.json": (
        "schemas/coverage_matrix.schema.json should be replaced by recommendation_matrix.schema.json"
    ),
}
REQUIRED_SKILL_PHRASES = [
    "USER CHECKPOINT",
    "HARNESS RECOMMENDATION MATRIX",
    "Helper routing",
    "capability-recommender",
    "agent-instructions-maintainer",
    "recovery-surface-builder",
    "selected recovery surface",
    "verification",
]
MANIFEST_TOKENS = ["harness_goals", "orchestration", "asset_loading", "selected_assets"]
STATE_TOKENS = ["Active work", "Open user decisions", "Last known good verification", "Known broken checks"]
CURRENT_SCAN_SIGNALS = [
    "node_script_tooling",
    "cursor_plugin_or_adapter",
    "harness_workflow_plugin",
    "cursor_preview",
    "packaged_plugin",
    "plugin_rules",
    "automation_signals",
    "frontend_framework",
    "github_remote",
]
