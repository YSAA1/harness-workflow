from __future__ import annotations

from pathlib import Path

HOT_DOC_MAX_LINES = 300
HOT_SCRIPT_MAX_LINES = 120
HOT_RECOVERY_DOCS = [
    ".harness/state.md",
    ".harness/session_handoff.md",
]
HOT_AGENT_SCRIPTS = [
    "scripts/agent/status.sh",
    "scripts/agent/selftest.sh",
    "scripts/agent/research_status.sh",
]
STATE_MIRROR_TOKENS = [
    "active_slice",
    "current_phase",
    "evidence_log",
    "probe inventory",
    "active task",
    "current status",
    "当前 active",
    "当前状态",
    "证据日志",
    "探针清单",
]


def _line_count(path: Path) -> int:
    return len(path.read_text(encoding="utf-8", errors="replace").splitlines())


def _looks_like_state_mirror(text: str) -> bool:
    lowered = text.lower()
    token_hits = sum(1 for token in STATE_MIRROR_TOKENS if token.lower() in lowered)
    output_lines = sum(1 for line in text.splitlines() if line.lstrip().startswith(("echo ", "printf ")))
    # ponytail: heuristic, tune thresholds if real target repos are noisy.
    return token_hits >= 3 and output_lines >= 5


def check_hot_recovery_surfaces(root: Path, warnings: list[str]) -> None:
    for rel in HOT_RECOVERY_DOCS:
        path = root / rel
        if path.exists() and _line_count(path) > HOT_DOC_MAX_LINES:
            warnings.append(f"review hot document length: {rel} exceeds {HOT_DOC_MAX_LINES} lines")

    for rel in HOT_AGENT_SCRIPTS:
        path = root / rel
        if not path.exists():
            continue
        text = path.read_text(encoding="utf-8", errors="replace")
        if _line_count(path) > HOT_SCRIPT_MAX_LINES:
            warnings.append(f"review script length: {rel} exceeds {HOT_SCRIPT_MAX_LINES} lines")
        if _looks_like_state_mirror(text):
            warnings.append(f"review possible state duplication: {rel}")


def check_target_repo_shape(
    root: Path, issues: list[str], backend: str | None = None, warnings: list[str] | None = None
) -> None:
    """Validate only an explicitly selected backend; entry docs do not imply one."""
    if not root.is_dir():
        issues.append(f"target directory does not exist: {root}")
        return
    if backend == "harness":
        for rel in (".harness/work_index.md", ".harness/state.md"):
            if not (root / rel).is_file():
                issues.append(f"selected harness backend missing file: {rel}")
    if warnings is not None:
        check_hot_recovery_surfaces(root, warnings)
