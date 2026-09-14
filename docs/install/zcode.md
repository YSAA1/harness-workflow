# ZCode 安装与识别

ZCode 按 Agent Skills 约定读取 `SKILL.md` 技能：用户级目录和跨 CLI 共享目录都会被扫描，新会话即可发现，无需 marketplace 注册（插件市场是另一套可选机制，本仓库用技能面安装）。

## 安装面

| 面 | 位置 | 说明 |
| --- | --- | --- |
| 用户级 | `~/.zcode/skills/<skill>/` | ZCode 专属 |
| 共享用户级 | `~/.agents/skills/<skill>/` | 跨 CLI 共享（Grok Build、Kimi Code、Codex 等同样读取），推荐 |

推荐装到共享目录 `~/.agents/skills/`，一份拷贝多个 CLI 共用；只用 ZCode 时选 `~/.zcode/skills/`。

## 安装

```bash
git clone https://github.com/YSAA1/harness-workflow.git
cd harness-workflow

# 共享用户级（推荐）
mkdir -p ~/.agents/skills
for s in harness-builder brainstorm plan implement diagnose review ship cleanup find-skills capability-recommender agent-instructions-maintainer recovery-surface-builder; do
  cp -r "skills/$s" ~/.agents/skills/
done

# 或 ZCode 专属用户级
mkdir -p ~/.zcode/skills
for s in harness-builder brainstorm plan implement diagnose review ship cleanup find-skills capability-recommender agent-instructions-maintainer recovery-surface-builder; do
  cp -r "skills/$s" ~/.zcode/skills/
done
```

只需要部分车道时按名拷贝对应目录即可，例如 `cp -r skills/diagnose skills/implement skills/ship ~/.agents/skills/`。

## 识别验证

新开一个 ZCode 会话，确认技能出现在可用技能列表中（`implement`、`diagnose`、`ship` 等），再用真实触发词验证路由：

```text
Use the diagnose skill to investigate this failing check.
```

## 更新与卸载

- 更新：`git pull` 后重复 `cp -r` 覆盖拷贝；或用 `rsync -a --delete skills/<name>/ ~/.agents/skills/<name>/` 逐技能同步。
- 卸载：删除对应技能目录，如 `rm -rf ~/.zcode/skills/ship`。

## 说明

- 技能按需加载，不改变 ZCode 默认行为，不自动安装 MCP 或 hooks。
- 项目级恢复记录统一放 `.harness/`（见仓库根 `AGENTS.md`），与技能安装面无关。
