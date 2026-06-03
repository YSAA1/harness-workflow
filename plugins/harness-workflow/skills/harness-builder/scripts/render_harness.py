#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import sys


def main() -> int:
    parser = argparse.ArgumentParser(description="Harness render helper (install packs removed).")
    parser.add_argument("--dry-run", action="store_true", default=True)
    args = parser.parse_args()

    result = {
        "ok": False,
        "mode": "dry-run" if args.dry_run else "install",
        "message": "init_scaffold install packs were removed. Use Harness Plan phases with templates/*.j2 and references/install_policy.md instead.",
        "would_create": [],
        "would_patch": [],
        "blockers": ["pack subsystem removed"],
    }
    print(json.dumps(result, indent=2, ensure_ascii=False))
    return 1

if __name__ == "__main__":
    raise SystemExit(main())
