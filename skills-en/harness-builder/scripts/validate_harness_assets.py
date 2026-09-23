from __future__ import annotations

from pathlib import Path

from validate_harness_catalog import (
    CONDITIONAL_REFERENCES,
    CONDITIONAL_TEMPLATES,
    CORE_REFERENCES,
    CORE_TEMPLATES,
)


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
