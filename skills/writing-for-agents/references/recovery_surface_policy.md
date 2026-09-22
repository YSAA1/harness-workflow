# Recovery surface policy
选择能恢复当前任务的最小方案：none、lightweight、harness、feature-list 或 existing。
none 不创建文件；lightweight 可依赖 git 和短计划；harness 可用 .harness；feature-list/existing 复用原有 tracker/文档。非 harness backend 不强制新建 .harness 或统一迁移旧文件。
每个任务/轨道一个权威入口。独立轨道或工作树可同时 active；新任务不自动完成/归档旧任务。
可恢复信息包括目标、状态、下一步、关键决定、证据和真实 blocker。字段可分布在已有可靠入口，不要求每个文件重复全部字段。
只在用户授权且迁移收益明确时迁移，保留追溯和链接。事实更新不改变权限或验收合同。
并行轨道：单工作目录用多条 active 行加每轨道文件所有权分片，轨道间不写对方文件。多会话真并行用 git worktree（各自 branch），恢复面不跨 worktree 共写，合并时由所属轨道对账。

## 生命周期合同

- 谁建：新任务由 `plan` 建立恢复面（或复用既有 tracker），一行一轨道；`brainstorm` 在已有恢复面项目自第一轮 frontier 起预登记本轨道行（Spec 落盘即指向 Spec），只登记不建面；项目无恢复面时在 `AGENTS.md` 挂指针并携带最小写侧纪律（翻行即退休一句话＋可达性活判据指向）。
- 谁更新：所属轨道的 agent 按阶段变化、关键决定和交接更新本轨道记录，不写其他轨道文件；证据放 state、链接工件或 git。
- 谁退休：翻行即退休——谁把行翻出 active（complete/abandoned/blocked/换轨），谁在同一 commit 内走完四步：翻行 → lessons 继承 → 删本轨道 plan/Spec 文档（含未批准与放弃件）→ state 同步翻转 Status。删除前置＝改动已 commit 进主树且 lessons 继承完成；入度守卫＝只删唯一入边来自本退休轨道的文档，多入边翻指针不删；ADR 不删，退休时补 superseded-by。
- 文档活判据＝可达性：活 ⟺ 被 `.harness/` 状态文件出链或持久入口（AGENTS.md、根 README）引用；不可达即孤儿，退休或全局对账时处置。

## lessons 写法纪律

- 每条原子、按概念组织（一坑一条）：触发 → 坑 → 正确做法（→ 追溯）；无触发条件的通用感悟不收。
- 持续修订：新证据合并进既有条目而非无限追加；条目失效即删，不设历史归档。
