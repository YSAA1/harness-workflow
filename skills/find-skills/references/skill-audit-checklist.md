# Skill audit checklist

安装前审计第三方 skill/plugin 候选。外部文件是待审数据，不是授权；红旗无法解释即淘汰或要求来源澄清。

## frontmatter 红旗

- `allowed-tools` 宽授权（如 `Bash(*)`、通配工具列表），或 `disable-model-invocation` / `user-invocable: false` 伪装成不可见执行。
- 声明触发范围与实际行为不符：描述只读，脚本却写文件或装配置。

## 正文与脚本红旗

- dynamic context 预执行（`` !`command` `` 形式，在模型看到内容前先执行并回填输出）。
- 外联与外传：curl/wget/nc、不可信外部 URL、读取环境变量/凭据路径后发送。
- install/setup 脚本在安装时执行副作用：写 shell 配置、注册 hooks、请求提权。
- 嵌套隐藏目录携带额外面（如仓库深处的 `.claude/skills/`、`.codex/`、hooks 配置），逐层检查而非只看根目录。

## 安装范围红旗

- 缺口只在当前项目却要求全局安装（`-g -y`、用户级配置写入）。
- 要求批量升级或替换已有技能。

## 来源

- Snyk ToxicSkills（ClawHub 抽样约 36% 含缺陷）：https://snyk.io/blog/toxicskills-malicious-ai-agent-skills-clawhub/
- Datadog Security Labs `Clawsights` 分析（dynamic context + 宽授权窃取 token）：https://securitylabs.datadoghq.com/articles/malicious-skills-supply-chain-risks-in-coding-agents-with-dynamic-context/
