from __future__ import annotations

import re
from pathlib import Path



def parse_skill_frontmatter(path: Path) -> tuple[bool, str]:
    text = path.read_text(encoding="utf-8", errors="replace")
    if not text.startswith("---"):
        return False, "missing frontmatter"
    match = re.match(r"^---\n(.*?)\n---\n", text, flags=re.DOTALL)
    if not match:
        return False, "malformed frontmatter"
    fm = match.group(1)
    missing = [key for key in ["name", "description"] if not re.search(rf"^{key}\s*:", fm, flags=re.MULTILINE)]
    if missing:
        return False, f"missing {', '.join(missing)}"
    return True, "ok"


def check_instruction_skill(root: Path, issues: list[str]) -> None:
    skill = root / "SKILL.md"
    if not skill.exists():
        return
    ok, msg = parse_skill_frontmatter(skill)
    if not ok:
        issues.append(f"invalid root SKILL.md: {msg}")
