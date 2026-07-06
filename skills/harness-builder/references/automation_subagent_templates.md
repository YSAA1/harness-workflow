# Automation Subagent Templates

Subagents are specialized workers or reviewers with bounded context. Recommend them when parallel read/review, domain focus, or isolated context materially improves quality.

Derived from Anthropic `claude-code-setup` 1.0.0 and adapted for Codex / Claude Code / Cursor surfaces. See `automation_recommendation_attribution.md`.

**Note**: These are common subagent patterns. Design or research custom subagents based on the codebase's specific review, analysis, and generation needs.

## Placement Surfaces

| Surface | Typical placement | Notes |
| --- | --- | --- |
| Codex | runtime subagent roles or project docs describing delegation policy | use only if current Codex surface supports it |
| Claude Code | `.claude/agents/<name>.md` | define model, tools, and task boundary |
| Cursor | Cursor agent/rule equivalents or project docs | verify current support before writing |

Project-local, read-only subagents (review, analysis, mapping) are low-risk capability supplements: recommend them as `Recommended` at `USER CHECKPOINT` when the repo shows the matching failure mode. Main agent owns writes unless the approved plan splits disjoint write scopes; write-capable subagents need explicit approval. Default recommendation is read-only review/research.

## Review Agents

### code-reviewer

**Best for**: large codebases or meaningful diffs needing parallel correctness review.

| Recommend when | Detection |
| --- | --- |
| large repo | high file count or many modules |
| active team development | frequent changes/PRs |
| consistent review needed | repeated review checklists |

**Value**: reviews in parallel while main agent continues implementation.

### security-reviewer

**Best for**: auth, payments, secrets, PII, permissions, or external-write integrations.

| Recommend when | Detection |
| --- | --- |
| auth/session code | `auth/`, `login`, `session`, JWT/OAuth |
| payment code | Stripe, billing, checkout |
| user data | PII/profile/account data |
| secret handling | env vars, credentials, API keys |

**Value**: catches exposure, auth, and trust-boundary failures.

### ui-reviewer

**Best for**: frontend accessibility, responsive behavior, and UX regressions.

| Recommend when | Detection |
| --- | --- |
| frontend framework | React, Vue, Angular, Svelte |
| component library | `components/`, Storybook |
| user-facing UI | pages/app routes |

**Value**: catches accessibility, layout, and interaction issues.

## Generation or Analysis Agents

### test-writer

**Best for**: generating tests after conventions are known.

| Recommend when | Detection |
| --- | --- |
| test suite exists | `tests/`, `__tests__/`, test config |
| low coverage | few tests vs source files |
| clear public behavior | APIs/components with expected behavior |

Writing tests requires an approved disjoint write scope.

### api-documenter

**Best for**: OpenAPI, route docs, schema docs, and API contract extraction.

| Recommend when | Detection |
| --- | --- |
| REST endpoints | Express/FastAPI/Django routes |
| GraphQL schema | `.graphql`, resolvers |
| existing OpenAPI | `openapi.yaml`, `swagger.json` |

### performance-analyzer

**Best for**: database-heavy, hot-path, or algorithmic performance review.

| Recommend when | Detection |
| --- | --- |
| DB queries | ORM/raw SQL, N+1 risk |
| high-traffic code | API hot paths |
| complex loops | nested loops, recursion |

## Maintenance Agents

| Agent | Best for | Notes |
| --- | --- | --- |
| dependency-updater | dependency upgrades and advisories | write-capable; needs approved scope and tests |
| migration-helper | framework/version migrations | high-risk; plan first |
| verification-scout | finding exact test/build entry | read-only; good for unfamiliar repos |
| repo-explorer | mapping project structure and protected paths | read-only; useful before harness install |
| harness-plan-reviewer | checking Harness Recommendation Plan before install | read-only; catches scope drift |

## Model and Tool Guidance

| Access | Tools | Use |
| --- | --- | --- |
| read-only | Read, Grep, Glob | review, analysis, mapping |
| write-scope | Read, Write, Grep, Glob | tests/docs generation with disjoint ownership |
| full | plus Bash | migrations and verification with clear command policy |

Use cheaper/faster models for repetitive checks and stronger models for security, architecture, and migrations when the platform supports model choice.

## Naming Rules

- Name by failure mode or duty: `security-reviewer`, `verification-scout`, `api-contract-reviewer`.
- Avoid vague status names such as `senior-engineer` or `architect`.
- Include scope, allowed tools, stop condition, and output contract.
