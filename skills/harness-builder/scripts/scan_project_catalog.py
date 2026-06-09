from __future__ import annotations


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
    "mlruns", "dist", "build", "prisma", "supabase", "migrations",
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
