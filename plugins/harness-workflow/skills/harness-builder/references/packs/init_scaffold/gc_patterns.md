# Garbage Collection Patterns

Entropy management scans catch drift, not just style violations.

## Safety rules

- GC scripts must be read-only: scan and report, never auto-fix or delete.
- Auto-fix requires explicit `--fix` and user approval.
- Scheduled CI runs are report-only.
- GC scripts must not modify source files, delete files, or alter git history.

## High-value scans

- doc-code drift;
- architecture violations;
- known-violation baseline growth;
- duplicate rules across instruction files;
- stale recovery state;
- generated artifacts that were hand-edited.

Templates live under `templates/packs/init_scaffold/gc/`.
