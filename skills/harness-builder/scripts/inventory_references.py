#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path

CORE_REFERENCES = {
    "coverage_matrix_policy.md",
    "recovery_surface_policy.md",
    "architecture_enforcement_policy.md",
    "install_policy.md",
    "verification_policy.md",
    "anti_entropy.md",
    "decision_matrix.md",
    "capability_signal_policy.md",
    "capability_starter_catalog.md",
    "subagent_orchestration.md",
    "research_route_policy.md",
}


def main() -> int:
    root = Path.cwd()
    refs = sorted((root / "references").rglob("*.md")) if (root / "references").exists() else []
    root_refs = {p.name for p in (root / "references").glob("*.md")} if (root / "references").exists() else set()
    issues: list[str] = []

    for required in CORE_REFERENCES:
        if required not in root_refs:
            issues.append(f"missing core reference: references/{required}")

    forbidden_root = {"stack_routing.md", "boundary_test_templates.md", "ci_templates.md", "gc_patterns.md", "security_template.md"}
    for name in forbidden_root:
        if name in root_refs:
            issues.append(f"pack reference leaked into root references: references/{name}")

    if (root / "references" / "packs").exists():
        issues.append("references/packs/ should not exist; init_scaffold pack was removed")

    result = {
        "ok": not issues,
        "core_references": sorted(root_refs),
        "issues": issues,
    }
    print(json.dumps(result, indent=2, ensure_ascii=False))
    return 0 if not issues else 1

if __name__ == "__main__":
    raise SystemExit(main())
