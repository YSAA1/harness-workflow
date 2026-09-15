---
name: harness-builder
description: "修复或建立跨入口、恢复、验证和能力配置的项目工作台。只处理实际缺口；已有工作台足够时直接回原任务，窄指令或恢复问题用对应 helper。"
---

# Harness Builder

这是跨工作台问题的总控；交付与缺口相称的配置或建议，不把完整工作流当作所有任务前置条件。

## 流程

1. 阅读与用户目标相关的入口、配置、脚本、恢复记录和实际错误。确认 canonical source、目标运行时及已有能力。
2. 仅对真实缺口选方案，并识别可拆除的过期组件；简单修复可直接说明文件和检查，跨领域改造用一张 HARNESS RECOMMENDATION MATRIX 汇总缺口、证据、处理方式、负责人和验证。Required / Recommended / Deferred / Rejected 是建议等级，不是安装授权。
3. helper 路由见下表。独立、边界明确的只读调查可并行；简单一行修改无需为每类文件完整启动另一套工作流，跨 helper 传递已有目标和授权。
4. USER CHECKPOINT 仅用于实际缺少的授权或关键取舍。仅审计/推荐时只读；明确要求建立、修复或优化时完成范围内可逆编辑和必要验证，不要求用户批准每个精确 patch。新增外部操作或扩大配置范围需另行授权。
5. 修改 canonical source；安装面受影响时同步 `.claude-plugin/` manifest 与 `README.md`、`docs/install.md`，验证真实目标。不要默认安装 hooks、MCP、子代理配置或所有模板。
6. 相关检查通过且风险低时可以完成；复杂合同修改按 `review` 进一步审阅。若用户同时授权后续产品工作，继续该工作；仅工作台推荐不授权执行产品任务。

## Helper Skill routing

| 缺口 | Helper Skill |
| --- | --- |
| 持久指令与恢复/状态面（AGENTS / CLAUDE / Cursor rules、work index、plan、state） | `writing-for-agents`（Writing for Agents） |
| 能力选型 | `capability-recommender`（Capability Recommender，只读） |
| 明确需要寻找技能 | `find-skills` |

## 按需参考

- 范围与授权：`references/controller_discipline.md`、`references/install_policy.md`。
- 推荐矩阵：`references/recommendation_matrix_policy.md`；配置落点：`references/decision_matrix.md`。
- 验证入口：`references/verification_policy.md`；架构守卫：`references/architecture_enforcement_policy.md`；漂移：`references/anti_entropy.md`。
- 缺少 helper 时可用 `references/capability_discovery_playbook.md`；不要把 fallback 当重复必读。
- 需要并行调查时：`references/subagent_orchestration.md`。

## Recommended next skill

按尚未完成的实际工作选择 helper、`implement`、`diagnose` 或 `review`；只有本次记录需要整理时用 `cleanup`，否则结束。
