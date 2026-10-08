# 不为避让同名命令而改名

**拒绝内容**：因为别的技能套件或宿主内置命令（例如 mattpocock/skills 的 `implement`/`tdd`/`writing-for-agents`、Grok 内置 `implement`/`review`、Claude Code 内置 `/review`）与本套技能同名，就给本套技能改名或加别名。

**理由**：宿主随时新增内置命令、各家各起名字；每撞一次就改名，是在追一个移动靶，还会打断所有用户的肌肉记忆和技能之间的互相引用。两个同名东西怎么解析是宿主的行为，技能文本本身无论哪种解析都是对的。

**替代做法**：

- Claude Code 插件路径：用命名空间显式调用，如 `/harness-workflow:implement`。
- skills.sh 安装：拿到的是可编辑副本，自行改本地目录名与 `name:` 字段。
- 其他宿主：用全名消歧（如 "use the harness-workflow implement skill"）；宿主完全无法到达改名或命名空间技能时，向宿主反馈。

**来源**：本仓 `.harness/lessons.md` 同名顶位实测（2026-09-22）；上游 mattpocock/skills `.out-of-scope/harness-name-collisions.md` 同结论。
