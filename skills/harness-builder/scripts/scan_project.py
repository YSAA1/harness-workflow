#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path


FILES = [
    "README.md", "AGENTS.md", "CLAUDE.md", "GEMINI.md",
    "pyproject.toml", "requirements.txt", "setup.py", "environment.yml",
    "package.json", "package-lock.json", "pnpm-lock.yaml", "yarn.lock",
    "bun.lockb", "bun.lock", "uv.lock", "poetry.lock", "Pipfile.lock",
    "Cargo.lock", "go.sum", "Makefile", "justfile",
    "tsconfig.json", "vite.config.js", "vite.config.ts", "next.config.js",
    "next.config.mjs", "Dockerfile", "docker-compose.yml", "compose.yml",
    "CONTEXT.md", "docs/harness-method-contract.md",
    ".codex-plugin/plugin.json", ".claude-plugin/plugin.json", ".cursor-plugin/plugin.json",
    ".agents/plugins/marketplace.json",
    ".codex/config.toml", ".codex/hooks.json",
    ".harness/manifest.yaml", ".harness/state.md",
]

DIRS = [
    "src", "app", "tests", "test", "scripts", "configs", "data",
    "notebooks", ".github/workflows", ".devcontainer", ".agents/skills", ".agents/plugins",
    "skills", "rules", "plugins/harness-workflow", ".cursor/rules", ".cursor/skills", ".codex",
    ".claude", ".harness", "runs", "outputs", "checkpoints", "wandb",
    "mlruns", "dist", "build", "prisma", "supabase", "migrations"
]

LOCK_FILES = [
    "package-lock.json", "pnpm-lock.yaml", "yarn.lock", "bun.lockb", "bun.lock",
    "uv.lock", "poetry.lock", "Pipfile.lock", "Cargo.lock", "go.sum",
]

FRONTEND_DEPENDENCIES = {
    "react": "react",
    "vue": "vue",
    "angular": "@angular/core",
    "svelte": "svelte",
    "next": "next",
    "nuxt": "nuxt",
    "vite": "vite",
}

TEST_DEPENDENCIES = {
    "jest": "jest",
    "vitest": "vitest",
    "playwright": "@playwright/test",
    "cypress": "cypress",
    "pytest": "pytest",
}

FORMAT_LINT_DEPENDENCIES = {
    "eslint": "eslint",
    "prettier": "prettier",
    "biome": "@biomejs/biome",
    "ruff": "ruff",
    "black": "black",
}

TYPECHECK_DEPENDENCIES = {
    "typescript": "typescript",
    "pyright": "pyright",
    "mypy": "mypy",
}

DATABASE_DEPENDENCIES = {
    "prisma": "prisma",
    "supabase": "@supabase/supabase-js",
    "postgres": "pg",
    "mysql": "mysql2",
    "mongodb": "mongodb",
    "mongoose": "mongoose",
    "sqlite": "sqlite3",
    "sqlalchemy": "sqlalchemy",
    "alembic": "alembic",
}


def infer_project_type(root: Path) -> list[str]:
    types = []
    if (root / "pyproject.toml").exists() or (root / "requirements.txt").exists():
        types.append("python")
    if (root / "package.json").exists():
        types.append("javascript_or_typescript")
    if any((root / "scripts" / name).exists() for name in [
        "check-plugin.mjs",
        "check-claude-code-install.mjs",
        "check-cursor-install.mjs",
    ]):
        types.append("node_script_tooling")
    if (root / ".codex-plugin" / "plugin.json").exists() and (root / "skills").exists():
        types.append("codex_plugin")
    if (root / ".claude-plugin" / "plugin.json").exists():
        types.append("claude_code_plugin")
    if (root / ".cursor-plugin" / "plugin.json").exists() or (root / ".cursor" / "rules").exists():
        types.append("cursor_plugin_or_adapter")
    if (root / "skills" / "harness-builder" / "SKILL.md").exists():
        types.append("harness_workflow_plugin")
    if (root / "configs").exists() or (root / "notebooks").exists() or (root / "data").exists():
        types.append("ml_or_data_possible")
    if any((root / d).exists() for d in ["src/envs", "envs", "tasks"]):
        types.append("rl_or_sim_possible")
    return types or ["unknown"]


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


def git_config_path(root: Path) -> Path | None:
    git = root / ".git"
    if git.is_dir():
        return git / "config"
    if git.is_file():
        text = git.read_text(encoding="utf-8", errors="replace").strip()
        prefix = "gitdir:"
        if text.lower().startswith(prefix):
            gitdir = text[len(prefix):].strip()
            gitdir_path = Path(gitdir)
            if not gitdir_path.is_absolute():
                gitdir_path = (root / gitdir_path).resolve()
            return gitdir_path / "config"
    return None


def has_github_remote(root: Path) -> dict:
    config = git_config_path(root)
    if not config or not config.exists():
        return {"present": False, "source": None}
    text = config.read_text(encoding="utf-8", errors="replace")
    return {"present": "github.com" in text, "source": str(config)}


def detect_automation_signals(root: Path) -> dict:
    package_json = read_package_json(root)
    deps = package_dependencies(package_json)
    scripts = package_scripts(package_json)

    frontend = set(dependency_signals(deps, FRONTEND_DEPENDENCIES))
    frontend.update(file_signals(root, {
        "next": ["next.config.js", "next.config.mjs", "next.config.ts"],
        "vite": ["vite.config.js", "vite.config.ts", "vite.config.mjs"],
        "svelte": ["svelte.config.js", "svelte.config.ts"],
    }))

    tests = set(dependency_signals(deps, TEST_DEPENDENCIES))
    tests.update(file_signals(root, {
        "pytest": ["pytest.ini", "conftest.py"],
        "playwright": ["playwright.config.js", "playwright.config.ts"],
        "cypress": ["cypress.config.js", "cypress.config.ts"],
        "jest": ["jest.config.js", "jest.config.ts"],
        "vitest": ["vitest.config.js", "vitest.config.ts"],
    }))
    tests.update(f"package_script:{name}" for name in script_signals(scripts, ["test", "spec"]))

    format_lint = set(dependency_signals(deps, FORMAT_LINT_DEPENDENCIES))
    format_lint.update(file_signals(root, {
        "eslint": [".eslintrc", ".eslintrc.js", ".eslintrc.cjs", "eslint.config.js", "eslint.config.mjs"],
        "prettier": [".prettierrc", ".prettierrc.json", "prettier.config.js"],
        "biome": ["biome.json"],
        "ruff": ["ruff.toml"],
    }))
    format_lint.update(f"package_script:{name}" for name in script_signals(scripts, ["lint", "format", "prettier", "eslint", "biome"]))

    typecheck = set(dependency_signals(deps, TYPECHECK_DEPENDENCIES))
    typecheck.update(file_signals(root, {
        "typescript": ["tsconfig.json"],
        "pyright": ["pyrightconfig.json"],
        "mypy": ["mypy.ini", ".mypy.ini"],
    }))
    typecheck.update(f"package_script:{name}" for name in script_signals(scripts, ["typecheck", "type-check", "tsc"]))

    database = set(dependency_signals(deps, DATABASE_DEPENDENCIES))
    database.update(file_signals(root, {
        "prisma": ["prisma/schema.prisma"],
        "supabase": ["supabase/config.toml"],
        "migrations": ["migrations"],
    }))

    docker = file_signals(root, {
        "dockerfile": ["Dockerfile"],
        "compose": ["docker-compose.yml", "docker-compose.yaml", "compose.yml", "compose.yaml"],
        "devcontainer": [".devcontainer/devcontainer.json"],
    })

    env_files = sorted(p.name for p in root.glob(".env*") if p.is_file())
    lock_files = [name for name in LOCK_FILES if (root / name).exists()]

    return {
        "frontend_framework": sorted(frontend),
        "test_runner": sorted(tests),
        "formatter_linter": sorted(format_lint),
        "typecheck": sorted(typecheck),
        "database": sorted(database),
        "docker": docker,
        "secret_env_files": env_files,
        "lock_files": lock_files,
        "github_remote": has_github_remote(root),
    }


def main() -> None:
    root = Path.cwd()

    existing_files = [f for f in FILES if (root / f).exists()]
    existing_dirs = [d for d in DIRS if (root / d).exists()]

    protected_candidates = [
        d for d in ["data/raw", "checkpoints", "runs", "outputs", "wandb", "mlruns", ".env"]
        if (root / d).exists()
    ]

    test_candidates = []
    for cmd_file in ["Makefile", "justfile", "package.json", "pyproject.toml"]:
        if (root / cmd_file).exists():
            test_candidates.append(cmd_file)
    script_commands = {
        "scripts/check-plugin.mjs": "node scripts/check-plugin.mjs",
        "scripts/check-claude-code-install.mjs": "node scripts/check-claude-code-install.mjs",
        "scripts/check-cursor-install.mjs": "node scripts/check-cursor-install.mjs",
        "scripts/install-cursor.mjs": "node scripts/install-cursor.mjs --target . --dry-run",
        "scripts/generate-skill-flow-html.mjs": "node scripts/generate-skill-flow-html.mjs",
    }
    for rel, command in script_commands.items():
        if (root / rel).exists():
            test_candidates.append(command)
    if (root / "tests").exists() or (root / "test").exists():
        test_candidates.append("pytest_or_project_tests_possible")

    result = {
        "root": str(root),
        "project_type_signals": infer_project_type(root),
        "existing_files": existing_files,
        "existing_dirs": existing_dirs,
        "protected_path_candidates": protected_candidates,
        "verification_signals": test_candidates,
        "automation_signals": detect_automation_signals(root),
        "harness_signals": {
            "agents_md": (root / "AGENTS.md").exists(),
            "claude_md": (root / "CLAUDE.md").exists(),
            "harness_dir": (root / ".harness").exists(),
            "repo_skills": (root / ".agents" / "skills").exists() or (root / "skills").exists(),
            "codex_plugin": (root / ".codex-plugin" / "plugin.json").exists(),
            "claude_plugin": (root / ".claude-plugin" / "plugin.json").exists(),
            "cursor_plugin": (root / ".cursor-plugin" / "plugin.json").exists(),
            "cursor_preview": (root / ".cursor" / "skills").exists() and (root / ".cursor" / "rules").exists(),
            "packaged_plugin": (root / "plugins" / "harness-workflow").exists(),
            "plugin_rules": (root / "rules").exists(),
            "codex_config": (root / ".codex" / "config.toml").exists(),
            "codex_hooks": (root / ".codex" / "hooks.json").exists(),
            "ci": (root / ".github" / "workflows").exists(),
        },
    }

    print(json.dumps(result, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
