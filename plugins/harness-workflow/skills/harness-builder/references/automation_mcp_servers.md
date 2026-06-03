# Automation MCP Servers

MCP servers connect the agent runtime to external tools and services. Recommend them when local files and shell commands are insufficient, or when live external context would materially reduce drift.

Derived from Anthropic `claude-code-setup` 1.0.0 and adapted for Codex / Claude Code / Cursor surfaces. See `automation_recommendation_attribution.md`.

**Note**: These are common MCP servers. Use targeted web search or local official docs to find MCP servers specific to the codebase's services, frameworks, and integrations.

## Setup Surfaces

| Surface | Project-local option | User/global option | Notes |
| --- | --- | --- | --- |
| Codex | project `.codex/config.toml` or plugin MCP declaration when supported | Codex user config / MCP install flow | do not edit without explicit approval |
| Claude Code | checked-in `.mcp.json` or project `.claude/settings.json` | `claude mcp add`, user settings | `claude --mcp-debug` can diagnose |
| Cursor | project Cursor MCP settings where available | user Cursor MCP settings | verify against current Cursor config surface |

Prefer project-local, read-only, env-var-backed configuration. Credential-bearing or write-capable MCP is approval-required.

## Documentation and Knowledge

### Context7

**Best for**: projects using popular libraries/SDKs where current documentation matters.

| Recommend when | Examples |
| --- | --- |
| frontend frameworks | React, Vue, Angular, Next.js |
| backend frameworks | Express, FastAPI, Django |
| ORMs | Prisma, Drizzle, SQLAlchemy |
| third-party APIs | Stripe, Twilio, SendGrid |
| cloud SDKs | AWS SDK, Google Cloud |
| AI/ML SDKs | OpenAI SDK, LangChain |

**Value**: live docs reduce hallucinated APIs and stale patterns.

### Fetch / web research MCP

**Best for**: current public facts, docs pages, and issue threads when local docs are insufficient.

**Fallback**: targeted web search or local docs snapshot.

## Browser and Frontend

### Playwright MCP

**Best for**: frontend projects needing browser automation, UI debugging, screenshots, or E2E verification.

| Recommend when | Examples |
| --- | --- |
| frontend app | UI component testing |
| E2E tests needed | user flow validation |
| visual regression | screenshot comparison |
| UI bug diagnosis | inspect rendered app |
| form workflows | multi-step flows |

### Puppeteer MCP

**Best for**: headless browser automation, scraping, PDF generation, and CI-friendly browser tasks.

## Databases

| Candidate | Best for | Detection |
| --- | --- | --- |
| Supabase MCP | Supabase auth/database/storage projects | `@supabase/supabase-js`, Supabase config |
| PostgreSQL MCP | direct Postgres query/schema work | `pg`, `postgres`, migrations, SQL files |
| SQLite MCP | local DB inspection | `.sqlite`, `.db`, SQLite deps |
| Neon MCP | Neon serverless Postgres | Neon env/config |
| Turso MCP | Turso/libSQL edge DB | Turso/libSQL deps/config |

Credential-bearing DB access requires explicit approval and a read-only role when possible.

## Version Control and DevOps

| Candidate | Best for | Detection |
| --- | --- | --- |
| GitHub MCP | issues, PRs, Actions, releases | GitHub remote, `.github/workflows` |
| GitLab MCP | GitLab issues, MRs, CI | GitLab remote |
| Linear MCP | issue workflow and backlog | Linear refs like `ABC-123` |
| Docker MCP | containers and compose debugging | `Dockerfile`, `docker-compose.yml` |
| Kubernetes MCP | cluster debugging | K8s manifests, Helm charts |

These are usually credential-bearing. Recommend as `Deferred` until owner and permissions are clear.

## Cloud Infrastructure

| Candidate | Best for | Detection |
| --- | --- | --- |
| AWS MCP | AWS resource management | `@aws-sdk/*`, CDK, Terraform, SAM |
| Cloudflare MCP | Workers, Pages, R2, D1 | wrangler config, Cloudflare deps |
| Vercel MCP | Vercel deployment/config | `vercel.json`, Vercel env |

Cloud write access is external-write. Default to recommendation-only with a manual fallback.

## Monitoring and Observability

| Candidate | Best for | Detection |
| --- | --- | --- |
| Sentry MCP | production error investigation | `@sentry/*`, Sentry config |
| Datadog MCP | APM, logs, metrics | Datadog env/config |

## Communication and Docs

| Candidate | Best for | Detection |
| --- | --- | --- |
| Slack MCP | deployment/incident notifications | Slack workflow references |
| Notion MCP | workspace docs/search | Notion docs references |
| Figma MCP | design-to-code handoff | Figma links, design system |

## File and Memory

| Candidate | Best for | Detection |
| --- | --- | --- |
| Filesystem MCP | controlled file access outside default workspace | multi-root workflows |
| Memory MCP | cross-session project memory | long-running project decisions |
| Time MCP | timezone/date-sensitive workflows | scheduling, release windows |

## Quick Detection Map

| If you see | Consider |
| --- | --- |
| popular npm/Python packages | Context7 |
| React/Vue/Next app | Playwright MCP |
| `@supabase/supabase-js` | Supabase MCP |
| `pg`, SQL migrations | PostgreSQL MCP |
| GitHub remote | GitHub MCP |
| `.github/workflows` | GitHub MCP or CI smoke script |
| `@aws-sdk/*` | AWS MCP |
| `@sentry/*` | Sentry MCP |
| `Dockerfile` / compose | Docker MCP |
| public current facts | Fetch/search MCP |
