---
name: tdd
description: "Test-driven development discipline. Triggers: a behavior change calls for test-first, the user mentions red-green-refactor or integration tests (集成测试), or implement drives the test loop on pre-agreed seams."
---

# TDD (red → green)

Tests verify behavior on public interfaces, not implementation details; the implementation can be replaced wholesale without the tests having to follow. Consult this file before each loop starts, not after the fact.

## Seams: where tests go

A seam is a public boundary for observing behavior: an interface where behavior changes are visible without digging into internals. Tests live only on seams and are never written against internals.

**Test only on pre-agreed seams.** Before writing any test, write down the seams to be tested and confirm them with the user, or adopt the acceptance surface of an approved Spec/plan; write no tests on unconfirmed seams. How to ask: "What is the public interface? Which seams are worth testing?"

A good test reads like a specification ("user can checkout with valid cart") and survives refactoring. Good/bad contrasts are in `references/tests.md`; mock boundaries are in `references/mocking.md`.

## Loop rules

- **Red first, green second.** Write the failing test first, then just enough implementation to make it pass; do not pre-write future tests or add speculative features.
- **One slice at a time.** Each loop covers one seam, one test, one minimal piece of implementation; a vertical slice rather than laying things out horizontally — writing all the tests first and then all the implementations verifies only imagined behavior.
- **Refactoring is not part of the loop.** Structural convergence after the behavior is green is identified by review and tidied up separately once authorized; it is not mixed into the red-green loop.

## Anti-patterns

- **Implementation coupling**: mocking internal collaborators, testing private methods, verifying through a side door. Detection signal: the behavior did not change, yet the test went red after refactoring.
- **Tautology**: the assertion recomputes the expected value the same way the implementation does, passing by construction. Expected values must come from an independent source of truth: known-correct literals, precomputed examples, or the Spec.
- **Horizontal slicing**: see "One slice at a time".

When the environment has a `CONTEXT.md`, read it first to align on domain language, and obey the ADRs governing the area you are in.
