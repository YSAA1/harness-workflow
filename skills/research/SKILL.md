---
name: research
description: "轻量单发调研：后台代理跑腿读一手来源，把结论连同逐条出处落成一份 markdown。适合一次性查证（文档/API 事实、主题摸底、查资料腿活）；开放问题需多轮假设验证时用 autoresearch。Triggers: research, 调研, 查证, 帮我查资料, 一次性调研."
---

# Single-shot Research

一次调研一个问题：后台跑腿、一手来源、产物落盘。不跑轮次循环、不做假设对抗——那是 `autoresearch` 的活。

## 流程

1. 把用户需求定成一句可交付的调研问题，确认产物落点：默认 `docs/research/YYYY-MM-DD--<topic>.md`（与 autoresearch 无恢复面日志同目录同命名）；项目已有调研笔记惯例则跟随惯例并说明落点。
2. 派后台代理跑腿（subagent 或 cli-delegate 等只读委派；没有就本会话直接做）：逐条结论回溯**一手来源**（官方文档、源码、spec、第一方 API），不采信二手转述；每条结论记来源与获取时点。
3. 主会话裁决：委派结果是 claim，关键事实回主会话核对来源后才落盘；对不上来源的结论如实标注不确定。
4. 落盘为单份 markdown，文档头带归属行（`Research: <问题一句话> | 日期 | 会话/轨道`）——该行即自登记，sweep 对其零引用时按自足交付物走人裁不自动删；有恢复面时在本轨道 state 的 Evidence 行出链。

## 边界

- 单问单答；调研中发现开放问题需要多轮验证 → 用户确认后转 `autoresearch` 另立轨道。
- 只读取证，不改代码；结论要落地改动 → `plan` / `implement`。
- 不做任务收尾（归 `cleanup`）。

## Recommended next skill

- 结论要变成改动：`plan`；范围已明确直接 `implement`。
- 问题升级为开放研究：`autoresearch`。
- 结束：交付调研文档即完成。
