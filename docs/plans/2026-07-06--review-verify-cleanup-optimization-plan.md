# Executable Plan：Review / Verify / Cleanup 三 Skill 优化

## Objective

对 `review`、`verify`、`cleanup` 三个 workflow skill 做一轮针对性优化：修复协议断裂、职责越界和结构性重复，补齐 verify 的隔离验证缺口，修整 review 的三端隔离路径，并引入对抗式攻击分类法、evidence ladder 场景映射、deferred cleanup registry 等增强。

## Active slice

阶段 2（当前）：Review 隔离机制三端通用化。

## Non-goals

- 不改动 `brainstorm`、`plan`、`implement`、`diagnose`、`harness-builder` 或辅助 skill。
- 不改动 `.harness/` recovery surface 的字段语义。
- 不改动 `docs/harness-method-contract.md` 的 C6/C8/C9 核心契约。
- 不改动三端 plugin manifest 或 marketplace catalog。
- 不引入新的 workflow lane 或 helper skill。
- 不修改用户级配置、全局 skills、MCP 或 hooks。

## Success criteria

- [ ] `review` 产出的 `verify_handoff_cases` 在 `verify` 的流程中有显式消费步骤。
- [ ] `verify` 的 Capability Recommendation 逻辑简化为"记录缺口 → route to harness-builder"。
- [ ] `review` 的隔离机制已三端通用化：Codex（codex_exec_review）、Claude Code（Agent + read-only）、Cursor（subagent），fallback 条件从"tiny diff"改为风险分级。
- [ ] `verify` 增加了 Cold Verification Pass：对 meaningful change，尝试隔离验证子步骤，三端各有明确机制。
- [ ] `review` 的 adversarial pass 增加了攻击假设分类法（attack taxonomy），作为按需读取 reference。
- [ ] `verify` 的 evidence ladder 增加了常见改动类型的阶梯组合推荐。
- [ ] `cleanup` 增加了 deferred cleanup registry 机制。
- [ ] 三个 skill 的跨 skill 共享反模式已提取为独立参考文件，各 SKILL.md 只保留自身特有反模式。
- [ ] 三端结构验证通过：`node scripts/check-plugin.mjs`、`node scripts/check-claude-code-install.mjs`、`node scripts/check-cursor-install.mjs`。
- [ ] `node scripts/generate-skill-flow-html.mjs` 重新生成并通过。
- [ ] Skill flow HTML 重新生成后无 broken references。

## Verification path

- `node scripts/check-plugin.mjs` — 检查 skill frontmatter、references 引用和结构一致性。
- `node scripts/check-claude-code-install.mjs` — 检查 Claude Code plugin 安装面。
- `node scripts/check-cursor-install.mjs` — 检查 Cursor rules/skills 一致性。
- `node scripts/generate-skill-flow-html.mjs` && `node scripts/check-plugin.mjs` — 检查 HTML 生成无报错。
- 手动 review：确认 `review/SKILL.md` 的 handoff cases 字段名与 `verify/SKILL.md` 的消费步骤引用一致。

**Verification path status**: `runnable`

## Required capabilities

无额外能力依赖。现有脚本链覆盖所有验证需求。

## Fallback evidence

如脚本报错，通过 `git diff --check` 和手动对照 three skill 文件确认无语法/引用断裂。

## Final integration claim

三个 skill 的 SKILL.md 和 references/ 文件修改完成后，运行全量验证脚本 + 重新生成 HTML，确认所有引用一致、无 broken references、无职责越界。

---

## 工作项

- [x] 阶段 0：基线 — 深度分析已完成，优化点已识别并分 P0-P3 优先级
  - acceptance_criteria: 分析报告覆盖 review/verify/cleanup 三个 skill，含 web 调研对照
  - verification_commands: 无（分析阶段，见对话上下文）
  - success_definition: 优化方向清晰，可写出 Executable Plan

- [x] 阶段 1：修复 P0 — review→verify handoff 协议 + verify 职责简化（已完成）
  - acceptance_criteria:
    1. verify/SKILL.md 的"先读取这些输入"或执行流程中显式包含"Consume review handoff cases"步骤
    2. verify 的 capability-recommendations.md 简化为"记录缺口 → route to harness-builder"，具体推荐模板移出或标注为 harness-builder 职责
    3. review/SKILL.md 的 handoff cases 格式保持不变，verify 能直接消费
  - verification_commands: `grep -n "handoff" skills/verify/SKILL.md && grep -n "Capability\|capability" skills/verify/SKILL.md`
  - success_definition: verify 的输入协议中包含 review 产出消费步骤，capability recommendation 在 verify 中不越界

- [x] 阶段 2：Review 隔离机制三端通用化（已完成）
- [x] 阶段 3：Verify Cold Verification Pass（已完成）
- [ ] 阶段 4：对抗式攻击分类法（review 增强）（当前）
  - acceptance_criteria:
    1. review/SKILL.md 的 Context Isolation 节重写为三端通用机制表，不再以 Codex 为中心：

       | 环境 | 推荐隔离机制 | fallback |
       | --- | --- | --- |
       | Codex | `codex exec review` 或 `codex exec` + reviewer packet | packet fallback |
       | Claude Code | `Agent` 工具 + `agentType: "Explore"`（read-only） | packet fallback |
       | Cursor | subagent + read-only context | packet fallback |

    2. 保留现有的 4 层尝试链记录要求，但改为三端通用的"mechanism + fallback_reason"格式
    3. fallback 条件从"tiny / trivial diff"改为风险分级：
       - 纯文档/注释/格式化 → 可 fallback
       - 逻辑/配置/依赖/API 改动 → 必须尝试隔离，不论 diff 大小
    4. 在 adversarial reviewer prompt（`references/adversarial-reviewer-prompt.md`）增加一条：若三端环境支持不同模型 family 的 reviewer（如 Codex 用 GPT、Claude Code 用 Claude），优先尝试跨模型审查
    5. 审查失败时，三端各自记录 ordered attempts + failure summary
  - verification_commands: `grep -n "Codex\|Claude Code\|Cursor\|风险分级\|模型" skills/review/SKILL.md skills/review/references/adversarial-reviewer-prompt.md`
  - success_definition: 三端用户都能在 SKILL.md 中找到自己环境的隔离路径，fallback 不再按 diff 大小而是按风险决定

- [ ] 阶段 3：Verify Cold Verification Pass（隔离验证子步骤）
  - acceptance_criteria:
    1. verify/SKILL.md 的执行流程增加"Cold Verification Pass"步骤（在 Run Checks 之后、Compare Against Success Criteria 之前）——对 meaningful change 尝试隔离验证
    2. 三端机制表：

       | 环境 | Cold Verification 机制 | 输入 | 输出 |
       | --- | --- | --- | --- |
       | Codex | `codex exec` + verification packet | diff + success criteria + 命令输出（不含实现者解读） | 独立 verdict + evidence gap 列表 |
       | Claude Code | `Agent` 工具 + `isolation: "worktree"` | diff + success criteria + 命令输出 | 同上 |
       | Cursor | subagent + isolated context | 同上 | 同上 |

    3. Cold verifier 只接收 artifact + criteria + 命令原始输出，**不接收**实现者的解读、review 结论或聊天上下文
    4. Cold verifier 的 prompt 写入新的 reference 文件 `skills/verify/references/cold-verifier-prompt.md`
    5. 隔离失败时记录机制和原因，回退到主流程自判——不做静默跳过
    6. 不强制所有场景：纯文档/配置改动可跳过；逻辑/行为改动必须尝试
  - verification_commands: `ls skills/verify/references/cold-verifier-prompt.md && grep -n "Cold\|cold\|隔离" skills/verify/SKILL.md`
  - success_definition: verify 不再是同一 agent 同一 session 的自我祝贺；meaningful change 有独立视角 challenge evidence

- [ ] 阶段 4：对抗式攻击分类法（review 增强）
  - acceptance_criteria:
    1. 新建 `skills/review/references/attack-taxonomy.md`，按边界/时序/身份/契约/数据五个类别组织攻击假设
    2. review/SKILL.md 的 Adversarial Pass 步骤引用此 taxonomy 作为按需读取
    3. 不要求每次 review 覆盖全部类别；给出按改动类型的选择指南
  - verification_commands: `ls skills/review/references/attack-taxonomy.md && grep -n "attack-taxonomy" skills/review/SKILL.md`
  - success_definition: reviewer 有结构化攻击面清单，不再凭即兴发挥

- [ ] 阶段 5：Evidence Ladder 场景映射（verify 增强）
  - acceptance_criteria:
    1. 在 `skills/verify/references/evidence-ladder.md` 增加场景映射表：文档改动 / 纯逻辑修复 / 配置构建 / UI 改动 / API 跨边界
    2. 每个场景给出最低阶梯和推荐阶梯
    3. verify/SKILL.md 的"选择检查"步骤引用此映射表
  - verification_commands: `grep -n "场景\|scenario\|改动类型" skills/verify/references/evidence-ladder.md`
  - success_definition: agent 能按改动类型快速选择正确的验证强度

- [ ] 阶段 6：Deferred Cleanup Registry（cleanup 增强）
  - acceptance_criteria:
    1. cleanup/SKILL.md 增加 deferred cleanup 步骤：本次发现但跳过的项写入 recovery surface 的 `deferred_cleanup` 字段
    2. 输出契约中增加 `Deferred cleanup:` 字段
    3. `references/entropy-checklist.md` 增加 deferred 项的记录格式
  - verification_commands: `grep -n "deferred" skills/cleanup/SKILL.md skills/cleanup/references/entropy-checklist.md`
  - success_definition: 低风险 residue 不丢失，下次 cleanup 可重新评估

- [ ] 阶段 7：跨 Skill 反模式去重提取
  - acceptance_criteria:
    1. 新建 `skills/review/references/cross-cutting-anti-patterns.md`（放在 review 的 references 下，因 review 是三道 gate 的第一个且反模式分析最全面），收录三个 skill 中重复出现的共享反模式
    2. review/verify/cleanup 的 SKILL.md 反模式节去掉共享项，改为引用此文件 + 列出自身特有项
    3. 引用路径：review 用 `references/cross-cutting-anti-patterns.md`，verify 用 `../review/references/cross-cutting-anti-patterns.md`，cleanup 用 `../review/references/cross-cutting-anti-patterns.md`
    4. 每个特有反模式在三个文件中表述一致（统一用词）
  - verification_commands: `ls skills/review/references/cross-cutting-anti-patterns.md && grep -n "cross-cutting-anti-patterns" skills/review/SKILL.md skills/verify/SKILL.md skills/cleanup/SKILL.md`
  - success_definition: 共享反模式只在一处维护且随插件分发，减少表述漂移

- [ ] 阶段 8：生成物刷新 + 全量验证 + milestone commit
  - acceptance_criteria:
    1. `node scripts/generate-skill-flow-html.mjs` 通过
    2. `node scripts/check-plugin.mjs` 通过
    3. `node scripts/check-claude-code-install.mjs` 通过
    4. `node scripts/check-cursor-install.mjs` 通过
    5. `node scripts/install-cursor.mjs --target . --dry-run` 通过
    6. milestone commits 包含阶段 1-7 所有改动
  - verification_commands: `bash scripts/agent/check.sh`
  - success_definition: 三端验证全绿，HTML 生成无报错，commit 可追溯

## Commit units

| Unit | 绑定阶段 | Scope | 提交前置条件 |
| --- | --- | --- | --- |
| 1 | 阶段 1-2 | P0 修复 + review 隔离三端化 | review 无 Critical + verify PASS |
| 2 | 阶段 3-4 | Cold Verification Pass + attack taxonomy | review 无 Critical + verify PASS |
| 3 | 阶段 5-6 | evidence ladder + deferred cleanup registry | review 无 Critical + verify PASS |
| 4 | 阶段 7-8 | 反模式提取 + 生成物刷新 | review 无 Critical + verify PASS |

## Known risks / blockers

- verify 的 Capability Recommendation 简化后，需确认 harness-builder 侧是否已有完整接收面。若 harness-builder 缺少对应 consumption 步骤，需在阶段 1 同步补齐。
- 反模式去重提取可能暴露三个 skill 中某些反模式的表述不一致，提取时以最精确版本为准。
- 共享反模式文件放在 `skills/review/references/`（而非 `docs/`），确保通过插件 `skills/` 目录分发给三端用户。
- Cold Verification Pass 依赖三端各自的子进程/子 agent 能力。Codex 的 `codex exec`、Claude Code 的 `Agent` 工具、Cursor 的 subagent 在隔离程度上存在差异——需在 reference 文件中明确各端的隔离等级（强/中/弱），不假装三端等效。
- review 隔离机制三端化后，Codex 用户仍可沿用原有 4 层链；改动以"增加 Claude Code / Cursor 路径 + 统一 fallback 规则"为主，不删除现有 Codex 路径。

## Next skill

`implement`
