#!/usr/bin/env python3
from __future__ import annotations

import json
import re
import subprocess
import sys
from pathlib import Path


def parse_skill_frontmatter(path: Path) -> tuple[bool, str]:
    text = path.read_text(encoding="utf-8", errors="replace")
    if not text.startswith("---"):
        return False, "missing frontmatter"
    match = re.match(r"^---\n(.*?)\n---\n", text, flags=re.DOTALL)
    if not match:
        return False, "malformed frontmatter"
    fm = match.group(1)
    missing = []
    for key in ["name", "description"]:
        if not re.search(rf"^{key}\s*:", fm, flags=re.MULTILINE):
            missing.append(key)
    if missing:
        return False, f"missing {', '.join(missing)}"
    return True, "ok"


def main() -> int:
    root = Path.cwd()
    issues = []

    required = [
        "AGENTS.md",
        "scripts/agent/check.sh",
        ".harness/manifest.yaml",
        ".harness/decisions.md",
    ]
    for rel in required:
        if not (root / rel).exists():
            issues.append(f"missing required file: {rel}")

    hooks_json = root / ".codex" / "hooks.json"
    if hooks_json.exists():
        try:
            json.loads(hooks_json.read_text(encoding="utf-8"))
        except Exception as exc:
            issues.append(f"invalid .codex/hooks.json: {exc}")

    for skill_md in (root / ".agents" / "skills").rglob("SKILL.md") if (root / ".agents" / "skills").exists() else []:
        ok, msg = parse_skill_frontmatter(skill_md)
        if not ok:
            issues.append(f"invalid skill {skill_md}: {msg}")

    for script in (root / ".codex" / "hooks").glob("*.py") if (root / ".codex" / "hooks").exists() else []:
        proc = subprocess.run([sys.executable, "-m", "py_compile", str(script)], capture_output=True, text=True)
        if proc.returncode != 0:
            issues.append(f"hook script does not compile: {script}\n{proc.stderr}")

    result = {
        "ok": not issues,
        "issues": issues,
    }
    print(json.dumps(result, indent=2, ensure_ascii=False))
    return 0 if not issues else 1


if __name__ == "__main__":
    raise SystemExit(main())
