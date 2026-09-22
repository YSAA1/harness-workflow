---
name: handoff
description: "把当前会话压缩成交接文档，让全新会话或另一个 agent 无损接手。会话要结束但工作未完、要换会话/换 agent 继续、要给下一个 session 定向任务时使用。Triggers: handoff, 交接, 会话交接, 换会话, 移交."
disable-model-invocation: true
argument-hint: "下一个会话用来干什么？"
---

# Session Handoff

写一份交接物，让一个零上下文的新 agent 能接着干。交接是显式动作：用户没叫就不自作主张交接。

## 流程

1. 用户传了参数就按它定制（下一会话的重点）；没传就按当前工作的自然续点写。
2. 落点分层：
   - 项目有恢复面：续点优先写进本轨道 state 的 Next 行，关键状态与证据写 Evidence 行（持久、可恢复）；确需完整上下文再附完整交接文档。
   - 无恢复面：交接文档写到操作系统临时目录（不进仓库，避免制造孤儿文件），把路径明确告诉用户。
3. 内容纪律：
   - 含「建议技能」一节：下一个 agent 应调用哪些 skill，直呼其名。
   - 不复述已有产物（Spec/plan/ADR/issue/commit/diff）——引用路径即可。
   - 脱敏：密钥、口令、个人身份信息一律不写。
4. 交付：告诉用户交接物在哪、下一会话怎么用（有恢复面按会话入口读；无恢复面把文档喂给新会话开场）。

## Recommended next skill

- 新会话：有恢复面按 `AGENTS.md` 会话入口续作；无恢复面以交接文档开卷。
- 交接暴露出工作台缺口：`harness-builder`。
