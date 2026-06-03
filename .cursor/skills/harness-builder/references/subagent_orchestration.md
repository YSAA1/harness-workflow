# Subagent Orchestration

Subagents are optional gap reducers—not spawned because they exist.

**Core rule:** subagents read, research, or review. The main agent writes harness files and integrates results.

## Modes

- **Solo** — small repos.
- **Parallel read-only** — large, legacy, or unfamiliar repos; unclear verification; signaled security/API/ML/research risk.
- **Review before install** — production-sensitive projects or before installing hooks/MCP/subagents.

For each proposal: gap reduced, input, expected output, why main agent should not do it alone, read-only yes/no.

## Signal mapping

| Repo signal | Candidate | Default use |
| --- | --- | --- |
| Large, legacy, or unfamiliar repository | repo explorer | Project map, protected paths, verification entry, source-of-truth scan |
| Unclear verification or broken checks | verification scout | Command discovery and risk report |
| Security, auth, secrets, payments | security reviewer | Trust boundaries, unsafe sinks |
| ML, RL, data, experiment claims | domain reviewer (ml/rl/data) | Leakage, reward, metric, baseline, reproducibility |
| API contracts, schemas, SDK boundaries | api contract reviewer | Contract drift, compatibility |
| Harness plan before install | harness plan reviewer | Plan critique before USER CHECKPOINT |
| Research loops | research critic, failure analyst | Independent critique, failed-path analysis |
| Large diffs, blast radius | blast radius reviewer | Scope and dependency impact |
| Test failures | test triager | Isolated failure clustering |

Name by **failure mode**, not job title. Avoid `senior-engineer`, `architect`, `backend-engineer`.

## Classification

- Default `Recommended`, not `Required`.
- `Required` only when user explicitly requests delegation or the harness objective cannot be reviewed safely by the main agent alone.
- Do not delegate the immediate blocking implementation step.

Record adopted subagents in `.harness/manifest.yaml` and `.harness/decisions.md`.
