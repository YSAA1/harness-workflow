# 坏味基线（smell baseline）

> 用于 `review` 第 2 步。条目取自 Fowler《重构》第 3 章，组织方式改编自 [mattpocock/skills](https://github.com/mattpocock/skills) `code-review`（MIT），revision `b0618bc`（2026-10-08）。

两条约束：

- **仓库优先**：文档化的仓库规范永远胜出；它认可的写法，对应坏味不报。
- **永远是判断**：每条都是带标签的启发式（「疑似 Feature Envy」），从不是硬违规；工具已强制的不报。

每条＝**是什么** → **怎么修**，对照 diff 匹配：

- **Mysterious Name**：函数、变量或类型的名字说不清它做什么/装什么 → 改名；起不出诚实的名字说明设计本身含混。
- **Duplicated Code**：同一逻辑形状出现在本次改动的多个 hunk 或文件 → 抽出共享形状，两处调用。
- **Feature Envy**：方法伸手拿别的对象的数据多于自己的 → 把方法挪到它羡慕的数据旁。
- **Data Clumps**：同几个字段/参数总是结伴出现（一个想诞生的类型） → 打包成一个类型传递。
- **Primitive Obsession**：用原始类型或字符串代替值得有自己类型的领域概念 → 给概念一个小类型。
- **Repeated Switches**：对同一类型的同一 `switch`/`if` 级联在改动中反复出现 → 换成多态，或两处共用一张映射表。
- **Shotgun Surgery**：一个逻辑改动迫使 diff 里多个文件零散修改 → 把一起变的东西收进一个模块。
- **Divergent Change**：一个文件/模块因几件无关的事被改 → 拆开，让每个模块只因一个理由变化。
- **Speculative Generality**：为需求里没有的场景加抽象、参数或钩子 → 删掉，内联回去，等真实需求出现。
- **Message Chains**：调用方依赖长串 `a.b().c().d()` 导航 → 把这段行走藏到第一个对象的一个方法后面。
- **Middle Man**：类或函数大部分只是往下转发 → 去掉中间层，直接调用真实目标。
- **Refused Bequest**：子类/实现者忽略或覆盖了继承来的大部分东西 → 放弃继承，改用组合。
