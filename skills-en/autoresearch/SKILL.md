---
name: autoresearch
description: "Research-loop controller: the user assigns a goal or open question (the approach may be completely unknown) and this skill runs it independently as a repeated research -> hands-on -> adversarial review -> distill loop — investigate, run experiments, attack your own conclusions, distill; check completion criteria and, if not met, re-open by exclusion until one of five honest terminal states (answered/inconclusive/blocked/budget-exhausted/cancelled). Triggers: autoresearch, 自动研究, 研究循环, research loop, hypothesis loop."
---

# AutoResearch Research Loop

The user assigns a goal or question — an unknown approach is fine. This skill runs it independently: each round is "research -> hands-on -> review -> distill", checked against the completion criteria; not done yet means another round via the exclusion three questions. One-sentence entry, zero-interruption loop; the difference from deep research is that **hands-on work is a first-class citizen** — running experiments, writing measurement scripts and changing code to test hypotheses are all normal evidence gathering. Code changes go through `implement` (an independent experiment subtask that never touches the main research track); `ship` is never invoked inside a round (closeout is handled uniformly by this skill).

## Entry points

- `autoresearch <goal/question>` (materials optional): register the track and start immediately.
- `autoresearch <research-log path>`: the goal already sits in the log header; resume directly. On re-entry, search existing logs under `docs/research/` first.

## Kickoff scan (planner)

1. State the need as one deliverable goal (quote the user's verbatim words; any inference beyond them must be marked as such) and start the log (default `docs/research/YYYY-MM-DD--<topic>.md`; follow the project's research/notes conventions when present). The header background section = one-sentence goal + scope boundaries + completion criteria + known facts and candidate explanations — **fixed for the whole run**, guarding against scope swap and drift. The log is the track (self-registered Track header): with a recovery surface, `plan` registers the row; without one, do not force `.harness/`; with no lessons surface, distilled entries land in a final section of the log.
2. Run the scan in parallel: read lessons and existing logs; general web search plus platform channels (when a platform-reading router such as agent-reach is installed, the evidence surface expands automatically — follow that skill's own protocol, e.g. doctor checks; otherwise degrade to general web search + direct primary-source reading). Candidate explanations = the competing hypotheses later rounds must distinguish.

## The loop (four segments per round)

1. **Research**: write the hypothesis package into the log — falsifiable hypothesis, prediction (sufficient to distinguish this round's competing explanations; never widens or swaps the user's scope), verification method, success criteria. **No approval wait** — the guardrails are the fixed background section + the authorization boundary + mandatory review.
2. **Hands-on** (evidence execution with parallel fan-out: independent tasks within a round dispatch to background agents/subagents in parallel; the main session holds only hypotheses and adjudication; serialize only on real dependencies):
   - Read-only: primary sources first (official docs, source, spec, first-party APIs); delegated results are always claims — re-verify source and acquisition time in the main session before logging; platform social content (X/Reddit/podcast transcripts etc.) is a lead, not a verdict — final determinations trace back to primary sources; key conclusions cross-check at least two independent primary sources, and a single-source conclusion must be marked as such.
   - Hands-on: local reversible experiments just run — benchmarks, measurement scripts, code changes made to verify a hypothesis (via `implement`, as an independent subtask that never touches the main track); a pure-reading round records "no hands-on needed this round".
3. **Review**: the `review` protocol plus independent attack (lenses in `references/adversarial-lenses.md`), with **the re-open proposal itself listed among the mandatory objects of review**. A degraded self-review must record the concrete attacks and counterexample attempts, and the output is labeled independent / self.
4. **Distill**: record one section in the log (hypothesis -> prediction and observation -> adversarial verdict -> conclusion); lessons take only non-obvious experience with trigger conditions — "nothing new" is a legitimate finding and is recorded as such.

## Control and stopping

- **Completion check**: after each round's distillation, check against the background section's completion criteria — covered with sufficient evidence -> `answered` (the only terminal state that may be called done); otherwise pass the three questions to decide on another round or an honest stop.
- **Re-open three questions** (delivered under adversarial review): what did this round exclude (with evidence)? which explanations remain undistinguished? how does the next round distinguish them? The goal and scope never change (the background section is fixed); uncovered original requirements must not be downgraded into "deferred items" — report a partial answer, or continue within the remaining budget; only adjacent new questions pointing in a different direction become "deferred items", and questions the user explicitly adds open their own tracks.
- **Authorization boundary (the only pause point)**: read-only work, searches, and local reversible experiments within the research scope need no approval; spending money, external writes, and irreversible or production-impacting actions — stop and ask. Per-round confirmation is a trigger-word option (the user saying "show me every round" enables it); an explicit full-authority declaration waives all pauses.
- **Budget**: default 3 rounds x 1 costly experiment per round (searches and reading do not count), user-adjustable; exhausted -> `budget-exhausted`.
- **Five terminal states**: `answered` / `inconclusive` (insufficient evidence; report honestly what could not be concluded) / `blocked` (an external dependency is unobtainable) / `budget-exhausted` / `cancelled` (the user called it off).

## Terminal state and delivery

After convergence or stopping, **finish writing the terminal state and conclusion first**, then run `cleanup`. The conclusion section leads with the answer and carries per-claim evidence links — a reader takes the answer away from that section alone. The research log is a deliverable and is never deleted by the retirement four steps; in an environment without git, keep the log and record the terminal state.

## Recommended next skill

- Closeout: `cleanup`; unknown root cause during hands-on work: `diagnose`.
- The goal itself is a user design trade-off that blocks progress: `brainstorm` (this skill ends after the hand-off).
- Repo-wide reconciliation once research artifacts pile up: `sweep`.
