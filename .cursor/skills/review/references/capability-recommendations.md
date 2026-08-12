# Capability Gap Recording

用于 `verify`。当验证能力不足时，只记录缺口，不写完整推荐。项目级能力安装和 Capability Recommendation Table 交给 `harness-builder`。

## 缺口记录格式

```text
Capability gap: <缺失能力名称>
Risk: <未覆盖的验证风险>
Fallback now: <当前替代证据>
Route: harness-builder
```

## 示例

```text
Capability gap: browser automation (Playwright MCP)
Risk: UI 改动无法用命令行验证，只能人眼确认
Fallback now: accessibility snapshot 手动截图对比
Route: harness-builder
```

```text
Capability gap: integration test runner
Risk: 跨组件路径未验证，单测覆盖不到调用链
Fallback now: 手动 curl smoke check
Route: harness-builder
```

## 不做什么

- 不评估具体工具方案（Playwright vs Cypress vs Selenium）。
- 不写安装指南或 enablement 步骤。
- 不输出 Capability Recommendation Table（那是 harness-builder 的职责）。
- 不因为"可能有用"就推荐能力。

verify 的记录只是触发 harness-builder 消费的信号；完整推荐格式见 `../../harness-builder/references/recommendation_matrix_policy.md`。
