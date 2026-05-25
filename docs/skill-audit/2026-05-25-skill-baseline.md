# Skill Baseline Audit - 2026-05-25

This is the baseline for the routing/description optimization work before deeper progressive-disclosure refactors. It reflects the current working tree after the first routing-contract pass.

## Scope

- Root canonical skills: `skills/*/SKILL.md`
- Packaged plugin mirror: `plugins/harness-workflow/skills/`
- Cursor preview mirror: `.cursor/skills/`
- Routing docs: `docs/skill-routing.md`, README skill-map links
- Generated review pages: `docs/skill-flow-review/*.html`

## Skill Inventory

| Skill | Lines | Description chars | Referenced refs | Notes |
| --- | ---: | ---: | ---: | --- |
| `brainstorm` | 113 | 113 | 4 | Already moved clarification and Spec drafting detail into references. |
| `plan` | 218 | 159 | 0 | Still heavy; planning surface and commit-unit policy remain in hot path. |
| `harness-builder` | 296 | 323 | 23 | Largest hot path; expected PR2 target for deeper splitting. |
| `implement` | 191 | 144 | 1 | Verification intensity is already a reference. |
| `diagnose` | 155 | 138 | 1 | Diagnosis loop remains mostly in hot path. |
| `review` | 170 | 178 | 1 | Review rubric remains mostly in hot path. |
| `verify` | 222 | 148 | 2 | Evidence ladder and capability recommendation are already references. |
| `cleanup` | 188 | 154 | 2 | Entropy and handoff detail are already references. |
| `find-skills` | 162 | 277 | 0 | Helper skill; needs quality rubric split if it grows. |

## Routing State

- `docs/skill-routing.md` defines the short lane-selection matrix.
- Every root `SKILL.md` now has a capability/trigger/exclusion style `description`.
- Every root `SKILL.md` now has a top routing snapshot:
  - `Use when`
  - `Do not use when`
  - `Route to`
- README and README.zh-CN both link to `docs/skill-routing.md` from the skill map.

## Output Contracts

All active workflow skills expose a stable output or report section. Current contract shape is still uneven:

| Skill | Current output surface |
| --- | --- |
| `brainstorm` | `BRAINSTORM CLARIFICATION IN PROGRESS` or `BRAINSTORM SPEC READY` |
| `plan` | `EXECUTABLE PLAN READY` |
| `implement` | `EXECUTION STEP DONE` |
| `diagnose` | `DIAGNOSIS COMPLETE` |
| `review` | review assessment with findings and route |
| `verify` | verification record and ready judgment |
| `cleanup` | cleanup report and closure state |
| `harness-builder` | Harness Charter, Coverage Matrix, Capability Discovery, Harness Plan |
| `find-skills` | candidate recommendation and adoption route |

PR3 should normalize these names and fields against the shared glossary rather than doing it ad hoc.

## Progressive Disclosure State

Already split into references:

- `brainstorm`: clarification loop, clarification coverage, Spec drafting, Spec review checklist.
- `implement`: verification intensity.
- `diagnose`: harness-layer patterns.
- `review`: premature-completion patterns.
- `verify`: evidence ladder, capability recommendations.
- `cleanup`: entropy checklist, handoff hygiene.
- `harness-builder`: many policies, templates, schemas, scripts, and pack references.

Still heavy in hot path:

- `harness-builder`
- `verify`
- `plan`
- `implement`
- `cleanup`
- `review`

## Mirror And Drift Status

Verified in this working tree:

- Root `skills/` and `plugins/harness-workflow/skills/` match recursively.
- Root `skills/` and `.cursor/skills/` match recursively.
- `rules/brainstorm.mdc` and `.cursor/rules/brainstorm.mdc` match.
- Generated flow review HTML was rebuilt from `scripts/generate-skill-flow-html.mjs`.

## Verification Commands

Run on 2026-05-25:

```bash
node scripts/generate-skill-flow-html.mjs
node scripts/check-plugin.mjs
node scripts/check-claude-code-install.mjs
node scripts/check-cursor-install.mjs
node scripts/install-cursor.mjs --target . --dry-run
git diff --check
```

All commands passed. `node scripts/check-plugin.mjs` reported that Codex CLI was not detected in this shell; that is an environment recognition note, not a project validation failure.

## Next PR Candidates

1. PR2: split `harness-builder`, `verify`, and `plan` hot-path detail into references without weakening gates.
2. PR3: add shared glossary and normalize output-contract fields.
3. PR4: add routing evals and negative cases.
4. PR5: add deterministic skill-quality checks to CI.
