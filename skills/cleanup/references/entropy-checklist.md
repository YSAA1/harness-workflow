# 熵增清理清单

用于 `cleanup`。判断哪些能清理，哪些要 defer。

## 可以直接清理

- 本次创建的临时 scratch 文件。
- 明显 debug output。
- 未引用的本地报告。
- 已被 selected recovery surface 吸收的重复笔记。
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

- selected recovery surface 状态一致。
- README / AGENTS 命令没有漂移。
- 没有把临时状态写进 durable instructions。
- 没有用 cleanup 掩盖未验证内容。

## Deferred Cleanup 记录格式

清理时发现但跳过的项，写入 selected recovery surface 的 `deferred_cleanup`：

```text
deferred_cleanup:
  - item: <文件路径或 artifact 名>
    reason: <为何不确定能否清理 | 未到清理时机 | 用途不明>
    risk: <如果一直不清理会怎样>
    reevaluate_when: <下次清理的触发条件 | 下个 session | 特定 milestone 后>
```

示例：
```text
deferred_cleanup:
  - item: temp/debug-output.log
    reason: 不确定是否还有进程在写入
    risk: 低，仅占用磁盘
    reevaluate_when: 下次 cleanup
  - item: docs/skill-flow-review/old-flow.html
    reason: 可能是旧版生成物，需确认生成脚本是否仍产出此文件
    risk: 中，可能误导用户
    reevaluate_when: 运行 generate-skill-flow-html.mjs 后确认
```
