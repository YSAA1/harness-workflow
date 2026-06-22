from __future__ import annotations

from pathlib import Path

from scan_project_domain_types import infer_domain_types


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
    types.extend(infer_domain_types(root))
    return types or ["unknown"]
