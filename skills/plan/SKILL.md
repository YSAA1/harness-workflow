---
name: plan
description: "用于多阶段、依赖复杂或需要跨会话恢复的任务，形成可执行计划，并在项目无恢复面时建立最小恢复面（work_index + state + AGENTS 指针）。用户只要计划时交付后结束；已授权执行时计划后继续。小补丁不强制使用。"
---

# Executable Plan

计划说明做什么、先后关系及如何验收，复用用户请求、已批准 Spec、issue 和现有项目记录，不要求再创建一套需求材料。

## 流程

1. 从现有证据确定目标、范围、验收和依赖。只对影响结果的未定取舍询问，常规实现选择自行决定并说明必要假设。
2. 优先更新项目现有 planning surface；无惯例且确需持久计划时用 `docs/plans/YYYY-MM-DD--<topic>-plan.md`。短任务可使用对话计划；改动可用一句话描述且无跨文件依赖时，不落盘计划文件。
3. 写目标、范围、可执行工作项、验证方式、重要依赖或风险。多阶段任务写最终整体验收标准（`final_integration_claim`），不以每步通过替代整体成功。
4. Markdown 工作项使用 checkbox；issue 或现有 tracker 保留其原生状态。按轨道标注当前项和依赖，独立工作可并行。
5. 恢复面：项目已有恢复面（`.harness/`、tracker 等）→ 按需同步本轨道入口，仅在同一轨道明确换轨时替换旧计划状态，不关闭其他轨道。项目无恢复面且本任务确需跨会话恢复 → 建立最小面，并在项目 `AGENTS.md` 挂一行指针（读取顺序：lessons（若有）→ work_index active 行 → state）：
   - `.harness/work_index.md`：表头 ID/标题/Status/Primary artifact/Last verified + 本任务 active 行（primary artifact 指向本计划文件）；维护规则：不删历史行、同轨道换轨更新旧入口。
   - `.harness/state.md`：Objective / Status / Primary artifact / Evidence / Next / Limits 六字段。
   短任务仍用对话计划，零文件；复用项目既有 tracker 优先，不强制 `.harness/`。
6. 用户只要求计划时交付后结束。已授权实现时继续执行可推进步骤；写计划不是新的批准门槛。

## 验证与提交

- 验证受阻时记录缺口、可用证据及不能作出的声明；继续不依赖缺口的工作。不要把工具暂缺自动变成重新搭建工作台的任务。
- 不用替代检查冒充原验收；改变约定验收标准需用户同意。
- commit unit 可用于有意义的里程碑，不是每个计划的必填项。提交需满足项目约定和相关验证；`verify` 是 `review` 的别名，不是第二轮检查。
- 不强制为每项重复填写 acceptance_criteria、verification_commands、success_definition；行动和成功条件清楚即可。

## Recommended next skill

- 已授权且需要改动：`implement`；根因未知：`diagnose`。
- 用户要求审阅或改动需要深入检查：`review`。
- 仅在真实工作台缺口需要修复时：`harness-builder`；仅计划请求：结束。
