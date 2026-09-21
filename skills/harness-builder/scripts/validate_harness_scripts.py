from __future__ import annotations

from pathlib import Path
import json
import re



def check_python_scripts_compile(root: Path, issues: list[str]) -> None:
    for script in sorted((root / "scripts").glob("*.py")):
        try:
            source = script.read_text(encoding="utf-8", errors="replace")
            compile(source, str(script), "exec")
        except SyntaxError as exc:
            issues.append(f"script does not compile: {script}\n{exc}")


def check_manifest_template(root: Path, issues: list[str]) -> None:
    manifest = root / "templates" / "manifest.yaml.j2"
    if not manifest.exists():
        return
    try:
        # Check the static structure without adding a Jinja runtime dependency.
        source = manifest.read_text(encoding="utf-8")
        source = re.sub(r"{{\s*(\w+)\s*\|\s*tojson\s*}}", lambda m: json.dumps(m[1]), source)
        data = json.loads(source)
        schema = json.loads((root / "schemas/harness_manifest.schema.json").read_text(encoding="utf-8"))
        for field in schema["required"]:
            if field not in data:
                issues.append(f"manifest template missing field: {field}")
        workflow = data.get("harness_workflow", {})
        for field in schema["properties"]["harness_workflow"]["required"]:
            if field not in workflow:
                issues.append(f"manifest template missing workflow field: {field}")
        if data.get("version") != schema["properties"]["version"]["const"]:
            issues.append("manifest template version does not match schema")
    except (ValueError, KeyError, TypeError, OSError) as exc:
        issues.append(f"manifest template/schema invalid: {exc}")


def check_state_template(root: Path, issues: list[str]) -> None:
    state = root / "templates" / "state.md.j2"
    if not state.exists():
        return
    text = state.read_text(encoding="utf-8", errors="replace")
    for token in ["Objective", "Status", "Primary artifact", "Evidence", "Next", "Limits"]:
        if token not in text:
            issues.append(f"state template missing section: {token}")


def check_script_compilation(root: Path, issues: list[str]) -> None:
    check_python_scripts_compile(root, issues)
    check_manifest_template(root, issues)
    check_state_template(root, issues)
