# 防臃肿（bloat prevention）调研：是否需要新 skill

- 日期：2026-09-16
- 状态：决策支持文档。**决策落地后吸收进对应 skill references 并删除本文件**（出生即带死亡条件——本文示范的就是这条原则）。
- 问题：长期项目中如何防止代码/文档冗余沉积？harness-workflow 是否需要一个新的清理类 skill？
- 方法：三个并行调研（死代码工具面 / 方法论面 / agent skill 生态面），主张均追到一手来源，未验证项已标注。

## TL;DR

1. 「通用死代码删除 skill」不值得做——外部已有成熟竞品（oh-my-openagent `remove-deadcode` 等），且本仓库 cleanup 的删除安全规则已有骨架。
2. 有真实真空，且正好对上本仓库的方法论 DNA：**证据链驱动的仓库级清理**（git 考古 + 引用证据 + 工具检测分级）和**出生即死亡条件**（每个新工件声明归属与过期路径）。本仓库自身沉积 ~210 个死文件就是证据：cleanup 是任务范围的，日常流从不触发仓库级审计，新文件出生时也没有人问"它什么时候可以死"。
3. AI 时代此事权重上升：GitClear 数据显示 2024 年首次出现复制粘贴行数超过重构行数，克隆块一年翻三倍（[GitClear 2025](https://www.gitclear.com/ai_assistant_code_quality_2025_research)）；DORA 2024/2025 显示 AI 采用损害交付稳定性（[dora.dev](https://dora.dev/research/2024/dora-report/)）。

## 五条最承重的方法论原则（方法论面调研结论）

1. **清理与功能开发交织，做成习惯而非事件**。童子军规则 / opportunistic refactoring（[Fowler](https://martinfowler.com/bliki/OpportunisticRefactoring.html)）优于周期性"技术债周"，后者容易漂移成宠物重构（[Chelsea Troy, Stack Overflow Blog](https://stackoverflow.blog/2023/12/27/stop-saying-technical-debt/)）。
2. **代码是负债不是资产，为删除而设计**（[SWE at Google ch.15](https://abseil.io/resources/swe-book/html/ch15.html)；[Tef: easy to delete](https://programmingisterrible.com/post/139222674273/write-code-that-is-easy-to-delete-not-easy-to)）；政策上让删除便宜：Google 评审规范明文"整文件删除按一行算"（[eng-practices small CLs](https://google.github.io/eng-practices/review/developer/small-cls.html)）。
3. **无主之物必沉积**。代码要 CODEOWNERS，文档要 owner + freshness date；Google GooWiki 下线时 ~90% 文档数月无浏览无更新（[SWE at Google ch.10](https://abseil.io/resources/swe-book/html/ch10.html)）。
4. **每个新增出生时就带过期路径**。feature flag 创建时挂移除任务 + 过期"定时炸弹"（[Hodgson](https://martinfowler.com/articles/feature-toggles.html)）；弃用要 deadline + 强制，"hope is not a strategy"；ADR 记录"为什么存在"让后人敢删。
5. **生成变便宜时，删除纪律必须变强**（GitClear / DORA / [METR 19% 变慢但自以为快 20%](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/)）。对策：小 CL 闸门、重复度预算、维护负重度量、评审有权直接拒膨胀。

## 工具面要点（按生态）

| 生态 | 首选工具 | 检测什么 | 关键坑 |
| --- | --- | --- | --- |
| JS/TS | **knip**（depcheck 已归档让位） | 未用文件/依赖/导出、ghost deps；150+ 插件感知入口 | 入口配置缺口 → 误报；渐进采用靠 baseline + `--max-issues` 棘轮 |
| Python | Ruff F401/F841 + vulture | 未用导入/变量 + 不可达代码 | `__init__.py` 删导入不安全（re-export 语义）；vulture 对 getattr 动态派发误报 |
| Go | `golang.org/x/tools/cmd/deadcode`（一方工具，RTA 可靠） | 从 main/init 不可达函数 | 汇编/`go:linkname` 盲区；结果只对单一 GOOS/tags 配置有效 |
| Rust | cargo-machete（快而糙）/ cargo-udeps（准而慢，需 nightly） | 未用依赖 | 文本匹配双向误报 |

主导实践是**棘轮/基线门禁**：容忍存量、只拦新增（knip rules + issue 预算；jscpd `--fail-on-new-clones`）。顺序讲究"先文件后导出"——一个未用文件背后藏着一串未用导出和依赖（[knip adopt-gradually](https://knip.dev/guides/adopt-gradually)）。每删一轮要重跑：删除会暴露更多死代码（[vulture](https://github.com/jendrikseipp/vulture)、[Go blog](https://go.dev/blog/deadcode)）。

失败模式共识：**动态访问让"死"代码活着**（getattr/反射/DI/动态 import/模板字符串引用），所以删除前要引用证据 + 删后针对性验证；**禁止大爆炸式清理**，用增量轮次。

## Skill 生态面要点

- Anthropic 官方 19 个 skill 无一做代码清理；最接近的是 Claude Code 内置 `/skill-doctor`（审计 skill 集合本身的使用率与上下文成本）——**预防而非修剪**。
- Matt Pocock 仓库无 cleanup lane；最接近 `improve-codebase-architecture`（周期性 survey + HTML 报告 + 删除测试）。
- 专门的死代码 skill 有三个可用竞品：oh-my-openagent `remove-deadcode`（最严谨：LSP find-references 验证、原子提交、TS-only）、rohitg00 toolkit `cleanup` 命令（多语言、safe/needs-review 分级）、89jobrien `dead-code-removal`（动态访问守卫清单齐全）。
- **没人覆盖的缺口**：① git 考古作为删除证据（`git log --follow`/blame 判断"最后一次被谁为何触碰"）；② feature flag 生命周期检查；③ 分级弃用（标记 deprecated → 浸泡期 → 下一轮删）；④ CI/节奏接线；⑤ skill 仓库自身的 references/死链修剪。

## 对照 harness-workflow 的差距

| 能力 | 现状 | 缺口 |
| --- | --- | --- |
| 任务范围收尾清理（童子军规则） | ✅ cleanup lane，已有"引用证据 + 删后验证"骨架 | 无 |
| 仓库级周期审计 | ❌ cleanup 明文"不扩展为全仓清理" | 全缺：清单盘点、证据分级、棘轮 |
| 出生即死亡条件 | ❌ brainstorm/plan 不问"这工件何时可删、归谁" | 全缺（本地另装的 doc-hygiene 有文档面 lifespan gate，但不在本仓库、不覆盖代码面） |
| 删除安全协议深度 | 半个：一句"以引用证据为准" | 无 git 考古、无动态访问清单、无工具检测分层 |

本仓库沉积史（~210 死文件：skillopt、plugin-eval、decks、tutorials、legal……）正是三个缺口同时作用的实证。

## 选项与建议

- **A. 新建独立"死代码清理 skill"**：不推荐。与外部竞品重复，且单次性删除不是本仓库方法论的差异化价值。
- **B. cleanup 增加第二模式「全仓清理」（用户显式触发）**：推荐。任务收尾模式不变；新增仓库级盘点 → 证据分级（git 考古 + 引用检查 + 按生态跑工具）→ safe/needs-review 分批删 → 删后验证 → 棘轮记录。工具清单与删除安全协议放 references（吸收本调研）。
- **C. 出生闸门并入 plan（或 brainstorm）**：推荐，且比 B 更高杠杆——方法论的共识是预防优于清理。新文件/新工件出生时声明：谁读它、什么条件下可删、有无过期时间。本仓库 docs/specs/plans 的沉积就是没有这个闸门的直接后果。

建议 B + C 组合：C 挡住新的沉积，B 清掉存量的沉积，现有任务收尾语义零改动。

## 主要来源

- [knip.dev](https://knip.dev/) · [knip adopt-gradually](https://knip.dev/guides/adopt-gradually) · [Go deadcode](https://pkg.go.dev/golang.org/x/tools/cmd/deadcode) · [Go blog: deadcode](https://go.dev/blog/deadcode) · [vulture](https://github.com/jendrikseipp/vulture) · [Ruff F401](https://docs.astral.sh/ruff/rules/unused-import/) · [cargo-machete](https://github.com/bnjbvr/cargo-machete) · [jscpd](https://github.com/kucherenko/jscpd) · [ts-prune](https://github.com/nadeesha/ts-prune) · [depcheck（已归档）](https://github.com/depcheck/depcheck)
- [Fowler: Opportunistic Refactoring](https://martinfowler.com/bliki/OpportunisticRefactoring.html) · [Fowler: Technical Debt Quadrant](https://martinfowler.com/bliki/TechnicalDebtQuadrant.html) · [Fowler: Strangler Fig](https://martinfowler.com/bliki/StranglerFigApplication.html) · [SWE at Google ch.10 文档](https://abseil.io/resources/swe-book/html/ch10.html) / [ch.15 弃用](https://abseil.io/resources/swe-book/html/ch15.html) / [ch.16 One-Version Rule](https://abseil.io/resources/swe-book/html/ch16.html) · [Google small CLs](https://google.github.io/eng-practices/review/developer/small-cls.html) · [Hodgson: Feature Toggles](https://martinfowler.com/articles/feature-toggles.html) · [Troy: Stop saying technical debt](https://stackoverflow.blog/2023/12/27/stop-saying-technical-debt/) · [Tef: easy to delete](https://programmingisterrible.com/post/139222674273/write-code-that-is-easy-to-delete-not-easy-to)
- [GitClear 2025](https://www.gitclear.com/ai_assistant_code_quality_2025_research) · [DORA 2024](https://dora.dev/research/2024/dora-report/) · [DORA 2025](https://dora.dev/insights/balancing-ai-tensions/) · [METR RCT](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/)
- [oh-my-openagent remove-deadcode](https://github.com/code-yeongyu/oh-my-openagent/blob/dev/.agents/skills/remove-deadcode/SKILL.md) · [rohitg00 cleanup 命令](https://github.com/rohitg00/awesome-claude-code-toolkit/blob/main/commands/refactoring/cleanup.md) · [89jobrien dead-code-removal](https://raw.githubusercontent.com/89jobrien/steve/main/steve/skills/dead-code-removal/SKILL.md) · [jonesrussell cleanup skill 设计](https://jonesrussell.github.io/blog/building-codebase-cleanup-skill-claude-code/) · [anthropics/skills](https://github.com/anthropics/skills) · [Claude Code skills 文档（/skill-doctor）](https://code.claude.com/docs/en/skills) · [mattpocock/skills](https://github.com/mattpocock/skills)

未验证项（保留原报告标注）：hagbard 园丁随笔（站点不可达）、Carmack 删除名言（.plan 档案中未找到）、GitClear 具体数字（Cloudflare 拦截，二手确认）、DORA 7.2% 数字（二手）、mcpmarket 两个目录级 skill（无源文件）。
