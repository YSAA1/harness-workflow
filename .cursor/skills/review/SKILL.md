---
name: review
description: "用于对稳定 diff 做 scope、correctness、docs、entropy 和 risk 的结构性评审。触发条件：implement/diagnose 后准备进入 ready 证明，或用户要求 review/sanity check。不要在 WIP、失败未解释或只需要 fresh evidence 时使用；review 不能声明 ready。"
---

# 工作流结构评审

`review` 用 **Spec / scope / diff / docs / entropy / risk** 六把尺检查当前结果，并默认采用 **adversarial review posture**：把实现视为未证明可信，先构造可能失败路径，再寻找代码、文档、测试或 evidence 反证。它抓正确性、范围、设计风险、缺失测试和文档漂移；fresh evidence sufficiency 与 ready judgement 归 `verify`。

## 路由快照

- **Use when**: 有意义改动已经稳定，需要在 ready 前判断范围、正确性、文档、熵和风险。
- **Do not use when**: 工作仍在 WIP、失败正在发生、或唯一问题是缺 fresh evidence。
- **Route to**: 无 blocking finding 转 `verify`；有结构问题转 `implement`；失败不明转 `diagnose`。

## 目的

review 必须同时检查"做超了"和"做欠了"。它可以判断"没有结构性 blocker"，但不能作为最终 ready gate。通过后仍路由到 `verify`；若已有 fresh evidence，则走 `verify` fast-path 做短重检和 claim mapping。

默认原则：meaningful diff 必须先尝试 **隔离 reviewer**，失败、不可用或成本明显不成比例时才 fallback。隔离优先级：

1. read-only subagent / independent reviewer。
2. Codex 环境中的 `codex exec review`。
3. Codex 环境中的 `codex exec` + review packet + reviewer prompt。
4. packet-based fallback，由当前 agent 按同一 prompt 做弱隔离审查。

fallback 不是静默自审；输出必须记录机制、失败原因或跳过原因。Tiny / trivial diff 可以直接 fallback，但必须说明为什么不属于 meaningful diff。

## 何时使用

### 触发信号

- `implement` 完成一个 slice、即将转下一阶段。
- `diagnose` 修复稳定，要回主流程。
- 用户说「review 一下」「这样可以吗」「能不能合并」「commit 前检查」「sanity check」。
- 准备调用 `verify` 之前的结构性把关。
- 多 agent 协作时上一个 agent 刚交付，本 agent 接手前。

### 不要使用

- 工作还在 WIP 中、active slice 未稳定：继续 `implement`。
- 工作完全没有稳定到可审状态：继续 `implement`。
- 用户要架构建议：转 `brainstorm`。
- 失败正在发生：转 `diagnose`。

### 路由规则

| 状态 | 下一步 |
| --- | --- |
| review 通过或仅有 evidence gap | `verify` |
| review 找出 Critical/Important findings | `implement` |
| review 发现 Spec 漂移 | `brainstorm` 或 `plan` |
| 发现项目工作面缺口 | `harness-builder` |
| 文档/知识漂移需要整理 | 先 `verify` ready claim；通过后 `cleanup` |

## 先读取这些输入

1. `references/adversarial-reviewer-prompt.md`。
2. scope / diff / 文件列表：`git status --short`、`git diff --stat`、实际改动文件，以及 untracked files。
3. accepted Spec、Executable Plan 或用户请求。
4. selected recovery surface：active slice、success criteria、evidence、risks。
5. 与本次 slice 相关的源文件、测试、配置。
6. README / `AGENTS.md` 的相关段，确认文档与代码同步。

## 检查重点

- **Spec coverage**：是否实现 goals，是否越过 non-goals。
- **Evidence routing**：是否存在 evidence gap，是否需要 `verify` fast-path；不在 review 中做 ready 判定。
- **Correctness and design risk**：边界、错误处理、数据、并发、兼容性是否合理。
- **Docs/artifacts**：命令、配置、用户可见行为、API 是否同步。
- **Entropy**：调试输出、TODO、未使用代码、未批准依赖或第二套状态来源。
- **Phase acceptance criteria**（当 Executable Plan 存在时）：对照当前阶段的 acceptance_criteria 逐条检查是否满足。没有 Executable Plan 时，此项自动跳过，review 仍用上述六把尺正常工作。

## Context Isolation

Review packet 只能包含可审事实：

- 用户请求、accepted Spec / Executable Plan、active slice、non-goals、success criteria。
- `git status --short`、`git diff --stat`、相关 diff、实际改动文件、untracked files 和相关源文件。
- 已运行命令、输出摘要、已知风险、capability gaps。
- README / docs / `AGENTS.md` 中与本 slice 相关的规则。

不要把实现者的自我解释、聊天中的辩护、未验证假设或“我觉得没问题”放进 reviewer packet。独立 reviewer 可以读取 repo 文件和命令输出，但不能把实现者 rationale 当作 evidence。Reviewer packet 不能只依赖 `git diff --stat`，因为它不会列出 untracked files；至少要包含 `git status --short` 或等价文件清单。

机制选择：

| 状态 | 要求 |
| --- | --- |
| meaningful diff 且 subagent 可用 | 尝试 read-only subagent / independent reviewer |
| Codex 环境且 subagent 不适用 | 尝试 `codex exec review` 或 `codex exec` reviewer packet |
| 独立 reviewer 失败 | 记录 ordered reviewer attempts、failure summary、fallback reason，再尝试下一层或 packet fallback |
| tiny / trivial diff | 可 packet fallback，但记录 tiny-diff reason |

## Adversarial Pass

在常规六把尺之前或同时执行：

1. **Attacker hypotheses**：如果我要让这个改动看起来通过但实际坏掉，最可能藏在哪里？
2. **Failure sketches**：为高风险 hypothesis 写最小失败路径，不写 exploit 代码。
3. **Defender evidence**：寻找代码、测试、文档或已运行 evidence 反证每个 hypothesis。
4. **Finding or handoff**：没有反证时，升级为 Critical / Important / Minor finding，或写成 `verify_handoff_cases` 交给 `verify` 收集 fresh evidence。

## 执行流程

### 第 1 步 — 重述 scope

一句话回答本次 review 的 active slice、改动文件和完成声明。

### 第 2 步 — 尝试隔离 adversarial reviewer

为 meaningful diff 生成 review packet，并按优先级尝试隔离 reviewer。记录完整尝试链，而不是只记录最终机制：

- `isolated_reviewer_attempt`: yes|no
- `reviewer_attempts[]`: ordered attempts；每项包含 mechanism、command/tool/agent、status、fallback_reason、failure_summary
- `final_reviewer_mechanism`: subagent|codex_exec_review|codex_exec_packet|packet_fallback
- `fallback_summary`: none 或为何进入下一层 / 最终 fallback

如果先后经历 `subagent`、`codex_exec_review`、`codex_exec_packet` 多次失败，必须逐项记录；不要用单个失败摘要覆盖整条链。

### 第 3 步 — 用六把尺和 adversarial pass 逐项过

对每条问题给状态、证据和严重级。当 Executable Plan 存在时，读取当前阶段的 acceptance_criteria 和 verification_commands 作为额外对照维度。

### 第 4 步 — 分级 findings

| 级别 | 含义 | 处置 |
| --- | --- | --- |
| Critical | 正确性错误、安全漏洞、数据丢失、核心行为破坏、违反 accepted Spec | 必须修复 |
| Important | 设计缺陷、关键测试缺失、文档严重失真、scope creep；等同于 broader audit 里的 Major | 应修或明确 deferred |
| Minor | 风格、可读性、非阻塞清理 | 可选 |

### 第 5 步 — 列 Open Questions / Residual Risks

把无法判断的项明确列出，不把不确定伪装成通过。

### 第 6 步 — 给出 Assessment

结论只能是 Pass / Conditional / Block。

### 第 7 步 — 按需同步 artifacts

blocking findings 和 residual risks 写入 selected recovery surface；不把一次性 review 结论写进 `AGENTS.md`。

## 输出契约

```text
REVIEW: PASS | CONDITIONAL | BLOCK

Scope:
  - Active slice: <一句话>
  - Files reviewed: <list 或 git stat>
  - Evidence base for review: <command/diff/manual read or missing>
  - Isolated reviewer attempt: <yes|no>
  - Reviewer attempts:
    - mechanism: <subagent|codex_exec_review|codex_exec_packet|packet_fallback>
      command: <command/tool/agent type or n/a>
      status: <completed|failed|skipped>
      fallback_reason: <none|tiny diff|tool unavailable|tool failed|cost disproportionate|other>
      failure_summary: <none|short failure output>
  - Final reviewer mechanism: <subagent|codex_exec_review|codex_exec_packet|packet_fallback>
  - Fallback summary: <none|why next layer/final fallback was used>

Adversarial Review:
  Hypotheses:
    - <failure path the implementation might hide>
  Defender evidence:
    - <hypothesis -> code/test/doc/evidence that refutes it, or missing>
  Verify handoff cases:
    - <case that verify should prove with fresh evidence>

Findings:
  Critical:
    - <一句话> (<file:line | command | artifact>) - <evidence>
  Important:
    - <一句话> (<file:line | command | artifact>) - <evidence>
  Minor:
    - <一句话>

Open Questions / Residual Risks:
  - ...

Assessment:
  - Spec coverage: <ok|partial|miss>
  - Evidence routing: <verify required|verify fast-path|blocked>
  - Docs sync: <ok|drift>
  - Entropy: <ok|residue>
  - Phase acceptance: <all met|partial|unmet|no plan>
  - Adversarial coverage: <ok|partial|missing>
  - Commit eligibility: <eligible|not eligible|no commit unit>

Next:
  - Skill: <implement | diagnose | verify | plan>
```

## Recommended next skill

Use review findings to route the next lane; review itself should not quietly become implementation.

| Situation | Recommended next skill |
| --- | --- |
| Pass, but fresh evidence is missing or stale | `verify` |
| Pass and evidence is already fresh | `verify` fast-path |
| Correctness, docs, or scope findings need edits | `implement` |
| A finding needs root-cause work before a fix | `diagnose` |
| The implementation no longer matches the plan or Spec | `plan` |
| Missing verification capability blocks confidence | `harness-builder` |

## 常见反模式

- **鼓励性总结，无证据。**
- **只看 diff，不对 Spec。**
- **把缺测试当成以后补。**
- **review 与 verify 混淆。** review 不声明 ready。
- **同上下文自审冒充独立评审。** meaningful diff 必须尝试隔离 reviewer；fallback 要记录完整尝试链和原因。
- **只写攻击假设，不找反证。** adversarial review 必须同时包含 hypotheses 和 defender evidence。
- **改 `AGENTS.md` 写本次结论。**
- **有 plan 不对照。** 当存在 Executable Plan 时，review 必须对照阶段 acceptance criteria，不能只检查 Spec coverage。

## 验收标准

- [ ] 至少检查了 Spec / scope / diff / docs / entropy / risk。
- [ ] meaningful diff 已尝试隔离 reviewer；若 fallback，已记录 ordered reviewer attempts、最终机制和原因。
- [ ] 已输出 adversarial hypotheses、defender evidence 和 verify handoff cases。
- [ ] 未把 review 通过当作 ready；pass 状态仍路由到 `verify`。
- [ ] 每条 Critical / Important finding 有文件路径、命令或工件级证据。
- [ ] Open Questions 与 Residual Risks 明确。
- [ ] Assessment 是 Pass / Conditional / Block 之一。
- [ ] blocking findings 按需写入 selected recovery surface。
- [ ] 当 Executable Plan 存在时，已对照阶段 acceptance criteria 检查。
- [ ] 下一步 skill 与原因显式。

## 工件更新

- selected recovery surface：Critical / Important findings、Open Questions、Residual Risks、review entry。
- `AGENTS.md`：不动；稳定规则漂移交给 `cleanup`。

## 按需读取

- `references/premature-completion-patterns.md`：常见伪完成模式与识别信号。
- `references/adversarial-reviewer-prompt.md`：隔离 reviewer / `codex exec` / fallback 共用提示词。
- 行为级验证：`../verify/SKILL.md`
- 失败诊断：`../diagnose/SKILL.md`
