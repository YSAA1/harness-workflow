---
name: verify
description: "当 tracked change 准备声明 ready，需要 fresh verification evidence、evidence ladder、smoke/E2E 判断和能力推荐记录时使用。典型触发语：验证一下、能结束吗、跑最终检查、证明它能用、ready to ship、E2E check、smoke test。review 通过但还缺当前命令证据时必须使用。"
---

# 声明 ready 前验证

本 skill 是 tracked slice 声明 ready 前的最终证据闸门。它不修复、不重做计划、不清理无关文件，只用 fresh commands 证明当前状态，记录证据边界，并把失败路由到正确 skill。

核心规则：**没有 fresh evidence，就不能声明 ready**。

## Workflow State Contract

本 workflow 依赖的是 `state-contract` 定义的 workflow state，而不是某三个文件本身。默认 backend 是三文件：`task_plan.md` / `progress.md` / `findings.md`。

如果项目在 `AGENTS.md`、`.harness/manifest.yaml` 或 `.harness/state.md` 中声明了其他 backend（lightweight、feature-list、existing），按该 backend 读取 active slice、evidence、decisions、risks 和 handoff。

若 state backend 不存在：简单任务可以轻量执行；非平凡或跨 session 任务先调用 `state-contract` 或 `plan` 建立状态。

## 目的

把"可以结束"转化为可追溯证据：每条成功标准都必须对应 fresh command、smoke/E2E 或明确的未验证限制。

## 何时使用

### 触发信号

- `review` found no blocking structural issue, but the slice still needs final fresh evidence.
- A slice is about to move from `in_progress` to `complete`.
- 用户说「验证一下」「能结束吗」「跑最终检查」「证明它能用」。
- The change touched UI, API, auth, persistence, config, build, packaging, or cross-component behavior.
- Prior evidence is stale because files changed after the last command.
- A capability gap may block proper verification, such as web UI without browser automation.

### 不要使用

- There is an unexplained failing command: use `diagnose`.
- The implementation is still changing: use `implement`.
- The spec is unclear: use `brainstorm` or `plan`.
- The task is a one-line non-behavioral edit and the user does not need tracked evidence.

## 先读取这些输入

1. workflow state execution contract：active slice、success criteria、verification path、blocker state（默认 `task_plan.md` 范围合同）。
2. workflow state evidence log：latest implementation and review entries; identify what evidence is stale（默认 `progress.md`）。
3. workflow state findings area：accepted spec, risks, prior failures, capability gaps（默认 `findings.md`）。
4. `git status --short`: confirm what changed since last evidence.
5. Project verification entry points: README, `AGENTS.md`, package/build/test config.
6. Related source/test paths touched by the current slice.

如果这些文件互相矛盾，先验证矛盾来源，再运行大范围检查。

## Evidence Ladder

Pick the highest-value set of checks for the current risk. You do not need to run every rung, but every skipped high-value rung needs a reason.

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

## E2E Required Signals

E2E or smoke-level verification is required when the change includes:

- multi-step user journey
- frontend + backend integration
- persistence across restart or reload
- auth, permission, payment, or other trust boundary
- browser rendering, routing, file upload, download, drag/drop, media, canvas, or websocket behavior
- packaging / installer / CLI invocation path
- release-facing regression where unit tests cannot represent the real path

如果项目缺少可用 E2E 路径，记录 capability recommendation，不要假装 unit tests 已经足够。

## Capability Recommendation

当验证能力不足时，按四个字段写推荐：

- **Value**: what risk the capability would cover.
- **Enablement**: how the user or project would enable it.
- **Risk / cost**: setup overhead, flake risk, security implications.
- **Fallback**: what can be done now without installing it.

Common mappings:

| Project need | Recommended capability |
| --- | --- |
| Web app UI | Playwright MCP or Playwright test suite |
| Browser debugging | Chrome DevTools MCP or Playwright trace |
| External API behavior | official docs/search capability plus mocked contract tests |
| Issue-driven workflow | GitHub / issue tracker MCP |
| Long-running jobs | logs, health check, trace, metrics capture |

本 skill 不安装任何能力，只推荐。

## 执行流程

### 第 1 步 — Restate The Claim

Write one sentence:

- "We are verifying that `<active slice>` is ready because `<success criteria>`."

If you cannot write this sentence, return to planning or review.

### 第 2 步 — Identify Evidence Freshness

For each previous command in `progress.md`:

- Is it after the latest relevant file change?
- Does it cover the changed behavior?
- Was it run in the current cwd and environment?
- Did it pass, fail, or have limits?

Only fresh, relevant commands count.

### 第 3 步 — Select Checks

Choose the smallest set of checks that covers the risk:

- Low-risk doc-only change: link/path checks or markdown lint if available.
- Pure logic: focused unit + adjacent regression.
- Config/build change: syntax + build/typecheck + smoke command.
- UI/user journey: unit/integration where relevant + browser smoke/E2E.
- Security/trust boundary: targeted tests + review/security lane + runtime evidence.

### 第 4 步 — Run Checks

Run commands exactly as documented when possible. Record:

- command
- cwd
- result
- relevant output summary
- whether it is fresh
- any skipped checks and why

不要隐藏失败。只要检查失败，下一步就转 `diagnose`。

### 第 5 步 — Compare Against Success Criteria

Map each success criterion to evidence:

| Criterion | Evidence | Status |
| --- | --- | --- |
| <from task_plan.md> | <command / smoke / manual signal> | pass/fail/unknown |

Unknown means not ready.

### 第 6 步 — Update Artifacts

- `progress.md`: append verification entry with commands and results.
- `findings.md`: record downgraded checks, flaky behavior, capability gaps, residual risk.
- `task_plan.md`: do not mark the phase complete here; record verification result and route to `cleanup` for closure, or update blocker / next on FAIL or INSUFFICIENT.

### 第 7 步 — Route

| Result | Next |
| --- | --- |
| All required evidence fresh and passing | `cleanup` |
| Command failed or behavior wrong | `diagnose` |
| Evidence insufficient due to missing capability | `save-session` with `blocked`, or user decision to enable capability |
| Spec / success criteria mismatch | `plan` |

## 输出格式

```text
VERIFICATION: PASS|FAIL|INSUFFICIENT

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
  - recommended: <none | capability + value/enablement/risk/fallback>

Risks:
  - ...

Ready:
  - YES|NO
  - Next: <cleanup | diagnose | bootstrap | plan>
```

## 示例

### 示例 1: Pure Logic Change

Active slice changes a date parser. Evidence:

- focused parser test passes
- caller integration test passes
- typecheck passes
- E2E skipped because no user flow changed

Result: `PASS`, next `cleanup`.

### 示例 2: Web UI Change Without Browser Tool

Active slice changes checkout modal flow. Unit tests pass, but no browser can run.

Result: `INSUFFICIENT`.

Capability recommendation:

- Value: validates real click path, routing, DOM state, screenshot regressions.
- Enablement: add Playwright test or enable Playwright MCP for this project.
- Risk / cost: setup time and possible flake management.
- Fallback: manual smoke with recorded steps and screenshots, marked weaker evidence.

### 示例 3: Stale Evidence

`npm test` passed before a follow-up edit changed the API shape. That command is stale. Re-run the relevant tests before bootstrap.

## 常见反模式

- **Counting old commands as proof.** Evidence must be after the relevant change.
- **Running broad checks without mapping to success criteria.** A green build may not verify the changed behavior.
- **Skipping E2E silently.** If E2E is relevant but unavailable, record why and recommend a capability.
- **Fixing during verification.** If a command fails, switch to `diagnose`; do not mix lanes.
- **Claiming ready with unknowns.** Unknown is not pass.

## 验收标准

- [ ] Active slice and ready claim are stated.
- [ ] Every success criterion is mapped to fresh evidence or marked unknown.
- [ ] Relevant evidence ladder rungs are run or skipped with reasons.
- [ ] Capability gap is either absent or documented with value/enablement/risk/fallback.
- [ ] `progress.md` records commands, results, timestamp, and limits.
- [ ] `findings.md` records residual risks or downgraded checks.
- [ ] Output routes to the next skill.

## 工件更新

- `progress.md`: append verification entry.
- `findings.md`: capability gaps, skipped checks, residual risks, flaky behavior.
- `task_plan.md`: do not mark complete; after PASS route to `cleanup`, otherwise update blocker / next.

## 按需读取

- `references/evidence-ladder.md`: detailed verification selection rules.
- `references/capability-recommendations.md`: recommendation format and examples.
- `../diagnose/SKILL.md`: route here on failed verification.
- `../cleanup/SKILL.md`: route here after PASS.


## State Contract Reference

需要选择、修复或解释 workflow state backend 时，读取 `../state-contract/SKILL.md`。
