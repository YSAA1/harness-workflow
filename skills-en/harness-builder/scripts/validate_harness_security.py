from __future__ import annotations

from pathlib import Path

from validate_harness_catalog import SUSPICIOUS_COMMAND_TOKENS


def check_ci_command_safety(root: Path, issues: list[str]) -> None:
    workflow_paths = list((root / "templates").rglob("*.yml.j2"))
    workflow_paths.extend((root / "templates").rglob("*.yaml.j2"))
    for path in workflow_paths:
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
