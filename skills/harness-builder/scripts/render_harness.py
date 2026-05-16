#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from pathlib import Path

COMPONENT_FILES = {
    "architecture_docs": [
        "docs/ARCHITECTURE.md",
        "docs/architecture/LAYERS.md",
    ],
    "python_boundary": [
        "tests/architecture/test_boundary.py",
        "tests/architecture/known-violations.json",
    ],
    "typescript_boundary": [
        "tests/architecture/boundary.test.ts",
        "tests/architecture/known-violations.json",
    ],
    "security_doc": ["docs/SECURITY.md"],
    "ci_github": [".github/workflows/ci.yml"],
    "gc_python": [
        "scripts/gc/run_all.py",
        "scripts/gc/doc_drift.py",
        "scripts/gc/architecture_drift.py",
    ],
}

COMPONENT_ROWS = {
    "architecture_docs": "architecture_boundaries",
    "python_boundary": "architecture_boundaries",
    "typescript_boundary": "architecture_boundaries",
    "security_doc": "static_docs",
    "ci_github": "verification_entry",
    "gc_python": "anti_entropy",
}


def main() -> int:
    parser = argparse.ArgumentParser(description="Dry-run render selected harness-builder install pack components.")
    parser.add_argument("--pack", default="init_scaffold")
    parser.add_argument("--components", default="", help="Comma-separated components. Empty means none selected.")
    parser.add_argument("--dry-run", action="store_true", default=True)
    parser.add_argument("--project-root", default=".")
    args = parser.parse_args()

    if args.pack != "init_scaffold":
        raise SystemExit(f"unsupported pack: {args.pack}")

    root = Path(args.project_root)
    components = [c.strip() for c in args.components.split(",") if c.strip()]
    unknown = [c for c in components if c not in COMPONENT_FILES]
    if unknown:
        raise SystemExit(f"unknown components: {unknown}")

    would_create = []
    would_patch = []
    for component in components:
        for rel in COMPONENT_FILES[component]:
            target = root / rel
            item = {"path": rel, "coverage_row": COMPONENT_ROWS[component], "component": component}
            if target.exists():
                would_patch.append(item)
            else:
                would_create.append(item)

    result = {
        "pack": args.pack,
        "mode": "dry-run",
        "would_create": would_create,
        "would_patch": would_patch,
        "would_skip": [],
        "would_defer": [],
        "would_reject": [],
        "verification": "Run scripts/validate_harness.py after approved installation; run selected project check command if installed.",
        "blockers": [],
    }
    print(json.dumps(result, indent=2, ensure_ascii=False))
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
