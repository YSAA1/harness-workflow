# Spec - Adversarial Review Skill

> Status: user-approved
> Owner: user / agent
> Date: 2026-05-27
> Source request: 用户要求改进 `review` skill，参考 Anthropic review harness / sabotage evaluation 的对抗验证思想，并要求 meaningful diff 默认尝试隔离 reviewer。

## Background

当前 `review` 已经和 `verify` 分工明确：`review` 负责 scope、correctness、docs、entropy、risk，不能声明 ready；`verify` 负责 fresh evidence 和 ready gate。问题在于，现有 `review` 仍可能由实现者在同一上下文里完成，容易滑向“解释自己为什么正确”，对抗性不足。

Anthropic 的相关思路提供了更强的审查模型：

- generator / evaluator 分离，降低自评偏差：<https://www.anthropic.com/engineering/harness-design-long-running-apps>
- sabotage evaluation 的 attacker / defender 结构：<https://www.anthropic.com/research/sabotage-evaluations>
- eval harness 应关注任务、grader、assertions、trajectory，而不只看结论：<https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents>
- Bloom 式 scenario generation 可以转译为主动构造失败场景：<https://www.anthropic.com/research/bloom>

本 Spec 的目标是把这些思想落到 `review` skill 的可执行协议里，让 review 默认更像独立、专业、对抗式审查，而不是同上下文的自我复述。

## Goals

- `review` 对 meaningful diff 默认启用 adversarial review posture。
- meaningful diff 必须先尝试隔离 reviewer；失败、不可用或成本明显不成比例时才允许 fallback。
- 新增 `review` 专用 reviewer prompt reference，供 subagent、`codex exec review`、`codex exec` packet 和 fallback reviewer 共用。
- `review` 输出必须记录隔离尝试、对抗假设、反证、失败路径和交给 `verify` 的 adversarial cases。
- 保持 `review` 和 `verify` 分工：`review` 不修代码、不声明 ready、不替代 fresh evidence。

## Non-goals

- 不重写 `brainstorm`、`verify` 或整个 workflow skill 顺序。
- 不把 subagent 或 `codex exec` 变成所有运行环境的硬依赖。
- 不让 `review` 自动修复 findings；修复仍交给 `implement` 或 `diagnose`。
- 不让 `review` 直接运行完整 ready verification；行为证明仍交给 `verify`。
- 不新增全局 hooks、用户级配置、MCP 配置或外部 marketplace 安装。

## Users / Callers

- Codex：可优先使用 `codex exec review --ephemeral --uncommitted` 或 `codex exec --ephemeral --sandbox read-only -C <repo> <review prompt>`。
- Claude Code：可使用可用的 subagent / independent reviewer 机制；没有时使用 packet fallback。
- Cursor：可使用项目预览 skill 文档里的同一 reviewer prompt；没有独立 reviewer 时使用 packet fallback。
- 当前主 agent：负责准备 review packet、触发隔离 reviewer、整合结果、判断 fallback 是否可接受。

## Behavior Spec

### Happy Path

- 输入：一个 meaningful diff，外加 `git status --short` / untracked file coverage、用户请求、accepted Spec / Executable Plan、相关 docs、现有 evidence 和风险记录。
- 主 agent 先构造只含事实的 review packet，不包含实现者自我辩护或未验证解释。
- 主 agent 尝试隔离 reviewer：
  - 首选可用的 read-only subagent / independent reviewer。
  - Codex 环境可用时，使用 `codex exec review` 或 `codex exec` read-only reviewer。
  - reviewer 必须使用新增 reviewer prompt reference。
- reviewer 先生成 attacker hypotheses，再寻找 defender evidence。
- review 输出包含：
  - `isolated_reviewer_attempt`
  - ordered `reviewer_attempts[]`
  - `final_reviewer_mechanism`
  - `fallback_summary`（如有）
  - `adversarial_hypotheses`
  - `defender_evidence`
  - `findings`，其中 Critical / Important finding 必须带 file:line、command 或 artifact 级证据
  - `verify_handoff_cases`
- 如果无 Critical / Important blocking finding，下一步仍路由到 `verify`，由 `verify` 用 fresh evidence 证明 ready claim。

### Edge Cases

- Tiny / trivial diff：可以跳过真实独立 reviewer，但必须说明为什么不属于 meaningful diff，并仍做 packet-based adversarial scan。
- 独立 reviewer 启动失败：允许 fallback，但输出必须记录失败命令、失败摘要和 fallback 机制。
- `codex exec` 成本明显不成比例：允许 fallback，但必须说明 cost reason，例如一行文档修正不值得启动完整外部 reviewer。
- subagent 可用但不适合当前端：使用该端的独立 reviewer 等价机制；没有则 fallback。
- reviewer 找不到反证：不能把“没有发现问题”当成反证；应记录为 evidence gap、Important finding 或 verify handoff case。
- reviewer 与实现者判断冲突：保留 reviewer finding，除非主 agent 能用 repo 文件、diff、测试或 docs 给出明确反证。

### Interfaces / State

- 修改 `skills/review/SKILL.md`：
  - 增加 adversarial review posture。
  - 增加 context isolation policy。
  - 增加 meaningful diff 的独立 reviewer 尝试规则。
  - 更新输出契约和验收标准。
- 新增 `skills/review/references/adversarial-reviewer-prompt.md`：
  - 定义独立 reviewer 的角色、禁止事项、输入 packet、审查步骤和输出格式。
- 按需更新 `README.md`、`docs/harness-method-contract.md` 或相关安装文档中关于 `review` 的描述，保持语义一致。
- 如 `SKILL.md` 结构变化，重新生成 `docs/skill-flow-review/*.html`。
- 不写任务状态到 `AGENTS.md`。

## Constraints

- `review` 仍不能声明 ready；ready gate 仍唯一属于 `verify`。
- review 是只读活动：不修复、不格式化、不生成 implementation diff。
- 独立 reviewer 的输入必须尽量事实化，避免继承实现者上下文污染。
- 运行时允许 fallback；本次改动验收不允许只用 fallback 冒充真实独立 reviewer。
- `codex exec` 已在本机最小启动检查通过，但 token / 时间成本较高，应只要求 meaningful diff 尝试。
- 跨 Codex、Claude Code、Cursor 三端要保持概念一致，具体执行器可不同。

## Chosen Approach

选择在 `review` 中加入默认 adversarial review mode，并新增独立 reviewer prompt reference。meaningful diff 的默认路径是“先尝试隔离 reviewer，失败才 fallback”。这样可以最大化吸收 Anthropic generator/evaluator 分离和 attacker/defender 的思想，同时不把所有运行环境绑死到某个具体 subagent 或 CLI。

该方案把强约束放在 review 协议和输出证据上，把具体执行器作为可替换 mechanism：subagent、`codex exec review`、`codex exec` packet 或 packet fallback 都遵守同一 reviewer prompt。

## Rejected Options

- 只在当前 agent 内增加几条对抗问题：拒绝。它不能解决实现者上下文污染，容易变成自我确认。
- 强制所有 review 都必须有 subagent，否则失败：拒绝。Claude Code、Cursor 或受限环境不一定有同等 subagent 能力，会让 review 变得不可用。
- 把 adversarial checks 放进 `verify`：拒绝。`verify` 应证明 ready claim，不应负责重新做结构性风险审查。
- 新增第九条 public workflow lane，例如 `adversarial-review`：拒绝。当前问题属于 `review` 的审查姿态和执行机制，不需要扩大 workflow lane。

## Verification Strategy

### Baseline Evidence

- 记录修改前 `skills/review/SKILL.md` 对 `review` / `verify` 边界的描述。
- 记录当前 `codex exec` 能力：
  - `codex exec --help`
  - `codex exec review --help`
- 记录当前可用 subagent reviewer 能力。

### Automated Checks

- `node scripts/check-plugin.mjs`
- `node scripts/check-claude-code-install.mjs`
- `node scripts/check-cursor-install.mjs`
- `node scripts/install-cursor.mjs --target . --dry-run`
- 如果改动 `SKILL.md` 结构或 reference：
  - `node scripts/generate-skill-flow-html.mjs`
  - `node scripts/check-plugin.mjs`

### Real Mechanism Acceptance Checks

- 不使用模拟检查或 packet-only 模拟作为最终验收。
- 使用真实 meaningful diff 触发 `codex exec review --ephemeral --uncommitted`，或使用 `codex exec --ephemeral --sandbox read-only -C <repo>` 加 reviewer prompt packet。
- 启动真实 read-only reviewer subagent，对同一 diff 和同一 reviewer prompt reference 做独立审查。
- 检查两个真实 reviewer 结果是否都体现：
  - 隔离 reviewer attempt；
  - attacker hypotheses；
  - defender evidence；
  - findings 或明确 no-finding 依据；
  - verify handoff cases。

### Negative / Boundary Checks

- reviewer prompt 必须禁止：
  - 引用实现者自我解释作为证据；
  - 直接修代码；
  - 声称 ready；
  - 把未验证项写成 pass。
- 对 tiny diff 的 fallback 路径必须要求记录跳过独立 reviewer 的原因。
- 对独立 reviewer 失败路径，必须输出 fallback reason，而不是静默回到自审。

### Documentation / State Checks

- `README.md` 中 workflow table 若仍准确，可不改；若描述不足以表达新的 review 隔离契约，则同步更新。
- `docs/harness-method-contract.md` 若 C6 / C5 语义需要明确 adversarial review，则同步更新。
- `docs/skill-flow-review/*.html` 只能由生成脚本更新。
- `AGENTS.md` 不写入本次临时状态。

### Fresh Evidence Required Before Completion

- 所有 automated checks 必须在最后一次相关文件修改后重跑。
- 真实 `codex exec` reviewer 必须在最后一次 `review` skill 文件修改后运行。
- 真实 subagent reviewer 必须在最后一次 `review` skill 文件修改后运行。
- 最终 ready claim 必须由 `verify` 记录 fresh evidence；`review` 通过本身不能作为 ready。

## Capability Gaps

- Codex 当前本机支持 `codex exec` 和 `codex exec review`，但成本较高；运行时应限制在 meaningful diff。
- 当前 Codex 会话有 read-only reviewer subagent；本次验收可作为硬标准。
- Claude Code / Cursor 是否有同等独立 reviewer 执行器取决于各端能力；skill 应要求“尝试等价独立 reviewer”，不可用时 packet fallback 并记录原因。
- fallback 只能降低运行时阻塞，不能替代本次实现验收里的真实机制证明。

## Success Criteria

- `skills/review/SKILL.md` 明确：meaningful diff 必须尝试隔离 reviewer，失败才 fallback。
- `review` packet 明确包含 `git status --short` 或等价 untracked file coverage，不能只依赖 `git diff --stat`。
- `skills/review/SKILL.md` 明确：`review` 默认使用 adversarial posture，并保留 `review` / `verify` 边界。
- 新增 reviewer prompt reference，能被 subagent、`codex exec review`、`codex exec` packet 和 fallback reviewer 共同复用。
- `review` 输出契约包含 isolated reviewer attempt、ordered reviewer attempts、final reviewer mechanism、fallback summary、adversarial hypotheses、defender evidence、verify handoff cases。
- Critical / Important findings 的输出契约支持 file:line、command 或 artifact 级证据。
- 项目结构检查和 skill-flow 生成检查通过。
- 真实 `codex exec` reviewer 和真实 subagent reviewer 都在最后一次相关修改后运行，并产生可审查输出。

## Residual Risks

- `codex exec review` 的内置 review 格式可能不完全匹配本仓库新增输出契约；必要时使用 `codex exec` 普通 read-only prompt 传入 reviewer reference。
- subagent 工具在不同客户端能力不同，跨端只能要求等价隔离机制和 fallback 记录。
- 对抗式 review 可能增加成本和输出长度；需要通过 meaningful diff 判断和 tiny diff fallback 控制噪音。
- reviewer prompt 若过强，可能产生过多 Important findings；实现时需要区分 blocker、evidence gap 和 verify handoff。

## Plan Handoff

- Active slice: 更新 `review` skill 协议、新增 adversarial reviewer prompt reference，并同步必要文档 / 生成物。
- Suggested next skill: plan
- Planning notes: 先改 `skills/review/SKILL.md` 和 `skills/review/references/adversarial-reviewer-prompt.md`；再判断 README / method contract 是否需要同步；最后运行结构检查、生成物检查、真实 `codex exec` reviewer 和真实 subagent reviewer。
- Suggested milestones:
  - M1: reviewer protocol and prompt reference
  - M2: documentation / generated skill-flow synchronization
  - M3: real isolated reviewer verification
- Per-milestone acceptance hints:
  - M1: `review` 输出契约和 prompt reference 能表达 isolation、attacker hypotheses、defender evidence、verify handoff。
  - M2: plugin checks and generated HTML are consistent with changed skill docs.
  - M3: `codex exec` reviewer and subagent reviewer both run against the final meaningful diff after the last relevant edit.
