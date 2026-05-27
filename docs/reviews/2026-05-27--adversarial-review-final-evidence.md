# Adversarial Review Final Evidence

> Date: 2026-05-27
> Scope: `review` skill adversarial isolated reviewer protocol, reviewer prompt, Cursor rules, docs, generated HTML, and validation evidence.

## Reviewer Attempts

| Time / order | Mechanism | Command / agent | Result | Notes |
| --- | --- | --- | --- | --- |
| Initial | `codex_exec_review` | `codex exec review --ephemeral --uncommitted` | failed invocation, then completed review with findings | Inline prompt form failed because `--uncommitted` cannot be used with a prompt; no-prompt retry found generated HTML and fallback-field issues. |
| Initial | `subagent` | `multi_agent_v1.spawn_agent(agent_type=reviewer)` / `019e67fe-98c0-7ad1-9e79-679f6ac39162` | BLOCK | Found generated HTML and evidence issues. |
| Middle | `codex_exec_packet` | `codex exec --ephemeral --sandbox read-only -C /home/ssy/桌面/harness-workflow <review prompt>` | CONDITIONAL | Found `harness-builder.html` artifact extraction gap. |
| Middle | `subagent` | `019e6802-133a-7681-ae05-446837ed300b` | BLOCK | Found single-field reviewer schema could not express multi-hop fallback. |
| Middle | `subagent` | `019e6809-2553-71c0-8e0d-a229d32355c9` | BLOCK | Found prompt finding evidence weaker than skill contract and missing untracked-file requirement. |
| After evidence-form fix | `codex_exec_packet` | `019e6816-565a-7b62-a6dc-545760957168` | BLOCK | Found Cursor rule drift and missing final Phase 3 evidence. |
| After evidence-form fix | `subagent` | `019e6816-59d0-72b3-947e-c04addc839f4` | BLOCK | Confirmed Cursor rules, generated HTML, and review/verify boundary were okay; required Spec and durable Phase 3 evidence sync. |
| After Cursor rule fix | `codex_exec_packet` | `019e681c-a263-7bc2-b7ad-51ee4078a2f5` | PASS | No Critical or Important findings. Confirmed mirrors, untracked coverage, generated HTML, Cursor rules, and review/verify boundary. |
| After Cursor rule fix | `subagent` | `019e681c-a5b1-7463-820b-1d6f674d93d8` | BLOCK | Confirmed Cursor rules, HTML, and boundary were no longer blockers; required Spec sync and durable reviewer/evidence artifact. |
| After Spec/evidence fix | `codex_exec_packet` | `019e6822-72b3-7d63-baa1-ee1e94d558c5` | PASS | Prior blockers resolved: Spec includes untracked coverage and file/command/artifact evidence forms; evidence artifact exists; Cursor rules, mirrors, generated HTML, and review/verify boundary are ok. |
| After Spec/evidence fix | `subagent` | `019e6822-7617-7da2-a60f-c49b8fa61826` | BLOCK on evidence closure only | Confirmed Spec, Cursor rules, mirrors, generated HTML, and boundary are not blockers. Blocked only because this latest subagent result and Phase 3 status had not yet been written to repo-local evidence. |

## Final Fixes After Reviewer Feedback

- `docs/specs/2026-05-27--adversarial-review-skill.md` now requires `git status --short` / untracked file coverage and Critical / Important evidence as file:line, command, or artifact evidence.
- This evidence artifact records the final real `codex exec` packet reviewer and real subagent reviewer attempts in a repo-local, reviewable file.
- `docs/plans/2026-05-27--adversarial-review-skill-plan.md` is the phase/status surface for final verification mapping.

## Evidence-Only Closeout Boundary

The last behavior/protocol-affecting edits before final isolated review were:

- `skills/review/SKILL.md`
- `skills/review/references/adversarial-reviewer-prompt.md`
- `rules/review.mdc`
- `.cursor/rules/review.mdc`
- README / method contract / generated skill-flow and mirrors

After those edits:

- `codex_exec_packet` reviewer `019e6822-72b3-7d63-baa1-ee1e94d558c5` returned `REVIEW: PASS` with Critical none / Important none.
- Real subagent reviewer `019e6822-7617-7da2-a60f-c49b8fa61826` found no protocol, rule, mirror, generated HTML, or review/verify boundary blocker; its only Important finding was that this evidence closure had not yet been recorded.

The updates after those two final reviewers are evidence-only updates to this file and the plan status/evidence log. They do not change the reviewed runtime protocol or user-facing skill behavior.

## Current Verify Inputs

- Last behavior-affecting changes: `skills/review/SKILL.md`, `skills/review/references/adversarial-reviewer-prompt.md`, `rules/review.mdc`, `.cursor/rules/review.mdc`, README / method contract, generated HTML, and mirrors.
- Last evidence-only changes: this review evidence file and the plan/spec status/evidence updates.
- Required final verification commands:
  - `git status --short --untracked-files=all`
  - `node scripts/generate-skill-flow-html.mjs`
  - `node scripts/check-plugin.mjs`
  - `node scripts/check-claude-code-install.mjs`
  - `node scripts/check-cursor-install.mjs`
  - `node scripts/install-cursor.mjs --target . --dry-run`
