---
name: cleanup
description: "整理本次任务影响的文档、代码、生成物、临时文件和恢复状态，支持完成、阻塞或交接。检查无漂移可零修改结束，不扩展为全仓清理。"
---

# Knowledge Cleanup

使本次任务的记录与实际结果一致。完成、阻塞、放弃和交接都可整理，不要求先获得 ready 才能记录未完成工作。

## 流程

1. 明确本任务/轨道及其权威入口；无持久任务记录时可直接检查本次 diff。多个独立轨道可同时 active，不修改其他轨道来凑唯一工作面。
2. 只检查本次改变影响的 README、指令、接口文档、生成物和已有恢复记录。只有证据显示跨文档漂移或用户要求全量整理时扩大范围。
3. 清理本任务引入的代码遗留：死代码、未用导入和依赖、被替代的旧实现、孤儿脚本与过期生成物。删除以引用证据为准，删后跑针对性检查确认行为不变；会改变行为的清理转 `implement` 修复路径，不当作纯整理。
4. 对已被替代的同轨道计划更新状态或按项目惯例归档；保留验收、复现和追溯证据，修正受影响链接。
5. 清理本任务创建且已无用途的 scratch。未知归属或仍有用途的文件保留并说明；不因为 untracked、旧日期或临时命名就删除。
6. 生成物通过现有生成器更新，仅在输入变化时重建。无差异可零修改完成。本次新踩的坑（环境、流程、依赖）按 lessons 格式落笔到项目恢复面的 lessons（若支持），失效条目随手删。
7. 报告任务状态、修改/归档、保留事项及恢复入口。不得把 cleanup 完成写成原任务已完成。

## 按需读取

- 计划过期：`references/doc-shelves.md`。
- 临时文件归属：`references/entropy-checklist.md`。
- 交接：`references/handoff-hygiene.md`。
- 领域风险：`../review/references/cross-cutting-anti-patterns.md`。

## Recommended next skill

- 整理完成：结束。
- 仍有已授权行为修改：`implement`；未知失败：`diagnose`。
- 用户显式要求全仓 Python 死代码清理：`remove-deadcode-py`；其他生态直接用对应工具（JS/TS knip、Go `deadcode`、Rust cargo-machete）。
- 新增工作超出任务：记录后续事项，不自动执行。
