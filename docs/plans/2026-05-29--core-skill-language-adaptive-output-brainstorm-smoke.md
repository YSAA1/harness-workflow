以下是只基于 `skills/brainstorm/` 入口、references 和 templates 的 **Phase A 示例输出**，未修改文件：

```text
BRAINSTORM CLARIFICATION IN PROGRESS

Spec 路径 / Spec: n/a
覆盖度 / Coverage: 0/8 已确认或豁免（confirmed or waived）；2 条推断项待假设批次确认（inferred pending assumption batch）
闸门 / Gate: BLOCKED
选定方案 / Chosen approach: n/a
验证策略 / Verification strategy: pending
需要用户确认 / Needs user review: question
批准后下一 skill / Next skill after approval: plan

澄清覆盖矩阵（Clarification Coverage）
| 维度（Dimension） | 状态（Status） | 来源 / 备注（Source / note） |
| --- | --- | --- |
| 目的（Purpose） | inferred | 用户想先 brainstorm：优化一个 CLI 工具的配置加载错误提示 |
| 范围（Scope） | unknown | 尚不清楚只改错误文案，还是包含错误分类、退出码、日志、文档 |
| 用户 / 调用者（Users / callers） | inferred | CLI 使用者和维护 CLI 的开发者 |
| 行为（Behavior） | unknown | 尚不清楚当前配置加载失败有哪些路径 |
| 约束（Constraints） | unknown | 尚不清楚是否要保持兼容现有输出、脚本解析、国际化或退出码 |
| 成功标准（Success criteria） | unknown | 尚无可证伪验收条件 |
| 验证策略（Verification strategy） | unknown | 尚未确定测试、CLI smoke 和负向用例 |
| 能力缺口（Capability gaps） | unknown | 尚不清楚是否需要真实 CLI fixture、现有错误样例或用户确认文案 |

问题 / Question: 这次优化的范围是只改“配置加载失败时的错误提示文案”，还是也允许调整错误分类、退出码、日志层级和配置校验流程？

推荐回答 / Recommended answer: 建议先限定为“错误分类 + 用户可执行的错误提示文案 + 现有退出码保持不变”，这样范围小、验证清楚，也不容易破坏已有脚本依赖。

等待 / Waiting for: user reply before Phase B
```