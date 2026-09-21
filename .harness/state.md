# Current task

Objective: 新增 autoresearch 研究循环总控 skill（薄总控：轮编排+授权档位+证据门；授权档位可调，默认首轮 Spec 批准、后续全权），并完成全枚举面同步；完成后经 cli-delegate 派 Grok 做第三方用户视角魔鬼对抗审查并按发现修复。
Worktree: 本仓 master。
Status: active
Primary artifact: skills/autoresearch/SKILL.md
Evidence: 设计已与用户逐点确认（薄总控同 ship 模式、证据门重开条件、对抗独立性机制化+降级标注、lessons 过滤含「无新增」合法、授权档位三档）；skills/autoresearch/ 三件已写（SKILL.md + references/adversarial-lenses.md + templates/research-log.md）；枚举面同步进行中。
Next: 全枚举面同步（check-plugin 九车道、README×2、install、方法合同、CONTEXT、AGENTS 铁律、plugin.json/marketplace 0.8.0）→ 三命令验证 → 中文 commit → 派 Grok 对抗审查（--read-only --schema）→ 按发现修复复验 → 退休本行（翻行+lessons+state 同步）。
Limits: Grok 审查为一次性外部意见，按证据采纳不盲从；本地安装面更新与 push 远端待用户指示。
