# Verification intensity
Choose verification by the affected behavior and the consequences of failure, not by file count, fixed coverage, or the skill's name.
Low-risk documentation/config: diff, paths, parsing, and applicable entries; bugfix: a reproduction/regression that can capture the original symptom; interface/data/permission changes: the relevant contracts, integration, and negative boundaries; user journeys: applicable smoke/E2E.
Documentation is not forced to have a failing test written first; even at high risk, do not blindly apply the all-language build/typecheck combination.
Reuse actual evidence that still applies; re-run only on related changes, failures, environment changes, or uncovered risk. When a necessary check cannot run, report the gap and the verified scope, and do not lower the original acceptance.
