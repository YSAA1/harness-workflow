#!/usr/bin/env python3
from __future__ import annotations

import argparse
import difflib
from pathlib import Path


def main() -> int:
    parser = argparse.ArgumentParser(description="Diff two Harness Recommendation Plan files.")
    parser.add_argument("before")
    parser.add_argument("after")
    args = parser.parse_args()
    before = Path(args.before).read_text(encoding="utf-8", errors="replace").splitlines(keepends=True)
    after = Path(args.after).read_text(encoding="utf-8", errors="replace").splitlines(keepends=True)
    print("".join(difflib.unified_diff(before, after, fromfile=args.before, tofile=args.after)))
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
