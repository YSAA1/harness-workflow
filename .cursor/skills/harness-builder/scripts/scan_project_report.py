from __future__ import annotations

from pathlib import Path

from scan_project_automation import detect_automation_signals
from scan_project_catalog import DIRS, FILES
from scan_project_types import infer_project_type


SCRIPT_COMMANDS = {
    "scripts/check-plugin.mjs": "node scripts/check-plugin.mjs",
    "scripts/check-claude-code-install.mjs": "node scripts/check-claude-code-install.mjs",
    "scripts/check-cursor-install.mjs": "node scripts/check-cursor-install.mjs",
    "scripts/install-cursor.mjs": "node scripts/install-cursor.mjs --target . --dry-run",
    "scripts/generate-skill-flow-html.mjs": "node scripts/generate-skill-flow-html.mjs",
}


def existing_paths(root: Path, paths: list[str]) -> list[str]:
    return [rel for rel in paths if (root / rel).exists()]


def verification_signals(root: Path) -> list[str]:
    candidates = existing_paths(root, ["Makefile", "justfile", "package.json", "pyproject.toml"])
    candidates.extend(command for rel, command in SCRIPT_COMMANDS.items() if (root / rel).exists())
    if (root / "tests").exists() or (root / "test").exists():
        candidates.append("pytest_or_project_tests_possible")
    return candidates


def harness_signals(root: Path) -> dict:
    return {
        "agents_md": (root / "AGENTS.md").exists(),
        "claude_md": (root / "CLAUDE.md").exists(),
        "harness_dir": (root / ".harness").exists(),
        "repo_skills": (root / ".agents" / "skills").exists() or (root / "skills").exists(),
        "codex_plugin": (root / ".codex-plugin" / "plugin.json").exists(),
        "claude_plugin": (root / ".claude-plugin" / "plugin.json").exists(),
        "cursor_plugin": (root / ".cursor-plugin" / "plugin.json").exists(),
        "cursor_preview": (root / ".cursor" / "skills").exists() and (root / ".cursor" / "rules").exists(),
        "packaged_plugin": (root / "plugins" / "harness-workflow").exists(),
        "plugin_rules": (root / "rules").exists(),
        "codex_config": (root / ".codex" / "config.toml").exists(),
        "codex_hooks": (root / ".codex" / "hooks.json").exists(),
        "ci": (root / ".github" / "workflows").exists(),
    }


def build_report(root: Path) -> dict:
    return {
        "root": str(root),
        "project_type_signals": infer_project_type(root),
        "existing_files": existing_paths(root, FILES),
        "existing_dirs": existing_paths(root, DIRS),
        "protected_path_candidates": existing_paths(root, [
            "data/raw", "checkpoints", "runs", "outputs", "wandb", "mlruns", ".env",
        ]),
        "verification_signals": verification_signals(root),
        "automation_signals": detect_automation_signals(root),
        "harness_signals": harness_signals(root),
    }
