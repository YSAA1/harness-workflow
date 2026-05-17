# Harness Workflow PPT Executable Plan

Date: 2026-05-17
Planning surface: docs plan
Spec source: explicit user request in chat; no separate Spec because the request already defines audience outcome, content scope, visual direction, density requirement, and proof path.

## Objective

Create a dense, vivid, reader-useful PPT about the current `harness-workflow` plugin workflow. The deck must explain:

- why the skills exist;
- the original design intent behind Harness Engineering;
- how the harness idea becomes concrete project artifacts, checks, recovery state, and workflow lanes;
- what each active workflow skill actually does;
- how the skills cooperate without becoming one forced linear ceremony.

The deck should feel like a practical field guide, not a low-information sales deck.

## Active Slice

Plan the PPT content architecture and execution path so the next implementation step can directly draft the deck from repository evidence.

## Non-goals

- Do not generate the PPT in this planning slice.
- Do not change workflow skill behavior, plugin manifests, install docs, or generated `docs/skill-flow-review/*.html`.
- Do not present `find-skills` as a ninth active workflow lane; it is an auxiliary capability-discovery helper.
- Do not make three-file state look like the default or mandatory backend.
- Do not turn the deck into a generic AI-agent presentation detached from this repository.

## Success Criteria

- A future implementer can produce the PPT without re-deciding the storyline, slide count, skill coverage, or validation path.
- The proposed deck includes enough information density for readers to learn from the slides themselves.
- Every active workflow skill has a clear purpose, workflow role, output, and coupling boundary.
- Harness Engineering is framed as an operating environment around the agent: instructions, state, feedback, tools, and cleanup.
- The plan defines a concrete verification path for the finished PPT.

## Verification Path

For this planning slice:

1. Confirm the plan references current repo truth from `README.md`, `CONTEXT.md`, `docs/harness-method-contract.md`, and `skills/*/SKILL.md`.
2. Run `node scripts/check-plugin.mjs` to ensure adding the plan does not disturb plugin structure.
3. Check `git status --short` before commit.

For the later PPT implementation:

1. Content review: map each slide back to repo sources and C1-C10 method contract.
2. Coverage review: verify the deck covers `harness-builder`, `brainstorm`, `plan`, `implement`, `diagnose`, `review`, `verify`, and `cleanup`, plus `find-skills` as auxiliary.
3. Density review: reject slides that only contain slogans, large empty visuals, or ungrounded diagrams.
4. Visual review: verify the PPT uses diagrams, route maps, matrices, and concrete workflow examples rather than decorative imagery.
5. Reader review: a reader should understand the design intent, each skill's job, when to route between skills, and why recovery/evidence/cleanup matter.

## Deck Positioning

Working title: **Harness Workflow: 把 Agent 工作变成可恢复、可验证、可交接的工程系统**

Audience:

- users who know Codex / Claude Code / Cursor but do not yet understand harness engineering;
- project maintainers deciding whether to adopt workflow skills;
- future agents or collaborators who need a compact mental model of this plugin.

Tone:

- practical, source-grounded, and specific;
- vivid through diagrams and examples, not through empty marketing visuals;
- Chinese-first deck, with key English terms retained where they are canonical: Harness Builder, Recovery Surface, Executable Plan, Fresh Evidence.

Visual metaphor:

- "agent workbench / control room" rather than "magic agent";
- use lanes, gates, evidence chains, recovery surfaces, and feedback loops as recurring visuals.

## Proposed Deck Structure

Target length: 14-16 slides. This gives enough space for content density without becoming a long tutorial document.

| # | Slide | Purpose | Dense Content To Include | Visual Device |
| --- | --- | --- | --- | --- |
| 1 | Title + thesis | State the deck promise. | Harness Workflow is not a prompt pack; it is a repo-local operating system for agent work. | Full-slide workbench/control-room visual with 5 labeled subsystems. |
| 2 | Why capable agents still fail | Motivate the design. | Stale docs, unclear scope, dirty git state, missing tests, long tasks, context compaction, weak ready claims. | Failure map: symptoms -> missing harness component. |
| 3 | Harness Engineering in one system | Explain the core idea. | Instructions, state, feedback, tools, cleanup; tie to C1 Harness As System. | Five-part system diagram around the agent. |
| 4 | Method contract C1-C10 | Show the stable principles. | Condensed C1-C10 table grouped by truth, scope, evidence, freshness, backend decoupling. | Contract matrix with emphasis rows. |
| 5 | Workflow lanes overview | Give the map before details. | brainstorm -> plan -> harness-builder -> implement -> review -> verify -> cleanup, with diagnose loops and find-skills auxiliary. | Route map with optional branches, not a rigid pipeline. |
| 6 | Design principle: skill independence | Explain why skills are separate. | Each skill owns one activity; recovery surface is semantic, not always three files; Harness Builder is used when workbench gaps exist. | Coupling diagram: activity lane -> output -> next handoff. |
| 7 | `harness-builder` | Explain project workbench construction. | Evidence collection, Harness Charter, Coverage Matrix, Capability Discovery, pack selection, verification gate. Output: project-local harness and recovery policy. | Coverage Matrix miniature. |
| 8 | `brainstorm` + `plan` | Explain thinking-to-contract flow. | Brainstorm produces Spec; plan produces Executable Plan; both define success and verification before implementation. | Split funnel: fuzzy intent -> Spec -> active slice. |
| 9 | `implement` + `diagnose` | Explain doing and debugging discipline. | Implement uses WIP=1, risk-matched checks, docs sync; diagnose uses reproduce -> minimize -> hypothesis -> root cause -> regression evidence. | Two-loop diagram: green implementation loop and red failure loop. |
| 10 | `review` + `verify` | Separate judgment from proof. | Review checks correctness, scope, evidence gap, docs, entropy; verify maps ready claim to fresh evidence ladder. | Gate pair: review judges; verify proves. |
| 11 | `cleanup` + `find-skills` | Explain anti-entropy and capability fit. | Cleanup aligns docs/generated artifacts/recovery surface; find-skills helps discover reusable capabilities but is not a workflow lane. | Knowledge freshness checklist + capability fit card. |
| 12 | Recovery Surface choices | Make backend decoupling concrete. | none, lightweight, docs plan, issue, feature list, three-file, existing system; semantic fields matter more than file layout. | Backend selector table. |
| 13 | Common route examples | Teach routing. | Tiny edit, unclear feature, clear task in unfamiliar repo, broken command, harness audit, research route. | Route cookbook cards. |
| 14 | Concrete example walkthrough | Make the abstract workflow tangible. | Example: user request -> brainstorm/plan -> harness-builder if needed -> implement -> review -> verify -> cleanup; show artifacts and evidence at each step. | Timeline with artifact icons. |
| 15 | What readers should remember | Close with actionable summary. | Good agent work needs scope, repo truth, recovery, current evidence, and cleanup; choose the lane by current state, not ceremony. | One-page operating checklist. |
| 16 | Appendix / reference map | Optional dense reference slide. | Skill responsibility map, canonical outputs, next-skill routing table. | Compact table for later lookup. |

## Skill Coverage Contract

Each active skill must get at least one explicit row or callout with these fields:

| Skill | Actual job | Canonical output | Coupling boundary |
| --- | --- | --- | --- |
| `harness-builder` | Build or repair the project-level workbench: project map, recovery surface, verification entry, capability decisions, anti-entropy guardrails. | Harness Charter, Coverage Matrix, project-local harness plan/components. | Invoked when workbench or recovery gaps exist; not mandatory before every task. |
| `brainstorm` | Turn fuzzy intent into an approved Spec with goals, non-goals, options, success criteria, and verification strategy. | Spec. | Stops before implementation planning until user approves the Spec. |
| `plan` | Turn a clear request or approved Spec into an Executable Plan with active slice, proof path, risks, and commit units. | Executable Plan in selected planning surface. | Does not default to three-file backend. |
| `implement` | Execute one scoped slice with WIP=1, risk-matched checks, and doc/recovery updates when behavior changes. | Scoped change with local evidence. | Routes to diagnose after repeated unexplained failure. |
| `diagnose` | Convert failing commands or flaky behavior into root cause evidence and minimal fix path. | Reproduction, hypothesis trail, root cause, regression evidence. | Not used for normal RED tests whose cause is expected. |
| `review` | Inspect stable work for correctness, scope, missing evidence, docs drift, and entropy. | Findings-first review and next route. | Review is judgment; it does not replace fresh verification. |
| `verify` | Prove a ready claim with fresh evidence mapped to success criteria. | Verification result and capability gaps. | Does not fix; failed checks route to diagnose. |
| `cleanup` | Reconcile docs, generated artifacts, recovery surface, and handoff state after work is done or blocked. | Knowledge cleanup result and residual drift. | Does not hide unfinished work or introduce new behavior. |
| `find-skills` | Discover reusable skills for a real capability gap. | Candidate screening and recommendation. | Auxiliary helper for Capability Discovery, not an active workflow lane. |

## Work Items

1. **NEXT: Content source pack**
   - Read and extract deck-ready claims from `README.md`, `CONTEXT.md`, `docs/harness-method-contract.md`, and each active `skills/*/SKILL.md`.
   - Output: slide evidence notes with source paths and the claim each slide can make.
   - Verification: every slide claim has at least one repo source.

2. **Deck narrative draft**
   - Convert the proposed structure into a Chinese slide-by-slide script.
   - Include title, main takeaway, dense body points, diagram instruction, and speaker note per slide.
   - Verification: no active skill is missing; `find-skills` remains auxiliary.

3. **Visual system and diagram plan**
   - Define 3-5 reusable diagram types: workbench system, route map, coverage matrix, evidence ladder, recovery surface selector.
   - Decide which visuals should be generated bitmap assets and which should be native PPT shapes/tables.
   - Verification: visuals communicate repo-specific workflow mechanics, not decorative filler.

4. **PPT production**
   - Build the deck with consistent layout, readable density, and diagrams/tables.
   - Keep slides self-contained enough for reading without presenter explanation.
   - Verification: open/render the PPT or exported images and inspect layout for text overflow, low-density slides, and missing visuals.

5. **Review and verification**
   - Review against the Skill Coverage Contract and C1-C10 method contract.
   - Run repository checks if any docs or generated artifacts changed.
   - Verification: final artifact path exists; coverage checklist passes; fresh validation evidence recorded.

6. **Cleanup and handoff**
   - Record final PPT artifact path, generation source, validation summary, and any deferred improvements.
   - Commit final deck and supporting assets in clear Chinese commit units.
   - Verification: `git status --short` contains only intended changes before commit.

## Commit Units

- Commit 1: `添加 workflow PPT 制作计划` for this plan document.
- Commit 2: `整理 workflow PPT 内容脚本` for source-backed slide script and diagram brief.
- Commit 3: `生成 workflow 讲解 PPT` for the actual PPT and visual assets.
- Commit 4, if needed: `完善 workflow PPT 验证与收尾记录` for final review notes or artifact references.

## Known Risks / Blockers

- **Risk: deck becomes too decorative.** Mitigation: each slide must have a dense claim table, route map, checklist, or concrete artifact example.
- **Risk: too much text reduces readability.** Mitigation: use layered tables, compact labels, and visual grouping rather than paragraphs.
- **Risk: skill coupling is misrepresented as a forced pipeline.** Mitigation: show route maps with loops and optional branches; explicitly explain skill independence.
- **Risk: three-file backend is overemphasized.** Mitigation: recovery surface slide must show multiple backend options and state that semantics matter more than layout.
- **Risk: deck drifts from current plugin truth.** Mitigation: source every slide from current repo docs and active `SKILL.md` files before production.

## Handoff

Recommended next skill: `implement`.

Reason: the active slice is now planned; the next step is content extraction and deck drafting, not further planning.
