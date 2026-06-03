# Automation Recommendation Attribution

These Harness Builder recommendation references are adapted from:

- Source: local cache of Anthropic `claude-code-setup` plugin 1.0.0
- Path: `/home/ssy/.claude/plugins/cache/claude-plugins-official/claude-code-setup/1.0.0`
- Skill: `skills/claude-automation-recommender/SKILL.md`
- References: `mcp-servers.md`, `hooks-patterns.md`, `subagent-templates.md`, `skills-reference.md`, `plugins-reference.md`
- Local command/headless reference also derives from the upstream main skill's slash/headless guidance.
- Manifest author: Anthropic
- License: Apache License 2.0

## Local changes

- Converted Claude Code-only install language into Codex / Claude Code / Cursor install-surface guidance.
- Added Harness recommendation-row binding, approval boundary, trust boundary, fallback, verification probe, and classification fields.
- Kept the `harness-builder` runtime entry light and moved long tables into references.
- Preserved read-only recommendation behavior by default; installation still requires `USER CHECKPOINT` or explicit user approval depending on surface.

The repository manifest remains MIT for this project. These specific adapted references carry this attribution note because they derive from Apache-2.0 upstream material.
