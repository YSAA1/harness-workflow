---
name: diagnose
description: "Investigate runtime, build, test, or performance failures whose root cause is unknown. First build a feedback loop that goes red on this failure, then locate the cause via reproduction, falsifiable hypotheses, and targeted instrumentation; a known localized fix needs no full diagnostic process."
---

# Evidence-based diagnosis

Map the user-described failure onto the real environment, distinguishing symptoms, hypotheses, confirmed causes, and fix evidence. Do not pass off a fix by hiding errors, skipping tests, or widening fault tolerance. Skip a phase only with an explicit reason.

## Process

1. **Capture the scene and redact**: capture the relevant commands, cwd, environment, exit codes, logs, inputs, and recent changes. Before showing anything, write secrets as `<REDACTED>`; credentials used by the loop travel through environment variables, never through what you show; quote only the lines of captured artifacts that carry the signal.
2. **Build a feedback loop first (gate)**: before proposing any root-cause hypothesis, have **one command** (a test invocation, a script path, a curl, ...) that you have **already run at least once** (show the invocation and its redacted output), and that is:
   - **Red-capable**: it drives the real failure path and asserts the user's **original symptom**, going green once fixed. "Ran without erroring" does not count;
   - **Deterministic**: the same verdict every run; for intermittent failures aim for a **higher reproduction rate** (loop the trigger, parallelise, add stress, narrow timing windows), not a clean repro;
   - **Fast**: seconds, not minutes;
   - **Agent-runnable unattended**: when a human must take part, drive them with a structured script whose output flows back.
   Once you have a loop, treat it as a product: faster, sharper signal, more deterministic. The menu of ways to build one is in `references/feedback-loops.md`. If you catch yourself reading code to build a theory before the loop exists, stop: that is exactly the failure this gate prevents.
   **Exemption**: when expensive GPU, production, destructive, or external environments genuinely cannot yield a loop, state the means you tried and the gap (environment access, a redacted captured artifact such as logs/HAR/core dump, permission for temporary instrumentation) and ask the user for it; you may keep reasoning from existing logs, source, and configuration, but every conclusion is labelled "unverified hypothesis" and no fix may be claimed as verified. Expensive tasks are not re-run just to satisfy a count.
3. **Reproduce and minimise**: run the loop and watch it go red; confirm it is the symptom the user described, not a nearby failure (wrong bug = wrong fix). Then cut inputs, callers, config, data, and steps one at a time, re-running after each cut, until every remaining element is load-bearing (removing any one turns it green).
4. **Rank falsifiable hypotheses**: before testing, list several candidates and rank them, rather than anchoring on the first plausible idea; no fixed count is enforced. Each states its prediction: "If X is the cause, then changing Y makes the failure disappear / changing Z makes it worse"; one with no statable prediction is a vibe: discard or sharpen it. Show the ranked list to the user (they often hold domain knowledge that re-ranks it instantly), but do not block on it.
5. **Targeted instrumentation**: each probe maps to one prediction, changing one variable at a time; independent read-only checks may run in parallel. Prefer a debugger/REPL, then logs at the boundaries that discriminate hypotheses; never "log everything and grep". Tag every debug log with a unique prefix (e.g. `[DEBUG-a4f2]`) so cleanup is a single grep. For performance, establish a baseline measurement and then bisect: measure first, fix second.
6. **Fix and regression test**: at a **correct seam** (where the test reproduces the failure as it really occurs at the call site), turn the minimised repro into a failing test → watch it go red (if you forced the red by mutating code or a fixture, diff against a pristine copy to prove the mutation landed before trusting it) → make the minimal fix within the authorized scope → watch it go green → re-run the step-2 loop against the original, un-minimised scenario. When only a too-shallow seam exists, do not force a regression test there (false confidence): **the absence of a correct seam is itself a finding**; record it in the report as an environment-improvement candidate for `cleanup`. Do not fold adjacent unrelated failures into the same root cause.
7. Continue while information gain keeps coming and the budget holds. When there is no new evidence, external access is needed, or cost exceeds the authorization, state the specific gap; do not automatically declare a block after a fixed three rounds.

## Completion and output

Before declaring done, check: the original loop no longer reproduces; the regression test passes (or the missing correct seam is recorded); zero `[DEBUG-` prefixes remain; throwaway prototypes are deleted or moved to a clearly marked debug location; the confirmed hypothesis is stated in the commit message so the next debugger learns.

Report the failure, the feedback-loop command, the key hypotheses supported/ruled out, the root cause or open items, the changes, and the verification. A read-only diagnosis may deliver a bounded conclusion without being forced to fix code. Mid-investigation, write the loop command, key dead ends, ruled-out hypotheses, and recovery commands into this track's state Evidence rows (do not write other tracks' files; the absence of a row for this track does not imply creating one — deliver them with this report), without waiting for the close; after a long investigation, re-read the task entry to prevent drift. Root causes worth reusing are promoted, in lessons format, to the project recovery surface's lessons; when the project is a harness backend and the lessons file does not exist, create it on the first write.

For workbench-level problems, see `references/harness-layer-patterns.md`; do not install new tools or rebuild the harness because a single command failed.

## Recommended next skill

- Cause identified but changes needed: `implement`; the fix is complex or the user requests a review: `review`.
- Simple fix verified, or read-only diagnosis delivered: stop; when a missing correct seam or a hard-to-build loop exposes a workbench gap, hand it to `cleanup` at close as an environment-improvement candidate.
- Only when a real gap requires changing the workbench: `harness-builder`; return to `plan` only when the goal changes.
