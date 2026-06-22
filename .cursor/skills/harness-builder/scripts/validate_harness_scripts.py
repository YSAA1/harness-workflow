from __future__ import annotations

from pathlib import Path

from validate_harness_catalog import CURRENT_SCAN_SIGNALS, MANIFEST_TOKENS, STATE_TOKENS


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
    text = manifest.read_text(encoding="utf-8", errors="replace")
    for token in MANIFEST_TOKENS:
        if token not in text:
            issues.append(f"manifest template missing field: {token}")


def check_state_template(root: Path, issues: list[str]) -> None:
    state = root / "templates" / "state.md.j2"
    if not state.exists():
        return
    text = state.read_text(encoding="utf-8", errors="replace")
    for token in STATE_TOKENS:
        if token not in text:
            issues.append(f"state template missing section: {token}")


def check_scan_project_signals(root: Path, issues: list[str]) -> None:
    scan = root / "scripts" / "scan_project.py"
    if not scan.exists():
        return
    text = scan.read_text(encoding="utf-8", errors="replace")
    for token in CURRENT_SCAN_SIGNALS:
        if token not in text:
            issues.append(f"scan_project.py missing current signal: {token}")


def check_script_compilation(root: Path, issues: list[str]) -> None:
    check_python_scripts_compile(root, issues)
    check_manifest_template(root, issues)
    check_state_template(root, issues)
    check_scan_project_signals(root, issues)
