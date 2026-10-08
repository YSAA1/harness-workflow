# 拷问不绑定宿主提问工具

**拒绝内容**：让 `brainstorm` 的拷问轮改走某个宿主内置的提问 UI（Claude Code 的 `AskUserQuestion`、其他宿主的结构化问卷/批量表单模式）。

**理由**：

- 本套技能是宿主中立的文本，跑在 Claude Code、Codex、Grok、Kimi 等多端；各家提问工具不同或没有。在技能里点名某一家，要么每个访谈技能都长出宿主分支，要么只在一处好用。
- 提问 UI 会改变拷问本身：结构化选择器把模型推向预制答案的选择题，而拷问要的是用户用自己的话回答、能否决推荐、能暴露隐式决定。

**替代做法**：偏好宿主提问工具的用户，在自己的 `CLAUDE.md` / `AGENTS.md` 写一行（如「brainstorm 拷问时用 AskUserQuestion」）即可——这是个人偏好，不需要共享技能知道。

**来源**：上游 mattpocock/skills `.out-of-scope/native-question-tool.md`（多次同类请求被拒）；本仓 brainstorm 轮出格式为纯文本唯一源。
