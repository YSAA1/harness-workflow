# Planning-With-Files Adaptation

Useful idea to keep: persistent working memory is not optional for complex work. The agent should read it before acting and update it after meaningful progress.

Harness-workflow adaptation:

- Treat file-based planning as a recovery pattern, not a fixed filename requirement.
- Prefer `.harness/` when harness-workflow owns the state surface.
- Use existing issue trackers, specs, plans, ADRs, or docs when they already carry the same fields.
- Avoid root-level `task_plan.md`, `findings.md`, and `progress.md` unless the project already uses that convention or the user requests it.
- Keep planning artifacts human-readable and simple enough for manual repair.