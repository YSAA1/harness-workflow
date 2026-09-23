from __future__ import annotations

from pathlib import Path


def infer_domain_types(root: Path) -> list[str]:
    types = []
    if any((root / name).exists() for name in ["configs", "notebooks", "data"]):
        types.append("ml_or_data_possible")
    if any((root / name).exists() for name in ["src/envs", "envs", "tasks"]):
        types.append("rl_or_sim_possible")
    return types
