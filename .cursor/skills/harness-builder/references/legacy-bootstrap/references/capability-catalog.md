# 能力推荐目录

用于 `bootstrap`。本文件帮助判断 capability 是 required 还是 recommended。required capability 应进入项目级工作面；recommended 才只是建议。

每条能力必须包含：required/recommended、价值、启用方式、风险、替代路径。

## Web / UI 项目

常见能力：
- Playwright MCP
- Playwright test suite
- Chrome DevTools MCP（调试网络、console、性能时）

价值：
- 验证真实浏览器中的点击、表单、路由、DOM 状态。
- 用 accessibility snapshot 降低纯视觉猜测。

风险：
- 安装和浏览器依赖增加。
- E2E 可能 flaky。
- MCP capability 开太多会增加 token 和工具选择成本。

替代：
- 手动 smoke steps + 截图 + 命令记录。
- 单元 / integration 只作为较弱证据。

## API / SDK / 第三方服务

常见能力：
- 官方 docs/search 能力。
- 契约测试或 mock server。

价值：
- 当前 API 行为和版本差异可验证。

风险：
- 外部服务需要网络、凭据、rate limit 管理。

替代：
- 保存官方链接和本地 mock contract。

## Issue 驱动项目

常见能力：
- GitHub / issue tracker MCP。

价值：
- 直接读取 issue、PR、review 状态，减少手动转述。

风险：
- 权限和 token 管理。

替代：
- 用户提供 issue 摘要，写入 `findings.md`。

## 长任务 / 实验 / 训练

常见能力：
- 日志采集、health check、metrics、trace、外部 runner。

价值：
- 长时间运行不依赖聊天窗口。

风险：
- 需要额外目录、存储或服务。

替代：
- 明确 command、log path、checkpoint path，定期 append 到 `progress.md`。
