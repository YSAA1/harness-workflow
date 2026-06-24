# 失败分层诊断

用于 `diagnose`。失败出现时先定位属于哪个层，而不是直接假设代码错。

## 任务层

信号：
- 测试期望和 accepted spec 冲突。
- 用户目标变了，但计划未变。

处理：
- 回 `brainstorm` 或 `plan`。

## 上下文层

信号：
- `AGENTS.md` 指令过期。
- 项目地图错。
- agent 找错入口。

处理：
- `harness-builder` 重新建立项目地图、验证入口和薄 `AGENTS.md` 指针。

## 工具 / 环境层

信号：
- 依赖缺失、版本不匹配、命令不存在。
- 本地过、CI 不过。
- 浏览器/数据库/服务能力缺失。

处理：
- 记录环境事实。
- 最小复现。
- 必要时给 capability recommendation。

## 状态层

信号：
- fixture 被改。
- cache、snapshot、generated file 过期。
- selected recovery surface 和 git state 不一致。

处理：
- 先修状态，再重新验证。
- 不要直接改业务代码掩盖状态问题。

## 验证层

信号：
- mock 屏蔽真实路径。
- unit 过但 smoke 失败。
- flaky 被当成 pass。

处理：
- 升级验证层级。
- 记录 flaky 条件和复现命令。

## 生命周期 / 范围层

信号：
- 多个 slice 混在一起。
- 顺手改动引入新失败。
- 未收尾的旧任务污染当前任务。

处理：
- `cleanup` 或 `plan` 重新划界。

## 回归 / 里程碑层

信号：
- 已提交的里程碑范围内出现新失败。
- verify 曾经 PASS 的检查现在 FAIL。
- 后续改动破坏了之前已验证的行为。

处理：
- 先确认是哪个 commit 引入了回归（git bisect 或 diff 分析）。
- 检查原 verify 证据是否覆盖了当前失败路径。
- 修复后需要重新 verify 受影响的里程碑范围。
