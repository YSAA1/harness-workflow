HARNESS EVIDENCE

本次为 read-only 模拟，未修改文件。

已读取证据：
- `skills/harness-builder/SKILL.md`
- 核心 templates：`AGENTS.md.j2`、`AGENTS.template.md`、`state.md.j2`、`progress.md.j2`、`decisions.md.j2`、`verification.md.j2`、`workflow.md.j2`、`manifest.yaml.j2`、`check.sh.j2`、`project_context.md.j2`、`risk_register.md.j2`、`session_handoff.md.j2`、`commit_convention.md.j2`、`features.json.j2`

证据结论：
- 中文用户场景应中文为主，但协议 token 保持英文原样。
- Harness Builder 必须先 evidence，再 Charter，再 Coverage Matrix，再 USER CHECKPOINT。
- `AGENTS.md` 应保持薄入口；动态任务状态进入 selected recovery surface。
- 默认验证入口模板是 `bash scripts/agent/check.sh`。
- 小型仓库适合 solo mode；subagent、hooks、MCP、Research Route 默认不安装，只在具体 gap 需要时推荐。

HARNESS CHARTER

目标：
为当前小型仓库建立最小可用的 read-only harness audit 输出，明确入口、状态、验证、风险和后续安装前检查点。

非目标：
- 不写文件。
- 不安装 hooks、MCP、subagents、skills 或 init scaffold pack。
- 不推断未读取文件的当前状态。
- 不进入 USER CHECKPOINT 之后的安装阶段。

用户可见验收标准：
- 输出中文为主。
- `HARNESS EVIDENCE`、`HARNESS CHARTER`、`HARNESS COVERAGE MATRIX`、`USER CHECKPOINT` token 行保持 exact。
- Coverage Matrix 使用 `Required / Recommended / Deferred / Rejected`。
- 不输出模板占位符文本。

验证路径：
- 本次只做只读内容核对。
- 若后续获批安装，最小验证建议为 `bash scripts/agent/check.sh` 或仓库现有验证命令。

证据位置：
- 当前回复中的 Harness Evidence。
- 后续如安装，可落到 `.harness/state.md`、`.harness/decisions.md`、`.harness/progress.md`。

选定 recovery surface：
- read-only 阶段：不创建。
- 后续安装建议：lightweight `.harness/state.md` + `.harness/decisions.md` + `.harness/progress.md`。

HARNESS COVERAGE MATRIX

| 覆盖区域 | 分类 | 当前判断 | 处理建议 |
| --- | --- | --- | --- |
| Agent 入口和项目地图 | Required | 模板支持薄 `AGENTS.md`、项目地图、快速验证入口 | 后续安装时保留薄入口 |
| 静态文档和稳定规则 | Required | 模板覆盖 project context、workflow、verification | 后续按仓库事实填充，不写临时状态 |
| Selected recovery surface | Required | `state/progress/decisions` 模板已覆盖语义字段 | 推荐 lightweight recovery surface |
| 验证入口和 deeper checks | Required | `check.sh.j2` 和 `verification.md.j2` 定义 fast check | 先用 fast check，deeper checks 需按项目栈确认 |
| 架构边界和机械 enforcement | Deferred | 本次未读取源码结构，不能判断边界风险 | 暂缓，不安装 LAYERS 或 lint |
| Anti-entropy 和 stale-state 检测 | Recommended | 模板强调 manifest/state/decisions 一致性 | 小仓库可先用人工检查，后续再考虑脚本 |
| Skill fit | Deferred | 当前没有证据表明需要项目本地新 skill | 不安装 |
| Hook fit | Rejected | read-only audit 不需要 hooks | 不安装 |
| MCP fit | Rejected | 无 MCP gap 证据 | 不安装 |
| Subagent fit | Deferred | 小型仓库 audit 可 solo mode | 不启用 |
| External research fit | Rejected | 无外部研究需求 | 不启用 Research Route |
| Dynamic context: git/diagnostics/CI/logs | Deferred | 用户限制只读 skill 和 templates，未查 git/CI | 后续获批再查 |
| Commit protocol and milestone discipline | Deferred | read-only audit 不产生 commit | 后续关键里程碑再启用 |

USER CHECKPOINT

安装项目前，请先确认这个 Harness Plan 示例：
- 章程 / Charter: 为当前小型仓库建立最小 project-local harness，保持 `AGENTS.md` 薄入口，把动态状态放进 selected recovery surface。
- 覆盖矩阵 / Coverage: Required 只覆盖入口、静态规则、recovery surface、验证入口；hooks、MCP、Research Route 暂不安装。
- 新增安装 / Install: 示例建议 `.harness/state.md`、`.harness/decisions.md`、`.harness/progress.md`、`scripts/agent/check.sh`。
- 修补现有文件 / Patch existing: 示例只在稳定事实缺失时小修 `AGENTS.md`。
- 归档或降级 / Archive/deprecate: 无。
- 暂缓 / Defer: 架构边界、subagents、anti-entropy 自动化、commit protocol。
- 拒绝 / Reject: hooks、MCP、external research，除非后续出现具体 gap。
- 验证 / Verification: 先运行 `bash scripts/agent/check.sh`；若命令不存在，先记录 blocker，不声称 ready。
请回复：approve / change / stop。