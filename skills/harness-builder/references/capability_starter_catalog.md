# Capability Starter Catalog

Starter map for Capability Discovery. Every row still needs repo signal, one coverage row, cost/risk, fallback, and classification. Consult this file and local docs before web search.

## MCP (read-only-first)

| Signal | Starter capability | Coverage row | Trust |
| --- | --- | --- | --- |
| Any greenfield or doc-heavy project | Official reference: Filesystem, Fetch, Git, Memory, Time, Sequential Thinking | MCP fit | read-only |
| GitHub-centric workflow | GitHub MCP (issues, PRs, code search) | MCP fit | credential-bearing |
| Fast-moving libraries, version drift | Context7 (live library docs) | MCP fit | read-only |
| Browser-only or E2E behavior | Playwright MCP | MCP fit | read-only/write per config |
| SQL schema or query verification | Postgres or SQLite MCP | MCP fit | credential-bearing |
| Production errors, regressions | Sentry MCP | MCP fit | read-only |
| Current facts, no local docs | Brave Search, Tavily MCP | MCP fit | read-only |
| Design-to-code handoff | Figma Dev Mode MCP | MCP fit | read-only |
| Issue/sprint tracking | Linear or Jira MCP | MCP fit | credential-bearing |

**Discovery registries:** [modelcontextprotocol registry](https://registry.modelcontextprotocol.io/), awesome-mcp-servers, mcp.so, glama.ai, Docker MCP Catalog.

**Safety:** pin versions; secrets via env vars; prefer stdio and read-only scopes; audit community servers before install.

## Hooks

| Signal | Pattern | Event | Template hint |
| --- | --- | --- | --- |
| Destructive shell risk | Block `rm -rf`, force-push main, prod deploy | PreToolUse / Bash | `block_destructive_shell.py.j2` |
| `.env`, secrets, checkpoints, generated artifacts | Protected-path guard | PreToolUse / Edit\|Write | `protected_paths.py.j2` |
| Known formatter/linter | Post-edit format or lint | PostToolUse / Edit\|Write | project script |
| Repeated “forgot to verify” | Verification reminder | PostToolUse or Stop | `verification_reminder.py.j2` |
| Research branch discipline | Branch/push guard | PreToolUse | `research_branch_push_guard.py.j2` |
| Milestone commits | Commit trailer enforcer | PostToolUse | `commit_trailer_enforcer.py.j2` |
| Audit trail | Command/event logger | PostToolUse | `research_iteration_logger.py.j2` |

## Skills (via find-skills)

| Signal | Search / install direction | Coverage row |
| --- | --- | --- |
| PR / code review standards | `npx skills find` + review category | Skill fit |
| Migrations, releases | migration/release skills | Skill fit |
| Security, auth changes | security review skills | Skill fit |
| ML/RL/data experiments | experiment, metric, leakage, reward review skills | Skill fit |
| Docs / spec quality | brainstorm-adjacent or docs skills | Skill fit |

Do not install from catalog alone—run `$find-skills` and bind to a gap.

## Subagents (patterns, not templates)

| Signal | Pattern | Coverage row |
| --- | --- | --- |
| Large or unfamiliar repo | `repo_explorer` — map, protected paths, verification entry | Subagent fit |
| Unclear or broken checks | `verification_scout` | Subagent fit |
| Auth, secrets, payments | `security_reviewer` | Subagent fit |
| API contracts, schemas | `api_contract_reviewer` | Subagent fit |
| ML/RL/data claims | domain reviewer (leakage, metrics, baselines) | Subagent fit |
| Harness plan before install | `harness_plan_reviewer` | Subagent fit |
| Research loops | `research_critic`, `failure_analyst` | Subagent fit |

Name by failure mode, not job title. Avoid `senior-engineer`, `architect`.

## Stack quick rows

| Stack signal | Starters |
| --- | --- |
| Python ML/RL | experiment/metric/leakage skills; protected-path hook for checkpoints |
| TypeScript frontend | lint/typecheck reminder hook; Playwright or UI smoke notes |
| Go backend | API contract reviewer; boundary tests per `architecture_enforcement_policy.md` |
| Autoresearch | Research Route templates; entropy checklist in `research_route_policy.md` |
