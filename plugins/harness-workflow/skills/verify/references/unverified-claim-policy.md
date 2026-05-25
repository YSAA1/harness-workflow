# Unverified Claim Policy

Use this reference when deciding whether a ready claim can pass, what to do with unknowns, and how commit eligibility interacts with verification.

## Fresh Evidence

Evidence is fresh only when it is:

- after the latest relevant change
- run or inspected in the current target cwd/environment
- tied to the stated success criterion
- explicit about pass, fail, or unknown

Old logs, prior CI, or memory are not ready proof unless the latest change cannot affect the checked behavior and that reasoning is stated.

## Unknowns

Unknowns are allowed in the report, but they block ready unless the user explicitly accepts the residual risk and the claim is narrowed.

Common unknowns:

- skipped E2E or smoke check
- unavailable external service
- missing browser runner
- manual-only behavior with no current observation
- success criterion that is not falsifiable

## Capability Gaps

When verification capability is missing, write:

- **Value**: risk the capability would cover
- **Enablement**: how the user or project would enable it
- **Risk / cost**: setup overhead, flake risk, security implications
- **Fallback**: what can be done now without installing it

`verify` does not install capabilities. Project-level adoption routes to `harness-builder`.

## Commit Eligibility

When an Executable Plan defines a commit unit and the current slice belongs to it:

- verify PASS plus review PASS/CONDITIONAL with no Critical finding -> `eligible`
- verify PASS but review is missing or has Critical finding -> `not eligible`
- no commit unit exists -> `no commit unit`

Commit eligibility is not the same as ready. It only answers whether a verified milestone can be committed.

## Anti-Patterns

- Counting old commands as proof.
- Running broad checks without mapping to success criteria.
- Skipping high-value checks silently.
- Fixing during verification.
- Claiming ready with unknowns.
- Verifying a local slice while ignoring `final_integration_claim`.
