# Feedback-loop construction menu

> Used by `diagnose` step 2. Ideas adapted from [mattpocock/skills](https://github.com/mattpocock/skills) `diagnosing-bugs` (MIT), revision `b0618bc` (2026-10-08).

Build the right loop and the failure is 90% fixed. Try roughly in this order:

1. **Failing test** at whatever seam reaches the failure: unit, integration, e2e.
2. **curl / HTTP script** against a running dev server.
3. **CLI invocation + snapshot diff**: a fixture input, stdout diffed against a known-good snapshot.
4. **Headless browser script** (Playwright / Puppeteer): drive the UI, assert on DOM, console, network.
5. **Replay a captured trace**: save a real request/payload/event log to disk and replay it through the failing code path in isolation.
6. **Throwaway harness**: spin up a minimal subset of the system (one service, mocked deps) that reaches the failing path with a single function call.
7. **Property / fuzz loop**: when the failure is "sometimes wrong output", run a thousand random inputs and look for the failure mode.
8. **Bisection harness**: when the failure appeared between two known states (commit, dataset, version), automate "boot at state X, check" and `git bisect run` it.
9. **Differential loop**: run the same input through old vs new version (or two configs) and diff outputs.
10. **Human-in-the-loop script (last resort)**: when a human must click, have a script prompt them step by step and collect the output, so the loop stays structured and its output flows back to the agent.

## Tighten the loop

- Faster: cache setup, skip unrelated init, narrow the test scope.
- Sharper signal: assert on the specific symptom, not "didn't crash".
- More deterministic: pin time, seed RNG, isolate the filesystem, freeze the network.

A 30-second flaky loop is barely better than none; a 2-second deterministic one is a debugging superpower.

## Intermittent failures

The goal is not a clean repro but a **higher reproduction rate**: loop the trigger 100×, parallelise, add stress, narrow timing windows, inject sleeps. A 50% rate is debuggable, 1% is not; keep raising the rate until it is.
