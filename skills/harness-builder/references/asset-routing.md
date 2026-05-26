# Harness Builder Asset Routing

This file is the ownership contract for `skills/harness-builder/` assets.
It keeps the main `SKILL.md` as the controller and prevents support files from
becoming unowned prompt baggage.

## Classifications

| Classification | Meaning | Allowed action |
| --- | --- | --- |
| `keep` | Required for a core gate, verification path, pack, or preserved capability. | Keep in the skill package and bind to an owner below. |
| `merge` | Useful content split too finely or duplicated across assets. | Merge into the named owner, then remove the duplicate source. |
| `downgrade` | Useful but not part of the default controller path. | Move to docs, examples, pack internals, or optional references. |
| `archive` | Low-frequency historical value with no current execution path. | Move out of the default package path or mark as archived. |
| `delete` | No owner, duplicate, generated cache, or AI-common advice without project value. | Remove after documenting the replacement path. |

## Owner Rules

Every retained file under `skills/harness-builder/` must satisfy at least one
rule:

- named by `SKILL.md` as a `read_when` or gate policy;
- listed in this routing table;
- consumed by a script, schema, generator, or install pack;
- preserved by an explicit compatibility rule;
- marked as archived or deprecated with a replacement path.

Generated runtime files such as `__pycache__/` and `*.pyc` are never assets.

## Routing Table

| Asset pattern | Classification | Owner gate / coverage row | Read when | Verification |
| --- | --- | --- | --- | --- |
| `SKILL.md` | `keep` | Controller for all harness-builder gates | Always on skill entry | `node scripts/check-plugin.mjs` |
| `README.md`, `INTEGRATION_NOTES.md` | `keep` | Maintainer docs / static documentation | Maintainer or integration work | `node scripts/check-plugin.mjs` |
| `references/coverage_matrix_policy.md` | `keep` | Coverage Matrix gate | Building or reviewing coverage rows | `python scripts/validate_harness.py` from this directory |
| `references/recovery_surface_policy.md` | `keep` | Selected recovery surface | Choosing or reconciling state surfaces | `python scripts/validate_harness.py` from this directory |
| `references/architecture_enforcement_policy.md` | `keep` | Architecture boundaries | Boundary tests, lint, or ratchets are considered | `python scripts/validate_harness.py` from this directory |
| `references/install_policy.md` | `keep` | Install and existing-file decisions | Before writing project-local harness files | `python scripts/validate_harness.py` from this directory |
| `references/verification_policy.md` | `keep` | Verification design and phase checks | Designing fast/deep evidence | `python scripts/validate_harness.py` from this directory |
| `references/anti_entropy.md` | `keep` | Anti-entropy and stale-state detection | Drift or cleanup risk is present | `python scripts/validate_harness.py` from this directory |
| `references/capability_signal_policy.md` | `keep` | Capability Discovery | Evaluating skills, hooks, MCP, subagents, scripts, or research | `python scripts/validate_harness.py` from this directory |
| `references/{skill,hook,mcp,subagent_orchestration,web_research}_policy.md` | `keep` | Capability Shortlist rows | The matching capability row is Required or Recommended | `node scripts/check-plugin.mjs` |
| `references/{research_route,research_graduation,research_entropy_gate}_policy.md` | `keep` | Research Route and graduation | User explicitly asks for research/autoresearch | `node scripts/check-plugin.mjs` |
| `references/{brainstorming,course_alignment,decision_matrix,harness_subsystems,project_map}_policy.md` | `keep` | Charter, hypothesis, course alignment, project map | The controller needs deeper policy for that gate | `node scripts/check-plugin.mjs` |
| `references/capability_starter_catalog.md` | `downgrade` | Capability Discovery | Stack signals need starter candidates | Future owner validator |
| `references/packs/init_scaffold/**` | `keep` | Pack Selection for approved coverage rows | Only after Coverage Matrix and Capability Discovery expose a real gap | `python scripts/inventory_references.py` |
| `templates/research_route/**` | `keep` | Research Route install | Explicit research route approval | `node scripts/check-plugin.mjs` |
| `templates/packs/init_scaffold/**` | `keep` | Pack implementation assets | Approved init scaffold component dry-run/install | `python scripts/render_harness.py --pack init_scaffold --components architecture_docs --dry-run` |
| `templates/agents/**` | `downgrade` | Subagent fit | Read-only subagent is Recommended or Required | Future owner validator |
| `templates/hooks/**` | `downgrade` | Hook fit | Narrow deterministic hook is approved | Future owner validator |
| `templates/skills/**` | `downgrade` | Skill fit | Project-local domain skill is approved | Future owner validator |
| `templates/{AGENTS.md,AGENTS.template,check.sh,manifest,state,decisions,progress,project_context,workflow,verification,risk_register,features,commit_convention,session_handoff}.j2` | `keep` | Install pack, recovery surface, verification, or preserved compatibility | Only during approved install or compatibility validation | `python scripts/validate_harness.py` from this directory |
| `templates/reports/verification_report.md.j2` | `keep` | Verification evidence reporting | Verification report template is selected | `python scripts/validate_harness.py` from this directory |
| `schemas/*.json` | `keep` | Machine-readable plan/manifest validation | Validator or pack validation uses schema-backed checks | Future owner validator |
| `scripts/{scan_project,validate_harness,inventory_references,render_harness,install_pack,diff_harness_plan,find_skills}.py` | `keep` | Deterministic evidence, validation, pack dry-run/install, skill search | Called by plan verification or Harness Builder support flow | Python compile check in `validate_harness.py` |
| `evals/*.json` | `downgrade` | Regression fixture / future eval surface | Maintainer validates behavior examples | Future owner validator |
| `scripts/__pycache__/**`, `*.pyc`, `*.pyo`, `*.pyd` | `delete` | None | Never | Ignored by git and adapter/check scripts |

## Current Minimal Keep Set

The first slimming pass must preserve:

- the controller gate contract in `SKILL.md`;
- core policies for coverage, recovery, install, verification, anti-entropy,
  architecture enforcement, capability signals, and research route;
- `init_scaffold` pack adapter and precedence policy;
- research route templates;
- project scanning, validation, inventory, render, and install helper scripts;
- root, packaged plugin, and Cursor preview parity.

## Follow-up Validator Target

The ownership validator should fail retained core-path assets that are not
covered by this file, by `SKILL.md`, by pack consumption, or by preserved
compatibility rules. It should warn, not fail, for assets classified as
`downgrade` during the first pass.
