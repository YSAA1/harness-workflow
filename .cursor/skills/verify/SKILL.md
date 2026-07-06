---
name: verify
description: "用于给具体 ready/done/merge claim 收集 fresh evidence 并映射到成功标准。触发条件：工作准备声明 ready、用户要求验证/最终检查/smoke/E2E，或 review 后缺当前证据。不要在实现仍变化、失败未解释或成功标准不清时使用；verify 不修复。"
---

# 声明 ready 前验证

`verify` 为一个具体 claim 收集 fresh evidence。它不修复、不重做计划、不清理无关文件，只用当前命令或可用 evidence source 证明当前状态，记录证据边界，并把失败路由到正确 skill。

核心规则：**`verify` 是唯一 ready gate；没有 fresh evidence，就不能声明 ready**。

## 路由快照

- **Use when**: 需要证明某个 ready claim，且能列出 success criteria 或 verification path。
- **Do not use when**: 实现仍在变化、命令失败未解释、或 success criteria 写不出来。
- **Route to**: PASS 后转 `cleanup`；失败转 `diagnose`；能力缺口转 `harness-builder`；范围不清转 `plan` / `brainstorm`。

## 目的

把"可以结束"转化为可追溯证据：每条成功标准都必须对应 fresh command、smoke/E2E 或明确的未验证限制。

用结构化 verification record 绑定 claim、路径、最后改动、命令、跳过项、unknown 和 ready verdict。

## 何时使用

### 触发信号

- `review` 没有 blocking structural issue，但仍需要最终 fresh evidence。
- 一个 slice 准备从 in-progress 进入 done/ready。
- 用户说「验证一下」「能结束吗」「跑最终检查」「证明它能用」。
- 改动触及 UI、API、auth、persistence、config、build、packaging 或跨组件行为。
- 之前证据在后续文件变化后变 stale。
- 能力缺口可能阻碍真实验证，例如 Web UI 没有浏览器自动化。

### 不要使用

- 有未解释的失败命令：用 `diagnose`。
- 实现仍在变化：用 `implement`。
- Spec 或成功标准不清：用 `brainstorm` 或 `plan`。
- 任务是单行非行为编辑，用户不需要 tracked evidence。

## 先读取这些输入

1. ready claim：active slice、success criteria、verification path、verification path status、required capabilities、fallback evidence。
2. selected recovery surface：最近 implementation/review evidence、risks、capability gaps。
3. `git status --short`：确认最后改动后哪些证据已过期。
4. 项目验证入口：README、`AGENTS.md`、package/build/test config。
5. 当前 slice 涉及的 source/test/docs 路径。
6. review 产出的 `verify_handoff_cases`（若有）— 对抗式验证清单，每个 case 是需要用 fresh evidence 验证的假设失败路径。不静默丢弃。

## Evidence Ladder

按风险选择最高价值的最小检查集：

1. static parse / syntax
2. build
3. typecheck
4. lint
5. unit tests
6. integration tests
7. smoke test
8. E2E / browser / external system
9. manual or operational signal

详细选择规则见 `references/evidence-ladder.md`。

## Capability Gap Recording

当验证能力不足时，记录缺口并路由到 `harness-builder`，不在 verify 中做完整推荐：

```text
Capability gap: <缺失能力>
Risk: <未覆盖的验证风险>
Fallback now: <当前替代证据>
Route: harness-builder
```

verify 不评估工具方案、不写安装指南、不输出 Capability Recommendation Table。项目级能力安装和完整推荐格式交给 `harness-builder`（见 `../harness-builder/references/recommendation_matrix_policy.md`）。

## 执行流程

### 第 1 步 — Restate The Claim

写一句话："We are verifying that `<active slice>` is ready because `<success criteria>`." 写不出来就回 planning 或 review。

### 第 1.5 步 — Consume Review Handoff Cases

若上一步 review 产出了 `verify_handoff_cases`，逐条映射到后续 checks 选择中。每个 handoff case 必须：

- 绑定到具体验证命令（如 "run `npm test -- --grep 'timeout'` 验证边界条件"），或
- 记录为 `unknown` 并加原因（如 "无法在当前环境构造时序竞争"）

不静默丢弃 review 的 handoff cases。若 review 未产出 handoff cases（无 review 步骤或 review 无此项），跳过本步。

### 第 2 步 — Identify Evidence Freshness

判断既有证据是否晚于最后相关改动、覆盖目标行为、在当前 cwd/env 运行、结果明确。

### 第 3 步 — Select Checks

选择能覆盖风险的最小检查集。读取 `references/evidence-ladder.md` 的"按改动类型选择"表，按当前改动类型定位推荐阶梯组合。相关但跳过的高价值检查必须说明原因。

### 第 4 步 — Run Checks

按文档命令运行，记录 command、cwd、result、输出摘要、freshness 和跳过原因。检查失败就转 `diagnose`。保留所有命令的原始输出——不要只保留你的解读，Cold Verification Pass 需要原始输出。

### 第 4.5 步 — Cold Verification Pass（隔离验证）

对中高风险改动（逻辑/行为/API/安全，非纯文档/格式），尝试将证据交给隔离的验证子进程独立判断。

**为什么需要**：同一 agent 在同一个 session 中既实现又验证，存在自我确认偏差。Cold verifier 不共享实现者的上下文、推理链或既得结论，只接收 artifact + criteria + 原始命令输出，独立判断证据是否真正证明 ready。

**三端 dispatch 机制**：

| 环境 | Dispatch 方式 | Cold verifier 接收 |
| --- | --- | --- |
| Codex | `codex exec` + cold verification packet | diff + success criteria + 原始命令输出 |
| Claude Code | `Agent` 工具（独立子 agent） | `skills/verify/references/cold-verifier-prompt.md` + diff + criteria + 原始输出 |
| Cursor | subagent + isolated context | 同上 |

**Cold verifier 不接收**：实现者的解读、review 结论、聊天上下文、实现者的 ready opinion。

**适用判断**：

| 改动类型 | Cold Verification |
| --- | --- |
| 纯文档/注释/格式化 | 跳过，记录 `cold_verification: skipped (low_risk)` |
| 逻辑/行为/API/配置/安全 | 必须尝试 |

**Fallback**：dispatch 失败或环境不支持时，记录 `cold_verification_attempted: false`、失败原因，回退到主流程自判。不静默跳过——输出中必须出现 `cold_verification` 字段。

**消费 Cold Verdict**：
- `CONFIRMED`：cold verifier 同意证据充分 → 增强 ready 信心
- `DISPUTED`：cold verifier 认为证据不足以证明某项 criteria → 该项必须标记为 `unknown` 或回 `diagnose`
- `INSUFFICIENT`：cold verifier 认为整体证据不足 → 不能声明 ready，回 `diagnose` 或记录 capability gap

### 第 5 步 — Compare Against Success Criteria

把每条成功标准映射到 evidence，状态只能是 pass/fail/unknown。unknown 不是 ready。多阶段或多 commit unit 任务还必须覆盖 `final_integration_claim`。

### 第 5.5 步 — Commit Eligibility 评估

当 Executable Plan 定义了 commit unit 且当前 slice 属于某个 commit unit 时：
- 检查 review 是否已对该 scope 产出 PASS 或 CONDITIONAL（无 Critical）
- 若 verify PASS + review PASS/CONDITIONAL → commit eligibility = eligible，建议执行 milestone commit
- 若 verify PASS 但 review 未做或有 Critical → commit eligibility = not eligible，建议先完成 review

没有 Executable Plan 或 commit unit 时，跳过此步，verify 正常工作。

### 第 6 步 — Update Artifacts

按 selected recovery surface 记录 verification entry、skipped checks、capability gaps 和 residual risk。

### 路由规则

| Condition | Route |
| --- | --- |
| All required evidence fresh and passing | `cleanup`（若 commit eligibility=eligible，先执行 milestone commit） |
| Command failed or behavior wrong | `diagnose` |
| Evidence insufficient due to missing capability | `harness-builder` 或用户决策 |
| Spec / success criteria mismatch | `plan` |

### 第 7 步 — Route

| Result | Next |
| --- | --- |
| All required evidence fresh and passing | commit milestone（当 eligible 时）-> `cleanup` |
| Command failed or behavior wrong | `diagnose` |
| Evidence insufficient due to missing capability | `harness-builder` 或用户决策 |
| Spec / success criteria mismatch | `plan` |

## 输出契约

```text
VERIFICATION: PASS|FAIL|INSUFFICIENT

Verification record:
  claim_id: <stable short id>
  claim: <ready claim>
  covered_paths:
    - <path or behavior surface>
  latest_change_ref: <git diff summary | commit | file timestamp basis>
  success_criteria:
    - criterion: <text>
      evidence: <command/smoke/manual signal>
      status: pass|fail|unknown
  commands:
    - command: <exact command>
      cwd: <path>
      result: pass|fail
      evidence_after_change: yes|no
  skipped_high_value_checks:
    - check: <name>
      reason: <why skipped>
      risk: <risk>
      fallback: <current substitute>
  unknowns:
    - <what remains unproven>
  commit_gate: eligible|not eligible|no commit unit|deferred
  ready: yes|no

Claim:
  - Active slice: ...
  - Success criteria checked: ...

Evidence:
  - Build: <command -> pass|fail|not applicable>
  - Typecheck: ...
  - Lint: ...
  - Unit: ...
  - Integration: ...
  - Smoke/E2E: ...

Freshness:
  - Latest relevant change: ...
  - Evidence after change: yes|no

Capabilities:
  - recorded gaps: <none | gap + risk + fallback + route>

Risks:
  - ...

Cold verification:
  - attempted: yes|no
  - mechanism: <codex_exec | agent_subagent | cursor_subagent | n/a>
  - verdict: confirmed|disputed|insufficient|skipped
  - skip_reason: <low_risk | tool unavailable | cost disproportionate | other>

Ready:
  - YES|NO
  - Next: <cleanup | diagnose | harness-builder | plan>
```

## Recommended next skill

Verification should produce the next lane from evidence, not from optimism.

| Situation | Recommended next skill |
| --- | --- |
| Required evidence is fresh and passing | `cleanup` |
| Command failed or observed behavior is wrong | `diagnose` |
| Required proof is blocked by missing skill, MCP, hook, service, or smoke runner | `harness-builder` |
| Success criteria, Spec, or active slice does not match the checked behavior | `plan` |
| Only docs or recovery notes are stale after passing checks | `cleanup` |

## 常见反模式

共享反模式见 `../review/references/cross-cutting-anti-patterns.md`（AGENTS.md 当会话笔记、角色混淆/verify 中修 bug、静默跳过/不记录、不对照 success criteria）。

verify 特有反模式：

- **Counting old commands as proof.** Evidence must be after the relevant change.
- **Claiming ready with unknowns.** Unknown is not pass.
- **Missing final integration claim.** Local slice proof is not enough for multi-stage work.

## 验收标准

- [ ] Active slice and ready claim are stated.
- [ ] Every success criterion is mapped to fresh evidence or marked unknown.
- [ ] Multi-stage work maps `final_integration_claim` to evidence.
- [ ] Verification record includes claim_id、covered_paths、latest_change_ref、commands、skipped checks、unknowns 和 ready verdict。
- [ ] Relevant evidence ladder rungs are run or skipped with reasons.
- [ ] Capability gap is absent or recorded with gap/risk/fallback/route format.
- [ ] 中高风险改动已尝试 Cold Verification Pass；若跳过或失败，已记录原因。
- [ ] selected recovery surface records commands, results, timestamp, and limits when required.
- [ ] 当 commit unit 存在时，已评估 commit eligibility。
- [ ] Output routes to the next skill.

## 工件更新

- selected recovery surface：verification entry、capability gaps、skipped checks、residual risks、flaky behavior。
- 不修改实现代码；失败转 `diagnose`。

## 按需读取

- `references/evidence-ladder.md`：detailed verification selection rules and scenario mapping。
- `references/capability-recommendations.md`：capability gap recording format and examples。
- `references/cold-verifier-prompt.md`：Cold Verification Pass 隔离子进程 prompt。
- `../review/references/cross-cutting-anti-patterns.md`：review/verify/cleanup 共享反模式。
- `../diagnose/SKILL.md`：route here on failed verification。
- `../cleanup/SKILL.md`：route here after PASS。
