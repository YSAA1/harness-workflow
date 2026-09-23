---
name: autoresearch
description: "Research loop orchestrator: runs an open question as a bounded multi-round hypothesis-verification loop — establish an approved package → gather evidence → adversarial verification → distill into lessons → reopen by exclusion or stop honestly (answered/inconclusive/blocked/budget-exhausted/cancelled). Budget and authorization tiers are adjustable. Triggers: autoresearch, research loop, hypothesis loop (自动研究, 研究循环)."
---

# AutoResearch Research Loop

Advance an open question round by round: each round poses one falsifiable hypothesis, then gathers evidence, attacks it, and distills; progress comes by exclusion, bounds come from the budget, and stopping must be honest. The orchestrator is responsible for round scheduling, authorization tiers, budget, and stop decisions; evidence gathering (reading, searching, running experiments) is executed directly by this skill — `implement` is invoked only when code changes are needed, and `ship` is never invoked inside a round (closing out is handled uniformly by this skill).

## Dependencies and degradation

When companion skills (`plan`/`implement`/`review`/`cleanup`) or the recovery surface are missing, self-check and self-close in the spirit of their protocols: without a recovery surface, the single log file is itself the track and `.harness/` is not force-created — default path `docs/research/YYYY-MM-DD--<topic>.md` (follow the project's research/notes conventions if present); the Track line in the log header self-registers the track, and on re-entering this skill first search existing logs under `docs/research/`; without a lessons surface, distilled entries are recorded in a final section of the log. Hand off to `brainstorm` only when the research question itself is a user design trade-off that blocks further progress; once handed off, this skill ends.

## Authorization tiers

| Tier | Rule |
| --- | --- |
| `default` | The first round's approved package must be approved by the user; subsequent rounds are released automatically |
| `strict` | Every round's approved package requires user approval |
| `full authority` | Approval waived after the user explicitly declares it; approved packages are still persisted to the log for the record |

Tiers govern only round confirmation; they do not expand tool, external-write, or spending authorization — permitted actions, data scope, and budget go into the first approved package, and when later methods exceed that scope, stop and request additional authorization. For rounds that require approval: after the approved package is written, pause and wait for the user's exact words (the exact words are filled back into the log) before evidence gathering starts; from then on the approved package only accepts appended revisions, with before/after differences preserved.

## Budget

Defaults: 3 rounds, 1 costly experiment per round, adjustable by the user. Substantive changes to the hypothesis, predictions, or method, and reruns of costly experiments all count against the budget; in-round patching re-verifies only the affected parts.

## Loop

Before the first round: read lessons and existing logs; if a recovery surface exists, `plan` establishes the track (a work_index row + the log). Each round has four segments:

1. **Establish the approved package**: write it into the log — the falsifiable hypothesis, predictions (sufficient to distinguish this round's competing explanations, neither expanding nor swapping the user's scope), verification method, success criteria, permitted actions, and budget. Done when: every item in the package is present and it is approved per the tier.
2. **Gather evidence**: execute reading/searching/experiments directly; route code changes through `implement` (experiment subtasks stay independent and do not touch the main research track); when the environment has read-only delegation capabilities such as subagents or cli-delegate, bulk reading/searching may be delegated to run in the background while the main loop holds only the hypothesis and the verdict — delegated results are still claims, and key observations are persisted to the log only after their sources and acquisition times have been checked back in the main session. Done when: observations land in the log together with their sources and acquisition times.
3. **Adversarial verification**: `review` protocol + independent attack (lenses in `references/adversarial-lenses.md`), with **the reopen proposal itself listed among the mandatory objects of review**. A degraded self-review must still record the concrete attacks and counterexample attempts, and the output is labeled independent / self. Done when: every key conclusion carries its attack record and an independent/self label.
4. **Distill**: record one section in the log (hypothesis → predictions and observations → adversarial verdict → conclusion); lessons only take non-obvious experience with trigger conditions, and "no additions" is a legitimate conclusion and is recorded as such. Done when: the log section is complete.

## Stop states (enterable at the end of any round)

`answered` (the original question is covered and the evidence is sufficient — the only terminal state that may be called research-complete) / `inconclusive` (evidence is insufficient; report honestly the conclusions that could not be reached) / `blocked` (an external dependency is unobtainable) / `budget-exhausted` (the budget is spent) / `cancelled` (the user called it off).

**Reopening** the next round must, under adversarial review, deliver the three exclusion questions: what this round excluded (with evidence), the remaining explanations not yet resolved, and how the next experiment distinguishes them — the original question and scope stay unchanged (the background section is fixed). Downgrading uncovered original requirements into "deferred items" is forbidden: only a partial answer may be reported, or work continues within the remaining budget; only adjacent new questions that point in a different direction than the original question are recorded as "deferred items", and questions the user explicitly adds start a separate track.

After convergence or stopping, **finish writing the terminal state and conclusions first**, then close out via `cleanup`; the research log is a deliverable and is not deleted by the four retirement steps (retirement only handles temporary plans and scratch; in an environment without git, keep the log and record the terminal state).

## Recommended next skill

- Close out: `cleanup`; unknown root cause during evidence gathering: `diagnose`.
- Repo-wide reconciliation once research artifacts pile up: `sweep`.
