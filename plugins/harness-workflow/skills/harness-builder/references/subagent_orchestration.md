# Subagent Orchestration

Subagents are optional gap reducers. They should not be spawned just because they are available.

Core rule: subagents read, research, or review. The main agent writes harness files.

Use solo mode for small repos. Use parallel_readonly for legacy/large/ML/RL/data projects with unclear verification or protected paths. Use review_before_install for production-sensitive projects, old projects, or installing hooks/MCP/subagents.

For every proposed subagent, state the gap it reduces, input, expected output, why main agent should not do it alone, and whether it is read-only.

## Signal mapping

Map repo signals to subagent types only when the Coverage Matrix exposes a real analysis or review gap:

| Repo signal | Candidate type | Default use |
| --- | --- | --- |
| Large, legacy, or unfamiliar repository | repo explorer | Read-only project map, protected paths, verification entry, source-of-truth scan. |
| Unclear verification or broken checks | verification scout | Read-only command discovery and risk report. |
| Security, auth, secrets, payments, or permissions | security reviewer | Read-only trust-boundary and unsafe-sink review. |
| ML, RL, data, or experiment claims | domain reviewer | Read-only leakage, reward, metric, baseline, and reproducibility critique. |
| API contracts, schemas, SDK boundaries | API contract reviewer | Read-only contract drift and compatibility review. |
| Significant harness plan before install | harness plan reviewer | Read-only plan critique before the user checkpoint. |

Subagents default to `Recommended`, not `Required`. They become `Required` only when the user explicitly asks for delegated analysis or the accepted harness objective cannot be reviewed safely by the main agent alone.

Do not delegate the immediate blocking implementation step. The main agent remains responsible for edits, integration, verification routing, and final reporting.
