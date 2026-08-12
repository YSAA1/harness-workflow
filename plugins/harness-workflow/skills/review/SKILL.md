---
name: review
description: "用于对稳定 diff 做对抗审查并用 fresh evidence 判定 ready。触发：implement/diagnose 后要结束、用户说 review/verify/最终检查。WIP 或未解释失败时不用；本 skill 是唯一 ready gate。"
---

# 对抗审查与 Ready Gate

实现后的唯一公开闸门。两段：**结构对抗** → **fresh evidence / ready**。`verify` 是别名，仍走这里。不修代码。

Leading words: **adversarial** · **subagent** · **fresh evidence** · **ready**

## 路由

- **Use**: 切片稳定；或要证明 ready。
- **Don't**: WIP → `implement`；命令红且根因不明 → `diagnose`；标准不清 → `brainstorm`/`plan`。
- **Next**: ready YES → milestone commit（若 eligible）→ `cleanup`；Critical/Important → `implement`；行为失败 → `diagnose`；能力缺口 → `harness-builder`。

低风险、用户不要求 tracked evidence 的单行非行为改动：可轻量自检，不必满配闸门。

## 输入

1. Claim：active slice、success criteria、verification path。
2. Diff 事实：`git status --short`、相关 diff、untracked、相关源/测/文档。
3. Spec / Plan / recovery；项目检查入口（README、`AGENTS.md`）。
4. 中高风险再读：`references/adversarial-reviewer-prompt.md`、`attack-taxonomy.md`、`evidence-ladder.md`、`cold-verifier-prompt.md`。

## 流程

### 1. 重述 claim

一句话：slice +「ready because \<criteria\>」。写不出 → 回 `plan`/`brainstorm`。

完成：claim 可证伪。

### 2. 结构对抗（subagent）

组 **只含事实** 的 packet（不要实现者辩解）。中高风险：spawn **独立只读 subagent**，用 adversarial prompt。机制只记 `subagent` | `packet_fallback`（后者仅低风险或 subagent 不可用；中高风险无 subagent → 不得 ready）。

完成：findings 分级；handoff cases 列出。

### 3. Fresh evidence

按 `evidence-ladder.md` 跑最小检查；每条 criterion → pass|fail|unknown。消费 handoff cases。中高风险：冷证据交给只读 subagent（`cold-verifier-prompt.md`），只给原始输出。

完成：verification record 填齐；unknown/fail 则 ready=no。

### 4. 判定与路由

Ready = 无 Critical **且** 所需 criterion 全 pass。写 recovery；输出契约。

完成：READY 明确；Next skill 明确。

## 结构尺（扁平）

Spec/non-goals · 正确性/设计风险 · docs · entropy ·（有 Plan 时）阶段 acceptance。

## 输出（精简）

```text
REVIEW: PASS | CONDITIONAL | BLOCK
VERIFICATION: PASS|FAIL|INSUFFICIENT
READY: yes|no

Isolation: subagent|packet_fallback|failed
Findings: Critical/Important/Minor ...
Criteria: [criterion -> pass|fail|unknown]
Cold: confirmed|disputed|insufficient|skipped
Commit gate: eligible|not eligible|no commit unit
Next: cleanup | implement | diagnose | harness-builder | plan
```

完整字段需要时沿用 `references/adversarial-reviewer-prompt.md` 与既有 verification record 习惯即可，不必每项填表。

## 验收

- [ ] 中高风险尝试了独立 subagent，或明确不得 ready
- [ ] 每条所需 criterion 有 fresh 映射；unknown ≠ ready
- [ ] 未在本 skill 修代码

## 按需读取

- `references/adversarial-reviewer-prompt.md` · `attack-taxonomy.md` · `evidence-ladder.md` · `cold-verifier-prompt.md` · `capability-recommendations.md` · `cross-cutting-anti-patterns.md`

## Recommended next skill

| Situation | Next |
| --- | --- |
| READY yes | `cleanup` |
| Structural findings | `implement` |
| Unexplained fail | `diagnose` |
| Capability gap | `harness-builder` |
