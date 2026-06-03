#!/usr/bin/env python3
from __future__ import annotations

import json
import re
from pathlib import Path

SUSPICIOUS_COMMAND_TOKENS = ["|", ";", "$(", "`", ">>", "curl", "wget", "eval", "exec"]
CORE_REFERENCES = [
    "recommendation_matrix_policy.md",
    "recovery_surface_policy.md",
    "install_policy.md",
    "verification_policy.md",
    "automation_recommendation_guide.md",
    "automation_mcp_servers.md",
    "automation_hooks_patterns.md",
    "automation_subagent_templates.md",
    "automation_skills_reference.md",
    "automation_plugins_reference.md",
    "automation_commands_reference.md",
    "automation_recommendation_attribution.md",
    "subagent_orchestration.md",
    "research_route_policy.md",
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
    "templates/research_route/*.j2",
]


def parse_skill_frontmatter(path: Path) -> tuple[bool, str]:
    text = path.read_text(encoding="utf-8", errors="replace")
    if not text.startswith("---"):
        return False, "missing frontmatter"
    match = re.match(r"^---\n(.*?)\n---\n", text, flags=re.DOTALL)
    if not match:
        return False, "malformed frontmatter"
    fm = match.group(1)
    missing = [key for key in ["name", "description"] if not re.search(rf"^{key}\s*:", fm, flags=re.MULTILINE)]
    if missing:
        return False, f"missing {', '.join(missing)}"
    return True, "ok"


def check_instruction_skill(root: Path, issues: list[str]) -> None:
    skill = root / "SKILL.md"
    if skill.exists():
        ok, msg = parse_skill_frontmatter(skill)
        if not ok:
            issues.append(f"invalid root SKILL.md: {msg}")
        text = skill.read_text(encoding="utf-8", errors="replace")
        required_phrases = [
            "USER CHECKPOINT",
            "Harness Recommendation Matrix",
            "Capability Recommendation",
            "Capability Recommendation pass",
            "selected recovery surface",
            "source evidence",
            "verification probe",
            "Harness Recommendation Plan",
            "automation_recommendation_guide.md",
        ]
        for phrase in required_phrases:
            if phrase not in text:
                issues.append(f"SKILL.md missing required phrase: {phrase}")


def collect_text_files(root: Path) -> str:
    paths = [
        root / "SKILL.md",
        root / "README.md",
        *sorted((root / "references").rglob("*.md")),
        *sorted(path for path in (root / "templates").rglob("*") if path.is_file()),
    ]
    chunks = []
    for path in paths:
        if path.is_file():
            chunks.append(path.read_text(encoding="utf-8", errors="replace"))
    return "\n".join(chunks)


def check_core_assets(root: Path, issues: list[str]) -> None:
    refs = root / "references"
    for name in CORE_REFERENCES:
        if not (refs / name).exists():
            issues.append(f"missing core reference: references/{name}")
    for rel in CORE_TEMPLATES:
        if not (root / rel).exists():
            issues.append(f"missing core template: {rel}")


def check_conditional_assets_if_referenced(root: Path, issues: list[str]) -> None:
    bundle = collect_text_files(root)
    refs = root / "references"
    for name in CONDITIONAL_REFERENCES:
        rel = f"references/{name}"
        if (name in bundle or rel in bundle) and not (refs / name).exists():
            issues.append(f"referenced conditional reference is missing: {rel}")

    for rel in CONDITIONAL_TEMPLATES:
        if (rel in bundle or Path(rel).name in bundle) and not (root / rel).exists():
            issues.append(f"referenced conditional template is missing: {rel}")


def check_no_removed_pack(root: Path, issues: list[str]) -> None:
    if (root / "references" / "packs").exists():
        issues.append("references/packs/ should not exist after init_scaffold removal")
    if (root / "templates" / "packs").exists():
        issues.append("templates/packs/ should not exist after init_scaffold removal")
    if (root / "scripts" / "install_pack.py").exists():
        issues.append("scripts/install_pack.py should be removed")
    if (root / "scripts" / "render_harness.py").exists():
        issues.append("scripts/render_harness.py should be removed with the init_scaffold pack renderer")
    if (root / "evals" / "pack_integration_evals.json").exists():
        issues.append("evals/pack_integration_evals.json should be removed with the init_scaffold pack")
    if (root / "schemas" / "coverage_matrix.schema.json").exists():
        issues.append("schemas/coverage_matrix.schema.json should be replaced by recommendation_matrix.schema.json")
    forbidden_refs = [
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
    refs = root / "references"
    for name in forbidden_refs:
        if (refs / name).exists():
            issues.append(f"removed reference still present: references/{name}")


def check_optional_asset_integrity(root: Path, issues: list[str]) -> None:
    for rel in [*CONDITIONAL_TEMPLATES, *CORE_TEMPLATES]:
        path = root / rel
        if path.exists() and not path.read_text(encoding="utf-8", errors="replace").strip():
            issues.append(f"empty template: {rel}")

    for glob in OPTIONAL_TEMPLATE_GLOBS:
        for path in sorted(root.glob(glob)):
            rel = path.relative_to(root).as_posix()
            text = path.read_text(encoding="utf-8", errors="replace")
            if not text.strip():
                issues.append(f"empty optional template: {rel}")

    for path in sorted((root / "evals").glob("*.json")) if (root / "evals").exists() else []:
        try:
            json.loads(path.read_text(encoding="utf-8", errors="replace"))
        except json.JSONDecodeError as exc:
            issues.append(f"invalid eval json: {path}: {exc}")

    for path in sorted((root / "schemas").glob("*.json")):
        try:
            json.loads(path.read_text(encoding="utf-8", errors="replace"))
        except json.JSONDecodeError as exc:
            issues.append(f"invalid schema json: {path}: {exc}")


def check_ci_command_safety(root: Path, issues: list[str]) -> None:
    for path in list((root / "templates").rglob("*.yml.j2")) + list((root / "templates").rglob("*.yaml.j2")):
        text = path.read_text(encoding="utf-8", errors="replace")
        for line in text.splitlines():
            if "- run:" not in line:
                continue
            command = line.split("- run:", 1)[1].strip()
            if "{{" in command:
                continue
            for token in SUSPICIOUS_COMMAND_TOKENS:
                if token in command:
                    issues.append(f"suspicious literal CI command token {token!r} in {path}: {command}")


def check_script_compilation(root: Path, issues: list[str]) -> None:
    for script in sorted((root / "scripts").glob("*.py")):
        try:
            source = script.read_text(encoding="utf-8", errors="replace")
            compile(source, str(script), "exec")
        except SyntaxError as exc:
            issues.append(f"script does not compile: {script}\n{exc}")

    manifest = root / "templates" / "manifest.yaml.j2"
    if manifest.exists():
        text = manifest.read_text(encoding="utf-8", errors="replace")
        for token in ["harness_goals", "orchestration", "asset_loading", "selected_assets"]:
            if token not in text:
                issues.append(f"manifest template missing field: {token}")

    state = root / "templates" / "state.md.j2"
    if state.exists():
        text = state.read_text(encoding="utf-8", errors="replace")
        for token in ["Active work", "Open user decisions", "Last known good verification", "Known broken checks"]:
            if token not in text:
                issues.append(f"state template missing section: {token}")

    scan = root / "scripts" / "scan_project.py"
    if scan.exists():
        text = scan.read_text(encoding="utf-8", errors="replace")
        for token in ["node_script_tooling", "cursor_plugin_or_adapter", "harness_workflow_plugin", "cursor_preview", "packaged_plugin", "plugin_rules", "automation_signals", "frontend_framework", "github_remote"]:
            if token not in text:
                issues.append(f"scan_project.py missing current signal: {token}")


def main() -> int:
    root = Path.cwd()
    issues: list[str] = []
    check_instruction_skill(root, issues)
    check_core_assets(root, issues)
    check_conditional_assets_if_referenced(root, issues)
    check_optional_asset_integrity(root, issues)
    check_no_removed_pack(root, issues)
    check_ci_command_safety(root, issues)
    check_script_compilation(root, issues)

    target_required = ["AGENTS.md", "scripts/agent/check.sh", ".harness/manifest.yaml", ".harness/decisions.md"]
    if any((root / rel).exists() for rel in target_required):
        for rel in target_required:
            if not (root / rel).exists():
                issues.append(f"target repo missing required harness file: {rel}")

    result = {"ok": not issues, "issues": issues}
    print(json.dumps(result, indent=2, ensure_ascii=False))
    return 0 if not issues else 1

if __name__ == "__main__":
    raise SystemExit(main())
