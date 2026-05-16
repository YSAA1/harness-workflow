#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path


FILES = [
    "README.md", "AGENTS.md", "CLAUDE.md", "GEMINI.md",
    "pyproject.toml", "requirements.txt", "setup.py", "environment.yml",
    "package.json", "Makefile", "justfile",
    "CONTEXT.md", "docs/harness-method-contract.md",
    ".codex-plugin/plugin.json", ".claude-plugin/plugin.json", ".cursor-plugin/plugin.json",
    ".agents/plugins/marketplace.json",
    ".codex/config.toml", ".codex/hooks.json",
    ".harness/manifest.yaml", ".harness/state.md",
]

DIRS = [
    "src", "app", "tests", "test", "scripts", "configs", "data",
    "notebooks", ".github/workflows", ".agents/skills", ".agents/plugins",
    "skills", "rules", "plugins/harness-workflow", ".cursor/rules", ".cursor/skills", ".codex",
    ".claude", ".harness", "runs", "outputs", "checkpoints", "wandb",
    "mlruns", "dist", "build"
]


def infer_project_type(root: Path) -> list[str]:
    types = []
    if (root / "pyproject.toml").exists() or (root / "requirements.txt").exists():
        types.append("python")
    if (root / "package.json").exists():
        types.append("javascript_or_typescript")
    if any((root / "scripts" / name).exists() for name in [
        "check-plugin.mjs",
        "check-claude-code-install.mjs",
        "check-cursor-install.mjs",
    ]):
        types.append("node_script_tooling")
    if (root / ".codex-plugin" / "plugin.json").exists() and (root / "skills").exists():
        types.append("codex_plugin")
    if (root / ".claude-plugin" / "plugin.json").exists():
        types.append("claude_code_plugin")
    if (root / ".cursor-plugin" / "plugin.json").exists() or (root / ".cursor" / "rules").exists():
        types.append("cursor_plugin_or_adapter")
    if (root / "skills" / "harness-builder" / "SKILL.md").exists():
        types.append("harness_workflow_plugin")
    if (root / "configs").exists() or (root / "notebooks").exists() or (root / "data").exists():
        types.append("ml_or_data_possible")
    if any((root / d).exists() for d in ["src/envs", "envs", "tasks"]):
        types.append("rl_or_sim_possible")
    return types or ["unknown"]


def main() -> None:
    root = Path.cwd()

    existing_files = [f for f in FILES if (root / f).exists()]
    existing_dirs = [d for d in DIRS if (root / d).exists()]

    protected_candidates = [
        d for d in ["data/raw", "checkpoints", "runs", "outputs", "wandb", "mlruns", ".env"]
        if (root / d).exists()
    ]

    test_candidates = []
    for cmd_file in ["Makefile", "justfile", "package.json", "pyproject.toml"]:
        if (root / cmd_file).exists():
            test_candidates.append(cmd_file)
    script_commands = {
        "scripts/check-plugin.mjs": "node scripts/check-plugin.mjs",
        "scripts/check-claude-code-install.mjs": "node scripts/check-claude-code-install.mjs",
        "scripts/check-cursor-install.mjs": "node scripts/check-cursor-install.mjs",
        "scripts/install-cursor.mjs": "node scripts/install-cursor.mjs --target . --dry-run",
        "scripts/generate-skill-flow-html.mjs": "node scripts/generate-skill-flow-html.mjs",
    }
    for rel, command in script_commands.items():
        if (root / rel).exists():
            test_candidates.append(command)
    if (root / "tests").exists() or (root / "test").exists():
        test_candidates.append("pytest_or_project_tests_possible")

    result = {
        "root": str(root),
        "project_type_signals": infer_project_type(root),
        "existing_files": existing_files,
        "existing_dirs": existing_dirs,
        "protected_path_candidates": protected_candidates,
        "verification_signals": test_candidates,
        "harness_signals": {
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
        },
    }

    print(json.dumps(result, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
