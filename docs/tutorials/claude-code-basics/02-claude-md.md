# 02 — CLAUDE.md：最重要的一步

上节你让 CC 探索项目："看看这个项目的结构，告诉我它是做什么的。"它做到了，但它是靠临场摸索——`ls`、`cat`、`grep` 一个个看。

如果你每次都让它这样摸索，它会慢、会漏、会理解偏。你需要的是一份**项目说明书**，让 CC 一进来就知道：这个项目做什么、目录怎么组织的、命令怎么跑、坑在哪里。

这份说明书就是 `CLAUDE.md`。在 Claude Code 的最佳实践中，这是排在"配置环境"第一位的——因为它是所有后续交互的基础。

## CLAUDE.md 放什么

先看 Claude Code 官方给的筛选标准：

| ✅ 该写 | ❌ 不该写 |
|---------|----------|
| CC 自己猜不出来的命令（激活环境、特殊构建步骤） | CC 读代码就能知道的东西 |
| 与默认风格不同的代码规范 | 标准语言约定（CC 本来就懂） |
| 测试怎么跑、用什么框架 | 详细的 API 文档（放链接就行） |
| 分支命名、PR 规范、commit 约定 | 经常变的信息 |
| 项目特有的架构决策 | 长篇解释或教程 |
| 环境变量、特殊依赖 | "写干净的代码"这种废话 |
| 常见坑和非直觉行为 | 一个文件一个文件地描述代码库 |

一句话：**写 CC 不可能自己猜出来的东西，不写它自己能发现的。**

## 科研项目 CLAUDE.md 模板

以小李的图像分类项目为例。他的项目结构：

```
~/research/image-classification/
├── data/
│   ├── raw/          # 原始 CIFAR-10 数据，不要改
│   └── processed/    # 预处理后的数据
├── experiments/
│   ├── baseline/     # ResNet-18 baseline
│   └── augmentation/ # 数据增强实验
├── results/          # 训练日志、检查点、图表
├── src/
│   ├── models/       # 模型定义
│   ├── data/         # 数据加载和预处理
│   └── utils/        # 工具函数
├── configs/          # 实验配置文件
├── train.py          # 主训练脚本
└── eval.py           # 评估脚本
```

对应的 `CLAUDE.md`：

```markdown
# 图像分类实验项目

## 环境
- 激活环境：`conda activate torch-env`
- Python 3.10+，PyTorch 2.x
- CUDA 可用时默认使用 GPU

## 目录约定
- `data/raw/`：原始数据，只读，不要修改
- `data/processed/`：预处理缓存，可重建
- `experiments/<实验名>/`：每个实验独立目录，包含自己的配置和日志
- `results/`：汇总结果、图表、checkpoint

## 常用命令
- 训练：`python train.py --config configs/<配置名>.yaml`
- 评估：`python eval.py --checkpoint results/<checkpoint名>.pt`
- 查看实验：`python src/utils/experiment_log.py --list`
- 运行测试：`python -m pytest tests/ -v`
- 代码检查：`python -m ruff check src/`

## 实验约定
- 每个实验用独立的 YAML 配置文件，不要硬编码参数
- 训练日志自动保存到 `experiments/<实验名>/logs/`
- 改模型结构前，先复制 baseline 配置和代码到新实验目录

## 常见坑
- `data/raw/` 里的文件解压后不要删——预处理脚本依赖原始文件
- 多 GP U 训练时 batch size 是 per-GPU 的，不是全局的
- `conda activate torch-env` 在脚本里不生效，需要用 `conda run -n torch-env`
```

**不需要写的**：PyTorch 怎么用、Python 语法规范、`train.py` 的逐行解释——CC 读代码就能知道。

## 快速生成初稿

如果你不想手写，CC 内置了 `/init` 命令：

```
/init
```

它会在你的项目里扫描一圈，自动生成一个 `CLAUDE.md` 初稿。初稿通常偏长（它会把能发现的都写上），你只需要按上面的"该写/不该写"标准删减一遍。

## 三层 CLAUDE.md

你可以把配置放在三个层级：

| 位置 | 作用范围 | 适合放什么 |
|------|---------|-----------|
| `~/.claude/CLAUDE.md` | 全局，所有项目生效 | 你的工作习惯、偏好的 commit 风格 |
| `./CLAUDE.md`（项目根目录） | 当前项目 | 项目结构、命令、架构决策 |
| `./CLAUDE.local.md`（项目根目录） | 当前项目，但不进 git | 你的本地路径、个人实验偏好 |

**建议**：团队协作时，`CLAUDE.md` 放项目公共约定（进 git），`CLAUDE.local.md` 放你的个人配置（加入 `.gitignore`）。

## 本节要点

- `CLAUDE.md` 是 CC 的"项目说明书"——花 5 分钟写好，后续所有交互都受益。
- 写 CC 猜不出来的东西，不写它自己能发现的。
- 用 `/init` 快速生成初稿，再按"该写/不该写"标准删减。
- 协作项目用 `CLAUDE.md`（进 git）+ `CLAUDE.local.md`（不进 git）组合。

---

> 接下来：[03 — 有效沟通：给上下文、给验证](03-effective-communication.md)。CLAUDE.md 让 CC 认识了项目，但每次具体任务怎么说，决定了它做得对不对。
