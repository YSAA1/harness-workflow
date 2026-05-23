# Init Scaffold Pack Adapter

This adapter maps harness-init phase discipline into Harness Builder coverage rows.

## Core constraint

Init phases are implementation hints, not workflow phases. Harness Builder gates remain authoritative.

The pack must not:

- bypass Evidence, Harness Charter, Coverage Matrix, Capability Discovery, Verification Design, or User Checkpoint;
- decide that a component is Required;
- overwrite existing files;
- install hooks, MCP, subagents, or Research Route artifacts;
- create CI/GC/SECURITY.md unless the relevant coverage row selected them;
- install all components by default.

## Phase-to-coverage mapping

| Init phase | Builder coverage row | Pack behavior |
| --- | --- | --- |
| Discovery | all rows | Checklist only. Does not replace evidence collection. |
| Thin AGENTS.md | Agent entry and project map | Snippets only; builder `templates/AGENTS.md.j2` remains canonical. |
| Docs system of record | Static docs and durable rules | Render selected docs only. |
| Boundary test | Architecture boundaries | Render only when Test level is selected by architecture policy. |
| Linter import rules | Architecture boundaries / Verification entry | Render snippets only when Lint level is selected. |
| CI | Verification entry | Render only when CI is selected and commands are validated. |
| GC / drift scan | Anti-entropy | Render read-only report-only scans only. |
| Pre-commit hooks | Hook fit | Defer to `references/hook_policy.md`; not installed by this pack. |

## Dry-run contract

Before installation, the pack must produce:

```text
PACK DRY RUN
- Selected pack:
- Selected coverage rows:
- Would create:
- Would patch:
- Would skip:
- Would defer:
- Would reject:
- Verification:
- Blockers / residual risks:
```

Every file must bind to exactly one primary coverage row.
