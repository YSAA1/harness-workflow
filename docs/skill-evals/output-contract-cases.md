# Skill Output Contract Eval Cases

Each active skill must expose a stable output contract with the fields below.
The exact prose may vary, but the field names should remain present so handoff,
review, and verification can recover the result.

| Skill | Expected status prefix | Required fields |
| --- | --- | --- |
| `brainstorm` | `BRAINSTORM:` | Primary artifact; Scope; Coverage; Verification strategy; User checkpoint; Recovery surface updated; Next |
| `plan` | `PLAN:` | Planning surface; Artifact; Spec source; Active slice; Non-goals; Success criteria; Verification path status; Required capabilities; Capability gaps; Fallback evidence; Commit units; Final integration claim; Recovery surface updated; Next skill |
| `harness-builder` | `HARNESS:` | Objective; Evidence summary; Existing harness reconciliation; Harness charter; Coverage matrix; Capability shortlist; Recovery surface; Verification design; User checkpoint; Ready claim; Next |
| `implement` | `IMPLEMENT:` | Active slice; This step; Risk tier; Evidence; Ready claim; Docs synced; Recovery surface updated; Files changed; Commit unit; Next |
| `diagnose` | `DIAGNOSE:` | Failure command; Reproduction; Hypotheses tried; Root cause; Evidence; Fix; Verification; Risks / residual; Recovery surface updated; Next |
| `review` | `REVIEW:` | Scope; Findings; Open Questions / Residual Risks; Assessment; Evidence routing; Commit eligibility; Ready claim; Recovery surface updated; Next |
| `verify` | `VERIFY:` | Claim; Evidence run; Success criteria mapping; Skipped high-value checks; Capability gaps; Commit gate; Recovery surface updated; Ready; Next |
| `cleanup` | `CLEANUP:` | Ready claim source; Evidence; Knowledge cleanup; Entropy cleanup; Git state; Recovery surface updated; Next |
| `find-skills` | `FIND-SKILLS:` | Task gap; Searches run; Candidates; Recommendation; Adoption surface; Risks / fallback; Install action; Recovery surface updated; Next |
