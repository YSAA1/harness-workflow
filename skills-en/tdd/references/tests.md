# Good tests and bad tests

Good tests: integration style, driven through the real public interface; one logical assertion per test; expected values from independent sources (known-correct literals, precomputed examples, the Spec).

Bad test = implementation-detail test:

- Mocking internal collaborators, testing private methods, asserting call counts or call order.
- Detection signal: the behavior did not change, yet the test broke after refactoring.
- Bypassing the interface to verify through a side door (BAD: calling an internal function directly and comparing structure; GOOD: going through the public entry point and asserting observable results).

Tautology:

- BAD: `expect(add(a, b)).toBe(a + b)` — the expected value is recomputed the same way the implementation does, passing by construction.
- GOOD: `expect(add(2, 3)).toBe(5)` — the expected value is an independent literal.
