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
    "skill_policy.md",
    "hook_policy.md",
    "mcp_policy.md",
    "subagent_orchestration.md",
    "web_research_policy.md",
    "research_route_policy.md",
    "brainstorming_policy.md",
    "course_alignment.md",
}


def main() -> int:
    root = Path.cwd()
    refs = sorted((root / "references").rglob("*.md")) if (root / "references").exists() else []
    root_refs = {p.name for p in (root / "references").glob("*.md")} if (root / "references").exists() else set()
    pack_refs = sorted(p for p in refs if "references/packs/" in p.as_posix())
    issues: list[str] = []

    for required in CORE_REFERENCES:
        if required not in root_refs:
            issues.append(f"missing core reference: references/{required}")

    forbidden_root = {"stack_routing.md", "boundary_test_templates.md", "ci_templates.md", "gc_patterns.md", "security_template.md"}
    for name in forbidden_root:
        if name in root_refs:
            issues.append(f"pack reference leaked into root references: references/{name}")

    adapter = root / "references" / "packs" / "init_scaffold" / "adapter.md"
    precedence = root / "references" / "packs" / "init_scaffold" / "precedence.md"
    if pack_refs and not adapter.exists():
        issues.append("init_scaffold pack exists without adapter.md")
    if pack_refs and not precedence.exists():
        issues.append("init_scaffold pack exists without precedence.md")

    result = {
        "ok": not issues,
        "core_references": sorted(root_refs),
        "pack_references": [p.as_posix() for p in pack_refs],
        "issues": issues,
    }
    print(json.dumps(result, indent=2, ensure_ascii=False))
    return 0 if not issues else 1

if __name__ == "__main__":
    raise SystemExit(main())
