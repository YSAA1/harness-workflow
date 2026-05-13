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

## Finding 格式

```text
Important: <file:line> <问题>
Impact: <为什么影响 ready>
Fix: <补验证/补实现/同步文档/拆 scope>
```
