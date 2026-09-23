from __future__ import annotations

import json
from pathlib import Path


def read_package_json(root: Path) -> dict:
    package_json = root / "package.json"
    if not package_json.exists():
        return {}
    try:
        return json.loads(package_json.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return {"_parse_error": "package.json"}


def package_dependencies(package_json: dict) -> set[str]:
    deps: set[str] = set()
    for key in ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"]:
        value = package_json.get(key)
        if isinstance(value, dict):
            deps.update(value.keys())
    return deps


def package_scripts(package_json: dict) -> dict:
    scripts = package_json.get("scripts")
    return scripts if isinstance(scripts, dict) else {}
