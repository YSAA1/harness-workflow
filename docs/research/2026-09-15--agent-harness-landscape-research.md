# 个人 Agent Harness 开发调研（2025–2026）

日期：2026-09-15
方法：4 路并行 subagents（agent-reach search/web/dev 渠道 + WebSearch/WebFetch/Jina），全部核对一手来源；服务于 Work Index 014「插件整合优化」的前置调研。
范围：Anthropic harness/context engineering 官方一手资料、Agent Skills 开放规范与生态、spec-driven development 现状、跨会话恢复与记忆模式。

## 一、Anthropic 官方一手资料（harness / context engineering）

1. **《Building effective agents》（2024-12-19）**：workflow（预定义路径）vs agent（模型自决）分层；五种模式中 evaluator-optimizer 直接对应 implement→review 闸门；收尾三原则：设计简单、展示 planning 过程、像打磨 HCI 一样打磨 ACI。
   https://www.anthropic.com/research/building-effective-agents
2. **《Writing effective tools for agents — with agents》（2025-09-11）**：工具描述质量可测影响表现；error/truncation 响应要给可执行修正建议而非裸错误码。
   https://www.anthropic.com/engineering/writing-tools-for-agents
3. **《Effective context engineering for AI agents》（2025-09-29）**：context 是稀缺资源，"找到最小高信号 token 集"；长程三策略 compaction / structured note-taking（外部持久 NOTES 式文件）/ sub-agent；just-in-time retrieval（只持轻量标识按需加载）。
   https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
4. **Context management 平台原语（2025-09-29）**：context editing + memory tool 比基线 +39%；`.harness/` 文件式状态本质是自建 memory tool。
   https://claude.com/blog/context-management
5. **《Equipping agents for the real world with Agent Skills》（2025-10-16，2025-12-18 更新）**：三级渐进加载（metadata→正文→资源）；SKILL.md 臃肿即拆分；bundled scripts 不占 context 却提供确定性执行；重点打磨 name/description。
   https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills
6. **《Effective harnesses for long-running agents》（2025-11-26）**：两段式 harness（initializer + coding agent）；每 session 只做一个 feature；feature 清单用 JSON 而非 Markdown（模型更难擅改）；强硬措辞保护测试（只许翻转 passes 字段）；每 session 以干净 git commit 收尾；固定启动例程（查目录→读 git log 和 progress→挑最高优先级未完成项）。注：网传 "effective harnesses for coding agents" 一文不存在，实际即此文。
   https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
7. **《Harness design for long-running application development》（2026-03-24）**：harness 组件都是"关于模型当前做不到什么"的临时假设，需随模型进步逐个拆除并测量；generator/evaluator 必须分离（自评偏乐观）；per-sprint 先协商可测契约再写码（硬性 pass/fail）；spec 保持高层级，防止 planner 猜错细节级联。
   https://www.anthropic.com/engineering/harness-design-long-running-apps
8. **Claude Code best practices（2026 现行版）**：CLAUDE.md 逐行自问"删掉会犯错吗"；"能用一句话描述 diff 就跳过 plan"；验证必须给可运行检查，"show evidence rather than asserting success"；subagent 做调研保持主对话干净；不相关任务间 /clear；并行用 git worktrees。
   https://code.claude.com/docs/en/best-practices
9. **《How we built our multi-agent research system》（2025-06-13）**：multi-agent 适合可并行、宽搜索型任务（约 15x token），**不适合紧耦合编码**；subagent 任务描述必须含目标、输出格式、工具指引与边界。
   https://www.anthropic.com/engineering/multi-agent-research-system

## 二、Agent Skills 开放规范与生态

1. **规范已是开放标准**：agentskills.io + `agentskills/agentskills`（Apache-2.0，2025-12-16 建立，~25k stars）为真相源，提供 `skills-ref validate` 官方校验工具。
   https://agentskills.io/specification
2. **规范核心约束**：必填 `name`（必须匹配目录名）+ `description`（≤1024 字符，写清 what + when）；推荐目录 `scripts/`、`references/`、`assets/`；SKILL.md body 建议 <5000 tokens / <500 行；引用保持一层深度。`allowed-tools` 仍标 experimental。
   https://agentskills.io/specification
3. **生态采用 45+ 客户端**：Claude Code、ChatGPT & Codex、Cursor、Gemini CLI、Copilot 等。Codex 读 `.agents/skills`；Cursor 读 `.cursor/skills` + `.agents/skills`；Grok Build 读 `.grok/skills` 且"零配置完全兼容 Claude Code"（直接读 Claude marketplaces/plugins/skills/CLAUDE.md）；Kimi Code 读 `.agents/skills/`。**`.agents/skills` 是 Codex/Kimi/Cursor/Grok 的最大公约数目录**；Grok 可直接复用 `.claude-plugin/` 面，无需单独 manifest。
   https://learn.chatgpt.com/docs/build-skills · https://cursor.com/docs/context/skills · https://docs.x.ai/build/features/skills-plugins-marketplaces · https://moonshotai.github.io/kimi-cli/en/customization/skills.html
4. **分发双轨**：antfu/skills-cli（skills.sh，npm 包 `skills`）`npx skills add owner/repo -a codex -a claude-code` 一次覆盖 30–75+ agent；Claude 侧走 `.claude-plugin/marketplace.json`。
   https://github.com/antfu/skills-cli
5. **跨端兼容风险**：Claude Code 私有 frontmatter（`disable-model-invocation`、`context: fork` 等）在 claude.ai 上传 / Skills API 场景会**硬报错**；端私有策略应放 adapter 层（如 Codex 的 `agents/openai.yaml`），公共 SKILL.md 只用规范字段。
   https://code.claude.com/docs/en/skills
6. **context 经济**：激活 skill 内容跨 turn 常驻；auto-compaction 时每 skill 重挂最多 5,000 tokens、共享 25,000 预算——重协议 skill 必须 SKILL.md 瘦身、细节下沉 references/。
   https://code.claude.com/docs/en/skills
7. **安全是实证攻击面**：Snyk ToxicSkills 发现 ClawHub marketplace 36% skills 含安全缺陷（1,467 个漏洞 skill）；Datadog（2026-05-11）披露 `Clawsights` 恶意 skill 利用 dynamic context（`` !`command` `` 预处理）+ `allowed-tools: Bash(*)` 预授权窃取 GitHub token。缓解：`disableSkillShellExecution`、审计嵌套 `.claude/skills/`、grep 红旗（curl/wget/nc、宽 Bash 授权、外部 URL）。
   https://snyk.io/blog/toxicskills-malicious-ai-agent-skills-clawhub/ · https://securitylabs.datadoghq.com/articles/malicious-skills-supply-chain-risks-in-coding-agents-with-dynamic-context/

## 三、Spec-driven development 与 plan artifact 现状

1. **GitHub Spec Kit 1.0（2026-08-21，~137k stars）**：命令面 constitution → specify → plan → tasks → implement → converge（核对代码与 spec 差异循环至 Converged）→ analyze（跨 artifact 一致性）。constitution = 项目铁律文件化。
   https://github.com/github/spec-kit
2. **最尖锐批评**："reinvented waterfall"（Scott Logic 实测：2,577 行 markdown 对 689 行代码，慢约 10 倍）；社区共识回退为**按任务规模分层裁剪**——小改动用 Plan Mode，大特性才上 spec 流水线。"code is law"：验证真代码输出，markdown 自洽不算数。
   https://blog.scottlogic.com/2025/11/26/putting-spec-kit-through-its-paces-radical-idea-or-reinvented-waterfall.html · https://github.com/github/spec-kit/discussions/1784
3. **Kiro 减重**（2026-08-27）：三件套保留，但新增 **Quick Spec**（理解充分时跳过审批门）；tasks 按依赖图分 waves 波内并行。
   https://kiro.dev/docs/specs/
4. **Matt Pocock skills（~262k stars）**：反对"owning the process"的重框架，主张小、可改、可组合；user-invoked（编排）与 model-invoked（纪律）二分，user-invoked 不得链式调用 user-invoked；主流程 grill → domain-model → PRD/Spec → tickets → tdd → review。
   https://github.com/mattpocock/skills · https://www.aihero.dev/skills
5. **方法论源头确认**：本插件的 "Learn Harness Engineering" 实为 walkinglabs/learn-harness-engineering（15.2k stars，MIT）：harness 五子系统 instructions / state / verification / scope / session lifecycle；会话生命周期 Start（读指令+state）→ 恰好选一个 feature → 执行+验证 → Wrap up（更新日志、commit、干净交接）。
   https://github.com/walkinglabs/learn-harness-engineering
6. **Plan-mode 三端趋同**：计划持久化为 markdown + 人工审批门。Claude Code 默认存 `~/.claude/plans/`（不进版本库、会被覆盖，issue #21131）；Cursor 可 "save to workspace"（社区惯例 `docs/plans/`）；Codex 默认不落 PLAN.md。**repo 内 `docs/plans/` 是三端缺口的最大公约数**。
   https://lucumr.pocoo.org/2025/12/17/what-is-plan-mode/ · https://cursor.com/blog/plan-mode
7. **共识收敛点**：保留 grilling/批准门、保留"为什么"（ADR/decisions）、保留可执行验收（checklist、converge 检查）；砍掉复述式 PRD 仪式。重型"接管流程"框架存活率低（Amp 移除自家 plan mode、Spec Kit 被定位 experiment、Kiro 加逃生门）。
   https://www.ashu.co/markdown-plan-files-vibe-coding/ · https://github.com/OthmanAdi/planning-with-files

## 四、跨会话恢复与记忆模式

1. **文件式 handoff 优于 /compact**：短会话 + 磁盘交接无损、可移植；handoff 本身随里程碑 commit（"git is the unsung hero of AI"）。
   https://news.ycombinator.com/item?id=49300800
2. **官方 checkpoint 不覆盖 subagent/bash 改动**，保留约 30 天；"git remains the tool for permanent history"——工具内建恢复面不能作为唯一恢复手段。
   https://code.claude.com/docs/en/checkpointing
3. **planning-with-files（26.9k★，社区最流行布局）**：task_plan.md（阶段+checkbox 即恢复点）+ findings.md（追加式笔记）+ progress.md（会话日志）；"3+ 步任务先建 plan"、"2-Action Rule"（每 2 次探查落盘 findings）、错误必须记录；benchmark：带文件恢复 5.0 turns vs 裸 agent 13.3 turns；"promote-when-durable"（值得保留的晋升进正式文档，其余 gitignore）。
   https://github.com/OthmanAdi/planning-with-files
4. **scratch 工程化（2026-06）**：日期前缀任务目录；plan.md 是"map, not the territory"（索引：goal/phases/status/decisions/errors）；"Store, Don't Stuff"；单文件 ~80 行即拆；**每 20+ tool calls 重读 plan 刷新目标**；session 结束前确认 findings 延续。
   https://nikiforovall.blog/ai/2026/06/08/scratch.html
5. **AGENTS.md 标准**：无 schema 纯 Markdown，"closest AGENTS.md wins"、"explicit user prompts override everything"；不放不希望被执行的命令。注意 agentsmd.com 域名已停放，引用以 https://agents.md 与 github.com/openai/agents.md 为准。
   https://github.com/openai/agents.md
6. **Anthropic memory 纪律**：CLAUDE.md 目标 <200 行（过长降低 adherence）；可推导内容外移；"多步骤流程或只关系到部分代码库的条目应移到 skill"；auto-memory 是"索引 + 指针"形态（索引仅加载前 200 行）。
   https://code.claude.com/docs/en/memory
7. **并行协调**：Claude Code Agent Teams（实验）用任务文件 + 文件锁 + JSON 信箱，不内建 worktree 隔离；官方建议简单并行用 subagent，真并行用 git worktrees（每 agent 独立 branch + 工作目录）。
   https://code.claude.com/docs/en/agent-teams
8. **Git 作为恢复面**：commit 应 frequent / verified / well-scoped；phase 完成即 commit、message 引用 plan 路径，使 git log 成为可 bisect 的恢复时间线。
   https://mcpmarket.com/server/commit-discipline

## 五、对照本插件的结论

### 现状已被一手资料背书（勿动）

| 现有设计 | 对应外部依据 |
| --- | --- |
| AGENTS.md 薄入口 T1，任务只进 work_index | Anthropic <200 行纪律；AGENTS.md 标准；scratch "map not territory" |
| `.harness/`（recovery_policy / work_index / state / progress / decisions） | structured note-taking 官方三策略之一；walkinglabs session lifecycle |
| repo 内 `docs/plans/` + checkbox + final_integration_claim | planning-with-files 三文件布局；三端 plan 不进版本库的缺口补位 |
| review 独立闸门 + fresh verification 铁律 | generator/evaluator 分离（2026-03）；"code is law" |
| 8 lane 可独立触发、薄 SKILL.md + references/ | Pocock 组合式 skills；Agent Skills 三级渐进加载 |
| skills 不用 experimental 字段、name 匹配目录 | agentskills.io 规范 |

### 补强候选（增加 / 调整）

1. **review**：ready 判定显式写进 "evidence not assertion"（可运行检查输出，非口头声明）与"保护测试"措辞（测试不可删改，只许翻转状态）——两条均来自官方 harness 文。
2. **brainstorm / plan**：增加轻量路径门槛建议（Kiro Quick Spec、Claude "一句话 diff 跳过 plan"）：问题已明确时 Spec 可薄、可跳过——现有 description 已有此意，可在协议里更明确，防 Spec Kit 式 markdown 膨胀。
3. **implement / diagnose**：吸收两条落盘纪律——2-Action Rule（多次探查后立即把 findings 写入恢复面）与"每 ~20 tool calls 重读 plan 刷新目标"。
4. **find-skills / capability-recommender**：补第三方 skill 安全审计检查表（Snyk/Datadog 红旗：嵌套 `.claude/skills/`、宽 Bash 预授权、dynamic context `` !`cmd` ``、外部 URL/凭据访问）。
5. **harness-builder**：决策矩阵加一条"组件是临时假设"——随模型升级逐个拆除并测量 gate 成本，防止 harness 越长越重。
6. **并行指引**：真并行用 git worktree（每 worktree 一条 active 线），单目录内 work_index 多 active 行 + 文件所有权分片——可写入 recovery-surface-builder 或 harness-builder references。
7. **分发面（可选）**：`templates/` 与规范推荐名 `assets/` 的对齐说明；frontmatter 可加命名空间化 `metadata`（version/author）；考虑 skills.sh / `.agents/skills` 作为六端长尾安装的统一面，收缩 docs/install 维护成本；`skills-ref validate` 可纳入 check-plugin.mjs。
8. **恢复文件 JSON 化（可选）**：机器读写的状态（如 work_index 表格）可部分 JSON 化防模型擅改——代价是可读性，仅对高频误改面值得。

### 删除候选

- **无需删除任何 skill**：12 个 skill 各有外部依据对应，无一冗余。
- 唯一收缩方向是安装面（若采用 skills.sh / Grok 复用 `.claude-plugin/`，可减少自维护的 docs/install 端数），以及持续用 agent-instructions-maintainer 做 AGENTS.md 逐行必要性裁剪。
