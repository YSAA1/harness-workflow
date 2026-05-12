# Codex Install And Recognition

This guide is for the Codex plugin runtime. In this repository, Codex is the native plugin target:

- `.codex-plugin/plugin.json` is the canonical Codex manifest.
- `skills/` is the canonical Codex skill source.
- No default MCP servers, hooks, apps, connectors, or user-level Codex config are installed by this plugin.

## Prerequisites

- Codex CLI or Codex App with plugin and skill support.
- A public GitHub source, local clone, or marketplace root that contains this repository.
- On Windows, prefer `codex.cmd` in PowerShell if `codex` resolves to a blocked `codex.ps1` shim.

The local validation script checks repository shape without modifying `~/.codex/config.toml`.

```bash
node scripts/check-plugin.mjs
```

## Install From GitHub

Use the public GitHub repository as the marketplace source once it is published:

```bash
codex plugin marketplace add <owner>/<repo>
```

For a pinned branch, tag, or commit:

```bash
codex plugin marketplace add <owner>/<repo>@<ref>
```

If the repository is hosted outside the `owner/repo` shorthand, use the Git URL form supported by Codex:

```bash
codex plugin marketplace add https://github.com/<owner>/<repo>.git --ref <ref>
```

After install, start or reload Codex so the plugin registry and bundled skills are refreshed.

## Local Development

From a local checkout, register the local repository path as the marketplace source:

```bash
codex plugin marketplace add <path-to-this-repository>
```

For this worktree on Windows, the path form is:

```powershell
codex.cmd plugin marketplace add C:\Users\shash\Desktop\harness_workflow\harness-workflow-codex
```

Run the repository verifier before trying live recognition:

```bash
node scripts/check-plugin.mjs
```

## Recognition

Successful recognition means Codex can see:

- plugin name: `harness-workflow`
- active skills: `harness-builder`, `brainstorm`, `plan`, `implement`, `diagnose`, `review`, `verify`, `cleanup`

You can ask Codex to use the plugin or a bundled skill explicitly, for example:

```text
Use the harness-workflow plugin to review this project harness.
```

```text
Use harness-workflow:verify to prove the ready claim with fresh evidence.
```

When app-server protocol tooling is available, the recognition surface to inspect is:

- `plugin/list` should include `harness-workflow`
- `plugin/read` should show `.codex-plugin/plugin.json`
- `skills/list` should include the 8 active skills above

If live app-server inspection is not available in the current shell, record that limitation and keep `node scripts/check-plugin.mjs` as the repository-side proof. The script also prints whether the local Codex CLI exposes `codex plugin marketplace add <SOURCE>`.

## Update

For an installed marketplace source, refresh it with:

```bash
codex plugin marketplace upgrade harness-workflow
```

If Codex registered the source under a different marketplace name, use that configured name instead. Re-run:

```bash
node scripts/check-plugin.mjs
```

Then reload Codex and confirm the plugin and 8 skills are still visible.

## Uninstall

Remove the configured marketplace source:

```bash
codex plugin marketplace remove harness-workflow
```

If the source was registered under another marketplace name, remove that name instead. After removal, reload Codex and confirm `harness-workflow` and the 8 bundled skills no longer appear in `plugin/list` or `skills/list`.

## Windows PowerShell Note

PowerShell may print a profile execution-policy error such as `profile.ps1 cannot be loaded because running scripts is disabled`. That is shell startup noise if the target command still exits successfully. It is not a project validation failure by itself.
