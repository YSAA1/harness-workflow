# Evidence ladder
Verification centers on concrete claims. Parseable structure, source-level contracts, unit/integration checks, real runs, and behavior replay each prove different levels and cannot stand in for one another.
Documentation: verify paths, command semantics, and diffs; configuration: parse it plus the relevant actual entry points; behavior changes: cover the affected paths and key negative boundaries; cross-module or user journeys: add the relevant integration/end-to-end verification.
There is no universal build + typecheck + unit + E2E must-run combination across languages. Choose checks that distinguish success from failure and follow the project's explicit acceptance contract.
fresh evidence means real output that applies to the current relevant code, environment, configuration, and inputs. Preserve the appropriate sources; subsequent unrelated changes or commits do not automatically invalidate the evidence.
Re-run only when relevant changes, environment changes, the original failure, or uncovered risks appear; switching skills does not require repeating tests.
Mark required acceptance as pass / fail / unknown; when the environment is missing you may deliver the verified portions, but you must not claim full ready, nor lower the acceptance criteria without consent.
Verbal assertions and implementer paraphrase do not constitute evidence; ready is based only on the actual output of runnable checks.
Tests and acceptance scripts are not thresholds to be satisfied by deleting or modifying them: a genuine need to change them is an acceptance-contract change and requires the user's consent first.
Weakening the verification surface without the user's consent (checks deleted or skipped, coverage thresholds relaxed, exemptions added to a workflow) is treated as a hard stop — restore it before discussing conclusions.
Non-trivial logic changes should come with a regression test that would have failed on the old code, as evidence of complete understanding.
