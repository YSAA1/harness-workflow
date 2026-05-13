---
name: verify
description: "当 change 准备声明 ready，需要 fresh verification evidence、evidence ladder、smoke/E2E 判断和能力推荐记录时使用。典型触发语：验证一下、能结束吗、跑最终检查、证明它能用、ready to ship、E2E check、smoke test。review 通过但还缺当前命令证据时必须使用。"
---

# 声明 ready 前验证

`verify` 为一个具体 claim 收集 fresh evidence。它不修复、不重做计划、不清理无关文件，只用当前命令或可用 evidence source 证明当前状态，记录证据边界，并把失败路由到正确 skill。

核心规则：**没有 fresh evidence，就不能声明 ready**。

## 目的

把"可以结束"转化为可追溯证据：每条成功标准都必须对应 fresh command、smoke/E2E 或明确的未验证限制。

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

1. ready claim：active slice、success criteria、verification path。
2. selected recovery surface：最近 implementation/review evidence、risks、capability gaps。
3. `git status --short`：确认最后改动后哪些证据已过期。
4. 项目验证入口：README、`AGENTS.md`、package/build/test config。
5. 当前 slice 涉及的 source/test/docs 路径。

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

## Capability Recommendation

当验证能力不足时，按四个字段写推荐：

- **Value**: what risk the capability would cover.
- **Enablement**: how the user or project would enable it.
- **Risk / cost**: setup overhead, flake risk, security implications.
- **Fallback**: what can be done now without installing it.

本 skill 不安装任何能力，只记录 required/recommended/deferred 的验证能力缺口。项目级安装或配置交给 `harness-builder`。

## 执行流程

### 第 1 步 — Restate The Claim

写一句话："We are verifying that `<active slice>` is ready because `<success criteria>`." 写不出来就回 planning 或 review。

### 第 2 步 — Identify Evidence Freshness

判断既有证据是否晚于最后相关改动、覆盖目标行为、在当前 cwd/env 运行、结果明确。

### 第 3 步 — Select Checks

选择能覆盖风险的最小检查集。相关但跳过的高价值检查必须说明原因。

### 第 4 步 — Run Checks

按文档命令运行，记录 command、cwd、result、输出摘要、freshness 和跳过原因。检查失败就转 `diagnose`。

### 第 5 步 — Compare Against Success Criteria

把每条成功标准映射到 evidence，状态只能是 pass/fail/unknown。unknown 不是 ready。

### 第 6 步 — Update Artifacts

按 selected recovery surface 记录 verification entry、skipped checks、capability gaps 和 residual risk。

### 第 7 步 — Route

| Result | Next |
| --- | --- |
| All required evidence fresh and passing | `cleanup` |
| Command failed or behavior wrong | `diagnose` |
| Evidence insufficient due to missing capability | `harness-builder` 或用户决策 |
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

- **Counting old commands as proof.** Evidence must be after the relevant change.
- **Running broad checks without mapping to success criteria.**
- **Skipping E2E silently.**
- **Fixing during verification.** If a command fails, switch to `diagnose`.
- **Claiming ready with unknowns.** Unknown is not pass.

## 验收标准

- [ ] Active slice and ready claim are stated.
- [ ] Every success criterion is mapped to fresh evidence or marked unknown.
- [ ] Relevant evidence ladder rungs are run or skipped with reasons.
- [ ] Capability gap is absent or documented with value/enablement/risk/fallback.
- [ ] selected recovery surface records commands, results, timestamp, and limits when required.
- [ ] Output routes to the next skill.

## 工件更新

- selected recovery surface：verification entry、capability gaps、skipped checks、residual risks、flaky behavior。
- 不修改实现代码；失败转 `diagnose`。

## 按需读取

- `references/evidence-ladder.md`：detailed verification selection rules。
- `references/capability-recommendations.md`：recommendation format and examples。
- `../diagnose/SKILL.md`：route here on failed verification。
- `../cleanup/SKILL.md`：route here after PASS。
