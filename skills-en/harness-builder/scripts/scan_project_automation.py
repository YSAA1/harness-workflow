from __future__ import annotations

from pathlib import Path

from scan_project_catalog import (
    DATABASE_DEPENDENCIES,
    FORMAT_LINT_DEPENDENCIES,
    FRONTEND_DEPENDENCIES,
    LOCK_FILES,
    TEST_DEPENDENCIES,
    TYPECHECK_DEPENDENCIES,
)
from scan_project_git import has_github_remote
from scan_project_matchers import dependency_signals, file_signals, script_signals
from scan_project_packages import package_dependencies, package_scripts, read_package_json


def detect_frontend(root: Path, deps: set[str]) -> list[str]:
    frontend = set(dependency_signals(deps, FRONTEND_DEPENDENCIES))
    frontend.update(file_signals(root, {
        "next": ["next.config.js", "next.config.mjs", "next.config.ts"],
        "vite": ["vite.config.js", "vite.config.ts", "vite.config.mjs"],
        "svelte": ["svelte.config.js", "svelte.config.ts"],
    }))
    return sorted(frontend)


def detect_tests(root: Path, deps: set[str], scripts: dict) -> list[str]:
    tests = set(dependency_signals(deps, TEST_DEPENDENCIES))
    tests.update(file_signals(root, {
        "pytest": ["pytest.ini", "conftest.py"],
        "playwright": ["playwright.config.js", "playwright.config.ts"],
        "cypress": ["cypress.config.js", "cypress.config.ts"],
        "jest": ["jest.config.js", "jest.config.ts"],
        "vitest": ["vitest.config.js", "vitest.config.ts"],
    }))
    tests.update(f"package_script:{name}" for name in script_signals(scripts, ["test", "spec"]))
    return sorted(tests)


def detect_format_lint(root: Path, deps: set[str], scripts: dict) -> list[str]:
    format_lint = set(dependency_signals(deps, FORMAT_LINT_DEPENDENCIES))
    format_lint.update(file_signals(root, {
        "eslint": [".eslintrc", ".eslintrc.js", ".eslintrc.cjs", "eslint.config.js", "eslint.config.mjs"],
        "prettier": [".prettierrc", ".prettierrc.json", "prettier.config.js"],
        "biome": ["biome.json"],
        "ruff": ["ruff.toml"],
    }))
    format_lint.update(
        f"package_script:{name}"
        for name in script_signals(scripts, ["lint", "format", "prettier", "eslint", "biome"])
    )
    return sorted(format_lint)


def detect_typecheck(root: Path, deps: set[str], scripts: dict) -> list[str]:
    typecheck = set(dependency_signals(deps, TYPECHECK_DEPENDENCIES))
    typecheck.update(file_signals(root, {
        "typescript": ["tsconfig.json"],
        "pyright": ["pyrightconfig.json"],
        "mypy": ["mypy.ini", ".mypy.ini"],
    }))
    typecheck.update(f"package_script:{name}" for name in script_signals(scripts, ["typecheck", "type-check", "tsc"]))
    return sorted(typecheck)


def detect_database(root: Path, deps: set[str]) -> list[str]:
    database = set(dependency_signals(deps, DATABASE_DEPENDENCIES))
    database.update(file_signals(root, {
        "prisma": ["prisma/schema.prisma"],
        "supabase": ["supabase/config.toml"],
        "migrations": ["migrations"],
    }))
    return sorted(database)


def detect_automation_signals(root: Path) -> dict:
    package_json = read_package_json(root)
    deps = package_dependencies(package_json)
    scripts = package_scripts(package_json)
    return {
        "frontend_framework": detect_frontend(root, deps),
        "test_runner": detect_tests(root, deps, scripts),
        "formatter_linter": detect_format_lint(root, deps, scripts),
        "typecheck": detect_typecheck(root, deps, scripts),
        "database": detect_database(root, deps),
        "docker": file_signals(root, {
            "dockerfile": ["Dockerfile"],
            "compose": ["docker-compose.yml", "docker-compose.yaml", "compose.yml", "compose.yaml"],
            "devcontainer": [".devcontainer/devcontainer.json"],
        }),
        "secret_env_files": sorted(p.name for p in root.glob(".env*") if p.is_file()),
        "lock_files": [name for name in LOCK_FILES if (root / name).exists()],
        "github_remote": has_github_remote(root),
    }
