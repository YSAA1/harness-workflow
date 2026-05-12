# Harness Workflow

[简体中文](README.zh-CN.md)

<p align="center">
  <img src="docs/assets/readme/harness-workflow-icon.png" alt="Harness Workflow icon" width="120">
</p>

![Harness Workflow hero](docs/assets/readme/harness-workflow-hero.png)

`harness-workflow` packages the Learn Harness Engineering operating model as reusable workflow instructions for AI coding agents. It gives an agent a practical workbench: project entry points, scoped planning, fresh verification, recovery surfaces, and cleanup discipline.

The repository supports three agent surfaces:

| Surface | Runtime shape | Primary entry | Recognition target |
| --- | --- | --- | --- |
| Codex | Native plugin + skills | `.codex-plugin/plugin.json` + `skills/` | Plugin `harness-workflow` and 8 bundled skills |
| Claude Code | Project skills + local plugin | `.claude/skills/` and `.claude-plugin/plugin.json` | `/skill-name` or `/harness-workflow:skill-name` |
| Cursor | Project Rules adapter | `.cursor/rules/*.mdc` | Harness Workflow rules in Cursor Project Rules |

Codex is the native plugin target. Claude Code and Cursor are first-class adapters with their own install and recognition paths; they do not read the Codex manifest.

## Why This Exists

Most agent failures are not model failures alone. They come from missing project maps, unclear scope, weak verification, invisible state, and stale documentation. Harness Workflow turns those concerns into small reusable workflows instead of one giant prompt.

```mermaid
flowchart LR
  A[Unclear request] --> B[brainstorm: Spec]
  B --> C[plan: Executable Plan]
  C --> D[implement: WIP=1 scoped change]
  D --> E[review: correctness and scope]
  E --> F[verify: fresh evidence]
  F --> G[cleanup: knowledge stays current]
  H[harness-builder] --> B
  H --> C
  H --> D
  D --> I[diagnose: reproduce and root cause]
  I --> D
```

## Quick Install

### Codex

Use this repository as a Codex plugin source after publishing or cloning:

```bash
codex plugin marketplace add <owner>/<repo>
node scripts/check-plugin.mjs
```

Successful recognition means Codex sees plugin `harness-workflow` and the 8 active skills listed below. See [docs/install/codex.md](docs/install/codex.md).

### Claude Code

Open the repository with Claude Code. Project skills are available from `.claude/skills/`:

```text
/harness-builder
/brainstorm
/plan
/implement
/diagnose
/review
/verify
/cleanup
```

For local plugin testing:

```bash
claude --plugin-dir .
```

Then invoke namespaced skills such as `/harness-workflow:harness-builder`. See [docs/install/claude-code.md](docs/install/claude-code.md).

### Cursor

Open the repository in Cursor. The `.cursor/rules/*.mdc` files are Project Rules, versioned with the repo:

```bash
node scripts/check-cursor-install.mjs
```

Cursor support is a rules adapter, not a Codex plugin runtime. The repository intentionally does not use legacy `.cursorrules` as the main path. See [docs/install/cursor.md](docs/install/cursor.md).

## Workflow Skills

| Skill | Use When | Output |
| --- | --- | --- |
| `harness-builder` | The project workbench, verification entry, Capability Discovery, or recovery surface is unclear | Harness Hypothesis and project-local harness plan |
| `brainstorm` | The requirement is fuzzy or has multiple valid interpretations | Approved Spec |
| `plan` | A Spec is approved or the request is already clear | Executable Plan |
| `implement` | The next scoped change is ready to build | Minimal verified code/doc change |
| `diagnose` | A failure, regression, or unknown root cause blocks progress | Reproduction, root cause, minimal fix, evidence |
| `review` | A change needs correctness, scope, design, and test scrutiny | Findings and residual risk |
| `verify` | A ready claim needs proof | Fresh evidence for a specific claim |
| `cleanup` | Work is done and project knowledge may drift | Updated docs, generated artifacts, and handoff notes |

`state-contract`, `resume`, and `save-session` are not active skills. Their useful ideas live in Harness Builder recovery policy and Cleanup handoff hygiene.

## Recovery Surface

A recovery surface is the durable place future agents use instead of chat history. It is semantic, not tied to one file layout.

| Backend | Use For | Typical Artifacts |
| --- | --- | --- |
| `none` | Simple one-turn work | Current request and git diff |
| `lightweight` | Small tasks needing only scope and evidence | Existing docs or short notes |
| `three-file` | Multi-step, risky, or cross-session work | `task_plan.md`, `progress.md`, `findings.md` |
| `feature-list` | Many independent product features | Feature tracker or structured list |
| `existing` | Repos with their own tracker | Issues, roadmap, project docs, internal system |

All skills read the same semantic fields when available: `active_slice`, `non_goals`, `success_criteria`, `verification_path`, `evidence_log`, `decisions`, `risks`, `blockers`, and `next_actions`.

## Method Contract

| Contract | Meaning | Primary skills |
| --- | --- | --- |
| C1 Harness as system | Agent performance comes from surrounding systems, not prompts alone | `harness-builder`, `diagnose` |
| C2 Repository as truth | Repository artifacts and recovery surface are the durable truth | All skills |
| C3 Thin instruction surface | `AGENTS.md` stays a thin rule entry | `harness-builder`, `cleanup` |
| C4 Workbench before implementation | Project map, verification entry, and recovery path must be clear when needed | `harness-builder` |
| C5 Scoped work | Work is bounded by Spec, Executable Plan, and WIP=1 | `brainstorm`, `plan`, `implement` |
| C6 Fresh evidence | Ready claims require current evidence | `review`, `verify`, `diagnose` |
| C7 Capability fit | Add skills, MCP, hooks, or subagents only when value beats risk | `harness-builder`, `verify` |
| C8 Artifact freshness | Docs, commands, and generated files must match code | `review`, `cleanup` |
| C9 Knowledge Cleanup | Close work by reducing drift and entropy | `cleanup` |
| C10 Backend decoupling | Recovery surface is semantic; three-file is optional | `harness-builder`, all skills |

## Validation

Run the full repository-side recognition checks before publishing:

```bash
node scripts/check-plugin.mjs
node scripts/check-claude-code-install.mjs
node scripts/check-cursor-install.mjs
```

If you modify skill structure or the generated flow review:

```bash
node scripts/generate-skill-flow-html.mjs
node scripts/check-plugin.mjs
```

`docs/skill-flow-review/*.html` is generated. Update the generator, then rebuild.

## Repository Map

| Path | Purpose |
| --- | --- |
| `.codex-plugin/plugin.json` | Codex plugin metadata and default prompts |
| `.claude-plugin/plugin.json` | Claude Code local plugin metadata |
| `.claude/skills/` | Claude Code project skills copy |
| `.cursor/rules/` | Cursor Project Rules adapter |
| `skills/*/SKILL.md` | Canonical workflow skill source |
| `skills/*/references/` | Detailed policy and checklist files |
| `skills/plan/templates/` | Optional three-file backend templates |
| `docs/install/` | Per-surface installation and recognition guides |
| `docs/harness-method-contract.md` | C1-C10 method contract |
| `docs/skill-flow-review/` | Generated skill flow review HTML |
| `scripts/check-*.mjs` | Repository-side recognition and consistency checks |

## Publishing Checklist

1. Run all validation commands.
2. Confirm the README and install docs describe the same three surfaces.
3. Confirm no default MCP, hooks, user-level config, or hidden install side effects were added.
4. Create a public GitHub repository and push.
5. Perform live recognition where available: Codex plugin listing, Claude Code skill menu, Cursor Project Rules UI.

## License

MIT.
