# Capability Recommendation 格式

用于 `verify`。只推荐，不安装。

## 模板

```text
Recommended: <capability>
Value: <覆盖什么验证风险>
Enablement: <项目如何启用>
Risk / cost: <依赖、权限、flake、token、维护成本>
Fallback now: <当前不用该能力时的替代证据>
```

## Playwright MCP

适用：
- web app
- 多步骤 UI
- 表单、路由、上传、下载
- 需要 accessibility snapshot 的浏览器验证

建议：
- 默认只推荐 core/browser automation。
- 测试场景再推荐 testing/storage。
- 调试场景再推荐 devtools/network。
- 不建议默认全开 capability。

## Docs / Search

适用：
- API/SDK 行为可能随版本变化。
- 官方文档是判断依据。

替代：
- 用户提供链接并把关键决策写入 `findings.md`。
