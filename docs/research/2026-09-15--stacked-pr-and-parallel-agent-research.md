# Stacked PR 与并行 Agent 工作流调研（2025–2026）

日期：2026-09-15
方法：2 路并行 subagents（WebSearch/WebFetch + gh api 核验 release 数据），服务于插件整合优化的扩展决策（Work Index 015 后续）。

## 一、Stacked PR / git stack 工具链

1. **GitHub 原生 stacked PR 已进 public preview（2026-07-30）**：有序 PR 层级、每层只显示本层 diff、merge 顶层合入全部未合层、partial merge 后自动 rebase+retarget、required checks 逐层生效；`gh extension install github/gh-stack` 提供 CLI；merge queue 支持渐进 rollout。
   https://github.blog/changelog/2026-07-30-stacked-pull-requests-are-now-in-public-preview/
2. **官方 "agent 大 PR 拆 stack" 标准做法（decomposition，2026-08-04）**：以 main 为 base 按依赖自底向上分层（数据→API→逻辑→UI）；每层一个 agent 实例开发、checks 全绿才 commit；人类自顶向下读上下文、自底向上逐层 review；反馈由 owning agent 修本层，rebase/sync 向上级联。官方甚至提供 agent skill（`npx skills add github/gh-stack`）。警告：web 端 "Rebase stack" 会产生未签名 commit，用本地 `gh stack rebase`。
   https://github.blog/engineering/turn-one-giant-ai-generated-pull-request-to-a-reviewable-stack/
3. **Graphite**：`gt` CLI + MCP 对个人仓库免费（Hobby）；merge queue 与无限 AI review 从 Team $40/user/月起。关键洞见：stacking 需要 planning——把 agent 的 Todos 映射为"一个 task 一个 PR"；1000+ 行 PR 仅 24% 收到 comment。
   https://graphite.com/pricing · https://graphite.com/blog/how-i-got-claude-to-write-better-code
4. **ghstack（Meta）仍活跃**：v0.14.0（2025-12-30），2026 年有 `ghstack pull` 等开发。"commits 即 PR"最薄面，与现有 milestone-commit 纪律最兼容。
   https://github.com/ezyang/ghstack
5. **Git 原语**：`git rebase --update-refs`（2.38+）是基石，可 `rebase.updateRefs=true` 默认；**Git 2.55（2026-06）新增 `git history fixup`**，一步 fixup 且自动 rebase 所有包含该 commit 的本地分支——stack 中段修正不再手动重排。不存在 `git branch --stacked`。
   https://about.gitlab.com/blog/whats-new-in-git-2-55-0/
6. **Jujutsu (jj) v0.45.1**：first-class stacks + 自动 working-copy commit 对 agent 契合度最高（`jj absorb`/`jj split`/`jj arrange`）；务实借鉴是其纪律——"agent 不负责切 commit，harness 负责事后 split/absorb"。换 VCS 不建议。
   https://github.com/jj-vcs/jj
7. **Sapling**：仍发版（2026-08-11）但 Meta 外采用 niche，不建议引入。
8. **小 diff 的实证收益**：McIntosh et al.（EMSE 2016）——review 覆盖与参与度和更低缺陷密度强相关；Mäntylä & Lassenius（2009）——review 发现的缺陷约 75% 是可维护性类。
   https://dl.acm.org/doi/10.1007/s10664-015-9381-9
9. **三条路线（2026-09 快照）**：(a) 原生 gh-stack + vanilla git（零成本，preview 有毛边）；(b) Graphite（体验最全，个人免费）；(c) ghstack/Sapling/jj（工程文化向）。对 plain-git + milestone-commit 的本插件，最小阻力是 (a)。

**核心判断**：升级点不在换工具，而在把"一个 slice = 一层可独立验证的提交/PR"写进 implement/review/ship 协议。

## 二、并行 Agent 高吞吐 PR 工作流

1. **并行主形态 = git worktree per agent + per branch**：Claude Code 原生 `claude --worktree <name>`；subagent frontmatter `isolation: worktree`；官方区分 worktrees（文件隔离）/subagents（session 内分治）/cross-session messaging 三种手段；`.worktreeinclude` 共享 gitignored 配置。
   https://code.claude.com/docs/en/worktrees
2. **GitHub 一方模式 Research→Plan→Assign→Ops**：issue 即 prompt；`/plan` 从 discussion 拆最多 5 个 sub-issue（objective/files/steps/acceptance criteria），每 issue 一个独立 PR；每次阶段交接是人审点。delegation 只给 well-scoped 任务。
   https://github.github.com/gh-aw/patterns/research-plan-assign-ops/
3. **Merge queue 成新瓶颈**：Mergify（引 Mitchell Hashimoto：churn 10x–1000x）方案——speculative merging、batching+bisection（10 变更 1 次 CI，红则二分）、scope-aware parallel lanes、two-step CI（push 廉价检查，贵套件只进 queue）。GitHub 原生 merge queue 也支持批量。
   https://mergify.com/blog/merge-queues-and-ai-coding-agents
4. **冲突实证（arXiv 2607.04697，33,596 个 agent PR）**：79.4% agent PR 时间重叠；cross-agent 冲突率 41.7%（intra-agent 19.8%）；约 42% 冲突是 add/add + modify/delete 结构性冲突；84.4% 冲突文件是源代码。结论：agent 缺并行感知机制，应维护 shared work ledger 并开工前扫描。
   https://arxiv.org/html/2607.04697v1
5. **分层 review（GitHub 官方 2026-05-07 十分钟 triage 法）**：CI 削弱是 hard stop（coverage 阈值被改、测试被删/skip）；最高 ROI 检查是 duplicate utility（agent 冗余会成为后续 agent 的 "prior art"）；端到端 trace 一条 critical path 而非通读 diff；非平凡变更必须带"在旧代码上会失败"的测试；触及 >5 个无关文件或说不清一句话目的 → 要求拆小。
   https://github.blog/ai-and-ml/generative-ai/agent-pull-requests-are-everywhere-heres-how-to-review-them/
6. **"Review the plan, spot-check the diff"**：大 PR + 无结构化 plan 与 agent 弃工（ghosting）强相关；先审 plan 与 acceptance criteria，再 spot-check diff。
   同上 · https://www.aibuilderclub.com/blog/reviewing-ai-generated-pull-requests
7. **Orchestrator-worker**：并行 subagent 是最大效率来源，代价约 15x token；多 agent 会出现 coordination failure，隔离与明确分工是前提。
   https://www.anthropic.com/engineering/multi-agent-research-system
8. **失败模式谱系**：duplicate work（→ shared ledger）、context drift（→ 目标 grounding 到 durable 文件，即 AGENTS.md/plan）、validation 瓶颈（→ 自动化验证管线先行）、CI 成本（→ `concurrency` + `cancel-in-progress` + `paths` 过滤）。
   https://www.signadot.com/blog/ai-generated-code-crisis/

## 三、对本插件的落点

1. **并行三短板**（按序）：无 worktree/branch 隔离约定（implement）、无 overlap 检查（多 active 行协调）、无 merge/serial queue 语义（ship）——全部可以 work_index 多 active 行为单一协调点渐进补齐，不动 lane 结构。
2. **stacking 协议**：implement 分层 commit（一 slice 一层、层内 checks 绿）→ review 逐层 evidence gate → ship `gh stack submit/sync` 或保持分层 milestone commits；与中文 commit 纪律正交。
3. **review 检查表升级**：吸收 GitHub 十分钟 triage 法四条（CI 削弱 hard stop、duplicate utility、fails-on-pre-change 测试、>5 无关文件拆小）。
4. **work_index 行扩字段**：branch/worktree 名 + 触碰文件范围，供 implement 前 overlap 检查（对应 cross-agent 41.7% 冲突率的缓解）。
5. **cleanup 增加 worktree sweep**：清理已合并的 worktree/分支。
6. **harness-builder 生成到目标项目时建议**：CI `concurrency`/`paths`、merge queue batching。
