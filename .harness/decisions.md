# Decisions

## D-001 — 统一 `.harness/`，弃用 three-file backend 作为主路径

- **Decision**: 运行时 recovery 统一在 `.harness/`；`recovery_policy.md` 与 `work_index.md` 在 recovery ≠ `none` 时 Required；不在仓库根创建 `task_plan.md` / `progress.md` / `findings.md`。
- **Rejected**: 继续推广 three-file backend 作为可选主路径。
- **Why**: 多任务时 AGENTS 漂移；根目录状态文件与 harness 目录并存造成事实源分裂。

## D-002 — brainstorm Phase A2 非平凡强制

- **Decision**: Coverage Gate 通过后，非平凡工作必须 Design Grill（≥2 轮），trivial 可在 assumption batch 豁免。
- **Rejected**: Grill 完全 optional。

## D-003 — harness-builder 拆分为一个 lane + 三个 helper

- **Decision**: `harness-builder` 保留为唯一 project workbench workflow lane；新增 `capability-recommender`、`agent-instructions-maintainer`、`recovery-surface-builder` 作为可顶层调用的 helper skills。
- **Rejected**: 把 helper 仅作为内部 references；保留或绑定 Research Route / autoresearch；照搬 `planning-with-files` 的 root three-file backend。
- **Why**: 顶层 helper 能降低 `harness-builder` 热路径厚度并便于单独 eval；Research Route 绑定外部插件风险高；`.harness/` 已是本仓库选定 runtime recovery surface。

## D-004 — helper skill attribution and recovery split

- **Decision**: `capability-recommender` and `agent-instructions-maintainer` keep the Anthropic official skill body and references as the primary source, with narrow harness-workflow adaptation notes and attribution files.
- **Decision**: `recovery-surface-builder` owns recovery backend selection and planning-with-files-inspired persistence; `harness-builder` only routes to it.
- **Rejected**: rewriting the two official-derived helpers from scratch; keeping research-governance gate assets inside this plugin.
- **Why**: official helper skill quality is already high; the split keeps hot-path harness-builder smaller while preserving explicit callable capabilities.