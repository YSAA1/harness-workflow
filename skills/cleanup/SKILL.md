---
name: cleanup
description: "用于完成、阻塞、放弃或交接前的知识收尾：对齐 living docs、生成物、recovery，并理清唯一 work surface。触发条件：收尾/同步文档/整理状态，或 review ready 后 closure。不要当重构或行为改动入口。"
---

# Knowledge Cleanup

`cleanup` 是收尾闸门。对齐 **living** docs、生成物和 recovery；保证同一时刻只有一个 **work surface**；把假活执行纸 **archive**。不是重构许可证。

Leading words: **work surface** · **living** · **archive** · **entry point**

## 路由快照

- **Use when**: batch 要关闭/阻塞/放弃/交接；文档或多 plan 抢权威；用户说收尾/整理。
- **Do not use when**: ready 未证明（`review`）；失败未解释（`diagnose`）；要改行为（`plan`/`implement`）。
- **Route to**: 对齐则 stop；缺行为 → `implement`；不明失败 → `diagnose`；范围漂 → `plan`；工作面缺口 → `harness-builder`。

## 输入

1. `AGENTS.md`、README、相关 docs、生成物脚本。
2. Recovery：尤其 `.harness/work_index.md`（唯一 `active`）与 `state.md`；含 `deferred_cleanup`。
3. `docs/plans/`、`docs/specs/` 中仍像权威的执行纸（见 `references/doc-shelves.md`）。
4. `git status --short`、`git diff --stat`。
5. 本 batch 的 temp / scratch。

不确定能否删的文件：问或 defer，不静默删。

## 流程

每步完成标准写在步骤末尾。

### 1. 点名 work surface

一句话写出当前唯一 work surface（通常是 Work Index `active` 行的 primary artifact）。若无 `active`、或多个 plan/Spec 都像「正在执行」→ 先 reconcile（改 index / 标 status），再往下。

完成：能指出唯一权威路径，或已记录 blocker 并停。

### 2. 对照真相

比代码、README、`AGENTS.md`、相关 living docs、生成物、recovery。找命令漂移、入口指向死纸、skill 广告过期、eligible 未提交。

完成：drift 列表写出（可空）。

### 3. 货架与 archive

对本次相关的过期 Executable Plan / 假活 Spec：标 `done` | `superseded` | `abandoned`，需要时按 `references/doc-shelves.md` **archive**（搬迁 + banner + 从 **entry point** 摘链）。本任务 temp/debug 按 `references/entropy-checklist.md` 清或 defer。

完成：无第二个「当前执行计划」仍挂在入口；跳过项写入 `deferred_cleanup`。

### 4. 小修 + 重生生成物

只做保鲜级修正；生成物只跑生成器。选 closure：`complete` | `blocked` | `abandoned` | `reopen`。

完成：closure 已选；生成物若触及已重生。

### 5. 报告

输出契约 + git 相关/无关改动 + deferred。

完成：报告含 work surface、archived/deferred、Next。

## 输出契约

```text
CLEANUP: complete|blocked|abandoned|reopen

Work surface: <唯一权威路径 | none/blocked>
Dual truth: none|resolved|blocked

Evidence:
  - <command -> result>

Knowledge:
  - README / AGENTS / docs / generated / recovery: ok|updated|stale

Archive / entropy:
  - archived: ...
  - removed: ...
  - deferred_cleanup:
    - item: ...
      reason: ...
      reevaluate_when: ...

Git:
  - related: ...
  - left alone: ...

Next: stop | implement | diagnose | plan | harness-builder
```

## 验收

- [ ] 唯一 work surface 已点名或 blocker 已写明
- [ ] 无入口仍把已替换 plan 当权威
- [ ] Closure 四态之一；不确定文件未静默删除
- [ ] 生成物未手改；deferred 有 reevaluate_when

## 按需读取

- `references/doc-shelves.md` — 货架、archive 清单、plan 头
- `references/entropy-checklist.md` — 可清 vs defer
- `references/handoff-hygiene.md` — 交接六问
- `../review/references/cross-cutting-anti-patterns.md`

## Recommended next skill

| Situation | Next |
| --- | --- |
| Aligned | stop |
| Missing behavior | `implement` |
| Unexplained fail | `diagnose` |
| Scope drift | `plan` |
| Workbench gap | `harness-builder` |
