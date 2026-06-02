"""Harness Workflow adapter for the upstream SkillOpt trainer.

This adapter intentionally keeps target rollouts deterministic: it scores a
candidate SKILL.md against repo-owned contract cases. SkillOpt still owns the
training loop, validation gate, patch aggregation, edit selection, update, and
artifact layout.
"""
from __future__ import annotations

import json
import os
import random
import re
from pathlib import Path
from typing import Any

from skillopt.envs.base import EnvAdapter


class HarnessWorkflowAdapter(EnvAdapter):
    def __init__(
        self,
        split_dir: str = "",
        seed: int = 42,
        limit: int = 0,
        **kwargs: Any,
    ) -> None:
        if not split_dir:
            raise ValueError("HarnessWorkflowAdapter requires env.split_dir")
        self.split_dir = Path(split_dir)
        self.seed = int(seed)
        self.limit = int(limit or 0)
        self.splits: dict[str, list[dict[str, Any]]] = {}

    def setup(self, cfg: dict) -> None:
        super().setup(cfg)
        for split in ("train", "val", "test"):
            path = self.split_dir / split / "items.json"
            if not path.exists():
                raise FileNotFoundError(path)
            with path.open(encoding="utf-8") as f:
                items = json.load(f)
            if self.limit > 0:
                items = items[: self.limit]
            self.splits[split] = list(items)

    def build_train_env(self, batch_size: int, seed: int, **kwargs: Any):
        return self._sample("train", batch_size, seed)

    def build_eval_env(self, env_num: int, split: str, seed: int, **kwargs: Any):
        canonical = {
            "train": "train",
            "valid_seen": "val",
            "selection": "val",
            "val": "val",
            "valid_unseen": "test",
            "test": "test",
        }.get(split, split)
        return self._sample(canonical, env_num, seed)

    def rollout(
        self,
        env_manager,
        skill_content: str,
        out_dir: str,
        **kwargs: Any,
    ) -> list[dict[str, Any]]:
        os.makedirs(out_dir, exist_ok=True)
        results = [self._score_item(item, skill_content) for item in list(env_manager)]
        with open(os.path.join(out_dir, "results.json"), "w", encoding="utf-8") as f:
            json.dump(results, f, ensure_ascii=False, indent=2)
        return results

    def reflect(
        self,
        results: list[dict[str, Any]],
        skill_content: str,
        out_dir: str,
        **kwargs: Any,
    ) -> list[dict[str, Any] | None]:
        del skill_content
        patches_dir = kwargs.get("patches_dir", os.path.join(out_dir, "patches"))
        os.makedirs(patches_dir, exist_ok=True)
        patches: list[dict[str, Any]] = []
        for result in results:
            if result.get("hard"):
                continue
            edits = result.get("edits") or []
            if not edits:
                continue
            patch = {
                "source_type": "failure",
                "batch_size": 1,
                "patch": {
                    "reasoning": result.get("fail_reason", "contract failure"),
                    "edits": edits,
                },
            }
            patches.append(patch)
        with open(os.path.join(patches_dir, "harnessworkflow_patches.json"), "w", encoding="utf-8") as f:
            json.dump(patches, f, ensure_ascii=False, indent=2)
        return patches

    def get_task_types(self) -> list[str]:
        return ["skill_contract"]

    def _sample(self, split: str, count: int, seed: int) -> list[dict[str, Any]]:
        items = list(self.splits.get(split, []))
        if not items:
            return []
        if count <= 0 or count >= len(items):
            return items
        rng = random.Random(self.seed + int(seed))
        shuffled = list(items)
        rng.shuffle(shuffled)
        return shuffled[:count]

    def _score_item(self, item: dict[str, Any], skill_content: str) -> dict[str, Any]:
        checks = [self._run_check(check, skill_content) for check in item.get("checks", [])]
        hard_failures = [check["id"] for check in checks if check["hard"] and not check["passed"]]
        score = sum(float(check["score"]) for check in checks)
        max_score = sum(float(check["max_score"]) for check in checks)
        passed = not hard_failures and score == max_score
        return {
            "id": str(item.get("id", "item")),
            "task_type": "skill_contract",
            "hard": 1 if passed else 0,
            "soft": 1.0 if max_score == 0 else score / max_score,
            "score": score,
            "max_score": max_score,
            "checks": checks,
            "fail_reason": "; ".join(hard_failures) if hard_failures else "",
            "reference_text": item.get("expected_behavior", ""),
            "edits": item.get("edits", []),
        }

    def _run_check(self, check: dict[str, Any], skill_content: str) -> dict[str, Any]:
        check_type = check.get("type")
        weight = float(check.get("weight", 1))
        missing: list[str] = []
        found: list[str] = []
        passed = False

        if check_type == "contains_all":
            missing = [token for token in check.get("tokens", []) if token not in skill_content]
            passed = not missing
        elif check_type == "contains_any":
            found = [token for token in check.get("tokens", []) if token in skill_content]
            passed = bool(found)
            if not passed:
                missing = list(check.get("tokens", []))
        elif check_type == "not_contains_any":
            found = [token for token in check.get("tokens", []) if token in skill_content]
            passed = not found
        elif check_type == "frontmatter_name":
            frontmatter_name = self._frontmatter_name(skill_content)
            expected = str(check.get("value", ""))
            passed = frontmatter_name == expected
            found = [frontmatter_name] if frontmatter_name else []
            if not passed:
                missing = [expected]
        else:
            raise ValueError(f"Unsupported check type: {check_type}")

        return {
            "id": check.get("id", "check"),
            "type": check_type,
            "hard": bool(check.get("hard", False)),
            "passed": passed,
            "score": weight if passed else 0,
            "max_score": weight,
            "missing": missing,
            "found": found,
        }

    def _frontmatter_name(self, skill_content: str) -> str:
        match = re.match(r"^---\n([\s\S]*?)\n---", skill_content)
        if not match:
            return ""
        for line in match.group(1).splitlines():
            pair = re.match(r"^name:\s*(.*)$", line)
            if pair:
                return pair.group(1).strip().strip("\"'")
        return ""
