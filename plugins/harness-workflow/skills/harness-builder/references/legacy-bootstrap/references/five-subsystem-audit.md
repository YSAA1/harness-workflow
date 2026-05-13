# 五子系统就绪审计

用于 `bootstrap`。只在需要逐项判断 PASS / WARN / FAIL 时读取。

## 使用方式

1. 先读 `task_plan.md`、`progress.md`、`findings.md`、`AGENTS.md`、README、构建/测试配置，并运行 `git rev-parse --show-toplevel`、`git status --short`。
2. 对每个子系统给 PASS / WARN / FAIL。
3. 每个判断必须有一句证据，不能只写感觉。
4. FAIL 项如果阻塞实现，下一步不要进入 `implement`。

## 指令面

PASS:
- `AGENTS.md` 存在且是薄入口。
- 有项目目标、地图、验证入口、恢复入口。
- 没有临时任务状态。

WARN:
- 文件存在但命令或地图可能过期。
- 规则有重复，但不影响本次实现。

FAIL:
- 没有 `AGENTS.md`，且仓库缺少其他冷启动入口。
- `AGENTS.md` 混入大量 session notes / TODO / review notes。
- 指向不存在的命令或路径。

## 工具 / 环境

PASS:
- install / run / test / lint / build 命令能从文件中定位，且至少一个 baseline 命令有 fresh 运行证据。
- 关键依赖和环境变量有说明。

WARN:
- 命令存在但没跑过；可继续的前提是当前 slice 风险低，且缺口写入 `findings.md`。
- 依赖安装需要人工凭据。

FAIL:
- README 命令与 package/config 不一致。
- 没有任何可复现验证命令。
- 任务需要浏览器、数据库、云服务或 issue tracker，但能力缺口没有记录。

## 状态

PASS:
- 三文件或等价工件能回答目标、当前阶段、最近动作、风险、下一步。
- `progress.md` 是 append-only。
- git root 已确认，最近提交或 baseline 缺口已记录。

WARN:
- 三文件存在但时间较旧。
- `findings.md` 缺少 rejected options。
- git root 正常，但 baseline commit 缺失；当前仍可继续 bootstrap，不能直接进入高风险实现。

FAIL:
- 计划只在聊天里。
- 多个 phase 同时 in_progress。
- `progress.md` 声称完成但没有命令证据。
- `git rev-parse --show-toplevel` 失败，且当前任务需要 commit / branch / checkpoint。

## 验证 / 反馈

PASS:
- 有 baseline command，且至少一个 baseline command 已 fresh 运行或明确说明无法运行的外部原因。
- 当前 slice 的 smoke / E2E 候选明确。
- fresh evidence 应写入哪里明确。

WARN:
- unit 有入口，但跨边界验证没有。
- E2E 需要工具但尚未启用，已有推荐能力和替代路径。

FAIL:
- 完成标准无法验证。
- 高风险 UI / auth / persistence 改动没有 smoke/E2E 路径。
- 只能靠人工口头确认。

## 生命周期 / 范围

PASS:
- active slice 单一。
- non-goals 明确。
- blocker 和 next action 具体。
- dirty worktree 已分类，commit / branch / worktree 规则明确。

WARN:
- 有 deferred cleanup，但不阻塞当前 slice。
- 用户可能想扩 scope，需要确认。
- dirty files 存在但已区分 related / unrelated / generated，且不会被自动 staged。

FAIL:
- 同时推进多个 slice。
- 当前任务与计划不一致。
- 上一次未收尾的失败被忽略。
- dirty worktree 未分类却准备 commit，或阶段未验证成功就准备提交。
