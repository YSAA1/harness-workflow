#!/usr/bin/env python3
from __future__ import annotations

import importlib.util
import tempfile
import unittest
import json
import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))


def load_script(name: str):
    path = ROOT / "scripts" / name
    spec = importlib.util.spec_from_file_location(path.stem, path)
    module = importlib.util.module_from_spec(spec)
    assert spec and spec.loader
    spec.loader.exec_module(module)
    return module


class HarnessBuilderScriptTests(unittest.TestCase):
    def test_existing_backend_does_not_require_harness_files(self) -> None:
        target = load_script("validate_harness_target.py")
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "AGENTS.md").write_text("Use the existing tracker.\n", encoding="utf-8")
            for backend in (None, "none", "lightweight", "existing", "feature-list"):
                issues = []
                target.check_target_repo_shape(root, issues, backend)
                self.assertEqual(issues, [], backend)

    def test_explicit_harness_checks_its_resume_files(self) -> None:
        target = load_script("validate_harness_target.py")
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            issues = []
            target.check_target_repo_shape(root, issues, "harness")
            self.assertEqual(len(issues), 2)
            (root / ".harness").mkdir()
            (root / ".harness/work_index.md").write_text("A active\nB active\n", encoding="utf-8")
            (root / ".harness/state.md").write_text("Current task A\n" * 301, encoding="utf-8")
            issues, warnings = [], []
            target.check_target_repo_shape(root, issues, "harness", warnings)
            self.assertEqual(issues, [])
            self.assertEqual(len(warnings), 1)

    def test_manifest_template_matches_schema_contract(self) -> None:
        checks = load_script("validate_harness_scripts.py")
        issues = []
        checks.check_manifest_template(ROOT, issues)
        self.assertEqual(issues, [])
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "templates").mkdir()
            (root / "schemas").mkdir()
            source = (ROOT / "templates/manifest.yaml.j2").read_text(encoding="utf-8")
            source = re.sub(r"{{\s*(\w+)\s*\|\s*tojson\s*}}", lambda m: json.dumps(m[1]), source)
            data = json.loads(source)
            del data["harness_workflow"]["verification_command"]
            (root / "templates/manifest.yaml.j2").write_text(json.dumps(data), encoding="utf-8")
            (root / "schemas/harness_manifest.schema.json").write_text(
                (ROOT / "schemas/harness_manifest.schema.json").read_text(encoding="utf-8"), encoding="utf-8")
            issues = []
            checks.check_manifest_template(root, issues)
            self.assertTrue(any("verification_command" in issue for issue in issues))

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
