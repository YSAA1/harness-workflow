# 安装指南

## 一条命令：选择 agent、选择技能

用 [skills.sh](https://skills.sh) 安装，交互式选择目标 agent 与要装的技能：

```bash
npx skills@latest add YSAA1/harness-workflow
```

- 支持 20+ agent：Claude Code、Cursor、Codex、GitHub Copilot、Gemini CLI、OpenCode、Goose、Windsurf、Cline、AMP、Roo、Trae、VS Code、Zed 等。
- 可以整组装，也可以只挑需要的技能（例如只装 `review` + `cleanup`）。
- 项目级或用户级安装均可选择。
- 更新：`npx skills update`；不做任何背后的自动变更。
- 卸载：删除对应 agent skills 目录下的技能文件夹。

## 混装警示：与其他技能套件的同名冲突

`implement`、`tdd`、`writing-for-agents` 在其他流行技能套件中也存在（例如 mattpocock/skills 的 engineering 系列有同名 `implement`、`tdd`，productivity 系列有同名 `writing-for-agents`）。装进同一 agent 的同一技能目录时，同名技能会互相顶位（后装覆盖先装，或按加载顺序取其一），触发词最终指向哪一套语义不可预测；个别套件还带 `disable-model-invocation`，只能手敲命令，敲到的却可能是另一套。

自查：安装后列出该技能目录，或问 agent「`/implement` 的 SKILL.md 用什么语言、什么协议」，确认在位的是你想要的那套。

建议：同一 agent 槽位同名技能只装一家；确要两套并用，用不同 agent、或项目级/用户级分层安装隔开。

## 选择语言版本（skills/ 中文 · skills-en/ 英文）

技能有两棵语言树：`skills/`（中文，默认）与 `skills-en/`（英文，完整镜像——harness-builder 的 tests/ 仅在中文树；`node scripts/check-plugin.mjs` 保证两树同名同数，整树缺席即红）。

- **中文（默认）**：

```bash
npx skills@latest add YSAA1/harness-workflow
```

- **英文**：同一仓库的英文树，用 tree URL 指定（skills.sh 的 `owner/repo` 简写不支持子目录；本仓库默认分支是 `master`）：

```bash
npx skills@latest add https://github.com/YSAA1/harness-workflow/tree/master/skills-en
```

两条命令都已实测：默认命令列出 17 个中文技能，tree URL 列出 17 个英文技能，互不串树。

- 未列入 skills.sh 的 CLI（Grok Build / ZCode / Kimi Code）手动拷贝，按语言选源（`skills/` 或 `skills-en/`）：

```bash
git clone https://github.com/YSAA1/harness-workflow.git
cd harness-workflow
mkdir -p ~/.agents/skills
for s in harness-builder brainstorm plan implement diagnose review ship cleanup autoresearch find-skills capability-recommender writing-for-agents tdd remove-deadcode-py sweep research handoff; do
  cp -r "skills-en/$s" ~/.agents/skills/
done
```

- 同一 agent 槽位**只装一种语言**：两棵树同名，混装会互相顶位（见上文混装警示）。
- 两树语义等价；冲突时以中文树为准（en 树是忠实翻译，不是第二套协议）。

## Claude Code 插件路径（可选）

Claude Code 也可以走官方 marketplace 托管插件（只读、自动更新）：

```text
/plugin marketplace add YSAA1/harness-workflow
/plugin install harness-workflow@harness-workflow
```

## 未列入 skills.sh 的 CLI（Grok Build / ZCode / Kimi Code）

三者都读取开放 `SKILL.md` 格式，一份共享拷贝服务全部 CLI：

```bash
git clone https://github.com/YSAA1/harness-workflow.git
cd harness-workflow
mkdir -p ~/.agents/skills
for s in harness-builder brainstorm plan implement diagnose review ship cleanup autoresearch find-skills capability-recommender writing-for-agents tdd remove-deadcode-py sweep research handoff; do
  cp -r "skills/$s" ~/.agents/skills/
done
```

| CLI | 用户级目录 | 项目级目录 |
| --- | --- | --- |
| Grok Build | `~/.grok/skills/` 或共享 `~/.agents/skills/` | `.grok/skills/` |
| ZCode | `~/.zcode/skills/` 或共享 `~/.agents/skills/` | — |
| Kimi Code | `~/.kimi/skills/` 或共享 `~/.agents/skills/` | `.kimi/skills/` |

`git pull` 后重新拷贝即更新；删除对应技能目录即卸载。

## 安装后识别验证

1. 问 agent「列出当前可用的 workflow skills」，应出现 9 个车道技能、3 个辅助、1 个纪律 skill（tdd）与 4 个工具 skill（remove-deadcode-py、sweep、research、handoff）。
2. 测试提示语：`Use Harness Workflow to plan a scoped implementation.`（中文等价说法：「用 Harness Workflow 给一个范围明确的实现做计划」。）
3. 恢复面不需要预先决定——两层分工见下节。

## 恢复面：什么时候建（两层分工）

新项目不用预先决定要不要建档，两层各管各的：

- **任务层（默认自动）**：单任务确需跨会话恢复时，`plan` 自动建立最小面（work_index + state）；已有恢复面的项目里，`brainstorm` 也会在讨论阶段预登记本轨道行。不确定就什么都不做，需要时它们自己会建。
- **项目层（按需手动）**：想把整个项目工作台一次配齐（agent 入口、恢复面、验证闸门、配置）时，才让 `harness-builder` 按需初始化 `.harness/` 等，不默认创建；日常单项任务用不上它。

## 技能清单

| 技能 | 用途 |
| --- | --- |
| `harness-builder` | 在目标项目搭/修工作台：入口指针、恢复面初始化、验证闸门（首次接入或真缺口才用，日常任务不经过） |
| `brainstorm` | 模糊需求收敛为用户批准的 Spec（frontier grill） |
| `plan` | 多阶段任务的可执行计划与恢复入口 |
| `implement` | 范围明确的修改，行为改动在商定 seams 测试驱动 |
| `diagnose` | 根因未知的故障证据化调查 |
| `review` | 审阅与验收证据判定（`verify` 是触发别名） |
| `ship` | implement → review → cleanup 的端到端交付编排 |
| `cleanup` | 任务收尾整理：文档、代码遗留、恢复状态 |
| `autoresearch` | 研究循环总控：假设轮次 + 直接取证 + 对抗验证 + 排除法重开 + 诚实终态，预算与授权档位可调 |
| `find-skills` | 明确技能缺口的定向发现（含第三方技能安全审计） |
| `capability-recommender` | 只读能力选型推荐 |
| `writing-for-agents` | 改「给 agent 读的文字」：写/改 skill、审计修订持久指令、修复迁移恢复面（搭工作台本身用 harness-builder） |
| `tdd` | 先红后绿的测试纪律，由 implement 在商定 seams 驱动 |
| `remove-deadcode-py` | 按需全仓 Python 死代码清除（工具检测 + 证据定罪 + 分批原子删除） |
| `sweep` | 按需全仓对账：六档分类盘点 + 证据定罪 + 用户裁决（工具 skill） |
| `research` | 轻量单发调研：后台跑腿读一手来源，结论带出处落 `docs/research/`（工具 skill） |
| `handoff` | 会话交接：压缩当前会话给下一个 agent；有恢复面优先写 state（工具 skill） |
