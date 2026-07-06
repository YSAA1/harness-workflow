# Evidence Ladder

用于 `verify`。选择最小但足够强的验证组合。

## 层级

1. static / syntax
2. build
3. typecheck
4. lint
5. unit
6. integration
7. smoke
8. E2E / browser / external system
9. manual / operational signal

## 选择规则

- 改文档：链接、路径、命令引用检查即可。
- 改纯逻辑：focused unit + caller regression。
- 改构建/配置：build/typecheck/lint 至少一个真实入口。
- 改 UI：组件测试不够时补 smoke/E2E。
- 改跨边界：integration 或真实运行路径。
- 改 trust boundary：review + targeted tests + 更强运行证据。

## 按改动类型选择

常见改动类型 → 推荐阶梯组合。最低阶梯是必须跑的；推荐阶梯是高价值补充。

| 改动类型 | 最低阶梯 | 推荐阶梯 | 说明 |
| --- | --- | --- | --- |
| 文档/注释 | 1 (syntax) | — | 链接、路径、命令引用检查即可 |
| 纯逻辑修复 | 5 (unit) | 6 (integration) | 至少跑相关单元测试；涉及跨模块调用时补集成测试 |
| 配置/构建变更 | 2 (build) + 3 (typecheck) | 4 (lint) | 确保 build 不破；lint 检查配置格式 |
| UI 改动 | 7 (smoke) | 8 (E2E/browser) | 至少截图或手动确认渲染；有浏览器自动化时跑 E2E |
| API/跨边界 | 6 (integration) | 8 (E2E) | 跨进程/网络调用必须有集成验证；关键路径补端到端 |
| 数据结构变更 | 5 (unit) + 6 (integration) | 8 (E2E) | schema/migration 变更需要单元+集成双重覆盖 |
| 安全相关 | 5 (unit) + 8 (E2E) | 9 (manual) | trust boundary 变更必须有强运行证据 |
| 依赖升级 | 3 (typecheck) + 5 (unit) | 6 (integration) | 确保类型兼容 + 现有测试全过 |

## 跳过规则

跳过高价值层级时必须写：

- 为什么不跑。
- 风险是什么。
- 当前替代证据是什么。
- 后续需要什么能力。
