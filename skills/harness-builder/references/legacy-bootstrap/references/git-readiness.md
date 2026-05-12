# Git Readiness

Use this during `bootstrap` when checking whether the project workbench can support implementation, review, recovery, and clean handoff.

## Required Checks

1. Confirm repo identity:
   - Run `git rev-parse --show-toplevel`.
   - Do not trust a visible `.git/` path by itself; it may be empty, nested, or not the active root.
   - If this fails, record `not a git repository` as a workbench gap.

2. Check current state:
   - Run `git status --short`.
   - Classify dirty files as `related`, `unrelated`, `generated`, or `unknown`.
   - Never revert or stage user-authored dirty files without explicit instruction.

3. Check recent history:
   - Run `git log --oneline -5` when the repo has commits.
   - If there are no commits, record `baseline commit missing`.

4. Check ignore rules:
   - Ensure dependencies, build output, local secrets, large generated artifacts, and local agent/runtime state are ignored when relevant.
   - Common candidates: `node_modules/`, `.venv/`, `dist/`, `build/`, `.env*`, `.codex/`, `.omc/`, `.worktrees/`.
   - Do not add broad ignore rules that would hide real source files.

## Greenfield Repo

If the directory is not a git repo and this is a greenfield project workbench:

1. Run `git init`.
2. Create a minimal `.gitignore` matched to the detected stack.
3. Create or confirm the bootstrap artifacts first: `AGENTS.md`, project map, state files, verification command.
4. Run at least one baseline verification command, or record why it cannot run.
5. Create a first baseline commit only after the workbench is truthful.

Do not initialize git only when the path is ambiguous, nested repo risk exists, or the user explicitly says this project should not use git.

## Baseline Commit Rule

A baseline commit is appropriate when:

- The project root is confirmed.
- Bootstrap artifacts exist and match repository truth.
- Verification entry points are documented.
- `git status --short` contains only intended bootstrap files or classified generated files.
- Secrets and local runtime state are not staged.
- At least one baseline verification command has passed, or the inability to run it is recorded as a blocker.

Suggested message shape:

```text
chore(harness): establish project workbench
```

## Feature Branch / Worktree Rule

Use the simplest branch shape that protects the main checkout:

- Small, local, single-agent work: current branch is fine if clean and user agrees.
- Risky, long-running, parallel, or architecture-sensitive work: recommend `git worktree add .worktrees/<feature> -b feature/<feature> HEAD`.
- Existing dirty main checkout: do not start a risky implementation in place; propose an isolated worktree or ask the user how to classify dirty files.

Project-local `.worktrees/` should usually be ignored.

## Commit Hygiene

- Commit only after fresh verification passes.
- If verification cannot run, record the blocker; do not commit that stage as complete.
- Follow `task_plan.md`: each completed phase gets a commit after its phase verification passes.
- Keep commits atomic: one coherent behavior, scaffold, or fix per commit.
- Commit messages should say what changed and why, not just "update".
- Do not include unrelated dirty files, secrets, local caches, logs, or runtime state.
- Do not rewrite history, reset, or delete branches during bootstrap.
- If dirty state is ambiguous, block commit and classify before staging.

## Report Fields

Record these in the bootstrap report or `progress.md` entry:

- Git root: `<path>` or `not a git repository`
- Branch: `<name>` or `unknown`
- Recent commit: `<hash subject>` or `no commits`
- Dirty state: `clean` or categorized file groups
- Baseline checkpoint: `exists`, `created`, `missing`, or `blocked`
- Git actions: `none`, `git init`, `.gitignore`, `baseline commit`, `feature branch`, `worktree`
