#!/usr/bin/env python3
from __future__ import annotations

import json
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
if str(SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPT_DIR))

from validate_harness_assets import check_conditional_assets_if_referenced, check_core_assets
from validate_harness_frontmatter import check_instruction_skill
from validate_harness_integrity import check_no_removed_pack, check_optional_asset_integrity
from validate_harness_scripts import check_script_compilation
from validate_harness_security import check_ci_command_safety
from validate_harness_target import check_target_repo_shape


def main() -> int:
    root = Path.cwd()
    issues: list[str] = []
    check_instruction_skill(root, issues)
    check_core_assets(root, issues)
    check_conditional_assets_if_referenced(root, issues)
    check_optional_asset_integrity(root, issues)
    check_no_removed_pack(root, issues)
    check_ci_command_safety(root, issues)
    check_script_compilation(root, issues)
    check_target_repo_shape(root, issues)

    print(json.dumps({"ok": not issues, "issues": issues}, indent=2, ensure_ascii=False))
    return 0 if not issues else 1


if __name__ == "__main__":
    raise SystemExit(main())
