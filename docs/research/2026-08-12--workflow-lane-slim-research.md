# Research: Workflow lane slim (grill + adversarial-review merge)

> Date: 2026-08-12  
> Status: findings for implementation  
> Scope: primary sources only

## Question

How should harness-workflow slim its public lanes when the user wants:

1. Merge `verify` + `review` into one adversarial ready gate
2. Replace one-question brainstorm with Matt-style frontier grilling
3. Use only independent subagents for isolation (no host-specific CLI reviewers)
4. Keep skill protocol host-neutral

## Findings

### Matt grilling / grill-me

- Canonical primitive is `grilling`: design tree + **frontier rounds** — ask the whole frontier of independent questions in one round, each with a recommended answer; wait; recompute ([grilling SKILL](https://raw.githubusercontent.com/mattpocock/skills/main/skills/productivity/grilling/SKILL.md); [aihero grilling](https://www.aihero.dev/skills-grilling)).
- `grill-me` is a thin user-invoked wrapper that runs grilling ([grill-me](https://www.aihero.dev/skills-grill-me)).
- One-question-at-a-time is an **opt-out**, not the default.
- Facts vs decisions: agent looks up facts; decisions wait for the user; session ends when frontier is empty **and** user confirms shared understanding.
- This repo’s brainstorm still hard-ruled one question per message — opposite of current Matt default.

### Adversarial verification

- Anthropic dynamic workflows: for spawned work, run a separate agent to adversarially verify against a rubric ([blog](https://claude.com/blog/a-harness-for-every-task-dynamic-workflows-in-claude-code)).
- Product code-review fleets find issues then verify candidates against real behavior ([code-review docs](https://code.claude.com/docs/en/code-review)).
- Learn Harness Engineering keeps maker–checker and verification as durable concepts ([learn-harness-engineering](https://github.com/walkinglabs/learn-harness-engineering)).
- Industry sources do **not** collapse critique and ready evidence into an undifferentiated blob — they sequence find → evidence inside one UX entry when merging.

### This repo baseline

- Method contract C6: `verify` sole ready gate; `review` must not declare ready ([docs/harness-method-contract.md](../harness-method-contract.md)).
- SSY-1 already strengthened adversarial review + cold verification, but kept two user-facing lanes and host-named isolation tables.
- `harness-builder` is already a controller with helper routing; no architecture rewrite needed beyond routing alignment.

## Design implications adopted

| Topic | Decision |
| --- | --- |
| Public lanes | Seven: `harness-builder`, `brainstorm`, `plan`, `implement`, `diagnose`, `review`, `cleanup` |
| `verify` | Alias helper / trigger → `review` |
| Ready gate | `review` owns structural adversarial pass **and** fresh-evidence ready verdict |
| Isolation | Independent read-only subagent only; no host CLI reviewer paths in skill protocol |
| Host neutrality | Skill / references / method-contract protocol text describe capabilities, not host product names |
| Brainstorm | Frontier rounds + shared-understanding gate + Spec approve; no Phase A/B ceremony |

## Sources inventory

- https://raw.githubusercontent.com/mattpocock/skills/main/skills/productivity/grilling/SKILL.md
- https://www.aihero.dev/skills-grilling
- https://www.aihero.dev/skills-grill-me
- https://claude.com/blog/a-harness-for-every-task-dynamic-workflows-in-claude-code
- https://code.claude.com/docs/en/code-review
- https://github.com/walkinglabs/learn-harness-engineering
- Local: `skills/{brainstorm,review,verify,harness-builder}/SKILL.md`, `docs/harness-method-contract.md`, `.harness/state.md` (SSY-1)
