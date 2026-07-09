# Capability Discovery Playbook

> Primary owner: `capability-recommender`. Keep this file as controller fallback when that helper is unavailable.

Use this when the user asks for setup, installation, automation, or capability
recommendations, or when local evidence shows a workflow gap that bundled
references do not cover well enough.

## Boundary

Capabilities recommended here serve the project's development workflow:
verification, observability, context retrieval, recovery, review, automation, or
agent safety. They are not product features and they do not execute the user's
supplied product task.

## Discovery Ladder

1. Local evidence: manifests, scripts, tests, CI, docs, `.env*`, logs, existing
   agent config, service SDKs, database clients, browser/E2E tools, issue
   tracker refs, observability SDKs.
2. Existing project surface: reuse or patch current scripts, docs, checks,
   AGENTS/CLAUDE/Cursor rules, `.harness`, project-local skills, commands, and
   CI before adding a new capability.
3. Bundled references: `automation_recommendation_guide.md` and the relevant
   `automation_*` reference.
4. Skill discovery: use `$find-skills` / `find-skills` when a repeatable
   workflow looks skill-shaped.
5. Targeted external search: use web search or local official docs when the
   repo stack points to framework, service, plugin, MCP, command, or CI
   capabilities not named in the bundled references.

Do not stop at currently installed skills, cached plugins, or this repository's
reference list. The references are seeds, not the full recommendation universe.

## Stack Signals To Consider

| Repo signal | Discovery direction |
| --- | --- |
| React, Vue, Svelte, Next, Vite, Storybook, Playwright, Cypress | browser automation, screenshot/E2E helpers, Storybook/visual review, CI-friendly browser commands |
| `@playwright/test`, `playwright.config.*`, browser bugs | Playwright/browser MCP, headless browser command, screenshot artifact workflow |
| `pg`, Prisma, Supabase, migrations, SQL files, SQLite files | read-only database/schema inspection MCP or local schema script; write-capable DB access requires explicit approval |
| GitHub remote, `.github/workflows`, release scripts | GitHub MCP or CI/status command, PR review command, workflow diagnostics |
| Jira, Linear, GitLab, issue IDs in docs | issue tracker MCP or read-only issue summary workflow |
| Sentry, Datadog, OpenTelemetry, logging SDKs | observability MCP or log snapshot workflow with credential boundary |
| Dockerfile, compose, Kubernetes, devcontainer | container health command, compose dry-run, environment bootstrap check |
| OpenAPI, GraphQL, SDK clients, schema files | API contract reviewer, schema validation command, docs MCP |
| ML/RL/data artifacts, notebooks, checkpoints, wandb/mlruns | experiment evidence protocol, data/reward/metric reviewer, artifact protection rules |
| generated docs/assets or codegen scripts | regeneration command, generated-file drift check, CI diff gate |

## Recommendation Quality Bar

Every candidate must have:

- `repo_signal`: concrete local evidence;
- `recommendation_row`: exactly one primary Harness Recommendation Matrix row;
- `why`: project-specific failure prevented or capability added;
- `install_surface`: project-local, runtime-specific, global, or recommendation-only;
- `approval_needed`: no approval, `USER CHECKPOINT`, or explicit user approval;
- `fallback`: local script/docs/manual workflow if the capability is unavailable;
- `verification_probe`: cheap command or observation proving install/use works;
- `classification`: `Required`, `Recommended`, `Deferred`, or `Rejected`;
- source/freshness/trust/risk when those change the decision.

Prefer one precise candidate with a probe over a broad bundle. Defer or reject
any candidate that cannot name the failure it prevents, lacks a safe fallback,
requires credentials without clear value, or would be better handled by an
existing project artifact.

## External Search Rules

Use targeted search when:

- the user explicitly asks for setup/installation/capability recommendations;
- the repo stack names a tool or service whose current official integration
  surface may have changed;
- a mature ecosystem tool is likely but not in the bundled references;
- plugin/MCP/hook/command availability affects approval or install surface.

Search for official docs or well-known maintained implementations first. Record
the source name, freshness, and trust boundary only when it affects the
recommendation.
