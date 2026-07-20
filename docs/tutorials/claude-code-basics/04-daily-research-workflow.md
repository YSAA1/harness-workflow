# 04 — 科研日常实战

前三节讲了概念、配置和沟通模式。这一节用一条完整的时间线把它们串起来，看小李怎么用 CC 过完一个真实的科研下午。

## 场景设定

小李在做图像分类。他刚看到一篇论文提出了新的数据增强方法 "MixCut"，论文代码开源在 GitHub 上。他下午的目标：

1. 读懂 MixCut 的开源代码
2. 在自己的 CIFAR-10 项目里复现这个方法
3. 和 baseline 对比效果
4. 画出对比图

**这个场景覆盖了科研最频繁的操作链：读代码 → 适配 → 跑实验 → 看结果 → 画图。**

---

## 第一阶段：读懂开源代码

小李把 MixCut 的仓库 clone 到本地。他不想逐文件读——只想快速了解核心逻辑。

```
我刚 clone 了这个 MixCut 的代码。先看 README 了解项目概况，
然后找到数据增强的核心实现，解释 MixCut 的算法流程。
列出它依赖了哪些库、输入输出是什么格式。
```

CC 会：
1. `cat README.md` — 看项目说明
2. `ls` 目录结构 — 找核心代码在哪
3. `grep` 关键词 — 定位 MixCut 的实现
4. 读核心文件，解释算法流程

小李看完 CC 的解释，心里有数了——MixCut 的核心就是一个函数，输入是一张图片和一个 label，输出是增强后的图片和混合后的 label。

---

## 第二阶段：适配到自己的项目

现在要把这个函数集成到自己的图像分类项目里。小李先让 CC 探索自己的项目（如果是一个新 session，CC 会读 CLAUDE.md 来了解项目）：

```
先读一下 @src/data/transforms.py 和 @configs/baseline.yaml，
了解我们现在是怎么做数据增强的。然后告诉我：
把 MixCut 加进来，哪些文件要改？怎么改？
先给我计划，别写代码。
```

CC 读文件后给出计划：

> 1. 在 `src/data/transforms.py` 中新增 `MixCut` 类
> 2. 在 `src/data/dataset.py` 的数据增强 pipeline 中加一个 MixCut 选项
> 3. 新增 `configs/mixcut.yaml` 配置文件
> 4. 不需要改训练脚本——配置驱动

小李确认计划后：

```
按计划实现。写完后：
1. 跑 python src/data/transforms.py 里的单元测试（如果有）
2. 跑 python -c "from src.data.transforms import MixCut; print('import OK')"
3. 跑 python train.py --config configs/mixcut.yaml --epochs 1 确认能跑通
```

CC 写代码 → 运行 → 报错（少了一个 import）→ CC 自己修 → 再跑 → 1 个 epoch 完成，loss 正常下降。

**这里体现了"给验证标准"（模式一）的价值**：小李没有说"加个 MixCut"，而是给了三步验证，CC 自己发现并修好了 import 缺失。

---

## 第三阶段：跑实验、看结果

1 个 epoch 能跑通，现在可以正式跑了：

```
跑 python train.py --config configs/mixcut.yaml --epochs 50，
同时跑 baseline 对比：python train.py --config configs/baseline.yaml --epochs 50。
用后台模式并行跑，告诉我命令就行。
```

CC 给出两个命令：

```bash
nohup python train.py --config configs/mixcut.yaml --epochs 50 > experiments/mixcut/logs/train.log 2>&1 &
nohup python train.py --config configs/baseline.yaml --epochs 50 > experiments/baseline/logs/train.log 2>&1 &
```

训练跑完后，小李让 CC 分析：

```
对比 experiments/mixcut/logs/train.log 和 experiments/baseline/logs/train.log。
提取每个 epoch 的 training loss 和 validation accuracy。
告诉我：
1. 两个实验的最高 validation accuracy 分别是多少？在第几个 epoch？
2. MixCut 有没有发生过拟合？依据是什么？
3. 用 matplotlib 画双线对比图（train loss + val accuracy），标注关键数据点，
   保存到 results/mixcut_vs_baseline.png。
```

CC 读两个日志文件 → 提取数据 → 分析 → 画图 → 保存。

---

## 这个流程为什么可靠

回看小李的整个下午，他做了 4 件事，每一步都没有因为"CC 出错"而浪费时间：

| 步骤 | 小李做的 | CC 做的 | 为什么没出错 |
|------|---------|---------|------------|
| 读懂代码 | 一句话描述目标 | 探索、解释 | 任务清楚，不涉及修改 |
| 适配 | 让 CC 先计划、再确认、再实现 | 计划 + 实现 + 自测 | 计划阶段发现了所有要改的文件 |
| 跑实验 | 给命令模板 | 组装命令 | 小李给了具体配置文件路径 |
| 分析 + 画图 | 指明日志位置和对比维度 | 提取、分析、画图、保存 | 验证标准清楚——"画双线图，标注关键点" |

**共同点**：每次交互，小李都给了三个东西——**做什么、在哪做、怎么算做完**。这不是天赋，就是模式一 + 模式二的肌肉记忆。

---

## 一节要点

- 科研中最频繁的操作链是"读→改→跑→看→画"，CC 能全链条参与。
- **先计划再实现**：改代码前让 CC 说清楚要改哪些文件、怎么改。
- **每次给验证步骤**：让 CC 自己发现并修复问题，而不是你帮它排查。
- CLAUDE.md（第二节）在"适配到自己项目"这一步发挥了作用——CC 知道项目约定，不需要每次重新探索。

---

> 下一节：[05 — 会话管理](05-session-management.md)。小李的下午很顺利，但如果实验跑了三天、中间要改方向、上下文越来越长怎么办？这是科研中最容易被忽略的核心技能。
