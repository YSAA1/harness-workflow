# 中文三文件模板

这些模板是 `plan` 的 canonical state-file templates。

来源：

- 仓库：`OthmanAdi/planning-with-files`
- 上游路径：`skills/planning-with-files-zh/templates`
- 引入日期：2026-05-09
- 许可证：MIT License，Copyright (c) 2026 Ahmad Adi

本地改造：

- 保留中文优先。
- 将 `task_plan.md` 调整为 active slice、commit-unit、验证命令和成功标准导向。
- 将 `progress.md` 调整为 append-only evidence log。
- 将 `findings.md` 调整为 accepted spec、rejected options、risks、references 和 root cause 记录。
- 未引入上游 hooks、session catchup、attestation 或自动化脚本。

职责边界：

- `plan` 通过 `state-contract` 负责创建和维护默认 three-file backend。
- `bootstrap` 不再直接维护三文件模板；需要 tracked state 时通过 `state-contract` / `plan` 复用这些模板。
- 其他 skill 只更新对应职责范围内的状态，不维护第二套模板。
