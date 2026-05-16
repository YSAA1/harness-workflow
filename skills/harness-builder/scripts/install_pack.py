#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from pathlib import Path

from render_harness import COMPONENT_FILES, COMPONENT_ROWS


def placeholder_for(rel: str, row: str) -> str:
    return f"# Installed by harness-builder init_scaffold pack\n# Coverage row: {row}\n# Replace this placeholder with the rendered template after project-specific variables are approved.\n"


def main() -> int:
    parser = argparse.ArgumentParser(description="Install approved harness-builder pack components.")
    parser.add_argument("--pack", default="init_scaffold")
    parser.add_argument("--components", required=True, help="Comma-separated components")
    parser.add_argument("--approved-plan-id", default="")
    parser.add_argument("--project-root", default=".")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    if args.pack != "init_scaffold":
        raise SystemExit(f"unsupported pack: {args.pack}")
    if not args.dry_run and not args.approved_plan_id:
        raise SystemExit("refusing to write without --approved-plan-id; run dry-run or obtain USER CHECKPOINT approval")

    root = Path(args.project_root)
    components = [c.strip() for c in args.components.split(",") if c.strip()]
    unknown = [c for c in components if c not in COMPONENT_FILES]
    if unknown:
        raise SystemExit(f"unknown components: {unknown}")

    installed = []
    skipped_existing = []
    for component in components:
        row = COMPONENT_ROWS[component]
        for rel in COMPONENT_FILES[component]:
            target = root / rel
            record = {"path": rel, "coverage_row": row, "component": component}
            if target.exists():
                skipped_existing.append({**record, "reason": "existing file; patch manually under install_policy.md"})
                continue
            if not args.dry_run:
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_text(placeholder_for(rel, row), encoding="utf-8")
            installed.append(record)

    result = {
        "pack": args.pack,
        "approved_plan_id": args.approved_plan_id or None,
        "dry_run": args.dry_run,
        "installed_or_would_install": installed,
        "skipped_existing": skipped_existing,
        "notes": "This installer writes placeholders only; full template rendering should use project-specific approved variables.",
    }
    print(json.dumps(result, indent=2, ensure_ascii=False))
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
