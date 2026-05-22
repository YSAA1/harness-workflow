# 伪完成模式

用于 `review`。当 change 看起来完成但证据不足时读取。

## 常见模式

| 模式 | 信号 | 处理 |
| --- | --- | --- |
| 只测 happy path | 只有一个成功路径测试 | 补边界 / 错误 / 空状态 |
| 旧证据冒充新证据 | 测试在最后一次代码变更前运行 | 重跑最小相关检查 |
| 局部绿全局未知 | 单测过，跨组件路径没跑 | 升级 integration / smoke |
| docs 漂移 | 命令、配置、用户行为已变但 README/AGENTS 未变 | 回执行 lane 同步 |
| scope creep | 做了 non-goal 或额外功能 | 拆 slice 或回滚 |
| hidden TODO | 留下临时代码、注释代码、debug output | cleanup 或修复 |
| capability gap 被忽略 | 需要浏览器/外部 API 却没工具 | 记录 recommendation 和替代证据 |
| 未经 verify 就提交 | git log 显示 commit 但 verify 未 PASS | 补 verify 或标记 commit 为非里程碑 |
| 阶段验收标准未逐条对照 | plan 有 acceptance_criteria 但 review 未提及 | 重新 review 对照验收标准 |
| commit message 与阶段不对应 | commit message 无法映射到 plan 阶段 | 提交时引用阶段名称 |

## Finding 格式

```text
Important: <file:line> <问题>
Impact: <为什么影响 ready>
Fix: <补验证/补实现/同步文档/拆 scope>
```
