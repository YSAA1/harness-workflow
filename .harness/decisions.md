# Decisions

## D-001 — 统一 `.harness/`，弃用 three-file backend 作为主路径

- **Decision**: 运行时 recovery 统一在 `.harness/`；`recovery_policy.md` 与 `work_index.md` 在 recovery ≠ `none` 时 Required；不在仓库根创建 `task_plan.md` / `progress.md` / `findings.md`。
- **Rejected**: 继续推广 three-file backend 作为可选主路径。
- **Why**: 多任务时 AGENTS 漂移；根目录状态文件与 harness 目录并存造成事实源分裂。

## D-002 — brainstorm Phase A2 非平凡强制

- **Decision**: Coverage Gate 通过后，非平凡工作必须 Design Grill（≥2 轮），trivial 可在 assumption batch 豁免。
- **Rejected**: Grill 完全 optional。
