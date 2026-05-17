# Harness Workflow: 把 Agent 工作变成可恢复、可验证、可交接的工程系统 Review

## Validation

- Protocol: C:\Users\shash\Desktop\harness-workflow\docs\decks\harness-workflow-overview\deck-protocol.json
- Status: OK
- Pages: 16
- Assets: 9
- Errors: none

## Intake

- Mode: reference_grounded_mode
- Source inputs: docs/plans/2026-05-17--harness-workflow-ppt-plan.md, README.md, CONTEXT.md, docs/harness-method-contract.md, skills/harness-builder/SKILL.md, skills/brainstorm/SKILL.md, skills/plan/SKILL.md, skills/implement/SKILL.md, skills/diagnose/SKILL.md, skills/review/SKILL.md, skills/verify/SKILL.md, skills/cleanup/SKILL.md, skills/find-skills/SKILL.md
- Warnings: none

## Assets

| id | type | usage | caption/summary | path/source |
| --- | --- | --- | --- | --- |
| plan_ppt | text_evidence | deck scope, slide sequence, success criteria, output and verification plan | The approved executable plan requires a dense, vivid, reader-useful PPT explaining why the skills exist, Harness Engineering design intent, each active skill's actual job, and non-rigid skill cooperation. | docs/plans/2026-05-17--harness-workflow-ppt-plan.md |
| readme_overview | text_evidence | title thesis, pain points, practical harness explanation, skill map, common routes | Harness Workflow is a context-aware agent workbench for real repositories. It gives agents repo evidence, requirement context, recovery state, and verification discipline for work that does not fit in one chat. | README.md |
| context_terms | text_evidence | terminology, coupling boundaries, backend decoupling | Defines canonical terms: Harness Builder, Skill Independence, Capability Discovery, Recovery Surface, Workflow State Backend, Executable Plan, Spec, Review, Verification, and Knowledge Cleanup. It warns against treating bootstrap, three-file state, or fixed sequencing as universal. | CONTEXT.md |
| method_contract | text_evidence | method contract, principle matrix, verification criteria | C1-C10 stable method contract: harness as system, repo as truth, thin instructions, workbench before implementation, scoped work, fresh evidence, capability fit, artifact freshness, knowledge cleanup, and backend decoupling. | docs/harness-method-contract.md |
| skill_harness_builder | text_evidence | harness-builder slide, coverage matrix, capability fit | Harness Builder collects repo evidence, reconciles existing harnesses, writes a Harness Charter, builds a Coverage Matrix, runs Capability Discovery, selects packs when justified, and verifies project-local harness changes. | skills/harness-builder/SKILL.md |
| skill_brainstorm_plan | text_evidence | thinking-to-contract slide | Brainstorm turns fuzzy intent into an approved Spec with goals, non-goals, options and verification strategy. Plan turns a clear request or Spec into an Executable Plan with active slice, success criteria, verification path, risks and commit units. | skills/brainstorm/SKILL.md; skills/plan/SKILL.md |
| skill_execute_diagnose | text_evidence | execution and debugging slide | Implement executes one scoped slice with WIP=1 and risk-matched checks. Diagnose handles unexplained failures through reproduce, minimize, hypothesis, instrumentation, root cause, fix and regression evidence. | skills/implement/SKILL.md; skills/diagnose/SKILL.md |
| skill_review_verify | text_evidence | quality gates slide | Review checks correctness, scope, evidence gaps, docs drift and entropy before ready claims. Verify maps a concrete ready claim to fresh evidence using an evidence ladder and routes failure to diagnose. | skills/review/SKILL.md; skills/verify/SKILL.md |
| skill_cleanup_find | text_evidence | cleanup and capability slide | Cleanup reconciles docs, generated artifacts and recovery surface to prevent knowledge rot. Find-skills is an auxiliary discovery helper for reusable capabilities, not a ninth active workflow lane. | skills/cleanup/SKILL.md; skills/find-skills/SKILL.md |

## Pages

| page | title | fidelity | evidence bindings | output_png |
| --- | --- | --- | --- | --- |
| 1 | Harness Workflow | light_redraw | text=plan_ppt,readme_overview; refs=plan_ppt,readme_overview | docs/decks/harness-workflow-overview/slides/slide-01.png |
| 2 | 为什么能力强的 Agent 仍会失败 | light_redraw | text=readme_overview,method_contract; refs=readme_overview,method_contract | docs/decks/harness-workflow-overview/slides/slide-02.png |
| 3 | Harness Engineering: 围绕 Agent 的工程系统 | light_redraw | text=readme_overview,method_contract; refs=readme_overview,method_contract | docs/decks/harness-workflow-overview/slides/slide-03.png |
| 4 | C1-C10: 稳定方法论合同 | light_redraw | text=method_contract; refs=method_contract | docs/decks/harness-workflow-overview/slides/slide-04.png |
| 5 | Workflow Lanes: 不是流水线，而是路由系统 | light_redraw | text=readme_overview,context_terms,plan_ppt; refs=readme_overview,context_terms,plan_ppt | docs/decks/harness-workflow-overview/slides/slide-05.png |
| 6 | Skill Independence: 解耦设计 | light_redraw | text=context_terms,method_contract; refs=context_terms,method_contract | docs/decks/harness-workflow-overview/slides/slide-06.png |
| 7 | harness-builder: 先修工作面 | light_redraw | text=skill_harness_builder,method_contract; refs=skill_harness_builder,method_contract | docs/decks/harness-workflow-overview/slides/slide-07.png |
| 8 | brainstorm + plan: 从想法到可执行合同 | light_redraw | text=skill_brainstorm_plan,method_contract; refs=skill_brainstorm_plan,method_contract | docs/decks/harness-workflow-overview/slides/slide-08.png |
| 9 | implement + diagnose: 执行与失败处理 | light_redraw | text=skill_execute_diagnose,method_contract; refs=skill_execute_diagnose,method_contract | docs/decks/harness-workflow-overview/slides/slide-09.png |
| 10 | review + verify: 判断与证明分开 | light_redraw | text=skill_review_verify,method_contract; refs=skill_review_verify,method_contract | docs/decks/harness-workflow-overview/slides/slide-10.png |
| 11 | cleanup + find-skills: 防熵增与能力适配 | light_redraw | text=skill_cleanup_find,method_contract; refs=skill_cleanup_find,method_contract | docs/decks/harness-workflow-overview/slides/slide-11.png |
| 12 | Recovery Surface: 后端是选择，不是信仰 | light_redraw | text=context_terms,method_contract,skill_brainstorm_plan; refs=context_terms,method_contract,skill_brainstorm_plan | docs/decks/harness-workflow-overview/slides/slide-12.png |
| 13 | 常见路由: 按状态选 skill | light_redraw | text=readme_overview,context_terms,plan_ppt; refs=readme_overview,context_terms,plan_ppt | docs/decks/harness-workflow-overview/slides/slide-13.png |
| 14 | 一次真实工作如何穿过 Harness | light_redraw | text=plan_ppt,readme_overview,method_contract; refs=plan_ppt,readme_overview,method_contract | docs/decks/harness-workflow-overview/slides/slide-14.png |
| 15 | 读者应该带走的操作清单 | light_redraw | text=method_contract,context_terms,readme_overview; refs=method_contract,context_terms,readme_overview | docs/decks/harness-workflow-overview/slides/slide-15.png |
| 16 | Reference Map: 每个 skill 的责任边界 | light_redraw | text=plan_ppt,method_contract,skill_harness_builder,skill_brainstorm_plan,skill_execute_diagnose,skill_review_verify,skill_cleanup_find; refs=plan_ppt,method_contract,skill_harness_builder,skill_brainstorm_plan,skill_execute_diagnose,skill_review_verify,skill_cleanup_find | docs/decks/harness-workflow-overview/slides/slide-16.png |

## Confirmation checklist

- Check page count, language, audience, aspect ratio, and visual style.
- Check every required logo, image, table, number, citation, and exclusion appears as an asset or explicit page instruction.
- Check reference-grounded pages bind assets through `content_inputs` or `reference_asset_ids`.
- Confirm only when this review artifact matches the intended deck.
