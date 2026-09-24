# Skill Guide

A plain-language walkthrough for users: what problem each of the 17 skills solves, when to use it, the flow it walks you through, and what you get at the end. You do not need to read the protocols to use them day to day; the authoritative protocol for each skill is `skills/<name>/SKILL.md` (the English tree `skills-en/` mirrors it).

For installation see the [install guide](install.md) (Chinese); for the full method see the [C1–C10 method contract](harness-method-contract.md).

## Why these skills exist

Coding agents today are smart, but smart is not the same as reliable. Without rules, an agent fails in three familiar ways:

1. **It forgets.** Once a session gets long or breaks, everything settled and verified earlier evaporates — the next session starts from zero.
2. **It reports "done" prematurely.** "Completed ✅" comes easily, but when you run it the tests fail, the docs were never updated, and acceptance was never actually checked.
3. **It leaves debris.** Work finishes without closeout — stale docs, scratch scripts, unreferenced plan files pile up until nobody, including the repo itself, understands it months later.

These skills give the agent working rules: **a clear entry (discuss before building), durable state (resume after interruption), real verification (done means evidence), clean closeout (finish without leaving debris)**. Each skill owns one job, triggers on demand, and none of them is a mandatory pipeline you must walk end to end.

## Three terms worth knowing first

| Term | In plain words |
| --- | --- |
| **Spec** | A requirements document stating "what we build, what we don't, what counts as success, and how it is verified". Code starts only after you approve it — so the agent cannot run three streets in the wrong direction. |
| **Recovery surface** | The save system for tasks. `work_index.md` is the task list (one row per task); `state.md` is the current checkpoint (where we are, the evidence, the next step). If a session dies, the next one reads these files and continues — you don't re-explain anything. Not every task needs one: small tasks stay zero-file, and `plan` creates the minimal surface automatically when a task truly spans sessions. |
| **Fresh evidence** | Verification output that actually ran just now (command output, test results) — not "I remember it passed earlier". Old evidence is reusable while the related code is unchanged; once it changes, it must be re-run. Completion claims accept only this. |

## Four skill families, each with its own job

| Family | Count | One-line role | Members |
| --- | --- | --- | --- |
| Lanes (workflow) | 9 | The main roads of daily work, one segment each | brainstorm, plan, implement, diagnose, review, ship, cleanup, autoresearch, harness-builder |
| Helpers | 3 | Staff officers filling gaps for the lanes | find-skills, capability-recommender, writing-for-agents |
| Discipline | 1 | Testing discipline during implementation | tdd |
| Tools | 4 | Standalone tools triggered on demand | remove-deadcode-py, sweep, research, handoff |

---

## Lane skills: the main roads of daily work

### brainstorm — turn a fuzzy idea into a clear one

**The problem it solves**: you want a feature but have only said half a sentence. Let the agent start coding immediately and it will likely build in the wrong direction based on its own imagination — rework costs more than starting over.

**What you say**: "I want to add a comments feature — let's discuss it before touching code", "This requirement is fuzzy, grill it first".

**The flow it walks you through**:

1. **Frontier grill**: it lists every unresolved material question for you in one numbered batch — each with a recommended answer and the design branch it belongs to (design-sensitive ones add a concrete stress scenario), so you answer by number instead of composing essays. Questions cover goal, scope, trade-offs, success criteria and verification; code and docs it can look up itself, so what it asks you are only the decisions only you can make. What is already settled is not re-asked, and "industry convention" never decides for you.
2. **Spec drafting**: when the questions hit zero, you first get a one-line eight-branch reconciliation (answered / waived / repo-backed), so any branch skipped over is visible on the spot; then it drafts a Spec for your review. Short needs where you already stated goal, boundaries and done-criteria take the lightweight Thin Spec — one round of questions, not a thesis defense; otherwise the full framework runs, and it never silently assumes "already thought through".
3. **Await approval**: only your explicit "approved" hands over to `plan`. Silence does not count as approval; it will not proceed on its own.

**What you get**: `docs/specs/date--topic.md`, a requirements document, plus the certainty that the direction is right.

**How it cooperates**: after approval it feeds `plan`; if the discussion exposes a missing workbench (no entry file at all, say), it offers `harness-builder`. One tip: don't spend the session answering "agreed, agreed, agreed" — what comes out tracks the quality of your answers, so say so when a question misses the mark.

**Tip**: if the need is already fully thought through, or it is a tiny patch, skip brainstorm and get to work — it will say so itself.

> Protocol: [`skills/brainstorm/SKILL.md`](../skills-en/brainstorm/SKILL.md)

### plan — turn an agreed goal into an executable plan

**The problem it solves**: the task has multiple steps with dependencies, or cannot finish in one session. Without a plan the agent loses sight of the overall goal halfway, or treats "each step passed" as "the whole thing works".

**What you say**: "Plan this against the Spec", "This task is big — plan it before starting".

**The flow it walks you through**:

1. Distills goal, scope and acceptance from materials you already have (request, approved Spec, issues) — it never asks you to write another requirements layer.
2. Writes the plan: goal, scope, checkbox work items, per-item verification, dependencies — and for multi-stage tasks a **final overall acceptance criterion** (guarding against "every step passed but the whole is incoherent").
3. If the task truly spans sessions and the project has no save system yet, it automatically creates the **minimal recovery surface** (one task index + one checkpoint file, plus a one-line pointer in the project entry) — automatic; you never have to decide in advance.
4. Plan-only requests end at delivery. Already-authorized work continues straight into execution.

**What you get**: `docs/plans/date--topic-plan.md` (or a plan in whatever tracker the project already uses), plus the recovery-surface files if needed.

**How it cooperates**: upstream is an approved Spec from `brainstorm`; downstream routes by need — code changes to `implement`, deep checks to `review`, unknown failures to `diagnose`.

**Tip**: small tasks (describable in one sentence, no cross-file dependencies) get no plan file — this skill does not manufacture documents for ceremony.

> Protocol: [`skills/plan/SKILL.md`](../skills-en/plan/SKILL.md)

### implement — make scoped changes

**The problem it solves**: this is the workhorse. When scope is clear (backed by a request/Spec/plan/review findings), it makes the change, verifies it, and commits what should be committed. The core discipline: **behavior changes go test-first** — failing test, then implementation — to kill the illusion of "seems to run after the change".

**What you say**: "Implement this plan", "Do steps 2 and 3", "Fix it per the review findings".

**The flow it walks you through**:

1. Reads the relevant code and tests, pins down target behavior and guardrails (never touching your unrelated uncommitted changes).
2. Agrees on **seams** with you — the public boundaries where behavior is observable from outside (APIs, CLI output); tests live only on seams, never against internal details.
3. Behavior changes run the red-green loop: one failing test (red) → the minimal implementation that makes it pass (green) → one small slice at a time. Docs and low-risk config skip the ceremony.
4. Verification has a rhythm: typecheck often, single-file tests often, full suite once at the end; already-verified parts are not re-run while their code is unchanged.
5. Long tasks log evidence and decisions to the track's checkpoint file as they happen — no waiting for closeout.
6. Finishing: low-risk changes complete after self-review plus targeted checks, defaulting to one commit; complex changes (cross-module, permission/data boundaries) go to `review`.

**What you get**: changed code, verification evidence that ran, and a clear change report (what changed, what was verified, what remains).

**How it cooperates**: driven by `plan`/`ship`/`review` (fix loop-back); in turn **drives `tdd`** while coding; hands off to `review` or `cleanup` by risk.

**Tip**: when a required acceptance fails or is unknown, it will not say "done" — the single most important honesty clause in this whole set.

> Protocol: [`skills/implement/SKILL.md`](../skills-en/implement/SKILL.md)

### diagnose — find out *why* it broke

**The problem it solves**: the build is red, tests fail, production errors — and you don't know why. Random fix attempts are the biggest time sink; this skill nails the cause with evidence before touching anything.

**What you say**: "Why is CI red", "Where does this error come from", "Why did this endpoint suddenly get slow".

**The flow it walks you through**:

1. **Preserve the scene**: record the full command, working directory, environment, exit code, logs — photograph before operating.
2. **Reproduce only when sensible**: one reproduction within reasonable cost; expensive GPU jobs and production systems are not run repeatedly to hit a quota.
3. **Hypotheses**: when reproduction is hard, candidate explanations come from logs and source, explicitly marked as uncertain — guesses are never sold as conclusions.
4. **Controlled experiments**: rank candidates, distinguish them with minimal checks; single experiments keep variables attributable, independent read-only checks run in parallel.
5. **Minimal fix**: once evidence suffices, fix within authorization, then verify the **original symptom** and affected paths — not just "the line I changed".
6. **Bank the lesson**: reusable root causes go into the project lessons file, so the next similar failure starts from the ledger.

**What you get**: the failure description, confirmed/excluded hypotheses, the root cause (or an honest "undetermined"), the fix and its verification. Diagnosis-only engagements deliver bounded conclusions without touching code.

**How it cooperates**: once the cause is known it hands to `implement`; complex fixes or requested oversight go to `review`.

**Tip**: a small patch whose cause you already know does not need this — fix it directly; skill switching is not ceremony.

> Protocol: [`skills/diagnose/SKILL.md`](../skills/diagnose/SKILL.md)

### review — inspect the change and judge "is it actually done"

**The problem it solves**: two questions in one pass — is the change any good, and does the claimed "done" have real evidence? An ordinary agent's "I checked it" is self-report; this skill accepts only output that actually ran.

**What you say**: "Review this diff", "Verify what was just claimed done", "Review this WIP" (work-in-progress is reviewable; no need to finish first).

**The flow it walks you through**:

1. Establishes which version, what target behavior, which acceptance criteria.
2. Checks correctness, boundaries, contracts and regressions along concrete failure paths — not a ceremonial skim.
3. When valuable and the runtime allows, dispatches a **read-only independent subagent** for a cold second look ("author checks own work" is exactly the self-deception this method guards against).
4. Maps every required criterion to **pass / fail / unknown**. Key rules: verbal assertions are not evidence; prior verification stays reusable while the related code is unchanged — no re-running for ritual.
5. The verdict: ready only with no unresolved blocking findings and all required criteria passing. Critical/Important issues must be resolved; unknown never counts as pass.

**What you get**: two lists — "correctness & risk" (severity, location, trigger, impact per finding) and "acceptance evidence" (the pass/fail/unknown map) — plus remaining gaps and the conclusion. Findings that must outlive the session land in `docs/reviews/`.

**How it cooperates**: upstream `plan`/`implement`/`ship`; with authorized fixes it loops straight back to `implement`, then re-verifies only the affected parts. `verify` is its alias — saying verify enters here once, never twice.

**Tip**: low-risk small changes need no dedicated review; `implement` self-review suffices — and this skill makes that call itself.

> Protocol: [`skills/review/SKILL.md`](../skills-en/review/SKILL.md)

### ship — take an authorized task end to end

**The problem it solves**: the task is clearly authorized and scoped, and you don't want to babysit "now implement → now review → now clean up" one instruction at a time. ship chains the three stages into one delivery.

**What you say**: "This is authorized — take it all the way", "ship it".

**The flow it walks you through**:

1. **Confirm preconditions**: scope and acceptance clear, full-course authorized — otherwise divert to `brainstorm`/`plan`/`diagnose` first and come back.
2. **implement**: minimal change + test-driven + targeted checks.
3. **review** (by risk): substantive-risk changes get the deep check; low-risk mechanical changes self-review and go straight to closeout — no forced parade.
4. **cleanup**: reconcile docs and leftovers, leave the recovery surface resumable by the next session; closing the task this round runs the retirement flow (see the cleanup entry).
5. Delivery summary: change overview, evidence, closeout result, remaining items.

**Sequence discipline**: a later stage never overturns an earlier one without cause; review findings redo only the affected parts; it neither skips closeout to claim credit early nor inflates closeout into a repo-wide sweep.

**What you get**: one complete delivery — code, evidence, tidied state — without further instructions from you in between.

**How it cooperates**: it only orchestrates; each stage still runs its own protocol from `implement`/`review`/`cleanup`, with no extra gates or repeated confirmations added.

> Protocol: [`skills/ship/SKILL.md`](../skills-en/ship/SKILL.md)

### cleanup — tidy the site after the work

**The problem it solves**: the entropy after a task: README not updated, old implementation not removed, scratch files lying around, recovery state still hanging on "active". Skip it and three months later the repo is a black hole nobody dares touch.

**What you say**: "Wrap this up", "Reconcile what this task touched".

**The flow it walks you through**:

1. Locates the task's authoritative entry (recovery-surface row or this diff).
2. Reconciles only the docs, artifacts and recovery records **this task touched** — no repo-wide expansion (that is `sweep`'s job).
3. Removes code leftovers this task introduced: dead code, unused imports, superseded implementations; deletion requires reference evidence, followed by targeted checks proving behavior unchanged.
4. When the task closes (done/abandoned/blocked/handoff), runs the **retirement four steps**: flip the task row out of active → distill durable lessons → delete this track's temporary plan/Spec docs (git history is the archive) → flip the checkpoint file in sync. All four in one commit.
5. Zero drift permits a zero-modification finish — clean does not mean "must change something".

**What you get**: task records consistent with reality, a clean recovery surface, and the guarantee that the next task or session won't trip over this one's residue.

**How it cooperates**: called by `ship`/`implement`/`autoresearch` at closeout; routes explicit repo-wide Python dead-code requests to `remove-deadcode-py` and explicit repo-wide audits to `sweep`.

**Tip**: untracked files (never committed) are never deleted — the exits are "commit it" or "gitignore it", and the choice is yours.

> Protocol: [`skills/cleanup/SKILL.md`](../skills-en/cleanup/SKILL.md)

### autoresearch — assign a goal, let it research-work-review-distill to completion

**The problem it solves**: you have a task or question to nail down but no idea what approach to take. An ordinary agent either interrogates you first or builds one version blind and calls it done. This skill takes the assignment and runs it independently: it investigates, runs experiments and changes code with its own hands, adversarially attacks its own conclusions, and checks against the completion criteria — not done means excluding the refuted explanations and continuing, until it is genuinely done, or it honestly tells you where it is stuck.

**What you say**: "Research this: should push use long polling or WebSocket — until there's a conclusion", "Find out what this performance issue is and verify it" (if the session breaks, say "autoresearch <research-log path>" to resume).

**The flow it walks you through**:

1. **Kickoff scan**: your sentence becomes a one-sentence goal + scope boundaries + completion criteria (what counts as done, fixed for the whole run); a scan of known facts and candidate explanations lands in the log.
2. **Automatic loop**, four segments per round: **research** (pose one falsifiable hypothesis, write it into the log) → **hands-on** (search primary sources in parallel; when hands-on work is needed, just run the experiment, write the measurement script, change code on a branch to verify) → **review** (attack your own conclusions from an adversarial angle — even "should we open another round" gets reviewed) → **distill** (conclusions and lessons land in the log).
3. **Completion check**: against the completion criteria — done → terminal state; not done → pass the exclusion three questions (what was excluded? what remains undistinguished? how does the next round distinguish?) and continue.
4. **Terminal accounting**: five honest stops (answered/inconclusive/blocked/budget-exhausted/cancelled); the conclusion section **leads with the answer + per-claim evidence links** — read that section alone to take the answer away.

**When it comes to ask you (only four cases)**: spending money, external writes, irreversible or production-impacting actions, or your own stop — searching, local experiments and branch code changes never interrupt you. To watch the process, say "show me every round".

**What you get**: one research log — the final answer plus every round's hypotheses, evidence and verdicts, fully traceable; a durable deliverable you can resume any time.

**How it cooperates**: one-shot lookups are better served by lightweight `research`; conclusions turning into formal changes go to `plan`/`implement`.

> Protocol: [`skills/autoresearch/SKILL.md`](../skills-en/autoresearch/SKILL.md)

### harness-builder — build or repair the project's agent workbench

**The problem it solves**: before an agent can work in a new project it needs a basic workbench: an entry file (AGENTS.md), a save system (recovery surface), verification gates. Or the existing workbench is broken or insufficient. This skill is the general contractor for workbenches.

**What you say**: "Set up the workbench for this new project", "Fix this project's harness", "Audit how my AGENTS.md is configured".

**The flow it walks you through**:

1. Reads the project's entries, config, scripts and actual errors to establish the current state and real gaps.
2. **Acts only on real gaps**: simple repairs state exactly which file changes; cross-domain overhauls get a recommendation matrix (gap → evidence → treatment → verification). Audit/recommendation requests stay read-only.
3. Routes helpers by gap: text agents read → `writing-for-agents`; selection → `capability-recommender`; finding existing skills → `find-skills`.
4. Modifies the canonical source, syncs affected install-surface docs, verifies the real target.
5. **Installs nothing by default** — no hooks, MCP servers or subagent configs without a gap; zero recommendations is a valid outcome.

**What you get**: workbench configuration proportionate to the gap (or a read-only recommendation), no more no less.

**How it cooperates**: daily tasks **do not go through it** — per-task filing is done automatically by `plan`; call it only for a real missing or broken workbench.

**Tip**: the first time you adopt this set in a new project, say "wire this project up with harness-builder" once — after that, daily work never needs it.

> Protocol: [`skills/harness-builder/SKILL.md`](../skills-en/harness-builder/SKILL.md)

---

## Helper skills: filling gaps for the lanes

### find-skills — find an existing skill for the job

**The problem it solves**: you clearly lack a capability (say, "parse PDFs") and want to know whether a ready-made third-party skill exists instead of having the agent reinvent the wheel.

**What you say**: "Find a skill that can parse PDFs", "Find a skill to do X".

**The flow it walks you through**: pin down the gap and runtime → targeted search → **security-audit each candidate** (read its SKILL.md and anything it executes, against a red-flag checklist: does it quietly write shell config, register hooks, exfiltrate data, or demand elevation? one hit disqualifies) → present only qualifying candidates with install scope.

**Boundaries**: searching is not install authorization — candidates are shown to you, and whether and where to install (project or user level) is your call. Ordinary how-to questions never trigger it; daily Q&A is never interrupted.

> Protocol: [`skills/find-skills/SKILL.md`](../skills-en/find-skills/SKILL.md)

### capability-recommender — the read-only capability advisor

**The problem it solves**: you sense the workflow is missing something but don't know whether the gap is a skill, a hook, an MCP server or a subagent. It translates the gap into a concrete capability recommendation — **advice only, never action**.

**What you say**: "What capability is my workflow missing", "Should I add an MCP for this project".

**The flow it walks you through**: check whether existing tools suffice (if so, it says so and stops — zero recommendations is fine) → investigate only candidates that fill the gap → compare on task value, compatibility, permissions, maintenance cost → output a compact recommendation (gap → candidate → rationale → install scope → verification), optionally graded Required/Recommended/Deferred/Rejected.

**Boundaries**: recommendation grades are not install authorization; download counts and stars are background, not thresholds; third-party candidates pass the same red flags.

> Protocol: [`skills/capability-recommender/SKILL.md`](../skills-en/capability-recommender/SKILL.md)

### writing-for-agents — edit "the text agents read"

**The problem it solves**: skills themselves, AGENTS.md/CLAUDE.md-style durable instructions, recovery-surface files — these are the "policy documents" an agent reads on every run. Editing them is a different craft from editing code: the goal is that the agent follows the same *process* every run, not that it produces the same *result*.

**What you say**: "Change this rule in skill X", "Audit and revise the project's AGENTS.md", "Repair the .harness recovery surface".

**The flow it walks you through**: locate the files actually in effect (global/project/subdirectory layers) → sort findings into outdated, conflicting, duplicated, over-broad triggers and still-valuable constraints → complete the revision and report each change's location, consequence and rationale. Writing discipline and recovery-surface selection each have dedicated references.

**Boundaries**: *building* a workbench in a target project is `harness-builder`'s job; this skill only maintains the **text and protocols** themselves.

> Protocol: [`skills/writing-for-agents/SKILL.md`](../skills-en/writing-for-agents/SKILL.md)

---

## Discipline skill: testing rules during implementation

### tdd — red before green

**The problem it solves**: the three classic self-deceptions in agent-written tests: testing implementation details (test goes red on refactor while behavior is unchanged), assertions computed by the implementation itself (tautologies that always pass), and tests written after the fact (mere transcriptions of the code). This discipline closes all three.

**What it is**: it does not work standalone — `implement` **drives** it during behavior changes, and you can request it explicitly ("write this part TDD-style"). Four rules:

1. **Tests live only on seams**: a seam is the public boundary where behavior is observable from outside. Before writing any test, list the seams and confirm them with you.
2. **Red before green**: write the failing test first, then the minimal implementation that passes it — not one line more.
3. **One slice at a time**: one loop covers one seam, one test, one minimal implementation — vertical slices, never a horizontal spread.
4. **Refactoring stays outside the loop**: making the test green and tidying the structure are separate passes, never muddled into one.

**The layman's test for a good test**: it reads like a specification ("user can check out with a valid cart") and survives the implementation being replaced wholesale.

> Protocol: [`skills/tdd/SKILL.md`](../skills-en/tdd/SKILL.md)

---

## Tool skills: standalone tools triggered on demand

All four tools are **explicitly triggered** standalone entries and none of them does task closeout (that belongs to `cleanup`).

### remove-deadcode-py — repo-wide Python dead-code removal

**What you say**: "Clean up the dead code repo-wide", "Remove the unused code".

**The flow it walks you through**: first fence off the **never-delete zone** (entry scripts, CLI commands, framework-discovered models/urls, migrations, conftest) → Ruff fast lane for unused imports/variables → tiered vulture scan (60% is a lead; 90% can enter conviction) → **triple-evidence conviction** (zero repo-wide references + git archaeology + coverage corroboration) → the dynamic-access guard list (`getattr`/registering decorators/dunders/`__all__` — one hit keeps the symbol, whatever the tool says) → **batched atomic deletion** (run the narrowest tests per batch, commit only on green, roll the batch back and shrink on red) → cascade rescan (each deletion exposes more).

**Why trust it**: detection by tools, conviction by evidence, deletion in small batches — "vulture flagged it" is never a reason to delete; evidence is. False-positive whitelists must carry a comment on *why the symbol is alive*, because a stale whitelist is more dangerous than dead code.

**Boundaries**: Python only — JS/TS uses knip, Go uses `go tool deadcode`, Rust uses cargo-machete. Big repos are not cleared in one sitting: multiple sessions, each ending with green tests.

> Protocol: [`skills/remove-deadcode-py/SKILL.md`](../skills-en/remove-deadcode-py/SKILL.md)

### sweep — the repo-wide reconciliation

**What you say**: "Do a full repo audit", "Sweep the repo", "Reconcile the ledger".

**The problem it solves**: every task closes itself out, yet repo-level sediment accumulates — plan docs nobody references, registrations that contradict reality, zombie task rows, untracked leftovers. sweep periodically balances this ledger.

**The flow it walks you through**: probe the recovery surface (which state files and entries exist) → run the reconciliation checklist (status contradictions? zero-reference task artifacts? untracked files?) → **six-bucket classification** (orphaned task artifacts / zombie blocked rows / half-retired rows / untracked leftovers / archive directories / overloaded state files) → mechanical fixes applied automatically, **ambiguous items listed with evidence for your adjudication — nothing ambiguous is deleted without a ruling** → historical closeout debts get their retirement four steps → report (handled / needs-review / retained / next-round candidates).

**Why trust it**: deletion requires triple-evidence conviction (zero references + archaeology + no cross-references); untracked files are never deleted (exits: commit it or gitignore it); archives and ADRs are untouched. It stops conservatively rather than deletes aggressively.

**Split with cleanup**: cleanup reconciles what **this task** touched; sweep reconciles **the whole repo's** historical sediment. The former runs every task; the latter, rarely, on demand.

> Protocol: [`skills/sweep/SKILL.md`](../skills-en/sweep/SKILL.md)

### research — lightweight one-shot research

**What you say**: "Look up X for me", "Check how this library is used".

**The problem it solves**: one-shot verification — a doc/API fact, a topic survey, pure legwork. No need for autoresearch's multi-round hypothesis machinery.

**The flow it walks you through**: state the need as one deliverable question → dispatch a background agent (or check directly) with every conclusion traced to a **primary source** (official docs, source, first-party API) — secondhand retellings are not accepted → the main session source-checks before anything lands → one markdown deliverable with per-claim citations (`docs/research/date--topic.md`).

**Boundaries**: one question, one answer. If the question turns out to need multi-round convergence, it escalates to `autoresearch` with your confirmation; conclusions turning into changes go to `plan`/`implement`.

> Protocol: [`skills/research/SKILL.md`](../skills-en/research/SKILL.md)

### handoff — session handover

**What you say**: "Hand off — the next session continues", "Transfer this to a new session".

**The problem it solves**: the session is ending but the work isn't done. Open a new session cold and the new agent is blind; re-explain manually and you'll miss things. It compacts the current session into a handover artifact a **zero-context** agent can pick up.

**The flow it walks you through**: the full handover document always goes to the system temp directory (e.g. /tmp; never into the repo or project directory, avoiding orphan files), with the path told to you; with a recovery surface, the continuation point also goes into the checkpoint file first (durable, resumable) and key state and evidence into the evidence line, and the full document is attached only when truly needed. Content discipline: a "suggested skills" section naming exactly which skills the next agent should call; no restating existing artifacts (paths only); secrets, credentials and personal data are never written.

**Boundaries**: handover is an explicit act — it never hands off unless you ask.

> Protocol: [`skills/handoff/SKILL.md`](../skills-en/handoff/SKILL.md)

---

## Common combos at a glance

| Scenario | Combo | Notes |
| --- | --- | --- |
| One-line fix | `implement` self-review, done | No other skill involved; verified means committed |
| Authorized, well-scoped task | `ship` (= implement→review→cleanup) | One sentence of authorization, one end-to-end delivery |
| Fuzzy new feature | `brainstorm` → `plan` → `implement` → `review` → `cleanup` | Direction settled before construction, evidence throughout |
| Broken command/build | `diagnose` → (after authorization) `implement` | Nail the root cause before fixing; no guessing |
| Open technical question | `research` (one-shot) or `autoresearch` (multi-round) | Light for small questions, budgeted-to-a-conclusion for big ones |
| Onboarding a project | `harness-builder` once → daily work on the lanes | The workbench is built once |
| Repo sediment cleanup | `sweep` (repo reconciliation) + `remove-deadcode-py` (Python dead code) | Rare deep cleans, conviction by evidence |
| Session ending, work unfinished | `handoff` (or the recovery surface `plan` created resumes automatically) | Save file if there is one; handover doc if not |

## Getting started for the first time

1. After installing, try the smallest thing: pick any small change and say "use implement to make this change" — feel the difference of "verified means done".
2. Then try a full run: pick a small task you're willing to authorize and say "this is authorized — take it all the way with ship".
3. Before your next session ends, say "plan this" and watch the task save system appear automatically and the checkpoint resume.
4. When a fuzzy requirement arrives, let `brainstorm` grill you once — you'll come to like questions that each carry a recommended answer.
5. You don't need to memorize all 17: remember the spine "discuss it (brainstorm) → plan it (plan) → build it (implement) → check it (review) → close it (cleanup)" and come back to this guide for the rest.
