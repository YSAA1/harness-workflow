# Cross-Cutting Anti-Patterns

review、verify、cleanup 三个 gate 共享的反模式。每个 skill 的 SKILL.md 只保留自身特有反模式，共享项统一在此维护。

## 1. 将 AGENTS.md 当会话笔记

**表现**：把当前任务结论、一次性 review 结果、session summary 或临时状态写入 `AGENTS.md`。

**为什么是问题**：`AGENTS.md` 是 T1 薄入口（项目地图、铁律、验证命令），不是 changelog 或任务计划。写临时内容会导致：
- 下个 session 读到过期信息
- 膨胀到 agent 无法高效读取
- 与 selected recovery surface 中的真实状态矛盾

**正确做法**：当前任务状态写入 selected recovery surface（`.harness/state.md`、`.harness/progress.md`）；稳定规则变更才进 `AGENTS.md`，且由 `harness-builder` 或 `cleanup` 统一处理。

**涉及 skill**：review（"改 AGENTS.md 写本次结论"）、cleanup（"Updating AGENTS.md with session notes"）。

## 2. 角色混淆 / 职责越界

**表现**：在一个 gate 中执行另一个 gate 的职责。常见形式：
- review 声明 ready（应该是 verify 的职责）
- verify 中修 bug（应该是 diagnose/implement 的职责）
- cleanup 中隐藏未完成工作或创建新系统（应该是 implement/harness-builder 的职责）

**为什么是问题**：每个 gate 有独立的设计目的和验证标准。角色混淆导致：
- 关键检查被跳过（review 声明 ready → verify 被绕过）
- 问题被掩盖（cleanup 中做行为改动 → 未经 review/verify）
- 不可追溯（谁做了 ready 判定？证据在哪？）

**正确做法**：
- review → 只做结构性评审，不声明 ready
- verify → 只收集证据和判定 ready，不修代码
- cleanup → 只做知识收尾，不做行为改动

**涉及 skill**：review（"review 与 verify 混淆"）、verify（"Fixing during verification"）、cleanup（"Using cleanup to hide unfinished work"、"在 cleanup 中创建新系统"）。

## 3. 静默跳过 / 把缺口当 minor

**表现**：发现检查应该做但没做时，不记录、不说明、默认 defer。常见形式：
- 缺测试 → "以后补"（review）
- 跳过高价值 E2E → 不记录跳过原因（verify）
- 文档漂移 → 当 minor 略过（cleanup）

**为什么是问题**：未记录的缺口会累积成技术债，且下次 session 无法知道"这是故意跳过的还是遗漏的"。静默跳过 = 永久遗忘。

**正确做法**：每次跳过必须记录原因、风险和 fallback。verify 的 skipped_high_value_checks、cleanup 的 deferred_cleanup、review 的 Open Questions 都是为此设计的。

**涉及 skill**：review（"把缺测试当成以后补"）、verify（"Skipping E2E silently"）、cleanup（"Treating doc drift as minor by default"）。

## 4. 不与 source of truth 对照

**表现**：评审/验证/清理时只凭记忆或 diff，不和 accepted Spec、Executable Plan 或 success criteria 对照。常见形式：
- review 只看 diff，不对 Spec（review）
- verify 跑了一堆命令但不逐条对应 success criteria（verify）
- cleanup 改了文档但没跟代码实际行为对照（cleanup）

**为什么是问题**：没有对照源就无法发现 scope creep、漏做需求、或文档与代码不一致。产出看起来完整但实际偏离目标。

**正确做法**：
- review → 对照 Spec/plan 的 goals/non-goals/acceptance criteria
- verify → 每条 success criterion 必须映射到具体 evidence
- cleanup → 比较代码实际行为、README 命令、docs 描述是否一致

**涉及 skill**：review（"只看 diff，不对 Spec"、"有 plan 不对照"）、verify（"Running broad checks without mapping to success criteria"）、cleanup（间接：知识漂移检查中的对照步骤）。
