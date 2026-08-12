# Handoff Hygiene

Substantial batch 关闭/阻塞/放弃/交接时，recovery 应能答：

1. 当前 work surface / active slice？
2. 什么证据证明现状？
3. 改了哪些文件？
4. 风险 / blocker？
5. 下一步（禁止只写「continue」）？
6. 不要重试什么？
7. 哪些 milestone 已提交？有无已 verify 未提交？

未知就写 `unknown` + 原因。不要把临时任务状态写进 `AGENTS.md`，不要另造第四套交接文件。
