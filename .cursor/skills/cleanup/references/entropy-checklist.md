# 熵增清理清单

用于 `cleanup`。判断清、defer，还是交给货架/archive。

## 可直接清

- 本次 temp / scratch / debug 输出
- 未引用的本地报告
- 已被 recovery 吸收的重复笔记
- 本次引入且未使用的 import / 变量

## 走 archive（不是删）

- 已完成或被替换的 `docs/plans/*`、过期执行向 Spec（见 `doc-shelves.md`）
- 入口仍链到的假活执行纸

## 谨慎 → defer

- 用途不明的 generated / screenshot / fixture / lockfile / 配置
- 可能仍有进程写入的日志

写入 recovery `deferred_cleanup`：

```text
deferred_cleanup:
  - item: <路径>
    reason: <不确定 | 未到时机 | 用途不明>
    risk: <一直不清会怎样>
    reevaluate_when: <下次 cleanup | 某 milestone 后>
```

## 不要静默动

- 用户已有 dirty changes、行为代码、测试、大段重写 `AGENTS.md`、依赖删除、public API 结构调整

## 关闭前

- 唯一 work surface 已点名
- README / AGENTS 命令无漂移
- 临时状态未写进 entry point
