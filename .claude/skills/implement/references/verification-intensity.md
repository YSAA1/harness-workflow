# 验证强度选择

用于 `implement`。目标是按风险选验证，而不是机械追求固定覆盖率。

## 决策表

| 风险面 | 最低验证 | 升级信号 |
| --- | --- | --- |
| 纯函数 / 数据转换 | focused unit | 边界多、历史 bug 多 |
| 配置 / CLI / build | syntax + documented command | 命令影响 CI 或用户安装 |
| API / service / database | integration | schema、transaction、缓存、权限 |
| UI 单组件 | component/unit + smoke | 状态复杂、异步、可访问性 |
| 用户旅程 | smoke / E2E | 多页面、多步骤、支付、登录 |
| auth / secrets / trust boundary | targeted tests + review/security | 任何外部输入或权限变化 |
| 重构 | 前后行为对照 | 多模块、公共 API、框架升级 |

## RED-GREEN-REFACTOR 使用规则

- bugfix 优先写 reproduction test。
- 新功能优先写能表达行为的最小测试。
- 写不出自动测试时，写可复现命令或 smoke steps。
- refactor 必须在绿灯后做，做完再跑相同验证。

## 降级要求

如果不能跑应有验证，必须记录：

- 缺什么能力。
- 为什么现在不能跑。
- 当前替代证据是什么。
- 后续推荐能力是什么。
