---
name: brainstorm
description: "用于把模糊需求收敛成用户批准的 Spec。触发：目标/边界/取舍/成功标准/验证策略未定，或用户说先讨论/grill/先落 Spec。已有完整 Spec 或小补丁时不用；批准后交给 plan。"
---

# Spec 构思（Frontier Grill）

收敛模糊想法 → 用户批准的 **Spec** → `plan`。不写生产代码，不写 Executable Plan。

Leading words: **frontier** · **design tree** · **shared understanding**

Canonical Spec：`docs/specs/YYYY-MM-DD--<topic>.md`（仅用户或 `AGENTS.md` 明示时可 override）。默认不写 `.harness/`；唯一例外：项目已有 `.harness/` 恢复面时执行「落盘即登记」（见流程步骤 1–2）。

用户可见语言跟随用户；协议 token（`BRAINSTORM …`、`Spec`、`Gate`、路径）可保留英文。

## 路由

- **Use**: 意图开放、标准或验证不清、要 grill。含糊不是等待的理由——含糊正是这场会话要吃掉的东西。
- **轻量入口**: 仅当用户原话或材料已同时锚定目标、边界、完成判据（三锚点）且单会话可完成——首轮明示走轻量并附锚点出处，锚点不齐即全框架，不静默判「已想清」，用户可任一方向改判；framing 四要素照快评（可一轮问完或全 waived），Spec 走 Thin Spec（`references/spec-drafting.md` Thin Spec 节）；不因入口在 brainstorm 就默认全框架访谈。
- **Don't**: Spec 已批；单点小补丁；只要事实回答。
- **Next**: Spec 批准 → `plan`；工作面缺口 →（Spec 批准后或用户明示）`harness-builder`。

## 拷问纪律（正文即全量工艺，无第二来源）

一场 relentless interview，直到 shared understanding。六条机制承载全部：

1. **设计树**：把需求映射成决策树——每个决策分叉出挂在它下面的决策。
2. **frontier 轮**：frontier＝前置已定的全部未决决策，即现在就能问、不必猜没听过的答案的部分。**一轮一条消息问完整个 frontier**：编号、每题带 `➡️` 推荐答案；题干可多段、可带 2–3 个具体选项，让用户按编号作答（「1 同意，2 选第二个，3 不同意，理由…」）。framing（目标/边界）未清时先问 framing，再走设计分支。
3. **分支与压力**：每题标 `Design branch`（Branch Order 支名），设计敏感题附一条具体压力场景；纯 framing 题可省两条锚定行。Branch Order 扫描顺序：actors/boundaries → happy path → failure/edge → data/state → interfaces → NFR → verification hooks → rejected alternatives。
4. **事实归 agent，决策归用户**：环境可查的事实（代码、文档、工具）自己查或派 sub-agent 查，**绝不问用户**；查证不阻塞——进行中的查证＝未定前置，只有其下游的问题等，其余 frontier 照问。偏好、取舍、验证力度、范围边界是**决策**，必须问用户并等答案；agent 自答决策＝破坏协议，不是灵活执行。
5. **每轮重塑树**：用户答案落定后重算 frontier 再问下一轮；一题的答案会改另一题 → 依赖题拆后轮。事后发现误并轮或漏支 → 受影响分支重开进下轮，不装没发生。
6. **判空才算完**：frontier 空＝Branch Order 八支每支已答/显式豁免/仓库可证（来源可查：对账行或 Spec 引用），framing 四要素（目标/边界/成功标准/验证策略）confirmed 或 waived。**宣告判空的同条消息附八支一行对账**；自评「已想清」不构成判空。常识默认、业界惯例、可延后不构成免问。不设最少轮数，已定不重问。判空后仍须用户确认 shared understanding（完整 brief 与起草授权，或单次确认）才起草 Spec；沉默≠批准。

用户要求一次一题时改逐题问，同一棵树照常维护。术语冲突当场对质、模糊词提规范名（按当前任务授权更新目标项目既有词汇表，不自动创建）；ADR 仅限不可逆架构决策，按授权即时提议不批量。

## 轮出格式（唯一源）

```text
BRAINSTORM CLARIFICATION IN PROGRESS
❓ Q1 - <title>: <body; 可多段、可带选项>
Design branch: <Branch Order 支名>
Stress scenario: <一条具体压力场景；设计敏感题必带>
➡️ <recommended answer>
---
❓ Q2 - <title>: <body>
Design branch: <branch>
➡️ <recommended answer>
Framing: <confirmed+waived>/4; Gate: BLOCKED; Frontier: open
Needs: frontier answers | shared understanding
```

Gate 过后切换为（Branches 行即判空对账：豁免与仓库证当场可见，来源随对账行或 Spec 给出）：

```text
BRAINSTORM SPEC READY
Spec: <path>; Gate: PASSED; Frontier: empty
Branches: actors✓ · happy✓ · failure 豁免 · data✓ · ifaces✓ · NFR 仓库证 · verify✓ · rejected✓
Needs: approve Spec
Next after approval: plan
```

判空前如有剩余**事实型**推断，按假设批一次性呈报（逐条附来源）确认后并账；偏好与取舍永不入批。

## 流程

### 1. Frontier grill

按「拷问纪律」执行至判空 + shared understanding 确认。开工先读：既有 Spec/代码/`AGENTS.md`、`git status`、用户材料。

恢复面接续（仅项目已有 `.harness/` 时）：第一轮 frontier 发出后，为本轨道在 work_index 登记行——Status `active`、Primary artifact 填 `（Spec 未落盘：<预定 Spec 路径>）`；每轮 grill 结束顺手把该行 Last verified 格更新为「日期 · 已定 n/m · 未决题号」。断会话后新会话按行内进度续问，不从头重问；无恢复面项目跳过本段，维持零文件。

### 2. Spec

按 `references/spec-drafting.md`：验证策略 → 方案比较 → 写 Spec → 自审 → 求批准。未批准不 `plan`。Spec 落盘的同一动作里，把本轨道 work_index 行的 Primary artifact 翻转为实际 Spec 路径（grill 阶段未登记者此时补登记；无恢复面项目不登记，批准后由 `plan` 接管建档）。未批准 Spec 因该行出链而非孤儿。

完成：独立 Spec 路径已给，等待批准。

## 硬规则

- 存在未决偏好/取舍时，用户可见的第一条消息必须是编号 frontier 问题；禁止只发计分行或假设批代替提问。
- 一条消息一个 frontier round；依赖题拆到后轮，独立题同轮发出。
- 沉默 ≠ 批准；shared understanding 由完整 brief 与明确起草授权覆盖，否则单问一次，不重复索要相同确认。
- 判空须对账：宣告 Gate 过 / frontier 空的同条消息附 Branch Order 八支一行对账；自评「已想清」或只报计分不构成判空。

## 验收

- [ ] Gate 过；purpose/scope/success/verification 为 confirmed 或 waived，不以 inferred 过闸
- [ ] 判空宣告附八支一行对账（每支：已答/豁免/仓库证），自评不代替对账
- [ ] 存在未决取舍时 Frontier 为 open 且本轮有编号问题
- [ ] Shared understanding 已覆盖；Spec 已求批
- [ ] 有恢复面项目：Spec 落盘时本轨道 work_index 行已指向该 Spec（项目确无恢复面则免）

## 按需读取

- 步骤 2 起：`references/spec-drafting.md` · `spec-review-checklist.md` · `templates/spec.md`
- 文中 `CONTEXT.md` 指目标项目根目录的领域词汇表（若存在），不是插件包文件；先按项目 `AGENTS.md` 找实际词汇来源，不存在不强制创建。

## Recommended next skill

| Situation | Next |
| --- | --- |
| Spec approved | `plan` |
| Spec rejected / 讨论放弃（含 grill 中止） | 同 commit 翻行 `abandoned` 走退休四步（删未批准 Spec；无恢复面或 grill 中止时无件可删）→ 结束 |
| Workbench gap（批准后或用户明示） | `harness-builder` |
