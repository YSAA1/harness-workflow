# Codex Global Install And Recognition

This guide is for **global Codex plugin installation**. The public distribution path is a Codex marketplace, not project-local instructions copied into a single repository.

Codex uses:

- `.agents/plugins/marketplace.json`: marketplace catalog.
- `plugins/harness-workflow/.codex-plugin/plugin.json`: installable plugin manifest.
- `plugins/harness-workflow/skills/`: bundled Codex skills.

The repository also keeps root-level `.codex-plugin/` and `skills/` copies for direct review and adapter checks. `node scripts/check-plugin.mjs` verifies that the installable package under `plugins/harness-workflow/` has not drifted from those root copies.

No default MCP servers, hooks, apps, connectors, or user-level Codex config are installed by this plugin.

## Global Install From GitHub

Add the public GitHub repository as a user-level Codex marketplace:

```bash
codex plugin marketplace add YSAA1/harness-workflow
```

On Windows PowerShell, prefer `codex.cmd` if `codex` resolves to a blocked `.ps1` shim:

```powershell
codex.cmd plugin marketplace add YSAA1/harness-workflow
```

Then restart Codex, open the plugin directory, choose the `Harness Workflow` marketplace, and install the `harness-workflow` plugin.

For a pinned branch, tag, or commit:

```bash
codex plugin marketplace add YSAA1/harness-workflow@master
```

## Personal Marketplace Manual Install

For local/private use, install through the user-level marketplace files:

1. Copy or clone this plugin to a stable user-level location, for example `~/.codex/plugins/harness-workflow`.
2. Add or update `~/.agents/plugins/marketplace.json` so its plugin entry points at that directory.
3. Restart Codex and install `harness-workflow` from the plugin directory.

This repository already includes `.agents/plugins/marketplace.json` for marketplace discovery. Do not treat a target project checkout as the installation surface; install the plugin into the user's Codex plugin environment, then use it across projects.

## Recognition

Successful recognition means Codex can see:

- marketplace: `harness-workflow`
- plugin: `harness-workflow`
- workflow skills: `harness-builder`, `brainstorm`, `plan`, `implement`, `diagnose`, `review`, `verify`, `cleanup`
- helper skill: `find-skills`

You can ask Codex to use the plugin or a bundled skill explicitly:

```text
Use the harness-workflow plugin to review this project harness.
```

```text
Use harness-workflow:verify to prove the ready claim with fresh evidence.
```

When app-server protocol tooling is available, the recognition surface to inspect is:

- `plugin/list` includes `harness-workflow`.
- `plugin/read` shows `.codex-plugin/plugin.json`.
- `skills/list` includes the 8 workflow skills above plus `find-skills`.

## Repository-Side Validation

Run before publishing:

```bash
node scripts/check-plugin.mjs
```

The script checks:

- `.agents/plugins/marketplace.json` exists and points to `plugins/harness-workflow`.
- `.codex-plugin/plugin.json` is valid.
- `skills/` contains the 8 workflow skills plus `find-skills` with valid frontmatter.
- `plugins/harness-workflow/` contains the installable Codex package and matches the root manifest and skills.
- removed skills are not exposed.
- no default MCP, hooks, apps, connectors, or Codex config are bundled.
- the local Codex CLI exposes the marketplace command surface when available.

This is repository-side validation. The final live check is still a global install/recognition check in Codex: the marketplace, plugin, 8 workflow skills, and `find-skills` helper must appear after installing from the plugin directory.

## Update

For an installed marketplace source:

```bash
codex plugin marketplace upgrade harness-workflow
```

If Codex registered the source under a different marketplace name, use that configured name instead. Restart Codex and confirm the plugin, 8 workflow skills, and `find-skills` helper are still visible.

## Uninstall

Remove the configured marketplace source:

```bash
codex plugin marketplace remove harness-workflow
```

If the source was registered under another marketplace name, remove that name instead. After removal, restart Codex and confirm `harness-workflow`, the 8 workflow skills, and `find-skills` helper no longer appear.

## Windows PowerShell Note

PowerShell may print a profile execution-policy error such as `profile.ps1 cannot be loaded because running scripts is disabled`. That is shell startup noise if the target command still exits successfully. It is not a project validation failure by itself.
