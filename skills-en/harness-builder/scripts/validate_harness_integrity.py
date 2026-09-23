from __future__ import annotations

import json
from pathlib import Path

from validate_harness_catalog import (
    CONDITIONAL_TEMPLATES,
    CORE_TEMPLATES,
    FORBIDDEN_REFERENCES,
    OPTIONAL_TEMPLATE_GLOBS,
    REMOVED_ASSETS,
)


def check_no_removed_pack(root: Path, issues: list[str]) -> None:
    for rel, message in REMOVED_ASSETS.items():
        if (root / rel).exists():
            issues.append(message)
    refs = root / "references"
    for name in FORBIDDEN_REFERENCES:
        if (refs / name).exists():
            issues.append(f"removed reference still present: references/{name}")


def check_empty_templates(root: Path, issues: list[str]) -> None:
    for rel in [*CONDITIONAL_TEMPLATES, *CORE_TEMPLATES]:
        path = root / rel
        if path.exists() and not path.read_text(encoding="utf-8", errors="replace").strip():
            issues.append(f"empty template: {rel}")

    for glob in OPTIONAL_TEMPLATE_GLOBS:
        for path in sorted(root.glob(glob)):
            rel = path.relative_to(root).as_posix()
            if not path.read_text(encoding="utf-8", errors="replace").strip():
                issues.append(f"empty optional template: {rel}")


def check_json_files(root: Path, issues: list[str]) -> None:
    for folder, label in [("evals", "eval json"), ("schemas", "schema json")]:
        for path in sorted((root / folder).glob("*.json")):
            try:
                json.loads(path.read_text(encoding="utf-8", errors="replace"))
            except json.JSONDecodeError as exc:
                issues.append(f"invalid {label}: {path}: {exc}")


def check_optional_asset_integrity(root: Path, issues: list[str]) -> None:
    check_empty_templates(root, issues)
    check_json_files(root, issues)
