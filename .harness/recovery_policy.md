# Recovery Policy

本文件是会话入口契约，不是当前任务状态。动态 slice 写在 Work Index 与 `.harness/state.md`。

## 会话启动

1. 读取 `AGENTS.md`（T1 durable entry）
2. 读取本 Recovery Policy
3. 读取 `.harness/work_index.md`，打开 `status=active` 行的 primary artifact
4. 读取 `.harness/state.md`（hot index）
5. 探测动态上下文：`git status --short`、`git log --oneline -5`、`bash scripts/agent/check.sh`

若 Work Index 无 `active` 或有多条未声明并行的 `active`，先 reconcile，不要直接开干。

## 字段映射

| 字段 | 位置 |
| --- | --- |
| `objective` | active 行的 Executable Plan / Spec + `.harness/state.md` |
| `active_slice` | `.harness/state.md` |
| `evidence_log` | `.harness/progress.md` |
| `decisions` | `.harness/decisions.md` 或 `docs/adr/` |
| `risks` | `.harness/state.md` |
| `next_actions` | `.harness/state.md` |

## 更新触发

| 事件 | 更新 |
| --- | --- |
| 新任务 | `.harness/work_index.md` 新行 + 唯一 `active` |
| slice 进展 | 重写 `.harness/state.md` |
| 命令证据 | `.harness/progress.md` |
| verify PASS | evidence 指针 + milestone commit |
| 任务结束 | Work Index 状态 + `cleanup` |

## 陈旧信号

- `state.md` 日期早于该任务相关 git 活动
- Work Index `active` 与 `state.md` objective 不一致
- `AGENTS.md` 仍指向某个具体 plan/Spec 路径

## 交接最低要求

见 `skills/cleanup/references/handoff-hygiene.md`：active slice、证据、next、rejected options、milestone commits。
