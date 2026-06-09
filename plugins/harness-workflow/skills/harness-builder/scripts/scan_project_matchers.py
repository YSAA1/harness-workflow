from __future__ import annotations

from pathlib import Path


def dependency_signals(deps: set[str], mapping: dict[str, str]) -> list[str]:
    signals = []
    for label, dependency in mapping.items():
        if dependency in deps:
            signals.append(label)
    return sorted(signals)


def file_signals(root: Path, candidates: dict[str, list[str]]) -> list[str]:
    signals = []
    for label, paths in candidates.items():
        if any((root / rel).exists() for rel in paths):
            signals.append(label)
    return sorted(signals)


def script_signals(scripts: dict, keywords: list[str]) -> list[str]:
    signals = []
    for name, command in scripts.items():
        text = f"{name} {command}".lower()
        if any(keyword in text for keyword in keywords):
            signals.append(name)
    return sorted(signals)
