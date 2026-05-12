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

## 跳过规则

跳过高价值层级时必须写：

- 为什么不跑。
- 风险是什么。
- 当前替代证据是什么。
- 后续需要什么能力。
