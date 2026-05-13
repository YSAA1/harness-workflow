# Claude Code Global Install And Recognition

This guide is for **global Claude Code installation**. The public distribution path is a Claude Code plugin marketplace, not project-local `.claude/skills` inside this repository.

Claude Code does not read `.codex-plugin/plugin.json`. This repository has a separate Claude Code plugin surface:

- `.claude-plugin/plugin.json`: plugin identity and namespace.
- `.claude-plugin/marketplace.json`: marketplace catalog for global installation.
- `skills/`: canonical plugin skills exposed as `/harness-workflow:<skill-name>` after install.

## Global Plugin Install

Add the public GitHub repository as a Claude Code marketplace:

```text
/plugin marketplace add YSAA1/harness-workflow
```

Or from the shell:

```bash
claude plugin marketplace add YSAA1/harness-workflow
```

Then install the plugin globally:

```text
/plugin install harness-workflow@harness-workflow
```

Or from the shell:

```bash
claude plugin install harness-workflow@harness-workflow
```

Restart Claude Code or run `/reload-plugins` if your version supports it.

## Recognition

Successful recognition means Claude Code can see the installed plugin and namespaced skills:

```text
/plugin list
/harness-workflow:harness-builder
/harness-workflow:brainstorm
/harness-workflow:plan
/harness-workflow:implement
/harness-workflow:diagnose
/harness-workflow:review
/harness-workflow:verify
/harness-workflow:cleanup
/harness-workflow:find-skills
```

You can also ask:

```text
List all available Skills
```

Expected result: the 8 Harness Workflow lanes plus the `find-skills` helper appear under the `harness-workflow` namespace.

## Local Marketplace Test

For release testing before publishing:

```bash
claude plugin validate .
claude plugin marketplace add . --scope user
claude plugin install harness-workflow@harness-workflow
```

Then start Claude Code and try:

```text
/harness-workflow:harness-builder
```

This still installs through the user-level marketplace/plugin mechanism. It is not a project-local `.claude/skills` install.

## Personal Skills Fallback

Claude Code also supports personal skills in `~/.claude/skills/`. Use this only when you explicitly do not want plugin marketplace installation. This is still user-global, not project-local:

```bash
mkdir -p ~/.claude/skills
cp -r skills/harness-builder ~/.claude/skills/
cp -r skills/brainstorm ~/.claude/skills/
cp -r skills/plan ~/.claude/skills/
cp -r skills/implement ~/.claude/skills/
cp -r skills/diagnose ~/.claude/skills/
cp -r skills/review ~/.claude/skills/
cp -r skills/verify ~/.claude/skills/
cp -r skills/cleanup ~/.claude/skills/
cp -r skills/find-skills ~/.claude/skills/
```

On Windows PowerShell:

```powershell
New-Item -ItemType Directory -Force "$env:USERPROFILE\.claude\skills" | Out-Null
Copy-Item -Recurse -Force skills\harness-builder "$env:USERPROFILE\.claude\skills\"
Copy-Item -Recurse -Force skills\brainstorm "$env:USERPROFILE\.claude\skills\"
Copy-Item -Recurse -Force skills\plan "$env:USERPROFILE\.claude\skills\"
Copy-Item -Recurse -Force skills\implement "$env:USERPROFILE\.claude\skills\"
Copy-Item -Recurse -Force skills\diagnose "$env:USERPROFILE\.claude\skills\"
Copy-Item -Recurse -Force skills\review "$env:USERPROFILE\.claude\skills\"
Copy-Item -Recurse -Force skills\verify "$env:USERPROFILE\.claude\skills\"
Copy-Item -Recurse -Force skills\cleanup "$env:USERPROFILE\.claude\skills\"
Copy-Item -Recurse -Force skills\find-skills "$env:USERPROFILE\.claude\skills\"
```

Equivalent Windows path: `%USERPROFILE%\.claude\skills`.

Personal skills use short names such as `/harness-builder`. Plugin installation uses namespaced names such as `/harness-workflow:harness-builder`. The repository does not ship `.claude/skills/` as its primary surface because that would be a project-local copy, not the global install path.

## Product Boundary

Codex uses `.agents/plugins/marketplace.json` and `.codex-plugin/plugin.json`. Cursor uses `.cursor-plugin/plugin.json`, `.cursor/rules`, and the project adapter installer. Claude Code does not read either product's manifest; it uses `.claude-plugin/marketplace.json`, `.claude-plugin/plugin.json`, and canonical `skills/`.

## Repository-Side Validation

Run:

```bash
node scripts/check-claude-code-install.mjs
```

The script checks:

- `.claude-plugin/plugin.json` is valid.
- `.claude-plugin/marketplace.json` exposes `harness-workflow`.
- `skills/` contains the 8 active workflow skills plus `find-skills` with valid frontmatter.
- Supporting files remain available under each skill.
- The docs describe global plugin or personal-skill installation, not project-local `.claude/skills` as the primary path.

## Update

For plugin installs:

```bash
claude plugin marketplace update harness-workflow
claude plugin update harness-workflow
```

If the plugin was installed from a marketplace under a different name, use that marketplace/plugin identifier from `claude plugin list`.

For personal skills fallback, recopy the 8 workflow skill directories plus `find-skills` into `~/.claude/skills/`.

## Uninstall

For plugin installs:

```bash
claude plugin uninstall harness-workflow
claude plugin marketplace remove harness-workflow
```

For personal skills fallback, delete only these directories from `~/.claude/skills/`:

- `harness-builder`
- `brainstorm`
- `plan`
- `implement`
- `diagnose`
- `review`
- `verify`
- `cleanup`
- `find-skills`

Do not delete the whole `~/.claude` directory.
