# Adversarial verification lenses

Adversarial independence discipline: the attacker is separated from the author — a fresh context (subagent or new session), with access to the same evidence (reading the same set of files and command outputs), read-only. The same agent re-reading its own output in a different tone is self-confirmation (generator/evaluator not separated). When a host without subagents degrades to self-review: the concrete attacks and at least one counterexample attempt must still be recorded, and the output explicitly labeled self — the degradation label does not replace the attack record, and self is not called independent verification. When the user needs to open a separate session to review, the minimal handoff package = original question, approved package, evidence locations, claim under review.

Objects of attack: this round's **approved package, observations, conclusions, and reopen proposal**. Three complementary lenses; pick one to three based on that round's risk:

## Red team (default)

Hunt exclusively for defects: criterion ambiguity, broken evidence chains, counterexample scenarios, and whether the reopen proposal's three exclusion questions actually hold. Findings are ranked Critical/Important/Minor (blocking levels follow the review definitions: Critical and blocking Important); each finding = the problem + one concrete scenario + a revision suggestion.

## Devil's advocate (proposal level)

Assume the proposal is wrong: is it over-engineered, which layer could be cut while still solving the main problem, what is the cheaper alternative, and which revision suggestions should actually be rejected. Final verdict: approve / approve after revision / start over.

## Third-party user perspective (delivery surface)

Play a third party who installs it and uses it right away: in a project with an empty AGENTS.md, no scripts, no CI, and possibly missing companion skills, ask of each capability "how does it reach my hands"; check whether documented promises match the actual delivery.

## Verdict rules

- Unresolved blocking findings = that conclusion is recorded as "unconfirmed" and must not serve as a premise for the next round's hypothesis.
- Errors found by the attack go back to `implement` to be fixed, then re-verify only the affected parts (counted against the budget); fixes take priority over opening a new round.
