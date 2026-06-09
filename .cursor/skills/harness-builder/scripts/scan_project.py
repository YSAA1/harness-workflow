#!/usr/bin/env python3
from __future__ import annotations

import json
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
if str(SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPT_DIR))

from scan_project_automation import detect_automation_signals
from scan_project_report import build_report


CURRENT_SIGNAL_TOKENS = [
    "node_script_tooling",
    "cursor_plugin_or_adapter",
    "harness_workflow_plugin",
    "cursor_preview",
    "packaged_plugin",
    "plugin_rules",
    "automation_signals",
    "frontend_framework",
    "github_remote",
]


def main() -> None:
    print(json.dumps(build_report(Path.cwd()), indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
