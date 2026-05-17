import fs from "node:fs";

const protocolPath = "docs/decks/harness-workflow-teaching-deck/deck-protocol.json";
const assetIndexPath = "docs/decks/harness-workflow-teaching-deck/reference-assets/asset-index.json";
const protocol = JSON.parse(fs.readFileSync(protocolPath, "utf8"));

const assets = [
  { id: "spec_teaching", type: "text_evidence", path: "docs/specs/2026-05-17--harness-workflow-teaching-deck.md", summary: "Approved teaching deck spec: 25+ pages, Chinese-first, for readers already using Agent tools; focus on specification-driven development and Harness engineering, not a skill catalog.", usage: "deck scope, page outline, negative constraints, success criteria" },
  { id: "plan_teaching", type: "text_evidence", path: "docs/plans/2026-05-17--harness-workflow-teaching-deck-plan.md", summary: "Executable plan for the teaching deck: output path, image-first workflow, QA path, commit units, and content negative checks.", usage: "production route, verification and artifact map" },
  { id: "readme_workflow", type: "text_evidence", path: "README.md", summary: "Harness Workflow is a context-aware agent workbench for real repositories, giving agents repo evidence, requirement context, recovery state, verification discipline, and cleanup paths.", usage: "Harness overview, practical routes, workflow framing" },
  { id: "context_terms", type: "text_evidence", path: "CONTEXT.md", summary: "Defines core terms: Harness Builder, Skill Independence, Recovery Surface, Workflow State Backend, Executable Plan, Spec, Review, Verification, Knowledge Cleanup.", usage: "terminology and boundary rules" },
  { id: "method_contract", type: "text_evidence", path: "docs/harness-method-contract.md", summary: "Stable method contract for harness-as-system, repo truth, thin instructions, workbench before action, scoped work, fresh evidence, capability fit, artifact freshness, cleanup, and backend decoupling.", usage: "engineering principles without visible course-code markers" },
  { id: "skill_harness_builder", type: "text_evidence", path: "skills/harness-builder/SKILL.md", summary: "Harness Builder designs or repairs the project workbench and recovery surface: project map, rules, verification entry, reusable skills, capability discovery, and anti-entropy guardrails.", usage: "initialization and workbench pages" },
  { id: "skill_brainstorm", type: "text_evidence", path: "skills/brainstorm/SKILL.md", summary: "Brainstorm clarifies fuzzy intent into a Spec with goals, non-goals, options, risks, and verification strategy before planning.", usage: "clarification and spec pages" },
  { id: "skill_plan", type: "text_evidence", path: "skills/plan/SKILL.md", summary: "Plan turns an approved Spec or clear request into an Executable Plan with active slice, success criteria, verification path, phases, risks, and commit units.", usage: "planning and active slice pages" },
  { id: "skill_implement", type: "text_evidence", path: "skills/implement/SKILL.md", summary: "Implement executes a scoped change using existing project context, narrow edits, risk-matched checks, and routing to diagnose/review/verify.", usage: "action phase pages" },
  { id: "skill_diagnose", type: "text_evidence", path: "skills/diagnose/SKILL.md", summary: "Diagnose handles unexplained failures through reproduce, minimize, single hypothesis, instrumentation, root cause, fix, and regression evidence.", usage: "failure phase pages" },
  { id: "skill_review", type: "text_evidence", path: "skills/review/SKILL.md", summary: "Review checks correctness, scope, evidence gaps, docs drift, artifacts, and entropy before ready claims.", usage: "review gate pages" },
  { id: "skill_verify", type: "text_evidence", path: "skills/verify/SKILL.md", summary: "Verify maps a concrete ready claim to fresh evidence using an evidence ladder and routes failing evidence to diagnosis.", usage: "verification and fresh evidence pages" },
  { id: "skill_cleanup", type: "text_evidence", path: "skills/cleanup/SKILL.md", summary: "Cleanup reconciles documentation, generated artifacts, recovery surfaces, and residual risks so knowledge does not rot after a batch.", usage: "cleanup and handoff pages" }
];

const commonNegative = "No later PPT text overlay, no placeholder art, no screenshot of prompt, no visible file paths, no asset ids, no protocol metadata, no source labels, no watermarks, no low-information hero-only page, no decorative neon clutter, no course-number method-code labels, no skill catalog layout, no tiny unreadable Chinese text.";
const commonStyle = "restrained cyberpunk engineering console, dark graphite background, cyan green and blue violet accents, thin grid lines, status lights, evidence-chain connectors, dense but readable Chinese teaching content, clear hierarchy, diagram/table/process visual, professional internal training deck";

const pageData = [
  ["从会用 Agent 到会驾驭 Agent", "会用工具不等于具备工程流程；真正难点是让 Agent 稳定、可控、可验证地完成复杂任务。", ["会用 Codex/Claude/Cursor 只是操作层", "复杂任务需要目标、边界、状态、证据和交接", "Harness Workflow 关注的是工作环境，不是模型炫技"], "two-layer contrast: user who can operate Agent tools vs engineered Agent workbench; central thesis strip", ["spec_teaching", "readme_workflow"]],
  ["Agent 开发为什么会失控", "失控往往来自工程环境缺口：需求漂移、上下文丢失、验证缺失、文档过期和范围膨胀。", ["需求在聊天里变化但没有落成合同", "上下文压缩后缺少恢复面", "完成声明没有新鲜证据", "文档和生成物跟不上真实代码"], "failure map with symptoms on left and missing harness controls on right", ["spec_teaching", "readme_workflow", "method_contract"]],
  ["对话驱动的局限", "聊天适合探索，但不适合承载长期任务的边界、验收、状态和责任。", ["对话容易把临时假设当事实", "长任务跨轮次后难以恢复", "人类很难审查 Agent 是否越界", "缺少可重复的验收路径"], "conversation stream dissolving into lost requirements, contrasted with durable artifacts", ["spec_teaching", "context_terms"]],
  ["规范驱动开发的核心思想", "把“想让 Agent 做什么”转成可执行、可验证、可恢复的工程规范。", ["规范不是写给人看的装饰文档", "规范定义目标、非目标、行为、约束和验证", "Agent 依据规范行动，人类依据规范审查"], "spec contract panel connected to action, evidence, recovery, review nodes", ["spec_teaching", "method_contract"]],
  ["Harness 到底是什么", "Harness 是围绕 Agent 的工作台：规则、上下文、状态、工具、验证和收尾共同约束工作。", ["不是提示词模板", "不是某一个 AGENTS.md", "不是固定三文件", "是让 Agent 在项目中可靠工作的运行环境"], "central Agent surrounded by six workbench modules with concise labels", ["readme_workflow", "context_terms", "method_contract"]],
  ["可靠 Agent 工作流的组件", "一个可靠工作流至少需要入口规则、项目地图、任务规格、执行计划、验证路径、恢复状态和清理纪律。", ["入口规则告诉 Agent 不能乱动什么", "项目地图降低探索成本", "验证路径把 ready claim 接到证据", "恢复状态让下个会话能接上"], "component checklist matrix: component / purpose / failure prevented", ["readme_workflow", "context_terms", "method_contract"]],
  ["规范驱动闭环总览", "澄清、规格、计划、初始化、行动、诊断、审查、验证、清理，组成可恢复的工程闭环。", ["每一环都产出可检查的状态或证据", "失败可以回路由，不必假装线性", "闭环完成后项目知识要回到真实状态"], "large lifecycle loop with nine nodes and route-back arrows, not a rigid pipeline", ["spec_teaching", "context_terms"]],
  ["第一步：不要急着实现", "模糊需求直接进实现，会让 Agent 自己补全目标并把隐藏假设写进代码或产物。", ["先识别问题是否清楚", "先问边界而不是先改文件", "先定义成功标准而不是先追速度"], "split screen: rush-to-code chaos vs clarify-first checkpoint", ["spec_teaching", "skill_brainstorm"]],
  ["澄清需求：把想法变成问题结构", "澄清阶段要把目标、用户、边界、非目标、约束、验收方式和风险摆上桌面。", ["目标：到底要改变什么", "非目标：明确不做什么", "约束：风格、路径、权限、时间", "验收：用什么证明完成"], "question grid turning a fuzzy request into structured requirement blocks", ["skill_brainstorm", "spec_teaching"]],
  ["Spec 的意义：不是文档，是执行合同", "Spec 同时约束 Agent 行为，也让人类能审查它是否做对。", ["Spec 是行为合同，不是会议纪要", "它把需求、边界、验证和残余风险固定下来", "后续 Plan 和 Review 都应回看 Spec"], "contract document in center with clauses mapped to agent actions and human review", ["skill_brainstorm", "context_terms"]],
  ["好 Spec 应该包含什么", "好 Spec 要覆盖背景、目标、非目标、行为要求、约束、验证策略和残余风险。", ["背景说明为什么做", "目标和非目标限制范围", "行为要求定义可观察结果", "验证策略提前定义证据"], "dense but readable anatomy diagram of a Spec with labeled sections", ["spec_teaching", "skill_brainstorm"]],
  ["为什么验证策略必须前置", "如果一开始不知道怎么证明做对，后面所有“完成”都可能只是幻觉。", ["验证不是最后补票", "不同任务需要不同证据强度", "没有证据路径的计划不可执行", "验证策略会反过来修正范围"], "evidence ladder planned before action, with red warning for proof-after-the-fact", ["skill_verify", "method_contract", "spec_teaching"]],
  ["从 Spec 到 Plan", "Plan 不是 TODO list，而是把目标切成 active slice、成功标准、验证路径和 commit 单元。", ["Spec 回答要什么", "Plan 回答下一片怎么做", "每个阶段都应有可验证出口", "commit 单元让历史可追溯"], "transformation flow: Spec contract -> Executable Plan -> slice cards -> verification gates", ["skill_plan", "plan_teaching"]],
  ["Active Slice：一次只做一件可验证的事", "WIP=1 是防止范围膨胀的核心纪律：当前只推进一个能被证明的切片。", ["active slice 要小到能验证", "不要在一个切片里混实现、重构、清理和实验", "切片结束必须留下证据或明确阻塞"], "single highlighted work lane with other tempting tasks parked in backlog", ["skill_plan", "skill_implement"]],
  ["初始化工作面：让 Agent 进入真实仓库", "行动前先确认项目地图、验证命令、保护路径、已有状态和能力缺口。", ["读 AGENTS/README/CONTEXT 不是形式", "验证命令必须来自项目真实入口", "保护路径和脏工作树决定改动边界", "能力缺口要显式评估"], "agent docking into repo workbench with panels: map, rules, status, checks, capabilities", ["skill_harness_builder", "readme_workflow", "context_terms"]],
  ["Recovery Surface：任务不能只活在聊天里", "恢复面保存目标、范围、证据、风险和下一步，让未来会话能从工件恢复任务状态。", ["短任务可以轻量", "长任务需要 durable artifact", "后端可以是 docs plan、issue、feature list 或既有系统", "关键是语义字段可恢复"], "backend selector with semantic fields above multiple storage options", ["context_terms", "plan_teaching"]],
  ["能力适配：工具不是越多越好", "skills、MCP、hooks、subagents 都应该服务具体缺口，而不是堆能力。", ["先问缺口是什么", "再评估收益、成本和风险", "能用项目已有脚本就不要发明新工具", "能力发现是辅助，不是主流程"], "capability fit decision matrix: gap/value/cost/risk/fallback", ["skill_harness_builder", "readme_workflow"]],
  ["行动阶段：小步执行，小步验证", "实现阶段要保持 scope，做最小必要改动，并用窄验证不断校准方向。", ["改动必须能追溯到 active slice", "优先复用现有模式和脚本", "改变行为就同步必要文档或状态", "检查失败要记录而不是绕过"], "green execution loop: inspect -> edit -> focused check -> evidence -> next", ["skill_implement", "method_contract"]],
  ["失败阶段：不要盲改", "失败要复现、最小化、提出单一假设、验证根因，然后再修复。", ["错误变化说明假设可能错了", "连续失败应切到诊断模式", "根因要写入恢复面或证据记录", "修复后要有回归证据"], "red diagnosis loop with reproduce/minimize/hypothesize/instrument/root cause/fix/regression", ["skill_diagnose", "skill_implement"]],
  ["Review 和 Verify 的区别", "Review 判断有没有做错、越界、缺证据；Verify 用当前证据证明 ready claim。", ["Review 是结构性判断", "Verify 是证据性证明", "Review 发现问题回实现或诊断", "Verify 失败说明 ready claim 不成立"], "two-gate diagram: review gate then evidence gate, with route-back arrows", ["skill_review", "skill_verify"]],
  ["Fresh Evidence：旧证据不能证明新结果", "只要文件、配置、数据或生成物变了，之前的测试、截图和口头结论就可能过期。", ["证据必须在最后一次相关改动之后产生", "验证命令要覆盖 ready claim", "绿色状态不能替代需求覆盖", "截图/QA/manifest 也要检查覆盖范围"], "timeline showing stale evidence before change vs fresh evidence after change", ["skill_verify", "method_contract"]],
  ["Cleanup：工程流程真正闭环的地方", "清理不是寒暄收尾，而是同步 README、状态、生成物、风险和交接信息。", ["文档要回到真实状态", "生成物要和源工件一致", "残余风险要可见", "不要把临时计划塞进长期入口"], "anti-entropy closing loop: artifacts reconcile into clean handoff package", ["skill_cleanup", "method_contract"]],
  ["Skill 是职责映射，不是主角", "规范驱动流程决定何时需要哪个 skill；skill 只是把职责落到可执行协议上。", ["brainstorm 负责澄清", "plan 负责执行合同", "harness-builder 负责工作面", "implement/diagnose/review/verify/cleanup 分别承担行动和质量闭环"], "role mapping table from workflow phase to skill responsibility, compact not catalog-like", ["context_terms", "skill_brainstorm", "skill_plan", "skill_harness_builder", "skill_implement", "skill_diagnose", "skill_review", "skill_verify", "skill_cleanup"]],
  ["贯穿案例：一个 PPT 需求如何被规范驱动", "“帮我做 PPT”会先被转成教学目标、Spec、Plan、Protocol、PNG、QA 和提交证据。", ["模糊请求先澄清教学目标", "Spec 定义不做 skill 清单", "Plan 定义 image-first 产物和验证", "Protocol 锁定每页教学点", "QA 证明 PPTX 结构符合路线"], "timeline using this deck production as case: request -> spec -> plan -> protocol -> images -> manifest -> pptx -> qa -> commit", ["spec_teaching", "plan_teaching"]],
  ["如果没有规范会怎样", "直接生成很容易内容跑偏、风格过头、无法验收、无法复用，下次也接不上。", ["看似更快，实际返工更多", "没有验收标准就无法判断好坏", "没有 protocol 就无法定位哪页失败", "没有 cleanup 就留下知识债"], "before/after failure comparison: prompt-only deck chaos vs protocol-driven deck traceability", ["spec_teaching", "plan_teaching"]],
  ["常见误区", "常见误区包括把 Harness 当单个文件、把 Plan 当 TODO、把 Verify 当跑一次命令、把 Cleanup 当可选。", ["Harness 是系统，不是一个入口文件", "Plan 要有 active slice 和证据路径", "Verify 要匹配 ready claim", "Cleanup 是防止项目知识腐烂的工程动作"], "myth vs reality matrix with four misconceptions and corrections", ["context_terms", "method_contract", "skill_verify", "skill_cleanup"]],
  ["方法论总结：Agent 不是被命令，而是被约束", "好流程不是限制 Agent，而是让它在正确边界内发挥能力。", ["约束目标让 Agent 不漂移", "约束范围让改动可审查", "约束证据让完成可证明", "约束收尾让项目可持续"], "central statement surrounded by four constraint rails: goal, scope, evidence, cleanup", ["method_contract", "readme_workflow"]],
  ["最终 Takeaway", "规范驱动开发让 Agent 工作可控、可验、可恢复、可交接。", ["从对话到规范", "从工具到工作台", "从一次性输出到可恢复工程流程", "下一次任务先问：状态是什么，证据在哪里，如何收尾"], "final high-density takeaway board with lifecycle loop and five concise principles", ["spec_teaching", "readme_workflow", "context_terms"]]
];

protocol.mode = "reference_grounded_mode";
protocol.source = {
  brief: "Teaching-oriented image-first deck explaining Harness Workflow as specification-driven Agent development and Harness engineering.",
  inputs: assets.map((asset) => asset.path),
  reference_mode_note: "References are local Markdown repository sources and generated reference intake assets. No OCR or external document extraction is required."
};
protocol.deck = {
  title: "规范驱动的 Agent 开发：Harness Workflow 工程思想课件",
  language: "zh",
  audience: "已经会使用 Codex / Claude Code / Cursor 等 Agent 编程工具，但需要理解如何用规范、工作面、证据和清理纪律驾驭复杂 Agent 任务的开发者、维护者和教学读者。",
  page_count: pageData.length,
  aspect_ratio: "16:9",
  output_pptx: "docs/decks/harness-workflow-teaching-deck.pptx"
};
protocol.style = {
  description: "Restrained cyberpunk engineering console for a dense teaching deck: dark graphite canvas, cyan/green/blue-violet accents, thin grids, status lights, evidence chains, compact matrices and lifecycle diagrams. Teaching clarity comes first; avoid neon poster decoration.",
  template_image_ids: [],
  logo_ids: [],
  palette: ["#070B10", "#0E1726", "#13F2A3", "#22D3EE", "#7C3AED", "#F59E0B", "#E5F3FF"],
  typography: "Chinese-first sans-serif similar to Microsoft YaHei / Noto Sans CJK. Large readable headings, compact but legible body text, no microscopic paragraphs. Use diagram labels instead of long prose blocks.",
  page_number_policy: "Use a consistent small bottom-right page/total footer on every slide: 01/28 through 28/28.",
  visible_text_policy: "Render only reader-facing Chinese teaching content. Do not render asset ids, filenames, paths, source labels, protocol metadata, parser labels, or internal method-code labels."
};
protocol.assets = assets;
protocol.pages = pageData.map(([title, claim, points, visual, refs], index) => {
  const page = index + 1;
  const footer = `${String(page).padStart(2, "0")}/28`;
  return {
    page,
    title,
    claim,
    content_inputs: { text: refs, tables: [], images: [] },
    reference_asset_ids: refs,
    fidelity: "light_redraw",
    final_image_prompt: `Create a complete finished full-slide 16:9 PNG for a Chinese teaching PPT. Slide ${footer}. Title: ${title}. Main claim: ${claim} Required teaching points: ${points.join("；")}。Visual structure: ${visual}. Global style: ${commonStyle}. Make it information-dense but readable, suitable for readers who already use Agent coding tools. All visible text must be inside the image. Include the consistent footer ${footer}.`,
    negative_prompt: commonNegative,
    output_png: `slides/slide-${String(page).padStart(2, "0")}.png`,
    speaker_notes: `本页讲解重点：${claim} 讲的时候先点出本页结论，再按这几个教学点展开：${points.join("；")}。这一页要服务整套主线：从对话驱动转向规范驱动，让 Harness 被理解为工程工作台而不是工具清单。过渡到下一页时，强调下一个环节如何继续收紧目标、状态或证据。`,
    free_generation: false
  };
});

fs.writeFileSync(protocolPath, `${JSON.stringify(protocol, null, 2)}\n`, "utf8");
fs.writeFileSync(
  assetIndexPath,
  `${JSON.stringify({ kind: "ppt-composer-asset-index", version: "0.1", assets }, null, 2)}\n`,
  "utf8"
);

console.log(JSON.stringify({ protocolPath, pages: protocol.pages.length, assets: protocol.assets.length }, null, 2));
