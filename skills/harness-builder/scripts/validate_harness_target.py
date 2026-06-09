from __future__ import annotations

from pathlib import Path


def check_target_repo_shape(root: Path, issues: list[str]) -> None:
    target_required = ["AGENTS.md", "scripts/agent/check.sh", ".harness/manifest.yaml", ".harness/decisions.md"]
    if not any((root / rel).exists() for rel in target_required):
        return
    for rel in target_required:
        if not (root / rel).exists():
            issues.append(f"target repo missing required harness file: {rel}")
