# Kimi Code CLI 安装与识别

Kimi Code CLI（MoonshotAI）原生支持 Agent Skills 的开放 `SKILL.md` 格式，并直接复用 Claude Code / Codex 风格的技能目录：项目级、Kimi 专属用户级和跨 CLI 共享用户级三层都会读取。

## 安装面

| 面 | 位置 | 说明 |
| --- | --- | --- |
| 项目级 | `<project>/.kimi/skills/<skill>/` | 仅当前项目 |
| Kimi 用户级 | `~/.kimi/skills/<skill>/` | 随 `KIMI_CODE_HOME` 移动；数据根隔离时技能一并隔离 |
| 共享用户级 | `~/.agents/skills/<skill>/` | 跨 CLI 共享（Grok Build、ZCode、Codex 等同样读取），推荐 |

推荐装到共享目录 `~/.agents/skills/`；希望和其他工具的技能隔离时用 `~/.kimi/skills/`。

## 安装

```bash
git clone https://github.com/YSAA1/harness-workflow.git
cd harness-workflow

# 共享用户级（推荐）
mkdir -p ~/.agents/skills
for s in harness-builder brainstorm plan implement diagnose review ship cleanup find-skills capability-recommender agent-instructions-maintainer recovery-surface-builder; do
  cp -r "skills/$s" ~/.agents/skills/
done

# 或 Kimi 专属用户级
mkdir -p ~/.kimi/skills
for s in harness-builder brainstorm plan implement diagnose review ship cleanup find-skills capability-recommender agent-instructions-maintainer recovery-surface-builder; do
  cp -r "skills/$s" ~/.kimi/skills/
done

# 或项目级（在目标项目根执行）
mkdir -p .kimi/skills
for s in implement review ship cleanup; do
  cp -r "/path/to/harness-workflow/skills/$s" .kimi/skills/
done
```

## 识别验证

新开一个 Kimi Code 会话，确认技能被发现：

```text
列出当前可用的 skills，确认 harness-workflow 的 implement、review、ship 已加载。
```

再用真实触发词验证路由：

```text
Use the ship skill to deliver this authorized change end to end.
```

## 更新与卸载

- 更新：`git pull` 后重复 `cp -r` 覆盖拷贝；或用 `rsync -a --delete skills/<name>/ ~/.agents/skills/<name>/` 逐技能同步。
- 卸载：删除对应技能目录，如 `rm -rf ~/.kimi/skills/implement`。

## 说明

- 技能按需加载，不改变 Kimi 默认行为，不自动安装 MCP 或数据源。
- 若设置了 `KIMI_CODE_HOME`，`~/.kimi/skills` 随之移动；共享目录 `~/.agents/skills` 始终留在真实系统 home，不受影响。
