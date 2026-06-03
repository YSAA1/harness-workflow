# Automation Plugins Reference

Plugins are installable bundles of skills, commands, agents, hooks, MCP declarations, and documentation. Recommend plugins when a bundle closes a real coverage row better than a single project-local skill or script.

Derived from Anthropic `claude-code-setup` 1.0.0 and adapted for Codex / Claude Code / Cursor surfaces. See `automation_recommendation_attribution.md`.

## Placement Surfaces

| Surface | Project-local package | Install surface | Notes |
| --- | --- | --- | --- |
| Codex | `.codex-plugin/plugin.json`, marketplace entry, plugin skill dirs | Codex plugin install/cache | do not update user cache unless asked |
| Claude Code | `.claude-plugin/plugin.json` | `/plugin install`, Claude plugin cache | plugin may include commands/hooks/agents |
| Cursor | `.cursor-plugin/`, `.cursor/rules/`, `.cursor/skills/` | Cursor plugin/project preview | verify available adapter |

Plugin recommendation does not imply installation. Marketplace/cache changes need explicit approval.

## Development and Code Quality

| Plugin | Best for | Key features |
| --- | --- | --- |
| plugin-dev | building plugins and extensions | skills for skills, hooks, commands, agents, MCP |
| pr-review-toolkit | PR review workflows | specialized review agents |
| code-review | automated code review | multi-agent review and confidence scoring |
| code-simplifier | simplifying/refactoring code | simplify while preserving behavior |
| feature-dev | end-to-end feature development | planning, implementation, review workflow |

## Git and Workflow

| Plugin | Best for | Key features |
| --- | --- | --- |
| commit-commands | commit, push, and PR commands | `/commit`, `/commit-push-pr` |
| hookify | automation rules | create hooks from repeated patterns |

## Frontend

| Plugin | Best for | Key features |
| --- | --- | --- |
| frontend-design | production-grade UI work | distinctive UI, avoids generic output |
| playwright/browser plugin | browser verification | screenshots, interactions, E2E support |

## Learning and Guidance

| Plugin | Best for | Key features |
| --- | --- | --- |
| explanatory-output-style | learning while coding | educational explanation style |
| learning-output-style | interactive learning | asks for contribution at decision points |
| security-guidance | security-aware editing | warns about security issues |

## Language Servers

| Language | Plugin direction |
| --- | --- |
| TypeScript/JavaScript | typescript-lsp |
| Python | pyright-lsp |
| Go | gopls-lsp |
| Rust | rust-analyzer-lsp |
| C/C++ | clangd-lsp |
| Java | jdtls-lsp |
| Kotlin | kotlin-lsp |
| Swift | swift-lsp |
| C# | csharp-lsp |
| PHP | php-lsp |
| Lua | lua-lsp |

## Quick Signal Map

| Codebase signal | Consider |
| --- | --- |
| building plugins | plugin-dev |
| PR-based workflow | pr-review-toolkit or code-review |
| frequent git commits | commit-commands |
| React/Vue/Angular | frontend-design |
| repeated automation rules | hookify |
| TypeScript project | typescript-lsp |
| Python project | pyright-lsp |
| Go project | gopls-lsp |
| security-sensitive work | security-guidance |
| onboarding/teaching | explanatory-output-style |

## Recommend Plugins When

- The user wants prebuilt automations from a marketplace or official repository.
- Multiple related capabilities are needed.
- Team standardization matters.
- A plugin is already present and needs repair or upgrade.

## Defer Plugins When

- A project-local skill/script closes the gap with less surface.
- The plugin requires global install, credentials, or cache updates without approval.
- The plugin source, license, version, or compatibility is unclear.
