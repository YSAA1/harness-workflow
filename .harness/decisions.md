# Decisions

## D-001 — 统一 `.harness/`，弃用 three-file backend 作为主路径

- **Decision**: 运行时 recovery 统一在 `.harness/`；`recovery_policy.md` 与 `work_index.md` 在 recovery ≠ `none` 时 Required；不在仓库根创建 `task_plan.md` / `progress.md` / `findings.md`。
- **Rejected**: 继续推广 three-file backend 作为可选主路径。
- **Why**: 多任务时 AGENTS 漂移；根目录状态文件与 harness 目录并存造成事实源分裂。

## D-002 — brainstorm Phase A 统一 Grill（非平凡强制深度）

- **Decision**: Phase A 是一场统一 grill interview；Coverage 是进度账本，Design Grill 是同场招式而非 A2。非平凡工作必须满足 grill 深度（≥2 轮且 ≥1 stress scenario），trivial 可在 assumption batch 豁免。
- **Supersedes**: 旧「Coverage Gate 后再跑 Phase A2」双阶段模型。
- **Rejected**: Grill 完全 optional；先填矩阵再切第二套访谈协议。
- **Why**: A1 调查式填表与 A2 挑战式 grill 内容重叠、体验割裂；对齐 `/grill-with-docs` 的单场 interview + 文档结晶。

## D-003 — harness-builder 拆分为一个 lane + 三个 helper

- **Decision**: `harness-builder` 保留为唯一 project workbench workflow lane；新增 `capability-recommender`、`agent-instructions-maintainer`、`recovery-surface-builder` 作为可顶层调用的 helper skills。
- **Rejected**: 把 helper 仅作为内部 references；保留或绑定 Research Route / autoresearch；照搬 `planning-with-files` 的 root three-file backend。
- **Why**: 顶层 helper 能降低 `harness-builder` 热路径厚度并便于单独 eval；Research Route 绑定外部插件风险高；`.harness/` 已是本仓库选定 runtime recovery surface。

## D-004 — helper skill attribution and recovery split

- **Decision**: `capability-recommender` and `agent-instructions-maintainer` keep the Anthropic official skill body and references as the primary source, with narrow harness-workflow adaptation notes and attribution files.
- **Decision**: `recovery-surface-builder` owns recovery backend selection and planning-with-files-inspired persistence; `harness-builder` only routes to it.
- **Rejected**: rewriting the two official-derived helpers from scratch; keeping research-governance gate assets inside this plugin.
- **Why**: official helper skill quality is already high; the split keeps hot-path harness-builder smaller while preserving explicit callable capabilities.
## D-009 — Workflow lane slim

- **Decision**: 公开 lane 七条；`verify` 为 `review` alias；`review` 唯一 ready gate；隔离仅独立只读子 agent；brainstorm 用 frontier rounds；skill 协议宿主中立。
- **Supersedes**: C6「verify 唯一 ready」、D-002「一问一轮」、2026-05-27 review 不声明 ready、分端 CLI reviewer 链。
- **Date**: 2026-08-12
