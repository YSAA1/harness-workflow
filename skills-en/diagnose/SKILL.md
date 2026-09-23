---
name: diagnose
description: "Investigate runtime, build, test, or performance failures whose root cause is unknown. Locate the cause via logs, reproduction, comparison, and falsifiable hypotheses; a known localized fix needs no full diagnostic process."
---

# Evidence-based diagnosis

Map the user-described failure onto the real environment, distinguishing symptoms, hypotheses, confirmed causes, and fix evidence. Do not pass off a fix by hiding errors, skipping tests, or widening fault tolerance.

## Process

1. Capture the relevant commands, cwd, environment, exit codes, logs, inputs, and recent changes; avoid printing credentials.
2. Reproduce when it can be done safely at reasonable cost; repeat only when stability needs to be judged. Expensive GPU, production, or destructive tasks are not re-run a fixed number of times just to satisfy a count.
3. When reproduction is hard, first propose hypotheses from existing logs, replays, source code, and configuration, and mark the uncertainty. Having no reproduction does not forbid investigation, but no fix may be claimed as verified on that basis.
4. Rank the evidence-backed candidates and use minimal checks to discriminate between causes. A single causal experiment keeps its variables attributable; independent read-only checks may run in parallel; no fixed number of hypotheses is enforced.
5. Once the evidence is sufficient, make the minimal fix within the authorized scope and verify the original symptom and the affected paths. Do not fold adjacent unrelated failures into the same root cause.
6. Continue while information gain keeps coming and the budget holds. When there is no new evidence, external access is needed, or cost exceeds the authorization, state the specific gap; do not automatically declare a block after a fixed three rounds.

## Completion and output

Report the failure, the key hypotheses supported/ruled out, the root cause or open items, the changes, and the verification. A read-only diagnosis may deliver a bounded conclusion without being forced to fix code. Mid-investigation, write key dead ends, ruled-out hypotheses, and recovery commands into this track's state Evidence rows (do not write other tracks' files; the absence of a row for this track does not imply creating one — deliver them with this report), without waiting for the close; after a long investigation, re-read the task entry to prevent drift. Root causes worth reusing are promoted, in lessons format, to the project recovery surface's lessons; when the project is a harness backend and the lessons file does not exist, create it on the first write.

For workbench-level problems, see `references/harness-layer-patterns.md`; do not install new tools or rebuild the harness because a single command failed.

## Recommended next skill

- Cause identified but changes needed: `implement`; the fix is complex or the user requests a review: `review`.
- Simple fix verified, or read-only diagnosis delivered: stop.
- Only when a real gap requires changing the workbench: `harness-builder`; return to `plan` only when the goal changes.
