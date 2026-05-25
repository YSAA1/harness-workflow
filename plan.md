## 我已读取到的范围

你上传的文件本身只包含要阅读的仓库地址，我据此读取了 GitHub 上的 `YSAA1/harness-workflow` 仓库内容。

我重点看了：

* 仓库根说明、安装方式、路线图与目录结构：项目定位是 **“Context-aware agent workbench for real repositories”**，目标是给 Codex / Claude Code / Cursor 提供仓库证据、需求上下文、恢复状态与验证纪律。([GitHub][1])
* 当前 skill 套件：`brainstorm`、`plan`、`harness-builder`、`implement`、`diagnose`、`review`、`verify`、`cleanup`、`find-skills`。([GitHub][2])
* `skills/*/SKILL.md` 是 canonical editing surface，插件包与 Cursor / Claude / Codex 相关副本需要通过脚本防漂移。([GitHub][1])
* Matt Pocock 的 skills 哲学：真实工程使用、小而可改、可组合、以 shared language / CONTEXT / ADR / feedback loops / TDD / architecture navigability 为核心。([GitHub][3])
* Matt 的 `write-a-skill` 规范：`description` 是触发契约，`SKILL.md` 应尽量短，长内容进入 `references/`，确定性步骤进入 `scripts/`。([GitHub][4])

---

# 总体判断

`harness-workflow` 的核心方向是对的，不需要大重写。现在更适合做 **外科手术式优化**：

> **保留现有 workflow 语义与强约束，缩短 skill 热路径，强化触发边界，把长政策移入 references，补上 routing/eval/CI 防漂移。**

当前 skill 的优势很明显：

* 已经有清晰 lane：构思、计划、搭建 harness、实现、诊断、审查、验证、收尾。
* `verify` 作为唯一 ready gate 的设计很强：没有 fresh evidence 就不能宣称 ready。([GitHub][5])
* `implement` 的 WIP=1、风险分级验证、不能直接宣称 ready 的纪律合理。([GitHub][6])
* `cleanup` 的 anti-entropy / knowledge freshness gate 很符合长期项目维护。([GitHub][7])
* `harness-builder` 已经覆盖 evidence-first、coverage matrix、capability shortlist、现有 harness reconciliation、read-only subagents、research route 等关键机制。([GitHub][8])

主要问题不是“缺流程”，而是 **流程热路径偏重、skill 边界偏厚、触发契约不够 Matt-style 简洁**。这会导致模型在真实任务中加载过多政策，或者在 `brainstorm / plan / harness-builder`、`review / verify / cleanup` 之间犹豫。

---

# 借鉴 Matt Pocock 的 6 条设计原则

## 1. `description` 是触发契约，不是摘要

Matt 的 `write-a-skill` 明确强调：`description` 是 agent 决定是否加载 skill 时看到的核心信息，应该短、具体、说明 capability 与触发条件。([GitHub][4])

**落到 harness-workflow：**

每个 skill 的 frontmatter description 应改成两句结构：

```md
description: >
  Use this skill to [capability].
  Trigger it when [specific situations], not when [clear exclusions].
```

尤其要重写这些边界：

| Skill             | 当前风险           | 手术目标                                      |
| ----------------- | -------------- | ----------------------------------------- |
| `brainstorm`      | 容易和 `plan` 混   | 只负责模糊需求澄清与 Spec 构思                        |
| `plan`            | 容易变成流程总控       | 只把已清楚需求转成 executable plan                 |
| `harness-builder` | 容易过度介入         | 只在需要创建/修复工作台、能力缺口、验证缺口时进入                 |
| `review`          | 容易和 `verify` 混 | 只做 diff / scope / risk judgment，不宣称 ready |
| `verify`          | 容易被当成普通测试      | 明确是唯一 ready evidence gate                 |
| `cleanup`         | 容易被当成代码清理      | 只做知识面、文档、恢复状态、artifact 收尾                 |

---

## 2. `SKILL.md` 保持短，复杂内容 progressive disclosure

Matt 的模式是：`SKILL.md` 控制在较短热路径内，长内容进入 `references/`，罕见或高级细节按需加载。([GitHub][4])

**落到 harness-workflow：**

目标不是机械压缩，而是让每个 skill 的 `SKILL.md` 只保留：

1. 何时使用 / 何时不用
2. 输入与前置条件
3. 不变量
4. 5–7 步主流程
5. 输出格式
6. 路由到其他 skill 的条件

其余内容移入 `references/`：

| Skill             | 建议迁移到 references 的内容                                                 |
| ----------------- | -------------------------------------------------------------------- |
| `brainstorm`      | Spec 模板、澄清问题库、verification strategy 示例                               |
| `plan`            | planning surface matrix、commit unit 示例、blocked verification policy   |
| `harness-builder` | capability discovery、research route、init scaffold、coverage matrix 模板 |
| `implement`       | risk-based verification table、TDD examples                           |
| `diagnose`        | hypothesis/probe examples、failure taxonomy                           |
| `review`          | severity rubric、review checklist                                     |
| `verify`          | evidence ladder、verification record examples                         |
| `cleanup`         | knowledge freshness checklist、artifact regeneration rules            |
| `find-skills`     | skill marketplace quality rubric                                     |

---

## 3. shared language 优先于长说明

Matt 的 `grill-with-docs` 强调通过 `CONTEXT.md`、glossary、ADR 建立 shared language，而不是把所有语义塞进单个 skill。([GitHub][9])

**落到 harness-workflow：**

建议新增或强化一个共享术语层：

```txt
CONTEXT.md
docs/adr/
docs/workflow-glossary.md
```

先定义这些术语，不让每个 skill 重复解释：

| 术语                    | 建议定义                                             |
| --------------------- | ------------------------------------------------ |
| `ready`               | 只有 `verify` 可以给出的状态                              |
| `fresh evidence`      | 本轮实际运行或确认的证据，不是旧日志                               |
| `active slice`        | 当前唯一实现切片，WIP=1                                   |
| `recovery surface`    | 任务恢复所需的计划、状态、上下文、剩余风险                            |
| `planning surface`    | plan 可以写入的位置：plan doc、issue、feature list、三文件等    |
| `capability gap`      | 当前 repo 缺少验证、观测、脚本、环境、工具或知识入口                    |
| `knowledge freshness` | README、AGENTS、docs、generated artifacts 与真实仓库状态一致 |

这样可以显著缩短 skill 文件，同时减少概念漂移。

---

## 4. TDD 与 vertical slice 要进入 `implement`

Matt 的 TDD skill 很强调 **vertical slices / tracer bullets**：一条测试驱动一小块实现，不做横向大铺垫。([GitHub][10])

`harness-workflow` 的 `implement` 已经有 WIP=1 和 TDD loop，但可以更明确地吸收这条原则：([GitHub][6])

```md
Preferred loop:
1. Pick one externally observable behavior.
2. Add or identify one failing check.
3. Implement the smallest code path.
4. Run the nearest verification.
5. Refactor only inside the active slice.
6. Sync recovery notes.
```

这会比“按模块推进”更抗失控。

---

## 5. architecture navigability 要服务 agent，而不是只服务人类

Matt 的 architecture skill 关注 deep modules、interfaces、seams、locality、testability 和 AI-navigability。([GitHub][11])

`harness-workflow` 可以把这部分放进两个地方：

* `harness-builder`：发现 repo 结构不利于 agent 工作时，提出 harness 改造建议。
* `review`：审查时标记 architecture entropy，但不直接重构。

不要新增一个大而全的 architecture skill，除非现有项目频繁需要架构诊断。更好的手术式做法是先加一份 reference：

```txt
skills/review/references/architecture-risk-rubric.md
skills/harness-builder/references/ai-navigability-checklist.md
```

---

## 6. scripts 承担确定性检查

Matt 的 `write-a-skill` 建议：重复、确定性、容易出错的步骤进入 scripts，以提升可靠性、节省 token。([GitHub][4])

`harness-workflow` 已经有 plugin / install / drift 检查脚本的方向。仓库说明也明确 root `skills/` 是 canonical surface，并有脚本检查 packaged copy drift。([GitHub][1])

建议新增 skill 质量检查脚本：

```txt
scripts/check-skills-frontmatter.mjs
scripts/check-skills-routing.mjs
scripts/check-skills-references.mjs
scripts/check-skills-output-contracts.mjs
```

检查项：

* 每个 `SKILL.md` 有 frontmatter。
* `description` 小于 1024 字符。
* `description` 包含 capability + trigger。
* `SKILL.md` 不直接引用不存在的 reference。
* 每个 skill 有 `Use when` / `Do not use when`。
* 每个 skill 有稳定 output contract。
* 关键术语来自 shared glossary。
* packaged copies 与 root `skills/` 无漂移。

---

# 行动方案

## Phase 0 — 建立基线，不动语义

**目标：** 先确认现状，避免一上来大重写。

产出：

```txt
docs/skill-audit/2026-05-25-skill-baseline.md
```

内容包括：

| 检查项             | 说明                             |
| --------------- | ------------------------------ |
| skill 列表        | 当前 9 个 skill                   |
| 每个 SKILL.md 行数  | 判断热路径重量                        |
| description 长度  | 判断触发契约质量                       |
| references 使用情况 | 判断 progressive disclosure 是否充分 |
| skill 间路由       | 找重叠与冲突                         |
| 输出格式            | 判断是否可恢复、可审计                    |
| packaged copies | 判断是否存在同步风险                     |

**不改的东西：**

* 不删除现有 skill。
* 不合并 `review` 和 `verify`。
* 不削弱 `verify` 的唯一 ready gate。
* 不把 `cleanup` 变成代码重构。
* 不让 `harness-builder` 变成默认入口。

---

## Phase 1 — 先做 description 与 routing 手术

**目标：** 最小改动，最大收益。

优先改这些文件：

```txt
skills/*/SKILL.md
README.md
README.zh-CN.md
docs/skill-routing.md   # 新增
```

### 建议新增 routing matrix

```md
# Skill Routing Matrix

| Situation | Use | Do not use |
|---|---|---|
| User idea is fuzzy | brainstorm | plan |
| Requirement is clear but execution path is not | plan | brainstorm |
| Repo lacks harness / verification / recovery surface | harness-builder | implement |
| One active slice is ready to code | implement | verify |
| A failure exists but cause is unknown | diagnose | implement |
| Need judgment on diff/scope/risk | review | verify |
| Need fresh evidence for ready claim | verify | review |
| Need docs/state/artifact closure | cleanup | implement |
| Need external skill discovery | find-skills | harness-builder unless adoption is required |
```

### 关键边界要写死

```md
implement cannot mark ready.
review cannot mark ready.
verify cannot fix.
cleanup cannot change behavior.
harness-builder cannot silently turn vague requests into a full harness.
```

这些边界都符合当前仓库已有设计，只是把它们变成更可触发、更不含糊的路由契约。([GitHub][1])

---

## Phase 2 — 热路径瘦身，把长政策移入 references

**目标：** 保留语义，减少模型每次进入 skill 时的负担。

### 建议目标

| 文件                         | 目标                            |
| -------------------------- | ----------------------------- |
| 普通 `SKILL.md`              | 80–120 行左右                    |
| `harness-builder/SKILL.md` | 可略长，但尽量 <160 行                |
| 复杂 checklist               | 进入 `references/`              |
| 复杂模板                       | 进入 `references/templates/`    |
| 罕见路径                       | 进入 `references/advanced-*.md` |

### 示例：`verify`

当前 `verify` 的 Evidence Ladder 很有价值，但不一定需要全部在热路径里。([GitHub][5])

建议拆成：

```txt
skills/verify/SKILL.md
skills/verify/references/evidence-ladder.md
skills/verify/references/verification-record-template.md
skills/verify/references/unverified-claim-policy.md
```

`SKILL.md` 只保留：

```md
Use verify when a ready/done/merge claim needs fresh evidence.

Invariants:
- Verify does not fix.
- No fresh evidence, no ready claim.
- Map every success criterion to evidence or mark it unverified.

Workflow:
1. Restate claim.
2. Identify success criteria.
3. Select strongest available evidence.
4. Run or inspect fresh checks.
5. Map evidence to criteria.
6. State ready / not ready / blocked.
7. Update verification record.
```

---

## Phase 3 — 给每个 skill 加稳定 output contract

**目标：** 让每次 agent 运行都可恢复、可审计、可路由。

建议统一格式，但不同 skill 保持自己的字段。

### `brainstorm` 输出

```md
## Spec Direction
## Open Questions
## Options Compared
## Recommended Direction
## Verification Strategy
## Needs User Decision
## Next Skill
```

`brainstorm` 目前已经强调多轮澄清、方案比较、先设计验证策略，再写 Spec。这个方向应保留，只是输出契约可以更短更稳定。([GitHub][12])

### `plan` 输出

```md
## Objective
## Active Slice
## Non-goals
## Success Criteria
## Verification Path
## Capability Gaps
## Stages
## Risks
## Next Skill
```

`plan` 现在的定位是把 approved Spec 或清晰请求转成 Executable Plan，并且支持不同 planning surface，而不是强制三文件。这个设计应保留。([GitHub][13])

### `implement` 输出

```md
## Active Slice
## Change Made
## Check Added or Used
## Local Evidence
## Recovery Notes Updated
## Remaining Work
## Next Skill
```

### `diagnose` 输出

```md
## Failure
## Reproduction
## Hypotheses Tried
## Root Cause
## Fix or Blocker
## Regression Evidence
## Next Skill
```

`diagnose` 的“不复现、不修；无 root cause 证据、不修”很强，应保留为硬约束。([GitHub][14])

### `review` 输出

```md
## Verdict
Pass | Conditional | Block

## Findings
## Scope / Spec Coverage
## Evidence Gaps
## Entropy Risks
## Required Changes
## Route
```

`review` 当前已有 Pass / Conditional / Block 判断，非常适合固化成 schema。([GitHub][15])

### `verify` 输出

```md
## Claim
## Evidence Run
## Success Criteria Mapping
## Unverified Areas
## Ready Judgment
## Next Action
```

### `cleanup` 输出

```md
## Closure State
Done | Partial | Blocked

## Docs Updated
## Artifacts Regenerated
## Recovery Surface
## Known Residual Drift
## Final Handoff
```

---

## Phase 4 — 引入 Matt-style examples / evals

**目标：** 不只靠说明，让 skill 有“案例测试”。

建议新增：

```txt
docs/skill-evals/
  routing-cases.md
  negative-cases.md
  output-contract-cases.md
```

或每个 skill 自带：

```txt
skills/plan/evals/route-cases.md
skills/verify/evals/route-cases.md
```

### 示例 routing eval

```md
Case: User says "fix the failing checkout test"
Expected:
- If failure is reproducible but cause unknown -> diagnose.
- If root cause is known and active slice is clear -> implement.
- If fix is complete and ready is claimed -> verify.
Not expected:
- brainstorm.
- harness-builder unless verification environment is missing.
```

### 示例 negative eval

```md
Case: User says "this is done, right?"
Expected:
- verify.
Not expected:
- review, because judgment without fresh evidence cannot mark ready.
```

这类 eval 能防止之后优化时把 skill 边界改坏。

---

## Phase 5 — packaging / drift 防线

**目标：** 保证 root `skills/` 是唯一真源，插件副本不漂移。

已有仓库结构已经显示：

```txt
skills/*
plugins/harness-workflow/
.codex-plugin
.claude-plugin
.cursor-plugin
.cursor/rules
rules
scripts/check-*.mjs
```

并且 README 明确 root `skills/` 是 canonical editing surface，检查脚本用于防 packaged copy drift。([GitHub][1])

建议新增 CI job：

```yaml
skill-quality:
  - node scripts/check-skills-frontmatter.mjs
  - node scripts/check-skills-routing.mjs
  - node scripts/check-skills-references.mjs
  - node scripts/check-plugin.mjs
  - node scripts/check-claude-code-install.mjs
  - node scripts/check-cursor-install.mjs
```

---

# Skill-by-skill 手术清单

| Skill             | 手术方向                                                                                                                                    | 优先级 |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------- | --- |
| `harness-builder` | 最大瘦身对象。保留 orchestrator 身份，把 init scaffold、research route、capability discovery、coverage matrix 大块移到 references。明确“不能默认把模糊请求升级为 harness”。 | P0  |
| `brainstorm`      | 借鉴 `grill-with-docs`：一问一答、术语澄清、能从代码回答的问题先查代码，不用用户猜。Spec 模板外移。                                                                           | P0  |
| `plan`            | 强化 planning surface 选择：issue / doc / feature list / 三文件都只是载体。输出契约固定。                                                                    | P0  |
| `implement`       | 加入 vertical slice / tracer bullet 表达：一个行为、一条检查、一小步实现。保留 WIP=1。                                                                          | P1  |
| `diagnose`        | 固化 `Observation → Hypothesis → Probe → Result` 模板。三轮无进展则 blocker。                                                                       | P1  |
| `review`          | 明确只判断 diff/scope/risk/docs/entropy，不跑 ready gate。                                                                                       | P1  |
| `verify`          | 保留唯一 ready gate。Evidence Ladder 外移，热路径只保留 claim→criteria→fresh evidence→judgment。                                                       | P0  |
| `cleanup`         | 明确 “knowledge cleanup, not code cleanup”。加 no behavior changes guard。                                                                   | P1  |
| `find-skills`     | 加强外部 skill 质量门槛；安装或项目采用必须路由到 `harness-builder`。                                                                                         | P2  |

---

# 推荐 PR 拆分

## PR 1 — Trigger & Routing Contract

**范围：**

```txt
skills/*/SKILL.md frontmatter
docs/skill-routing.md
README.md / README.zh-CN.md 小幅补充
```

**原则：**

* 只改触发语义。
* 不移动大段内容。
* 不改变 workflow 行为。

**收益：** 马上降低误触发。

---

## PR 2 — Progressive Disclosure Refactor

**范围：**

```txt
skills/*/references/
skills/*/SKILL.md
```

**动作：**

* 把长 checklist、模板、policy 拆入 references。
* `SKILL.md` 保留主流程。
* 所有 reference 保持一层深，避免 agent 找不到。

**收益：** 热路径变短，skill 更 Matt-style。

---

## PR 3 — Output Contracts & Shared Glossary

**范围：**

```txt
CONTEXT.md
docs/workflow-glossary.md
docs/adr/0001-skill-design-philosophy.md
skills/*/SKILL.md
```

**动作：**

* 统一术语。
* 固定每个 skill 的输出字段。
* 写一条 ADR：为什么采用 “short skill + references + scripts + evals”。

**收益：** 长期维护者不会重新把内容塞回 `SKILL.md`。

---

## PR 4 — Skill Evals

**范围：**

```txt
docs/skill-evals/
scripts/check-skills-routing.mjs
```

**动作：**

* 加 20–30 个 routing cases。
* 加 negative cases。
* 让 CI 检查 skill 名称、路由表、reference path 不漂移。

**收益：** 防止未来优化破坏边界。

---

## PR 5 — Packaging Sync & CI

**范围：**

```txt
scripts/
.github/workflows/
plugins/harness-workflow/
.codex-plugin/
.claude-plugin/
.cursor-plugin/
```

**动作：**

* 运行并补强现有 drift check。
* 确保 root `skills/` 到插件包的一致性。
* CI 中跑 skill quality checks。

---

# Definition of Done

这一轮优化完成的标准建议设为：

| 标准                                        | 目标                                                 |
| ----------------------------------------- | -------------------------------------------------- |
| 每个 skill 的触发条件                            | 一眼可判断                                              |
| 每个 `description`                          | capability + trigger + exclusion                   |
| 每个 `SKILL.md`                             | 热路径短，长内容外移                                         |
| 每个 skill                                  | 有稳定 output contract                                |
| 关键术语                                      | 来自 shared glossary                                 |
| `review` / `verify` / `cleanup`           | 边界无重叠                                              |
| `brainstorm` / `plan` / `harness-builder` | 升级路径清楚                                             |
| verification                              | `verify` 仍是唯一 ready gate                           |
| scripts                                   | 能检查 frontmatter、references、routing、packaging drift |
| CI                                        | 防止 skill 副本漂移                                      |

---

# 我建议先动的第一刀

第一刀不要碰复杂逻辑，先做 **routing + description 手术**。

最小 patch：

```txt
1. 新增 docs/skill-routing.md
2. 重写 9 个 skills/*/SKILL.md 的 description
3. 每个 skill 顶部加：
   - Use when
   - Do not use when
   - Route to
4. 不改主流程正文
5. 跑现有 check scripts
```

这一步风险最低，但能立刻改善 agent 的 skill 选择质量。之后再进入热路径瘦身和 references 拆分。

[1]: https://github.com/YSAA1/harness-workflow "GitHub - YSAA1/harness-workflow: Context-aware agent workflow and project harness for Codex, Claude Code, and Cursor. · GitHub"
[2]: https://github.com/YSAA1/harness-workflow/tree/master/skills "harness-workflow/skills at master · YSAA1/harness-workflow · GitHub"
[3]: https://github.com/mattpocock/skills "GitHub - mattpocock/skills: Skills for Real Engineers. Straight from my .claude directory. · GitHub"
[4]: https://github.com/mattpocock/skills/blob/main/skills/productivity/write-a-skill/SKILL.md "skills/skills/productivity/write-a-skill/SKILL.md at main · mattpocock/skills · GitHub"
[5]: https://github.com/YSAA1/harness-workflow/blob/master/skills/verify/SKILL.md "harness-workflow/skills/verify/SKILL.md at master · YSAA1/harness-workflow · GitHub"
[6]: https://github.com/YSAA1/harness-workflow/blob/master/skills/implement/SKILL.md "harness-workflow/skills/implement/SKILL.md at master · YSAA1/harness-workflow · GitHub"
[7]: https://github.com/YSAA1/harness-workflow/blob/master/skills/cleanup/SKILL.md "harness-workflow/skills/cleanup/SKILL.md at master · YSAA1/harness-workflow · GitHub"
[8]: https://github.com/YSAA1/harness-workflow/blob/master/skills/harness-builder/SKILL.md "harness-workflow/skills/harness-builder/SKILL.md at master · YSAA1/harness-workflow · GitHub"
[9]: https://github.com/mattpocock/skills/blob/main/skills/engineering/grill-with-docs/SKILL.md "skills/skills/engineering/grill-with-docs/SKILL.md at main · mattpocock/skills · GitHub"
[10]: https://github.com/mattpocock/skills/blob/main/skills/engineering/tdd/SKILL.md "skills/skills/engineering/tdd/SKILL.md at main · mattpocock/skills · GitHub"
[11]: https://github.com/mattpocock/skills/blob/main/skills/engineering/improve-codebase-architecture/SKILL.md "skills/skills/engineering/improve-codebase-architecture/SKILL.md at main · mattpocock/skills · GitHub"
[12]: https://github.com/YSAA1/harness-workflow/blob/master/skills/brainstorm/SKILL.md "harness-workflow/skills/brainstorm/SKILL.md at master · YSAA1/harness-workflow · GitHub"
[13]: https://github.com/YSAA1/harness-workflow/blob/master/skills/plan/SKILL.md "harness-workflow/skills/plan/SKILL.md at master · YSAA1/harness-workflow · GitHub"
[14]: https://github.com/YSAA1/harness-workflow/blob/master/skills/diagnose/SKILL.md "harness-workflow/skills/diagnose/SKILL.md at master · YSAA1/harness-workflow · GitHub"
[15]: https://github.com/YSAA1/harness-workflow/blob/master/skills/review/SKILL.md "harness-workflow/skills/review/SKILL.md at master · YSAA1/harness-workflow · GitHub"
