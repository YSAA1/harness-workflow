#!/usr/bin/env python3
from __future__ import annotations

import json
import re
from pathlib import Path


def parse_frontmatter(text: str) -> dict[str, str]:
    if not text.startswith("---"):
        return {}
    match = re.match(r"^---\n(.*?)\n---\n", text, flags=re.DOTALL)
    if not match:
        return {}
    result = {}
    for line in match.group(1).splitlines():
        if ":" not in line:
            continue
        key, value = line.split(":", 1)
        result[key.strip()] = value.strip().strip('"').strip("'")
    return result


def collect_skills(root: Path, scope: str) -> list[dict]:
    skills = []
    if not root.exists():
        return skills
    for skill_md in sorted(root.rglob("SKILL.md")):
        text = skill_md.read_text(encoding="utf-8", errors="replace")
        meta = parse_frontmatter(text)
        skills.append({"scope": scope, "name": meta.get("name", skill_md.parent.name), "description": meta.get("description", ""), "path": str(skill_md)})
    return skills


def main() -> None:
    cwd = Path.cwd()
    candidates = [(cwd / ".agents" / "skills", "repo"), (Path.home() / ".agents" / "skills", "user"), (cwd / ".codex" / "skills", "repo_codex_legacy"), (cwd / ".claude" / "skills", "repo_claude")]
    result = []
    for root, scope in candidates:
        result.extend(collect_skills(root, scope))
    print(json.dumps({"cwd": str(cwd), "skills": result}, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    main()
