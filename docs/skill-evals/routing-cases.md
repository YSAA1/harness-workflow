# Skill Routing Eval Cases

These cases protect the lane-selection contract in `docs/skill-routing.md`.
They are not model-output golden files; they are routing expectations that must
stay aligned with the active workflow skills.

Run:

```bash
node scripts/check-skills-routing.mjs
```

| ID | Situation | Expected skill | Not expected | Rationale |
| --- | --- | --- | --- | --- |
| R001 | User has a fuzzy product idea and no success criteria. | `brainstorm` | `plan`, `implement` | Requirements need a Spec before execution. |
| R002 | A Spec is approved but no executable work order exists. | `plan` | `brainstorm`, `implement` | Planning owns active slice and verification path. |
| R003 | A clear multi-file task needs phases and commit units. | `plan` | `implement` | Non-trivial work needs an Executable Plan first. |
| R004 | Repo lacks a verification entry and recovery surface. | `harness-builder` | `implement` | Project workbench gap blocks reliable work. |
| R005 | User asks to bootstrap AGENTS, protected paths, and checks. | `harness-builder` | `brainstorm` | This is explicit project harness work. |
| R006 | One active slice is scoped and verification entry is known. | `implement` | `plan`, `verify` | Implementation owns file changes for a clear slice. |
| R007 | A tiny docs typo has an obvious local check. | `implement` | `plan`, `harness-builder` | Direct small fix does not need planning ceremony. |
| R008 | A test is failing and the root cause is unknown. | `diagnose` | `implement` | Unknown failure needs reproduce and hypothesis loop. |
| R009 | Root cause is proven and the fix is a small code change. | `implement` | `diagnose` | Diagnosis is done; implementation owns the patch. |
| R010 | A stable diff needs scope, correctness, docs, and risk judgment. | `review` | `verify` | Review judges structure before ready proof. |
| R011 | User asks "this is done, right?" after a change. | `verify` | `review`, `cleanup` | Ready claim needs fresh evidence. |
| R012 | User asks for final smoke or E2E proof. | `verify` | `implement` | Proof, not editing, is the current lane. |
| R013 | Verify passed and docs/generated artifacts need closure. | `cleanup` | `implement` | Cleanup owns knowledge freshness after proof. |
| R014 | User asks to synchronize handoff notes and remove task residue. | `cleanup` | `review` | Closure hygiene is not structural review. |
| R015 | User asks "is there a reusable skill for PR review?" | `find-skills` | `harness-builder` | Discovery helper can search candidates. |
| R016 | A discovered skill should become project-local policy. | `harness-builder` | `find-skills` | Adoption is a project workbench decision. |
| R017 | User explicitly asks for a Research Route harness with clear hypothesis and metric. | `harness-builder` | `implement` | Research Route is project harness setup. |
| R018 | The same command fails with changing output across runs. | `diagnose` | `implement`, `verify` | Flaky or unstable failure is a diagnosis problem. |
| R019 | Verification is blocked by missing browser runner or service. | `harness-builder` | `verify` | Capability gap must be repaired or accepted as fallback. |
| R020 | Review passes but the evidence is stale after later edits. | `verify` | `cleanup` | Stale proof cannot close work. |
| R021 | Cleanup finds a missing user-visible behavior. | `implement` | `cleanup` | Behavior changes route out of cleanup. |
| R022 | Plan is only for release readiness proof, not more code. | `verify` | `implement` | Proof-only plan routes to verification. |
| R023 | User asks whether the approach is worthwhile. | `brainstorm` | `plan` | Open tradeoffs belong to Spec discussion. |
| R024 | Existing plan is stale: active slice and next step no longer match reality. | `plan` | `implement` | Plan owns execution contract repair. |
