---
name: capability-recommender
description: "针对已确认的工具或工作流缺口推荐 skills、hooks、MCP、subagents 或插件。仅做只读推荐；已有能力足够时不添加工具，不按技术栈关键词自动推荐安装。"
---

# Capability Recommender

这是只读能力设计 Helper Skill。以具体任务缺口为输入，比较现有工具和最少新增能力，不负责安装。派生来源见 `references/attribution.md`。

## 流程

1. 查现有可用工具、项目命令及实际失败点。若现有能力足够，说明无需新增并结束。
2. 仅调查能解决缺口的候选；需要当前外部能力事实时读官方文档或实现，技能发现可用 `find-skills`。不要求为每类工具凑推荐数量，也不做无关全网搜索。
3. 比较任务价值、兼容平台、权限、维护成本、已有能力重复度和最小验证方式。下载量、stars 只作背景，不作为质量门槛。第三方 skill/plugin 候选先过 `../find-skills/references/skill-audit-checklist.md` 红旗。
4. 给紧凑推荐：缺口 → 候选/现有替代 → 理由 → 安装范围 → 验证；有意义时用 Required / Recommended / Deferred / Rejected。允许零推荐。
5. 用户已请求安装时，将具体候选和范围交给适用安装工具或 `harness-builder` 继续；本技能不写配置，也不要求用户重述已有授权。

## 按需参考

`references/skills-reference.md`、`hooks-patterns.md`、`mcp-servers.md`、`subagent-templates.md`、`plugins-reference.md` 是决策参考，不是当前已安装目录。只读相关类别。

## Recommended next skill

- 只读推荐已完成：结束。
- 已授权的安装/整合：对应安装工具或 `harness-builder`。
- 指令问题：`agent-instructions-maintainer`；恢复记录问题：`recovery-surface-builder`。
