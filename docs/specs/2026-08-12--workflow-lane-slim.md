# Spec - Workflow Lane Slim

> Status: user-approved (plan confirmation +「开始实施」)
> Owner: user / agent
> Date: 2026-08-12
> Research: `docs/research/2026-08-12--workflow-lane-slim-research.md`

## Background

SSY-1 hardened brainstorm Phase A, review↔verify handoff, and cleanup registry, but the user-facing chain remains heavy: one-question grill, Phase A/B ceremony, then separate `review` and `verify` lanes, plus host-named isolation tables (`codex exec`, per-host mechanism matrices).

This Spec supersedes:

- Method contract C6 wording that `verify` is the sole ready gate
- Decision D-002’s “one question per message” hard rule
- `docs/specs/2026-05-27--adversarial-review-skill.md` boundary that review must not declare ready
- Review isolation policy that lists host-specific CLI reviewers or per-host mechanism tables

## Goals

- Public workflow lanes: `harness-builder`, `brainstorm`, `plan`, `implement`, `diagnose`, `review`, `cleanup`
- `verify` remains installable as an **alias helper** that routes to `review`
- `review` is the sole ready gate: independent-subagent adversarial structure pass, then fresh-evidence mapping; ready only when no Critical finding and every success criterion is pass (unknown ≠ ready)
- Isolation mechanism in skill protocol: **independent read-only subagent only**; `packet_fallback` only for low-risk when subagent unavailable; mid/high risk without subagent cannot claim ready
- Skill / references / method-contract protocol text is **host-neutral** (no host product names or host-branch tables as execution paths)
- `brainstorm` uses Matt-style frontier rounds (multi-question per round with recommendations); drop Phase A/B ceremony; Spec still requires user approval before `plan`
- `harness-builder` only aligns routing (ready claims → `review`); no controller re-architecture

## Non-goals

- Do not remove `diagnose` or `cleanup`
- Do not add a ninth public workflow lane
- Do not keep external host-CLI reviewer compatibility paths in live skill protocol
- Do not rewrite historical plans/specs wholesale
- Do not install user-level MCP/hooks/global config

## Behavior Spec

### Happy path

1. Unclear work → `brainstorm` frontier grilling → shared understanding confirm → Spec draft → user approve → `plan`
2. Scoped work → `implement` (WIP=1) → `review`
3. `review`: assemble fact-only packet → spawn independent read-only subagent with adversarial reviewer prompt → consume findings → run evidence ladder / cold subagent when needed → emit combined REVIEW + VERIFICATION / ready verdict → `cleanup` on pass

### Edge cases

- Low-risk docs-only: subagent optional; packet_fallback allowed with recorded reason; ready still needs fresh evidence mapping for claimed criteria
- Mid/high-risk without subagent: BLOCK or CONDITIONAL; cannot ready
- Trigger words `verify` / “验证一下”: route into `review` evidence+ready path
- Capability gaps: record and route to `harness-builder`

## Chosen Approach

UX merge with internal phases (find → evidence → verdict). Keep `review` as the lane name; thin `verify` alias for continuity.

## Success Criteria

- [ ] Public lane set and docs/AGENTS/method contract agree on seven lanes + `verify` alias
- [ ] `skills/review/SKILL.md` owns adversarial subagent pass + evidence ladder + ready verdict
- [ ] Skill protocol has no host-named isolation branches; mechanism tokens are `subagent` | `packet_fallback`
- [ ] `skills/brainstorm/SKILL.md` uses frontier rounds; no Phase A/B or one-question hard rule
- [ ] Structure checks and skill-flow HTML regenerate cleanly
- [ ] Grep on changed `skills/**/SKILL.md` + related references shows no new host-product execution branches

## Verification Strategy

```bash
node scripts/check-plugin.mjs
node scripts/check-claude-code-install.mjs
node scripts/check-cursor-install.mjs
node scripts/install-cursor.mjs --target . --dry-run
node scripts/generate-skill-flow-html.mjs
# plus host-neutrality grep on changed skill protocol files
```

## Capability Gaps

None beyond existing local Node scripts and session subagent tools.

## Handoff to Plan / Implement

Active implementation follows this Spec directly (Executable Plan = approved Workflow Lane Slim plan). WIP=1 slices: (1) brainstorm rewrite, (2) review+verify merge + docs/contracts/checks, (3) harness-builder align + regen/verify.
