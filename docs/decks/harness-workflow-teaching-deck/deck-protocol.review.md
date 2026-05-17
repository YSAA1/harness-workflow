# 规范驱动的 Agent 开发：Harness Workflow 工程思想课件 Review

## Validation

- Protocol: C:\Users\shash\Desktop\harness-workflow\docs\decks\harness-workflow-teaching-deck\deck-protocol.json
- Status: OK
- Pages: 28
- Assets: 13
- Errors: none

## Intake

- Mode: reference_grounded_mode
- Source inputs: docs/specs/2026-05-17--harness-workflow-teaching-deck.md, docs/plans/2026-05-17--harness-workflow-teaching-deck-plan.md, README.md, CONTEXT.md, docs/harness-method-contract.md, skills/harness-builder/SKILL.md, skills/brainstorm/SKILL.md, skills/plan/SKILL.md, skills/implement/SKILL.md, skills/diagnose/SKILL.md, skills/review/SKILL.md, skills/verify/SKILL.md, skills/cleanup/SKILL.md
- Warnings: none

## Assets

| id | type | usage | caption/summary | path/source |
| --- | --- | --- | --- | --- |
| spec_teaching | text_evidence | deck scope, page outline, negative constraints, success criteria | Approved teaching deck spec: 25+ pages, Chinese-first, for readers already using Agent tools; focus on specification-driven development and Harness engineering, not a skill catalog. | docs/specs/2026-05-17--harness-workflow-teaching-deck.md |
| plan_teaching | text_evidence | production route, verification and artifact map | Executable plan for the teaching deck: output path, image-first workflow, QA path, commit units, and content negative checks. | docs/plans/2026-05-17--harness-workflow-teaching-deck-plan.md |
| readme_workflow | text_evidence | Harness overview, practical routes, workflow framing | Harness Workflow is a context-aware agent workbench for real repositories, giving agents repo evidence, requirement context, recovery state, verification discipline, and cleanup paths. | README.md |
| context_terms | text_evidence | terminology and boundary rules | Defines core terms: Harness Builder, Skill Independence, Recovery Surface, Workflow State Backend, Executable Plan, Spec, Review, Verification, Knowledge Cleanup. | CONTEXT.md |
| method_contract | text_evidence | engineering principles without visible course-code markers | Stable method contract for harness-as-system, repo truth, thin instructions, workbench before action, scoped work, fresh evidence, capability fit, artifact freshness, cleanup, and backend decoupling. | docs/harness-method-contract.md |
| skill_harness_builder | text_evidence | initialization and workbench pages | Harness Builder designs or repairs the project workbench and recovery surface: project map, rules, verification entry, reusable skills, capability discovery, and anti-entropy guardrails. | skills/harness-builder/SKILL.md |
| skill_brainstorm | text_evidence | clarification and spec pages | Brainstorm clarifies fuzzy intent into a Spec with goals, non-goals, options, risks, and verification strategy before planning. | skills/brainstorm/SKILL.md |
| skill_plan | text_evidence | planning and active slice pages | Plan turns an approved Spec or clear request into an Executable Plan with active slice, success criteria, verification path, phases, risks, and commit units. | skills/plan/SKILL.md |
| skill_implement | text_evidence | action phase pages | Implement executes a scoped change using existing project context, narrow edits, risk-matched checks, and routing to diagnose/review/verify. | skills/implement/SKILL.md |
| skill_diagnose | text_evidence | failure phase pages | Diagnose handles unexplained failures through reproduce, minimize, single hypothesis, instrumentation, root cause, fix, and regression evidence. | skills/diagnose/SKILL.md |
| skill_review | text_evidence | review gate pages | Review checks correctness, scope, evidence gaps, docs drift, artifacts, and entropy before ready claims. | skills/review/SKILL.md |
| skill_verify | text_evidence | verification and fresh evidence pages | Verify maps a concrete ready claim to fresh evidence using an evidence ladder and routes failing evidence to diagnosis. | skills/verify/SKILL.md |
| skill_cleanup | text_evidence | cleanup and handoff pages | Cleanup reconciles documentation, generated artifacts, recovery surfaces, and residual risks so knowledge does not rot after a batch. | skills/cleanup/SKILL.md |

## Pages

| page | title | fidelity | evidence bindings | output_png |
| --- | --- | --- | --- | --- |
| 1 | 从会用 Agent 到会驾驭 Agent | light_redraw | text=spec_teaching,readme_workflow; refs=spec_teaching,readme_workflow | slides/slide-01.png |
| 2 | Agent 开发为什么会失控 | light_redraw | text=spec_teaching,readme_workflow,method_contract; refs=spec_teaching,readme_workflow,method_contract | slides/slide-02.png |
| 3 | 对话驱动的局限 | light_redraw | text=spec_teaching,context_terms; refs=spec_teaching,context_terms | slides/slide-03.png |
| 4 | 规范驱动开发的核心思想 | light_redraw | text=spec_teaching,method_contract; refs=spec_teaching,method_contract | slides/slide-04.png |
| 5 | Harness 到底是什么 | light_redraw | text=readme_workflow,context_terms,method_contract; refs=readme_workflow,context_terms,method_contract | slides/slide-05.png |
| 6 | 可靠 Agent 工作流的组件 | light_redraw | text=readme_workflow,context_terms,method_contract; refs=readme_workflow,context_terms,method_contract | slides/slide-06.png |
| 7 | 规范驱动闭环总览 | light_redraw | text=spec_teaching,context_terms; refs=spec_teaching,context_terms | slides/slide-07.png |
| 8 | 第一步：不要急着实现 | light_redraw | text=spec_teaching,skill_brainstorm; refs=spec_teaching,skill_brainstorm | slides/slide-08.png |
| 9 | 澄清需求：把想法变成问题结构 | light_redraw | text=skill_brainstorm,spec_teaching; refs=skill_brainstorm,spec_teaching | slides/slide-09.png |
| 10 | Spec 的意义：不是文档，是执行合同 | light_redraw | text=skill_brainstorm,context_terms; refs=skill_brainstorm,context_terms | slides/slide-10.png |
| 11 | 好 Spec 应该包含什么 | light_redraw | text=spec_teaching,skill_brainstorm; refs=spec_teaching,skill_brainstorm | slides/slide-11.png |
| 12 | 为什么验证策略必须前置 | light_redraw | text=skill_verify,method_contract,spec_teaching; refs=skill_verify,method_contract,spec_teaching | slides/slide-12.png |
| 13 | 从 Spec 到 Plan | light_redraw | text=skill_plan,plan_teaching; refs=skill_plan,plan_teaching | slides/slide-13.png |
| 14 | Active Slice：一次只做一件可验证的事 | light_redraw | text=skill_plan,skill_implement; refs=skill_plan,skill_implement | slides/slide-14.png |
| 15 | 初始化工作面：让 Agent 进入真实仓库 | light_redraw | text=skill_harness_builder,readme_workflow,context_terms; refs=skill_harness_builder,readme_workflow,context_terms | slides/slide-15.png |
| 16 | Recovery Surface：任务不能只活在聊天里 | light_redraw | text=context_terms,plan_teaching; refs=context_terms,plan_teaching | slides/slide-16.png |
| 17 | 能力适配：工具不是越多越好 | light_redraw | text=skill_harness_builder,readme_workflow; refs=skill_harness_builder,readme_workflow | slides/slide-17.png |
| 18 | 行动阶段：小步执行，小步验证 | light_redraw | text=skill_implement,method_contract; refs=skill_implement,method_contract | slides/slide-18.png |
| 19 | 失败阶段：不要盲改 | light_redraw | text=skill_diagnose,skill_implement; refs=skill_diagnose,skill_implement | slides/slide-19.png |
| 20 | Review 和 Verify 的区别 | light_redraw | text=skill_review,skill_verify; refs=skill_review,skill_verify | slides/slide-20.png |
| 21 | Fresh Evidence：旧证据不能证明新结果 | light_redraw | text=skill_verify,method_contract; refs=skill_verify,method_contract | slides/slide-21.png |
| 22 | Cleanup：工程流程真正闭环的地方 | light_redraw | text=skill_cleanup,method_contract; refs=skill_cleanup,method_contract | slides/slide-22.png |
| 23 | Skill 是职责映射，不是主角 | light_redraw | text=context_terms,skill_brainstorm,skill_plan,skill_harness_builder,skill_implement,skill_diagnose,skill_review,skill_verify,skill_cleanup; refs=context_terms,skill_brainstorm,skill_plan,skill_harness_builder,skill_implement,skill_diagnose,skill_review,skill_verify,skill_cleanup | slides/slide-23.png |
| 24 | 贯穿案例：一个 PPT 需求如何被规范驱动 | light_redraw | text=spec_teaching,plan_teaching; refs=spec_teaching,plan_teaching | slides/slide-24.png |
| 25 | 如果没有规范会怎样 | light_redraw | text=spec_teaching,plan_teaching; refs=spec_teaching,plan_teaching | slides/slide-25.png |
| 26 | 常见误区 | light_redraw | text=context_terms,method_contract,skill_verify,skill_cleanup; refs=context_terms,method_contract,skill_verify,skill_cleanup | slides/slide-26.png |
| 27 | 方法论总结：Agent 不是被命令，而是被约束 | light_redraw | text=method_contract,readme_workflow; refs=method_contract,readme_workflow | slides/slide-27.png |
| 28 | 最终 Takeaway | light_redraw | text=spec_teaching,readme_workflow,context_terms; refs=spec_teaching,readme_workflow,context_terms | slides/slide-28.png |

## Confirmation checklist

- Check page count, language, audience, aspect ratio, and visual style.
- Check every required logo, image, table, number, citation, and exclusion appears as an asset or explicit page instruction.
- Check reference-grounded pages bind assets through `content_inputs` or `reference_asset_ids`.
- Confirm only when this review artifact matches the intended deck.
