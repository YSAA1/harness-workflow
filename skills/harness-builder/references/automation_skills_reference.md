# Automation Skills Reference

Skills package repeatable expertise, workflows, templates, scripts, examples, and reference material. Recommend skills when a recurring task is too detailed for `AGENTS.md` and benefits from a stable trigger. Project-local skills live in this repo and do not change user/global state, so recommend them as `Recommended` at `USER CHECKPOINT` when a repeated project workflow matches; only user/global skill installs need explicit approval.

Derived from Anthropic `claude-code-setup` 1.0.0 and adapted for Codex / Claude Code / Cursor surfaces. See `automation_recommendation_attribution.md`.

**Note**: These are common patterns. Use targeted web search, `$find-skills` / `find-skills`, or local official docs to find skill ideas specific to the codebase's tools and frameworks.

## Placement Surfaces

| Surface | Project-local | User/global | Notes |
| --- | --- | --- | --- |
| Codex | plugin skill surface or repo-local `.agents/skills/` documented in `AGENTS.md` | `$CODEX_HOME/skills` or installed plugin | do not write global skills without explicit approval |
| Claude Code | `.claude/skills/<name>/SKILL.md` | user/global `.claude/skills` or plugin | supports frontmatter invocation controls |
| Cursor | `.cursor/skills/<name>/SKILL.md` | user/global Cursor skill surface if configured | mirror only when project uses Cursor preview |

## Official or Packaged Skill Directions

| Codebase signal | Skill direction | Plugin/bundle |
| --- | --- | --- |
| building plugins or skills | skill/plugin development skill | plugin-dev / skill-creator |
| git commit workflow | commit / commit-push-pr | commit-commands |
| React/Vue/Angular UI work | frontend-design | frontend-design |
| automation rules/hooks | hook/rule writing skill | hookify |
| feature planning | feature-dev / planning skill | feature-dev |
| PR/code review standards | review skill | review toolkit or local skill |
| documents | docx/xlsx/pdf/ppt skills | document plugin bundle |

Use `$find-skills` / `find-skills` for reusable skills before inventing a new local one.

## Custom Project Skills

| Codebase signal | Skill to create | Invocation | Value |
| --- | --- | --- | --- |
| API routes | `api-doc` | user-only or both | OpenAPI and route docs from templates |
| database project | `create-migration` | user-only | migration generation plus validation script |
| existing test suite | `gen-test` | user-only | tests matching local examples |
| component library | `new-component` | user-only | scaffold component/test/story templates |
| PR workflow | `pr-check` | user-only or forked | checklist-based review |
| releases | `release-notes` | user-only | git-derived release notes |
| code conventions | `project-conventions` | agent-only | background project style and forbidden patterns |
| onboarding | `setup-dev` | user-only | prerequisite and setup script |
| ML/RL/data experiments | `metric-review`, `data-leakage-audit`, `reward-review` | both | review claims and success criteria |
| deployment | `deploy-check` | user-only | side-effecting deploy preflight |

## Skill Structure

```text
<skill-root>/
  SKILL.md
  references/
  templates/
  scripts/
  examples/
```

`SKILL.md` should stay concise and use progressive disclosure. Put long tables, scripts, and examples in supporting files.

## Invocation Control

| Mode | Use for | Policy |
| --- | --- | --- |
| user-only | side effects: deploy, commit, send, install | user invokes explicitly |
| agent-only | background conventions, review policy | agent invokes automatically |
| both | safe workflows and reusable expertise | default when no side-effect risk |
| forked/context-isolated | PR review, broad exploration, heavy analysis | use when the platform supports isolated context |

For Claude Code, this maps to frontmatter such as `disable-model-invocation: true`, `user-invocable: false`, or `context: fork`. For Codex/Cursor, document the equivalent runtime behavior rather than copying unsupported keys blindly.

## Recommend A Skill When

- The workflow repeats.
- The trigger is clear enough for a description.
- The skill can bundle references/templates/scripts that improve quality.
- The task is too long or specialized for `AGENTS.md`.
- The skill can be verified with a smoke prompt, bundled script, or output contract.

## Reject Or Defer When

- A one-line instruction in `AGENTS.md` is enough.
- The workflow is one-off or still changing.
- The skill would install global side effects without approval.
- The skill is just a prompt with no durable references, examples, scripts, or verification value.
