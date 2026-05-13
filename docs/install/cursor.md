# Cursor Install And Recognition

`harness-workflow` supports Cursor in two ways:

1. **Cursor plugin surface** for public marketplace usage when a Cursor marketplace entry is available.
2. **Project adapter install** for teams that want the same rules and skills copied into a target project.

Cursor does not install the Codex plugin and does not read `.codex-plugin/plugin.json`. Its durable project context is `.cursor/rules` and `.cursor/skills`. This repository keeps both surfaces checked in, so the Cursor preview you see in this repo matches what the project adapter installs into a target repo.

This follows the pattern used by mature agent-tooling repos: keep reusable agent capabilities in repo-native folders, then expose a Cursor-specific plugin or `.cursor/` adapter rather than pretending Cursor can consume another agent's manifest.

## Cursor Plugin Install

When a Cursor marketplace entry is available, install it from Cursor chat:

```text
/add-plugin harness-workflow
```

Successful recognition means Cursor can see:

- plugin: `harness-workflow`
- bundled workflow skills: `harness-builder`, `brainstorm`, `plan`, `implement`, `diagnose`, `review`, `verify`, `cleanup`
- bundled helper skill: `find-skills`
- rules that carry the Harness Workflow operating model

The Cursor plugin metadata lives in:

- `.cursor-plugin/plugin.json`
- `.cursor-plugin/marketplace.json`

The canonical source and checked-in Cursor preview live in:

- `skills/`
- `rules/`
- `.cursor/rules/`
- `.cursor/skills/`

## Project Adapter Install

Use this when Cursor marketplace install is not available, or when you want the workflow pinned inside a specific target repo:

```bash
node scripts/install-cursor.mjs --target .
```

On Windows PowerShell:

```powershell
node scripts\install-cursor.mjs --target C:\path\to\target-project
```

The installer copies:

- `.cursor/rules/*.mdc` to the target repo's `.cursor/rules/`
- `skills/*` to the target repo's `.cursor/skills/`

It does not delete existing target rules or settings. If a file with the same name already exists, it is overwritten with this repository's current version. Preview without writing:

```bash
node scripts/install-cursor.mjs --target . --dry-run
```

## Recognition

For plugin install, use Cursor's plugin UI or chat command surface and confirm `harness-workflow` is installed.

For project adapter install:

1. Open the target project in Cursor.
2. Open Cursor Settings > Rules or inspect active Project Rules in the Agent sidebar.
3. Confirm Harness Workflow overview and 8 workflow rules are visible.
4. Confirm the target repo's `.cursor/skills/` contains the 8 workflow skill directories plus `find-skills`.

Test prompt:

```text
Use Harness Workflow to plan a scoped implementation for a small README change.
```

Expected behavior:

- Agent selects `plan`, or explains why the task is small enough to implement directly.
- If it implements, it keeps WIP=1.
- If it claims ready, it asks for or provides fresh evidence.
- If it closes the work, it mentions Knowledge Cleanup.

## Repository-Side Validation

Run:

```bash
node scripts/check-cursor-install.mjs
node scripts/install-cursor.mjs --target . --dry-run
```

These checks validate Cursor metadata, rule coverage, installer behavior, and documentation consistency. Cursor UI recognition still requires opening Cursor itself.

## Update

After changing canonical `skills/*/SKILL.md`, update `.cursor/rules/*.mdc` when the trigger, procedure, outputs, or done criteria changed. Then run:

```bash
node scripts/check-cursor-install.mjs
node scripts/check-plugin.mjs
```

For a target project adapter install, rerun:

```bash
node scripts/install-cursor.mjs --target .
```

## Uninstall

For marketplace install, remove `harness-workflow` from Cursor's plugin UI.

For project adapter install, delete only the installed Harness Workflow files from:

- the target repo's `.cursor/rules/`
- the target repo's `.cursor/skills/`

Do not delete the whole `.cursor` directory unless that project has no other Cursor configuration.

## Three-Surface Differences

| Surface | Primary Entry | Capability Shape | Install Meaning |
| --- | --- | --- | --- |
| Codex | `.agents/plugins/marketplace.json` + `.codex-plugin/plugin.json` | global plugin runtime + skills | add marketplace, install plugin globally |
| Claude Code | `.claude-plugin/marketplace.json` + `.claude-plugin/plugin.json` | global plugin runtime + skills | add marketplace, install plugin globally |
| Cursor | `.cursor-plugin/plugin.json`, `.cursor/rules`, `skills/` | plugin or copied project context | install Cursor plugin or copy adapter into target repo |

## Limits

- Cursor rules and skills are instruction context, not the Codex runtime.
- Cursor does not execute Codex manifest fields or Claude Code-specific plugin commands.
- This repository does not add Cursor MCP, extensions, hooks, or user settings by default.
- Legacy `.cursorrules` is intentionally not the main path.
