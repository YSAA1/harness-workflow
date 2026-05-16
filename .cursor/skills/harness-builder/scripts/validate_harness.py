#!/usr/bin/env python3
from __future__ import annotations

import json
import os
import re
import subprocess
import sys
from pathlib import Path

SUSPICIOUS_COMMAND_TOKENS = ["|", ";", "$(", "`", ">>", "curl", "wget", "eval", "exec"]
CORE_REFERENCES = [
    "coverage_matrix_policy.md",
    "recovery_surface_policy.md",
    "architecture_enforcement_policy.md",
    "install_policy.md",
    "verification_policy.md",
    "anti_entropy.md",
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
        required_phrases = ["Pack Selection gate", "USER CHECKPOINT", "Coverage Matrix", "Capability Discovery"]
        for phrase in required_phrases:
            if phrase not in text:
                issues.append(f"SKILL.md missing required phrase: {phrase}")


def check_references(root: Path, issues: list[str]) -> None:
    refs = root / "references"
    for name in CORE_REFERENCES:
        if not (refs / name).exists():
            issues.append(f"missing core reference: references/{name}")
    forbidden_root = ["stack_routing.md", "boundary_test_templates.md", "ci_templates.md", "gc_patterns.md", "security_template.md"]
    for name in forbidden_root:
        if (refs / name).exists():
            issues.append(f"pack reference leaked into root references: references/{name}")
    if (refs / "packs" / "init_scaffold").exists():
        for required in ["adapter.md", "precedence.md", "README.md"]:
            if not (refs / "packs" / "init_scaffold" / required).exists():
                issues.append(f"init_scaffold missing {required}")


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


def check_templates(root: Path, issues: list[str]) -> None:
    required_templates = [
        "templates/AGENTS.md.j2",
        "templates/check.sh.j2",
        "templates/manifest.yaml.j2",
        "templates/packs/init_scaffold/docs/architecture/LAYERS.md.j2",
        "templates/packs/init_scaffold/boundary/python_test.py.j2",
        "templates/packs/init_scaffold/boundary/typescript_test.ts.j2",
    ]
    for rel in required_templates:
        if not (root / rel).exists():
            issues.append(f"missing template: {rel}")


def check_script_compilation(root: Path, issues: list[str]) -> None:
    for script in sorted((root / "scripts").glob("*.py")):
        proc = subprocess.run([sys.executable, "-m", "py_compile", str(script)], capture_output=True, text=True)
        if proc.returncode != 0:
            issues.append(f"script does not compile: {script}\n{proc.stderr}")



def validate_preserved_assets(root: Path, issues: list[str]) -> None:
    preserved = [
        "references/harness_subsystems.md",
        "references/project_map_policy.md",
        "references/subagent_policy.md",
        "templates/research_route/research_plan.md.j2",
        "templates/research_route/evidence_log.md.j2",
        "templates/research_route/iteration_protocol.md.j2",
        "templates/research_route/research_manifest.yaml.j2",
        "templates/AGENTS.template.md",
        "templates/project_context.md.j2",
        "templates/workflow.md.j2",
        "templates/verification.md.j2",
        "templates/reports/verification_report.md.j2",
        "templates/risk_register.md.j2",
        "templates/features.json.j2",
        "templates/agents/repo_explorer.md.j2",
        "templates/hooks/protected_paths.py.j2",
        "templates/skills/rl-env-review/SKILL.md",
        "templates/skills/ml-experiment-review/SKILL.md",
        "templates/skills/data-leakage-audit/SKILL.md",
    ]
    for rel in preserved:
        if not (root / rel).exists():
            issues.append(f"missing preserved harness-builder asset: {rel}")

    manifest = root / "templates" / "manifest.yaml.j2"
    if manifest.exists():
        text = manifest.read_text(encoding="utf-8", errors="replace")
        for token in ["harness_goals", "orchestration", "course_alignment", "packs"]:
            if token not in text:
                issues.append(f"manifest template missing preserved/pack field: {token}")

    state = root / "templates" / "state.md.j2"
    if state.exists():
        text = state.read_text(encoding="utf-8", errors="replace")
        for token in ["Orchestration mode", "Open user decisions", "Last known good verification", "Known broken checks", "Current harness status", "Pack selection"]:
            if token not in text:
                issues.append(f"state template missing preserved/pack section: {token}")

    scan = root / "scripts" / "scan_project.py"
    if scan.exists():
        text = scan.read_text(encoding="utf-8", errors="replace")
        for token in ["node_script_tooling", "cursor_plugin_or_adapter", "harness_workflow_plugin", "cursor_preview", "packaged_plugin", "plugin_rules"]:
            if token not in text:
                issues.append(f"scan_project.py missing current signal: {token}")


def main() -> int:
    root = Path.cwd()
    issues: list[str] = []
    check_instruction_skill(root, issues)
    check_references(root, issues)
    check_templates(root, issues)
    check_ci_command_safety(root, issues)
    check_script_compilation(root, issues)
    validate_preserved_assets(root, issues)

    # Preserve original project-install validation when running against a target repo.
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
