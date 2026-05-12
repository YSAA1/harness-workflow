# 熵增清理清单

用于 `cleanup`。判断哪些能清理，哪些要 defer。

## 可以直接清理

- 本次创建的临时 scratch 文件。
- 明显 debug output。
- 未引用的本地报告。
- 已被 `progress.md` / `findings.md` 吸收的重复笔记。
- 本次引入且未使用的 import / variable。

## 需要谨慎

- generated assets。
- screenshots / traces。
- fixture 变化。
- lockfile。
- 项目配置。

处理：先说明用途不明，写入 deferred cleanup。

## 不要静默清理

- 用户已有 dirty changes。
- 行为代码。
- 测试文件。
- `AGENTS.md` 大段重写。
- 依赖删除。
- public API / docs 结构调整。

## 关闭前检查

- 三文件状态一致。
- README / AGENTS 命令没有漂移。
- 没有把临时状态写进 durable instructions。
- 没有用 cleanup 掩盖未验证内容。
