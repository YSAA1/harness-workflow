# Capability Starter Catalog

Use this catalog only as a starting point for Capability Discovery. Every candidate still needs a repo signal, one Coverage Matrix row, cost/risk, fallback, and classification.

## Python ML or RL

| Signal | Starter capability | Coverage row |
| --- | --- | --- |
| training scripts, configs, metrics, checkpoints | `ml-experiment-review`, `metric-design-review`, `data-leakage-audit` | Skill fit |
| large experiment outputs or checkpoints | protected-path hook for artifacts/checkpoints | Hook fit |
| unclear experiment validity | `ml_reviewer` or `rl_reviewer` | Subagent fit |

## TypeScript frontend

| Signal | Starter capability | Coverage row |
| --- | --- | --- |
| React/Vite/Next app with design-sensitive UI | UI smoke checklist or frontend review skill | Skill fit |
| existing lint/typecheck command | verification reminder hook | Hook fit |
| visual regressions or browser-only behavior | browser automation notes or MCP recommendation | MCP fit |

## Go backend

| Signal | Starter capability | Coverage row |
| --- | --- | --- |
| service boundaries, API contracts, generated clients | `api_contract_reviewer` | Subagent fit |
| dependency or package boundary risk | architecture boundary check | Hook fit |
| external API docs change frequently | read-only docs MCP or official docs research | MCP fit |

## Secrets or auth

| Signal | Starter capability | Coverage row |
| --- | --- | --- |
| `.env`, credentials, OAuth, cloud config | protected-path or secret-pattern hook | Hook fit |
| auth flow or permission changes | `security_reviewer` | Subagent fit |
| live provider docs needed | read-only official-docs research | External research fit |

## Dataset, checkpoint, or generated artifacts

| Signal | Starter capability | Coverage row |
| --- | --- | --- |
| raw data, model checkpoints, generated decks/images | protected-path hook with allowlist | Hook fit |
| repeated data split or eval changes | `data-leakage-audit`, `metric-design-review` | Skill fit |
| artifact cleanup drift | read-only GC scan | Hook fit |

## Autoresearch or method exploration

| Signal | Starter capability | Coverage row |
| --- | --- | --- |
| repeated hypothesis loops | Research Route templates | External research fit |
| failed branches and experiment residue | research entropy gate | Hook fit |
| need independent critique | `research_critic`, `failure_analyst` | Subagent fit |
