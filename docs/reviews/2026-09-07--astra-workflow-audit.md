# Harness Workflow 全量审核与优化

Date: 2026-09-07
Status: complete — source verified and local plugin installed
Baseline: 1b0ea87 / installed 0.3.1
Scope: 12 个技能、全部技能资源、canonical rules、安装包、Cursor 镜像、现行合同/入口及结构验证器。
原桌面源码有未提交修改且落后；使用独立工作树，未覆盖它，也不推送远端。

## 官方依据

已读取 [GPT-6 Astra 官方指南](https://developers.openai.com/api/docs/guides/latest-model#prompting-best-practices)：技能冲突会影响执行，授权内推进、必要时才确认，按风险控制测试。
[官方技能文档](https://developers.openai.com/codex/skills) 强调职责聚焦、明确触发、按需加载。这里的具体删改是本地审核判断，不是官方弃用清单。

## 改动决定

| 范围 | 原问题 | 处理 |
| --- | --- | --- |
| brainstorm | 固定访谈轮数、写 draft 前后重复确认 | 重要决策才问，可先 draft，复用已明确批准 |
| plan | 写完即停、关闭其他 active、字段重复 | 尊重执行/仅计划范围；按轨道跟踪；简化工作项 |
| implement | 小改动也强制失败测试及路由闸门 | 按风险验证，低风险可直接完成 |
| diagnose | 重复两次、固定三轮、无复现不得分析 | 按信息增益和成本调查，未证实不作修复声明 |
| review | 两次代理、工具缺失即失败、证据机械过期 | 统一证据审查，复用有效证据；必需验收仍严格 |
| verify | 别名残留独立规则、三处相对路径错误 | 单次指向 review，修复引用 |
| cleanup | 阻塞不能收尾、强制唯一 active 和删除 | 允许未完成交接、多轨道及零修改 |
| harness-builder | 精确 patch 逐级确认、所有类别填矩阵 | 传递已有授权，仅实际缺口使用相关 helper |
| recovery-surface-builder | backend-neutral 与强制 .harness 矛盾 | 只为 harness backend 要求对应文件 |
| agent-instructions-maintainer | 只许新增、百分制、Claude 全局路径泛化 | 支持删改合并、按运行时发现、具体证据报告 |
| capability-recommender | 按类别配额、静态产品/模型目录 | 现有工具优先，允许零推荐 |
| find-skills | 普通问题触发、排行榜及 stars 门槛、默认全局安装 | 明确缺口触发，审查内容与平台，保留安装范围 |

同时修正：模板/schema/validator 三方不一致；移除 research trailer 遗留 hook；启发式文档长度改警告；rules 改薄适配指针；流程图不再把 verify 画成独立阶段；现行 SkillOpt canary 不再奖励旧闸门短语。
12 个入口正文字符数：60549 → 11736。这不是 token 计费或质量提升百分比。
已有 5 份 agents/openai.yaml 的显式调用策略保持不变；补齐官方插件验证器所需的展示元数据。平台边界、无关改动保护、必要授权、真实行为证据和 unknown 不等于通过均保留。

## 已执行验证

- `node scripts/check-plugin.mjs`、`check-claude-code-install.mjs`、`check-cursor-install.mjs` 全部通过；Cursor installer dry-run 通过。
- `validate_harness.py` 通过，`tests/test_scripts.py` 6/6 通过。
- 官方 `quick_validate.py` 12/12 技能通过；官方 `validate_plugin.py plugins/harness-workflow` 通过。
- Jinja 渲染 manifest/features 后成功 JSON 解析，manifest 符合 JSON Schema；Windows 路径、引号、换行样例通过；reminder hook 渲染后可编译。
- 4 组静态 canary 各 3/3 通过；skill-bench schema 检查通过。这里只是结构及旧规则回归检查。
- 两路独立只读复核完成；修正收尾反向措辞及 Cursor 复制安装路径。无剩余阻断发现。
- 13 个技能流程 HTML 页面已重新生成。

## 本机安装

- 版本：`0.3.1+codex.20260907012458`，installed/enabled 均为 true。
- 独立源码：`C:/Users/shash/Desktop/harness-workflow-astra-audit`，分支 `codex/astra-workflow-audit`。
- 通过 Codex CLI 将同名市场由远端 Git 来源切换到此本地目录，未推送远端；以后该市场使用这份本地源码。
- 已重新安装；安装缓存与 `plugins/harness-workflow` 全部 132 文件 SHA-256 一致。
- 在新任务中使用更新后的技能。旧任务已加载的指令不会自动替换。
- 如需恢复远端安装来源，可用 CLI 移除本地市场记录、重新添加 `https://github.com/YSAA1/harness-workflow.git` 并重新安装；先保留本次本地分支，避免丢失未发布改进。

## 验证与限制

- Python validator 回归：覆盖已有 backend 不强制目录、harness 显式检查、长度警告不失败、manifest 缺字段会失败，以及现有扫描测试。
- 结构检查覆盖 manifest、12 技能元数据、相对引用、安装包与 Cursor 镜像；不代表真实业务任务质量已经通过评测。
- 场景审阅见 `evals/workflow-policy/scenarios.json`，包含 16 个正反边界；这是规则审阅用例，不伪称在线模型轨迹测试。
- SkillOpt 旧案例/历史分数不与新 canary 直接比较；未运行付费模型优化或在线基准。
- 扫描脚本仍只是候选发现，非所有运行时能力的完整清单；Python 技术栈和 linked-worktree remote 扫描局限本次未扩展功能。
- 可选 hook 是需按平台适配验证的示例，不是安全边界，不默认安装。

## 覆盖清单

基线 128 个技能资源，本版 127 个。两路独立只读审计覆盖 workflow/recovery/harness 子树；主代理检查三个能力/指令 helper 与现行适配面。历史研究报告、旧评测结果未作为现行政策重写。

| 资源 | 处理 |
| --- | --- |
| `skills/agent-instructions-maintainer/references/attribution.md` | 修订并纳入验证 |
| `skills/agent-instructions-maintainer/references/quality-criteria.md` | 修订并纳入验证 |
| `skills/agent-instructions-maintainer/references/templates.md` | 修订并纳入验证 |
| `skills/agent-instructions-maintainer/references/update-guidelines.md` | 修订并纳入验证 |
| `skills/agent-instructions-maintainer/SKILL.md` | 修订并纳入验证 |
| `skills/brainstorm/agents/openai.yaml` | 补齐展示元数据，保留调用策略 |
| `skills/brainstorm/references/clarification-coverage.md` | 修订并纳入验证 |
| `skills/brainstorm/references/clarification-loop.md` | 修订并纳入验证 |
| `skills/brainstorm/references/design-grill.md` | 修订并纳入验证 |
| `skills/brainstorm/references/spec-drafting.md` | 修订并纳入验证 |
| `skills/brainstorm/references/spec-review-checklist.md` | 修订并纳入验证 |
| `skills/brainstorm/SKILL.md` | 修订并纳入验证 |
| `skills/brainstorm/templates/spec.md` | 修订并纳入验证 |
| `skills/brainstorm/templates/spec.zh-CN.md` | 修订并纳入验证 |
| `skills/capability-recommender/references/attribution.md` | 修订并纳入验证 |
| `skills/capability-recommender/references/hooks-patterns.md` | 修订并纳入验证 |
| `skills/capability-recommender/references/mcp-servers.md` | 修订并纳入验证 |
| `skills/capability-recommender/references/plugins-reference.md` | 修订并纳入验证 |
| `skills/capability-recommender/references/skills-reference.md` | 修订并纳入验证 |
| `skills/capability-recommender/references/subagent-templates.md` | 修订并纳入验证 |
| `skills/capability-recommender/SKILL.md` | 修订并纳入验证 |
| `skills/cleanup/references/doc-shelves.md` | 修订并纳入验证 |
| `skills/cleanup/references/entropy-checklist.md` | 修订并纳入验证 |
| `skills/cleanup/references/handoff-hygiene.md` | 修订并纳入验证 |
| `skills/cleanup/SKILL.md` | 修订并纳入验证 |
| `skills/diagnose/references/harness-layer-patterns.md` | 审核保留 |
| `skills/diagnose/SKILL.md` | 修订并纳入验证 |
| `skills/find-skills/SKILL.md` | 修订并纳入验证 |
| `skills/harness-builder/agents/openai.yaml` | 补齐展示元数据，保留调用策略 |
| `skills/harness-builder/evals/evals.json` | 修订并纳入验证 |
| `skills/harness-builder/references/anti_entropy.md` | 修订并纳入验证 |
| `skills/harness-builder/references/architecture_enforcement_policy.md` | 审核保留 |
| `skills/harness-builder/references/automation_commands_reference.md` | 修订并纳入验证 |
| `skills/harness-builder/references/automation_hooks_patterns.md` | 修订并纳入验证 |
| `skills/harness-builder/references/automation_mcp_servers.md` | 修订并纳入验证 |
| `skills/harness-builder/references/automation_plugins_reference.md` | 修订并纳入验证 |
| `skills/harness-builder/references/automation_recommendation_attribution.md` | 审核保留 |
| `skills/harness-builder/references/automation_recommendation_guide.md` | 修订并纳入验证 |
| `skills/harness-builder/references/automation_skills_reference.md` | 修订并纳入验证 |
| `skills/harness-builder/references/automation_subagent_templates.md` | 修订并纳入验证 |
| `skills/harness-builder/references/capability_discovery_playbook.md` | 修订并纳入验证 |
| `skills/harness-builder/references/controller_discipline.md` | 修订并纳入验证 |
| `skills/harness-builder/references/decision_matrix.md` | 修订并纳入验证 |
| `skills/harness-builder/references/install_policy.md` | 修订并纳入验证 |
| `skills/harness-builder/references/living_docs_discipline.md` | 修订并纳入验证 |
| `skills/harness-builder/references/recommendation_matrix_policy.md` | 修订并纳入验证 |
| `skills/harness-builder/references/recovery_policy.md` | 修订并纳入验证 |
| `skills/harness-builder/references/recovery_surface_policy.md` | 修订并纳入验证 |
| `skills/harness-builder/references/source_of_truth_tiers.md` | 修订并纳入验证 |
| `skills/harness-builder/references/subagent_orchestration.md` | 修订并纳入验证 |
| `skills/harness-builder/references/verification_policy.md` | 修订并纳入验证 |
| `skills/harness-builder/schemas/harness_manifest.schema.json` | 修订并纳入验证 |
| `skills/harness-builder/schemas/phase_acceptance.schema.json` | 审核保留 |
| `skills/harness-builder/schemas/recommendation_matrix.schema.json` | 审核保留 |
| `skills/harness-builder/scripts/diff_harness_plan.py` | 审核保留 |
| `skills/harness-builder/scripts/find_skills.py` | 审核保留 |
| `skills/harness-builder/scripts/inventory_references.py` | 审核保留 |
| `skills/harness-builder/scripts/scan_project.py` | 修订并纳入验证 |
| `skills/harness-builder/scripts/scan_project_automation.py` | 审核保留 |
| `skills/harness-builder/scripts/scan_project_catalog.py` | 审核保留 |
| `skills/harness-builder/scripts/scan_project_domain_types.py` | 审核保留 |
| `skills/harness-builder/scripts/scan_project_git.py` | 审核保留 |
| `skills/harness-builder/scripts/scan_project_matchers.py` | 审核保留 |
| `skills/harness-builder/scripts/scan_project_packages.py` | 审核保留 |
| `skills/harness-builder/scripts/scan_project_report.py` | 审核保留 |
| `skills/harness-builder/scripts/scan_project_types.py` | 审核保留 |
| `skills/harness-builder/scripts/validate_harness.py` | 修订并纳入验证 |
| `skills/harness-builder/scripts/validate_harness_assets.py` | 审核保留 |
| `skills/harness-builder/scripts/validate_harness_catalog.py` | 修订并纳入验证 |
| `skills/harness-builder/scripts/validate_harness_frontmatter.py` | 修订并纳入验证 |
| `skills/harness-builder/scripts/validate_harness_integrity.py` | 审核保留 |
| `skills/harness-builder/scripts/validate_harness_scripts.py` | 修订并纳入验证 |
| `skills/harness-builder/scripts/validate_harness_security.py` | 审核保留 |
| `skills/harness-builder/scripts/validate_harness_target.py` | 修订并纳入验证 |
| `skills/harness-builder/SKILL.md` | 修订并纳入验证 |
| `skills/harness-builder/templates/AGENTS.md.j2` | 修订并纳入验证 |
| `skills/harness-builder/templates/check.sh.j2` | 审核保留 |
| `skills/harness-builder/templates/commit_convention.md.j2` | 审核保留 |
| `skills/harness-builder/templates/decisions.md.j2` | 审核保留 |
| `skills/harness-builder/templates/features.json.j2` | 修订并纳入验证 |
| `skills/harness-builder/templates/hooks/block_destructive_shell.py.j2` | 修订并纳入验证 |
| `skills/harness-builder/templates/hooks/hooks.json.j2` | 审核保留 |
| `skills/harness-builder/templates/hooks/protected_paths.py.j2` | 修订并纳入验证 |
| `skills/harness-builder/templates/hooks/verification_reminder.py.j2` | 修订并纳入验证 |
| `skills/harness-builder/templates/manifest.yaml.j2` | 修订并纳入验证 |
| `skills/harness-builder/templates/progress.md.j2` | 修订并纳入验证 |
| `skills/harness-builder/templates/project_context.md.j2` | 审核保留 |
| `skills/harness-builder/templates/recovery_policy.md.j2` | 修订并纳入验证 |
| `skills/harness-builder/templates/reports/verification_report.md.j2` | 审核保留 |
| `skills/harness-builder/templates/risk_register.md.j2` | 审核保留 |
| `skills/harness-builder/templates/session_handoff.md.j2` | 审核保留 |
| `skills/harness-builder/templates/state.md.j2` | 修订并纳入验证 |
| `skills/harness-builder/templates/verification.md.j2` | 修订并纳入验证 |
| `skills/harness-builder/templates/work_index.md.j2` | 修订并纳入验证 |
| `skills/harness-builder/templates/workflow.md.j2` | 修订并纳入验证 |
| `skills/harness-builder/tests/test_scripts.py` | 修订并纳入验证 |
| `skills/implement/references/verification-intensity.md` | 修订并纳入验证 |
| `skills/implement/SKILL.md` | 修订并纳入验证 |
| `skills/plan/agents/openai.yaml` | 补齐展示元数据，保留调用策略 |
| `skills/plan/SKILL.md` | 修订并纳入验证 |
| `skills/recovery-surface-builder/references/anti_entropy.md` | 修订并纳入验证 |
| `skills/recovery-surface-builder/references/living_docs_discipline.md` | 修订并纳入验证 |
| `skills/recovery-surface-builder/references/planning_with_files_adaptation.md` | 修订并纳入验证 |
| `skills/recovery-surface-builder/references/recovery_policy.md` | 修订并纳入验证 |
| `skills/recovery-surface-builder/references/recovery_surface_policy.md` | 修订并纳入验证 |
| `skills/recovery-surface-builder/references/source_of_truth_tiers.md` | 修订并纳入验证 |
| `skills/recovery-surface-builder/references/verification_policy.md` | 修订并纳入验证 |
| `skills/recovery-surface-builder/SKILL.md` | 修订并纳入验证 |
| `skills/recovery-surface-builder/templates/decisions.md.j2` | 审核保留 |
| `skills/recovery-surface-builder/templates/progress.md.j2` | 修订并纳入验证 |
| `skills/recovery-surface-builder/templates/recovery_policy.md.j2` | 修订并纳入验证 |
| `skills/recovery-surface-builder/templates/state.md.j2` | 修订并纳入验证 |
| `skills/recovery-surface-builder/templates/work_index.md.j2` | 修订并纳入验证 |
| `skills/review/agents/openai.yaml` | 补齐展示元数据，保留调用策略 |
| `skills/review/references/adversarial-reviewer-prompt.md` | 修订并纳入验证 |
| `skills/review/references/attack-taxonomy.md` | 修订并纳入验证 |
| `skills/review/references/capability-recommendations.md` | 修订并纳入验证 |
| `skills/review/references/cold-verifier-prompt.md` | 修订并纳入验证 |
| `skills/review/references/cross-cutting-anti-patterns.md` | 修订并纳入验证 |
| `skills/review/references/evidence-ladder.md` | 修订并纳入验证 |
| `skills/review/references/premature-completion-patterns.md` | 修订并纳入验证 |
| `skills/review/SKILL.md` | 修订并纳入验证 |
| `skills/verify/agents/openai.yaml` | 补齐展示元数据，保留调用策略 |
| `skills/verify/references/capability-recommendations.md` | 修订并纳入验证 |
| `skills/verify/references/cold-verifier-prompt.md` | 修订并纳入验证 |
| `skills/verify/references/evidence-ladder.md` | 修订并纳入验证 |
| `skills/verify/SKILL.md` | 修订并纳入验证 |

移除：`skills/harness-builder/templates/hooks/commit_trailer_enforcer.py.j2`，无现行调用者；不保留无效 no-op 示例。
