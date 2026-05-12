---
name: diagnose
description: "当 build、test、lint、typecheck、CI 或运行时检查失败，且无法指出单一证据支撑的 root cause 时使用。典型触发语：测试挂了、构建坏了、为什么报错、CI 红了、本地能跑 CI 不行、flaky、复现这个 bug、我试了但错误变了。修复前必须先复现、提出单一假设、验证根因，并把 root cause 写入 workflow state 的 findings area（默认 `findings.md`）。"
---

# 构建与失败诊断

构建与失败诊断 是 tracked workflow 的诊断入口。它强制把失败转化为**证据 → hypothesis → 验证 → 修复**的有限步骤,而不是\"再试一次\"的盲改循环。

它不是普通的 RED→GREEN 迭代,也不是临时绕过(`--no-verify`、注释测试、`try/except` 吞错)。它的产物是一条写进 workflow state findings area（默认 `findings.md`）的 root cause 记录,一次最小修复,以及 fresh 验证。

## Workflow State Contract

本 workflow 依赖的是 `state-contract` 定义的 workflow state，而不是某三个文件本身。默认 backend 是三文件：`task_plan.md` / `progress.md` / `findings.md`。

如果项目在 `AGENTS.md`、`.harness/manifest.yaml` 或 `.harness/state.md` 中声明了其他 backend（lightweight、feature-list、existing），按该 backend 读取 active slice、evidence、decisions、risks 和 handoff。

若 state backend 不存在：简单任务可以轻量执行；非平凡或跨 session 任务先调用 `state-contract` 或 `plan` 建立状态。

## 目的

本 skill 专门处理"基于失败现象继续猜"的问题。失败可能来自代码，也可能来自工具链、状态、验证方式、范围漂移或环境差异。诊断要先把失败稳定复现，再用单一假设逐步排除。

`diagnose` 把这些教训压成纪律:

- 没有可复现的失败,不允许提修复
- 没有写进 workflow state findings area 的 root cause,不算诊断完成
- 不在 build / test / lint 已红的状态下推进 implementation
- 修复必须是最小的、单一的、可验证的
- 三轮 hypothesis 仍找不到根因 → 升级为 blocker,不继续盲改

## 何时使用

### 触发信号

- `implement` 中同一 slice 出现连续两次失败,或同一命令两次返回不同错误
- `npm test` / `npm run build` / `cargo test` / `go test` 等命令红,且错误消息无法直接对应到刚改的几行
- 测试通过本地但 CI 红,或反过来
- 构建突然慢、卡住、内存爆,但代码改动看起来无关
- 出现\"我以为我修了\",但同一现象再次出现
- E2E / smoke 通过但 unit 失败,或反之 — 行为分层不一致
- 用户说「为什么报这个错」「再试一下还是不行」「flaky 了」「CI 红了」「能不能别用 try/except 把它包起来」

### 不要使用

- 这是 RED→GREEN 流程里你刚写的测试在红 → 回 `implement`
- 这是已知的 spec 变化导致旧测试失效 → 先回 `plan` 调整 active slice
- 失败的根因已经清楚,只差一行修改 → 回 `implement` 做最小修复
- 用户其实是在问\"应该怎么做\"而不是\"为什么坏\" → `brainstorm`

### 路由规则

| 状态 | 下一步 |
| --- | --- |
| 根因已找到、修复直接 | `implement`(以 reproduction test 起始) |
| 根因找到、影响多文件 | 回 `plan` 拆 slice |
| 根因找到、需要重新审视边界 | `brainstorm` |
| 修复稳定 | `review` 或 `verify` |
| 三轮诊断未果 | 记 blocker,转 `save-session` 或升级到 user |
| 命令链路本身坏(找不到入口、依赖装不上) | `bootstrap` 重审工作面 |

## 先读取这些输入

1. 失败命令的**真实输出**,不要靠记忆复述。完整 stderr / stack trace 必须存在 `progress.md`
2. 最近 `progress.md` entry,确认上一次成功状态
3. `findings.md` 的 Risks / Failures / Dead ends — 避免重走老路
4. `git diff HEAD~5..HEAD --stat` 与 `git status --short`:看最近改动范围
5. `task_plan.md`:确认当前 active slice,避免修着修着越界
6. 与失败直接相关的源文件、测试、配置(只读够定位即可)

## 铁律

> **没有根因证据,不提修复结论。**

\"看起来应该是 X\"不算证据;能用一条最小命令稳定再现 + 一条最小命令证明假设成立或不成立,才算证据。

## 先按工作面分层诊断

把失败映射到具体 harness 层(参见 `references/harness-layer-patterns.md`):

| 子系统 | 典型失败信号 | 修复 lane |
| --- | --- | --- |
| 任务 | spec 不清 / non-goal 模糊 / 成功标准没法判 | `brainstorm` |
| 上下文 | AGENTS.md 与代码漂移 / 项目地图缺失 | `bootstrap` |
| 工具 / 环境 | 依赖装不上 / 命令路径错 / 浏览器能力缺失 | `bootstrap` + capability recommendation |
| 状态 | workflow state 不一致 / 缓存陈旧 / 状态文件被覆盖 | 修复 artifacts 后回 `implement` |
| 验证 / 反馈 | 测试不覆盖真实路径 / 用 mock 把 bug 屏蔽 / smoke 不存在 | `verify` 升档 |
| 生命周期 / 范围 | 多 slice 同时进行 / 上次没收尾 / 隐藏 TODO | `cleanup` 后再修 |

不强行套\"代码 bug\"假设。很多失败在工具、状态、验证或范围层。

## 执行流程

### 第 1 步 — 捕获事实

完整记录:

- 命令(精确到 flag、cwd、env)
- 失败输出(stderr、stack trace、退出码)
- 时间戳与 git HEAD
- 最近 5 次相关命令的成功/失败序列

写到 `progress.md` 的本次 entry,不只是 chat 里。

### 第 2 步 — 稳定复现

- 跑同样命令两次,确认结果一致
- 如果 flaky,先治 flaky:看是不是时间/顺序/并发/外部依赖。flaky 本身就是根因之一,不能假装它\"偶尔\"
- 找出最小复现命令(单测试文件、单 spec、单 seed)
- 如果不能复现,转 `resume` 校对状态,或写进 `findings.md` 作为 dead end

### 第 3 步 — 定位变化面

- `git log --oneline -20` 看最近提交
- `git diff` 看本地未提交改动
- `git bisect` 在 regression 嫌疑大时使用
- 找一个**已知能跑通**的 commit 或 working example 作锚点

### 第 4 步 — 提出 hypothesis(单数)

每轮只一个 hypothesis,写成可证伪命题。例:

> H1: 失败是因为 `documentService` 在 `loadAll` 之后没等 `parseAll`,导致渲染线程拿到空数组。

不要写\"可能 A 也可能 B 也可能 C\"。多假设并发只会浪费 token。

### 第 5 步 — 用最小检查验证 hypothesis

- 加一行日志、一个断点、一段独立脚本、一个 focused test
- 检查必须能**单独**回答\"H1 是真的吗?\",不能依赖大段重构
- 跑检查,记录结果

### 第 6 步 — 命名 root cause

只有当检查证伪 hypothesis 时,才换下一个。每次切换前在 `findings.md` 记下\"H1 不是根因,因为 ...\"。当某个 hypothesis 被实证支撑时,把它写为 root cause。

格式参考:

```md
## Root cause: <一句话>
- 证据命令: ...
- 证据输出片段: ...
- 触发条件: ...
- 影响范围: ...
- 修复方向: ...
```

### 第 7 步 — 最小修复

- 修复改动要尽可能小且单一
- 不顺手 refactor、不顺手改命名
- 修完先跑 reproduction 命令(必须由红转绿),再跑相邻 verification
- 任何\"为了让测试过\"的 hack(注释、`xit`、catch-all、`@ts-ignore`)都不允许 — 那是把 bug 移走而不是修

### 第 8 步 — fresh 验证

- 跑全套相邻测试 / lint / typecheck
- 记录命令与结果到 `progress.md`
- 如果验证不充分,转 `verify`

### 第 9 步 — 同步 docs / artifacts

- root cause、修复理由、残余风险写进 `findings.md`
- 失败现象、hypothesis 序列、最终修复写进 `progress.md`(append-only)
- `task_plan.md` 仅在 phase / blocker / next 改变时更新

### 第 10 步 — 决定下一步

- 修复稳定 → `review` / `verify`
- 修复揭示 spec 漂移 → `plan` / `brainstorm`
- 仍未根因 → 记 blocker、`save-session`

## 输出格式

```text
BUILD FIX REPORT

Failure command:
  - <command -> output>
Reproduction:
  - <minimal command>
Hypotheses tried:
  - H1: <statement> -> <falsified|supported>
  - H2: <statement> -> <falsified|supported>
Root cause: <一句话>
Evidence: <command + output|trace>
Fix: <一句话 + 文件清单>
Verification:
  - <command -> result>
Risks / residual: <一句话>
Next: <implement | review | verify | blocker>
```

## 示例

### 示例 1: 误以为是代码 bug、实为状态 bug

`npm test` 报告 `documentService.test.ts` 失败:`expected 3, received 4`。

- 第 1 步-2:复现两次,稳定
- 第 3 步:`git diff` 发现本次只改了 UI 文案;不应影响 service
- 第 4 步:H1 = \"测试用的 fixture 文件被上次调试时改过\"
- 第 5 步:`git status` 显示 `tests/fixtures/docs.json` modified;`git diff` 看到多了一条
- 结论:状态层失败,不是代码 bug
- 第 7 步:`git checkout tests/fixtures/docs.json`
- 第 8 步:`npm test` 全绿
- `findings.md` 记下\"调试遗留 fixture 改动\";`progress.md` 追加 entry

### 示例 2: flaky 测试

`vitest` 偶发超时,本地 5 次中 1 次。

- 第 2 步:不能稳定复现 → flaky 本身是根因
- 第 4 步:H1 = \"测试与 fake timer 之间的 race\"
- 第 5 步:加 seed + 把测试包成同步逻辑,本地 100 次复现 12 次失败
- 结论:H1 成立 — 修 fake timer 的 advance 顺序
- 第 7 步:把 `vi.useFakeTimers()` 移到 `beforeEach`,在断言前显式 `await vi.runAllTimersAsync()`
- 第 8 步:100 次连测全绿
- `findings.md` 记\"async timer 顺序敏感,后续测试模板需注意\"

### 示例 3: 构建突然变慢

`npm run build` 从 12s 变 90s,代码改动只有一行。

- 第 1 步:记录两次构建时间与 trace 输出
- 第 3 步:`git log --stat -5` 发现昨天合入的 commit 改了 `tsconfig.json`,把 `incremental` 关掉了
- 第 4 步:H1 = \"是 tsconfig 改动\"
- 第 5 步:`git stash`,只回滚 `tsconfig.json` 跑构建 → 13s
- 结论:命中
- 第 7 步:重新打开 `incremental`,并把改动原因(\"想强制全量\")改为单独脚本
- 同步 `findings.md`:此项不可静默改回,作为 deferred decision

## 常见反模式

- **多假设并发。** 每轮只一个 hypothesis,被证伪再换
- **基于现象猜根因不验证。** \"应该是 X\"必须用一条命令证伪或证实
- **用 try/except、注释测试、`@ts-ignore` 把 bug 藏起来。** 这不是修复,是后患
- **修着修着越界。** 顺手改无关代码 → scope creep,WIP=1 被破坏
- **不记 dead end。** 下次会走同一路;每个被证伪的 hypothesis 必须写进 `findings.md`
- **三轮无果还在猜。** 转 blocker,不要把上下文撑满噪声
- **修复完不跑相邻验证。** 局部绿不等于全局绿

## 验收标准

- [ ] 失败有最小复现命令,且记录在 `progress.md`
- [ ] hypotheses 序列写在 `findings.md`,被证伪的也保留
- [ ] root cause 一句话能讲清,且有命令级证据
- [ ] 修复是最小的、单一的、未越界
- [ ] reproduction 命令由红转绿,相邻验证未 regress
- [ ] 没有用 hack 屏蔽失败
- [ ] 下一步 skill 已显式标注

## 工件更新

- `progress.md`:append entry,含失败现象、hypotheses、修复、验证
- `findings.md`:root cause + 残余风险 + dead ends
- `task_plan.md`:仅在 phase / blocker / next 改变时更新
- `AGENTS.md`:不动;若发现 baseline 命令或项目地图需调整,记录到 `findings.md`，由 `bootstrap` 或 `cleanup` 做薄入口修正

## 按需读取

- `references/harness-layer-patterns.md`:五子系统失败信号与修复 lane
- 修复后回归 RED→GREEN:`../implement/SKILL.md`
- 准备宣布 ready:`../verify/SKILL.md`


## State Contract Reference

需要选择、修复或解释 workflow state backend 时，读取 `../state-contract/SKILL.md`。
