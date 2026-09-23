# Architecture Enforcement Policy

Use this when the harness must describe or enforce architectural boundaries.

## Principle

Stable architecture rules should be enforceable. Markdown alone is enough only when the rule is still exploratory, low-risk, or not mechanically detectable.

## Discovery First

Before writing layer rules:

- detect language, framework, source roots, package layout, aliases, and test runner;
- inspect actual imports or dependency patterns;
- identify existing architecture docs, lint rules, and tests;
- ask if layer ownership or special exceptions are unclear.

Never force a generic layer template onto a repo whose actual code does not match it.

## Escalation Ladder

| Level | Use when | Artifact |
| --- | --- | --- |
| Describe | Boundaries are early or mostly social | project map, `AGENTS.md` pointer, docs |
| Document | Boundaries are stable enough to teach | `docs/architecture/LAYERS.md` with remediation |
| Test | Imports/dependencies can be scanned | boundary test and known-violations baseline |
| Lint | Violations should appear during normal development | native linter import restriction |
| Hook | A high-risk violation must be blocked before tool execution | narrow approved hook |

Choose the lowest level that prevents the real failure.

## Baseline And Ratchet

For existing repos, scan current violations, store known violations in a project-local baseline when a mechanical check is installed, fail or warn only on new violations at first, and let the baseline shrink over time.

## Agent-Readable Errors

Good errors name the file, import, failed layer relation, and point to `docs/architecture/LAYERS.md`.
