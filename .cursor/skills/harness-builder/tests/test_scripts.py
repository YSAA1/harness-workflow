#!/usr/bin/env python3
from __future__ import annotations

import importlib.util
import tempfile
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def load_script(name: str):
    path = ROOT / "scripts" / name
    spec = importlib.util.spec_from_file_location(path.stem, path)
    module = importlib.util.module_from_spec(spec)
    assert spec and spec.loader
    spec.loader.exec_module(module)
    return module


class HarnessBuilderScriptTests(unittest.TestCase):
    def test_find_skills_parses_frontmatter(self) -> None:
        find_skills = load_script("find_skills.py")
        text = "---\nname: demo\ndescription: Demo skill\n---\n# Demo\n"
        self.assertEqual(
            find_skills.parse_frontmatter(text),
            {"name": "demo", "description": "Demo skill"},
        )

    def test_scan_project_detects_package_signals(self) -> None:
        scan_project = load_script("scan_project.py")
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "package.json").write_text(
                '{"dependencies":{"next":"latest","@playwright/test":"latest"},"scripts":{"test":"vitest"}}',
                encoding="utf-8",
            )
            signals = scan_project.detect_automation_signals(root)
        self.assertIn("next", signals["frontend_framework"])
        self.assertIn("playwright", signals["test_runner"])
        self.assertIn("package_script:test", signals["test_runner"])

    def test_inventory_requires_capability_discovery_reference(self) -> None:
        inventory = load_script("inventory_references.py")
        self.assertIn("capability_discovery_playbook.md", inventory.CORE_REFERENCES)


if __name__ == "__main__":
    unittest.main()
