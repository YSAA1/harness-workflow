# Grok Build 安装与识别

Grok Build（xAI 的 agent CLI）原生支持 Agent Skills 的 `SKILL.md` 格式：把技能目录放进用户级技能目录即可自动按需加载，无需 marketplace 注册。

## 安装面

| 面 | 位置 | 说明 |
| --- | --- | --- |
| 用户级 | `~/.grok/skills/<skill>/` | 本 CLI 专属，最直接 |
| 共享用户级 | `~/.agents/skills/<skill>/` | 跨 CLI 共享（Codex、Kimi Code、ZCode 等同样读取） |
| 项目级 | 项目内技能目录 | 仅当前项目可用，按 Grok 项目约定放置 |

推荐把 harness 技能装到共享目录 `~/.agents/skills/`，一份拷贝多个 CLI 共用；只在 Grok 独用时选 `~/.grok/skills/`。

## 安装

```bash
git clone https://github.com/YSAA1/harness-workflow.git
cd harness-workflow

# 共享用户级（推荐）
mkdir -p ~/.agents/skills
for s in harness-builder brainstorm plan implement diagnose review ship cleanup find-skills capability-recommender agent-instructions-maintainer recovery-surface-builder; do
  cp -r "skills/$s" ~/.agents/skills/
done

# 或 Grok 专属用户级
mkdir -p ~/.grok/skills
for s in harness-builder brainstorm plan implement diagnose review ship cleanup find-skills capability-recommender agent-instructions-maintainer recovery-surface-builder; do
  cp -r "skills/$s" ~/.grok/skills/
done
```

只需要部分车道时按名拷贝对应目录即可，例如 `cp -r skills/implement skills/review skills/ship ~/.agents/skills/`。

## 识别验证

新开一个 Grok 会话，确认技能被发现：

```text
列出当前可用的 skills，确认 harness-workflow 的 implement、review、ship 已加载。
```

再用一个真实触发词验证路由：

```text
Use the implement skill to make this scoped change and run the relevant checks.
```

## 更新与卸载

- 更新：`git pull` 后重复上述 `cp -r` 覆盖拷贝；或用 `rsync -a --delete skills/<name>/ ~/.agents/skills/<name>/` 逐技能同步。
- 卸载：删除对应技能目录，如 `rm -rf ~/.agents/skills/implement`。

## 说明

- 技能仅在相关任务出现时被按需加载，不会改变 Grok 的默认行为或自动触发范围。
- 可选：在 `~/.grok/AGENTS.md` 里加一行指向本仓库方法合同的引用，让持久规则与技能语义一致；不加也不影响技能加载。
