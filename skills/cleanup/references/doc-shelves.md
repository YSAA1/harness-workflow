# Doc shelves（work surface / archive）

`cleanup` 按需读取。Leading words: **work surface** · **living** · **archive** · **entry point**。

## 货架

| Shelf | 含义 | 本仓例子 |
| --- | --- | --- |
| Entry point | 薄路由，不存任务状态 | `AGENTS.md`（指向 Work Index，不写具体 plan 路径） |
| Living | 必须跟当前行为一致 | README、method contract、当前 active plan/Spec |
| Immutable | 当时的为什么 | `docs/adr/`（Accepted → Superseded） |
| Ephemeral | 服务一次任务 | `docs/plans/YYYY-…`、多数 `docs/specs/YYYY-…` |
| Non-authoritative | 考古，不当 pickup | `docs/archive/`、`docs/research/` |

半活（旧架构纸仍有用、但不是当前队列）：文首标明非当前 work surface，勿当执行权威。

## 唯一 work surface

1. 读 `.harness/work_index.md`：至多一行 `active`。
2. Primary artifact 即当前 work surface（或 state 明示的 Spec/Plan）。
3. 若 `docs/plans/` / `docs/specs/` 另有文件仍写着进行中且与 active 不同 → dual truth：改 status、archive，或请用户选一个。

## Archive 清单

完成 / 放弃 / 被替换的 ephemeral 执行纸：

1. 文首 `Status: done|superseded|abandoned`（或等价）。
2. 需要移出活目录时：`git mv` 到 `docs/archive/plans/` 或 `docs/archive/specs/`（目录可按需建）。
3. Banner：

```markdown
> **Status: archived（非权威）** — living work surface: `.harness/work_index.md` → active primary artifact.
```

4. 从 `AGENTS.md` / README / 其他 living 入口**删除**指向（不要注释堆叠）。
5. 修仍指向旧路径的 living 链接。

Research 笔记默认非权威，不必当执行纸 archive，除非它被入口误链成权威。

## 新建文档（cleanup 中若要写）

能改 living 就不新建。新文件先选货架；临时执行纸用 ephemeral 头：

```markdown
Status: active
Work surface: <一句话>
```

结束后改 `done` / `superseded` / `abandoned`，必要时 archive。
