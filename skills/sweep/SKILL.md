---
name: sweep
description: "按需全仓对账（非任务收尾）：恢复面探测 → 内联对账清单 → 六档分类 → 机械项自动修、模糊项列证据人裁 → 退休四步 → 汇报。Triggers: sweep, 盘点, 大扫除, 项目对账."
---

# Sweep

全仓对账：把任务产物、恢复面状态与仓库遗留物对成一本账。检测靠清单，定罪靠证据，模糊项交人裁。

本 skill 是低频全局对账的按需入口，不做任务收尾（收尾走 `cleanup`）。与退休契约（AGENTS.md 写侧纪律）互补：源头止漏正常运转时，本 skill 大多数时候零修改结束。目标项目没有体检脚本闸门——本文件内联的对账清单就是等价补偿，不依赖任何仓库外脚本。

## 流程

1. **探测恢复面（实测，不假设）**：清点 `.harness/` 实际文件集（常见三文件，也可能有 decisions/progress 等异构形态）。有 → 根集合＝全部状态文件出链 + 持久入口（AGENTS.md、根 README、docs/README 类）。无 `.harness/` 或项目用 tracker/existing backend → 降级为只扫任务产物孤儿与 untracked 遗留物，显式声明"恢复面缺失"，不虚构状态判据（第三方项目可能从没建过恢复面）。state 不可解析时跳过状态矛盾检查并声明，不推孤儿结论。
2. **对账清单（与 `scripts/check-plugin.mjs` 恢复面 lint 同判据的手动版，目标项目照跑）**：
   - 状态矛盾：state 的 Status 与 work_index 对应行是否一致；state 所指轨道是否已登记。
   - 存在性：active/blocked 行 primary artifact 是否存在（文件系统或 `git worktree list` 注册树内，任一命中即算存在）。
   - 可达性：任务产物（plans/specs/reports）逐个 `grep -F` basename 于根集合全部文件，零提及＝孤儿候选；basename 匹配防裸文件名假阳。
   - untracked：`git status --porcelain` 列出，`git check-ignore -v` 剔除已忽略项，按目录/主题分组。
3. **六档分类**：
   - **① 任务产物孤儿**：tracked 三重证据定罪——根集合零提及 + `git log --follow` 溯源 + 同目录交叉引用；spec/plan 成对产物（共享 slug）成组裁决，防删 spec 留 plan；reports 类"零引用 + README 声明非权威"可直接列罪。
   - **② 僵尸 blocked**：不止字面 blocked，paused/待用户确认/blocked-by-policy 等价形态都入档，列冻结起点与时长。
   - **③ 半翻行**：active 行与后续更新行的时间线/资源冲突（如旧行占用的 GPU/目录已被新任务占用）即可列入，无需联网核验。
   - **④ untracked 遗留物**：一律不删，只列证据 + 二选一出口（补 commit 或补 .gitignore）；有 tracked 先例的目录（如 artifacts/）默认 commit 候选；内含注册 worktree 的目录单列高危——须先 `git worktree remove` 才能谈处置，绝不直接 ignore/删。
   - **⑤ 归档目录**（docs/archive/ 类）：仅清点标记，内容一律 needs-review 待人裁，不入可删档。
   - **⑥ 恢复面文件超本分**：state 超快照、decisions/lessons 双记账 → 蒸馏进 lessons 后截断/合并；族谱类条目压成一张 lineage 表；同一规则多份副本只留 lessons 一份。
4. **处置**：机械项（翻状态、删已定罪孤儿）自动修；模糊项（abandoned vs paused、未了事项去向）列证据请用户裁决，不裁决不删除（保守停）。
5. **退休四步**（同 AGENTS.md 写侧纪律，同一 commit 内完成）：翻行 → lessons 继承（先蒸馏）→ 删本轨道已完成 plan/Spec 文档（前置＝已 commit 主树且 lessons 继承完成；入度守卫＝只删唯一入边来自本退休轨道的文档，多入边翻指针不删；ADR 不删，补 superseded-by）→ state 同步翻转 Status。
6. **汇报**：无漂移可零修改结束。

## 假阳守卫（实测教训）

- 主树文件缺席≠可定罪：primary artifact 可能活在注册 worktree 内；孤儿判定以"引用源零提及"为准，不以"文件缺失"为准。
- /tmp 等外部路径引用会腐烂但非全部灭失，不宜机械定罪，只作证据维度。
- 全路径精确匹配会把裸文件名引用误判孤儿（文件实际以相对路径被引用）；slug 匹配会把共享 slug 的 spec/plan 互相放行——basename 匹配两头都对。

## 汇报格式

- **已处理**：项 + 动作 + 证据摘要。
- **needs-review**：原因（等价僵尸形态 / 半翻行 / 高危 worktree / 归档目录）。
- **保留**：守卫命中项（多入边、tracked 先例、活跃引用）。
- **下一轮候选**：本轮处置后新暴露的嫌疑（如级联孤儿、complete 历史行堆积行数）。

## Recommended next skill

- 对账完成：`cleanup` 收尾本轨道；新踩的坑按 lessons 落笔。
- 发现的是行为 bug 而非记录漂移：`diagnose`。

## 不做

- 不删 untracked 文件（出口只有补 commit 或补 .gitignore）。
- 不动归档目录内容与 ADR；不做任务收尾（归 `cleanup`）。
- 不追求一次清零；大仓分多次会话。
