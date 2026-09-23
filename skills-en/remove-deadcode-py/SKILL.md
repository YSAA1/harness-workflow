---
name: remove-deadcode-py
description: "On-demand Python dead-code removal (repo-wide scope, not task close-out): Ruff fast lane + vulture tiered detection + reference/dynamic-access conviction + batched atomic deletion. Triggers: remove dead code, dead code python, unused code python (死代码清理, Python 清理死代码, 删除未用代码)."
---

# Remove Dead Code (Python)

Delete unused code from Python projects. Detection relies on tools, conviction relies on evidence, deletion goes in small batches, and clearing everything in one pass is not the goal.

This skill is the on-demand entry for repo-wide cleanup and does not do task close-out (close-out goes through `cleanup`). The method is inspired by code-yeongyu/oh-my-openagent's remove-deadcode (no text copied); tool behavior defers to the official vulture/Ruff/deptry docs. Repo-wide scanning for non-Python ecosystems is out of scope for this skill: use knip for JS/TS, `go tool deadcode` for Go, and cargo-machete for Rust.

## Workflow

1. **Pin down entry points (mark off the undeletable zone first)**: `[project.scripts]` and `entry_points` in `pyproject.toml`/`setup.cfg`, `__main__.py`, `app.py`/`run.py`/`manage.py`, `conftest.py`, Django models/admin/urls/migrations, Celery tasks, plugin registration points. Entry points and framework auto-discovery surfaces = undeletable.
2. **Fast lane**: `ruff check --select F401,F841` for unused imports/variables; with `--fix`, accept only safe fixes — F401 in `__init__.py` is re-export semantics (Ruff flags it as unsafe); do not delete by hand before confirming `__all__`. If deptry is installed, also run `deptry .` for unused dependencies.
3. **Main scan**: `vulture <src> --min-confidence 60`. 60% (attributes/classes/functions) is only a lead; 90% (imports) can proceed to conviction; 100% (unreachable code) is mostly trustworthy but still goes through step 4.
4. **Conviction (triple evidence; missing any one downgrades to needs-review)**:
   - Zero references in a repo-wide grep — the scope covers source, strings, comments, config, docs, CI/workflows, Makefile/Dockerfile;
   - `git log --follow <file>` provenance: added for an abandoned feature, or long untouched, strengthens the call; recently active ones get downgraded;
   - Optional corroboration: never executed in test coverage (`coverage report`) ≠ dead code; it serves only as a bonus.
5. **Guard list (a hit means keep, no matter what the tool says)**:
   - Dynamic references reachable within the range of `getattr` / `globals()` / `eval` / `exec` / `__import__` / `importlib`;
   - Registration decorators: `@app.route`, `@router.*`, `@cli.command`, `@click.*`, `@pytest.fixture`, `@celery.task` and custom registration decorators (grep the decorator definition site to confirm the registration mechanism);
   - Dunder methods, abstract-method/Protocol implementations, operator overloads, dataclass/Pydantic fields;
   - re-exports and `__all__` in `__init__.py`;
   - Referenced by test files = a legitimate consumer;
   - Packaging-config references: include/packages in `pyproject.toml`, setup.cfg, MANIFEST.in.
6. **Batched atomic deletion**: one module or one group of related symbols per batch; after each deletion run the project's narrowest tests + typecheck (if configured); commit only when green (the message states the evidence basis); on failure, `git checkout -- <files>` rolls back this batch, then shrink the batch size.
7. **Cascade rescan**: after each finished batch, rerun vulture — deletions expose new dead code. Produce the report once all batches are done.

## vulture whitelist discipline

Suppress false positives by generating a whitelist with `vulture --make-whitelist <file>... > whitelist_python.py`; every whitelist entry must carry a comment stating "why it is alive"; the whitelist itself enters the next round's step-4 review — more dangerous than dead code is a stale "alive claim".

## Report format

- **Deleted**: symbols + evidence summary (zero references/provenance/coverage).
- **needs-review**: reason (tool report only / suspected dynamic access / recently active).
- **Kept**: guard-list hits.
- **Next-round candidates**: new suspects exposed by the cascade.

## Recommended next skill

- Cleanup finished: `cleanup` closes out this track; newly hit pitfalls are written into lessons.
- The dead code is actually a bug (it should be called but nothing calls it, or tests are red even before deletion): `diagnose`.

## Non-goals

- No deleting entry points, tests, conftest, migrations, generated code, or vendor directories.
- No aiming to clear everything in one pass; split large repos across multiple sessions, each round closing with all-green tests.
- Misbehaving "dead code" is not a cleanup job — route it to `diagnose`.
