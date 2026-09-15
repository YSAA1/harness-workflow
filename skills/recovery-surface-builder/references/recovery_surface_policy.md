# Recovery surface policy
选择能恢复当前任务的最小方案：none、lightweight、harness、feature-list 或 existing。
none 不创建文件；lightweight 可依赖 git 和短计划；harness 可用 .harness；feature-list/existing 复用原有 tracker/文档。非 harness backend 不强制新建 .harness 或统一迁移旧文件。
每个任务/轨道一个权威入口。独立轨道或工作树可同时 active；新任务不自动完成/归档旧任务。
可恢复信息包括目标、状态、下一步、关键决定、证据和真实 blocker。字段可分布在已有可靠入口，不要求每个文件重复全部字段。
只在用户授权且迁移收益明确时迁移，保留追溯和链接。事实更新不改变权限或验收合同。
并行轨道：单工作目录用多条 active 行加每轨道文件所有权分片，轨道间不写对方文件。多会话真并行用 git worktree（各自 branch），恢复面不跨 worktree 共写，合并时由所属轨道对账。
