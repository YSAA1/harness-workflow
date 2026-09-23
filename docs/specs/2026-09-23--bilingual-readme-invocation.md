# Spec - 17 技能全量双语（两套目录树）+ 安装语言选择 + README 技能地图

> 状态 / Status: user-approved（2026-09-23，push 时机拍板：完工一起推）
> Owner: user
> Date: 2026-09-23
> 来源请求 / Source request: 会话 /goal「出中英两个版本、安装加语言选择、README 写清每技能干啥怎么用与调用关系、调查隐触发」+ Q1-Q6 拍板

## 背景

技能层纯中文（17 个技能的 SKILL.md/references/templates 均为中文），英文用户安装后无法使用；README 虽双语但没有"每个技能干什么、怎么用、互相怎么调用"的地图；隐触发开关经网络调查（2026-09-23）确认：Claude Code 用 frontmatter `disable-model-invocation`、Codex 用 `agents/openai.yaml`、Cursor 声称支持实际忽略、其余 agent（含 ZCode/Grok/Kimi/Cline/Gemini）无此选项，开放规范（agentskills.io）未定义触发控制字段——唯一全端通用机制是 description 触发词写法（本仓 "Triggers:" 行）。

## 目标

- `skills-en/` 完整英文树：17 个技能全量文件（SKILL.md、references、templates；`agents/*.yaml` 原样复制；tests 留中文树）。
- 安装指引含语言选择：skills.sh 路径如实说明装的是中文树；英文树给手动拷贝循环（Grok/ZCode/Kimi 路径）。
- README.md 与 README.zh-CN.md 各加「技能地图」节：mermaid 调用关系图 + 逐技能表（干什么 / 怎么用 / 上下游）。
- `scripts/check-plugin.mjs` 扩展两树一致性守卫。
- 插件版本 0.10.0 → 0.11.0。

## 非目标（Non-goals）

- 隐触发开关**不新增**（用户 Q5 拍板）：现有 handoff 的 `disable-model-invocation` 与 6 个 `agents/openai.yaml` 保留原样，不扩展、不成体系，全端触发语义继续靠 description 的 Triggers 行。
- 不做语言切换脚本（两套目录树方案下不需要换名）。
- 不改中文树的协议内容（仅 README/install/check-plugin 配套面变动）。
- 本期不做两树分叉管理：en 树是 zh 树的忠实翻译，冲突时以中文树为准。

## 用户 / 调用者（Users / Callers）

- 中文用户：`skills/` 现状不变（skills.sh、插件、手动拷贝三条路径照旧）。
- 英文用户：按 install.md 语言选择节手动拷贝 `skills-en/`。
- 两语言读者：README 技能地图作为上手入口。

## 行为规格（Behavior Spec）

### 正常路径（Happy Path）

- 仓库根并存 `skills/`（zh）与 `skills-en/`（en），目录同名同数（17）。
- `npx skills add YSAA1/harness-workflow` 行为不变（skills.sh 只发现 `skills/`）；install.md 明示英文用户走手动拷贝并给出完整 for 循环。
- README.md（英文读者主入口）语言版本节链接 `skills-en/` 拷贝指引。

### 边界情况（Edge Cases）

- en 树缺目录或目录名不齐 → check-plugin 红。
- en 树内相对链接断裂 → check-plugin 红（现有链接检查循环需覆盖 `skills-en`）。
- 模板 `.j2` 的 `{{变量}}` 占位符不翻译；协议 token（BRAINSTORM/REVIEW/READY/SPEC 等）保留英文原样。
- 未跟踪状态的 Spec 与登记行：可达性检查按文件系统判定，出链即绿。

### 接口 / 状态（Interfaces / State）

- 新增 `skills-en/**`；修改 `scripts/check-plugin.mjs`、`docs/install.md`、`README.md`、`README.zh-CN.md`、`.claude-plugin/plugin.json`。
- `.harness/work_index.md` 024 行 primary artifact 指向本 Spec。

## 约束（Constraints）

- AGENTS.md 铁律：五面语义一致——en 树是翻译不是第二套协议，语义权威为中文树。
- 全量一步到位（用户 Q3 拍板，不分批发布）。
- skills.sh 的目录发现机制只认 `skills/`（调研确认）。

## 选定方案（Chosen Approach）

**两套目录树**（用户 Q2 拍板，未选推荐的双文件+切换脚本）：装哪套是哪套、agent 永远读标准 `SKILL.md` 文件名、无换名脚本依赖。代价：仓库体积与维护翻倍、两树漂移风险——用 check-plugin 一致性闸门 + lessons 纪律（改中文树必须同步 en 树）缓解。

## 拒绝方案（Rejected Options）

- 双文件 + 切换脚本（SKILL.md 缺省中文 + SKILL.en-US.md 换名）：用户不要，多一步操作且有脚本依赖。
- 只双语 SKILL.md 主文件分两批：用户要全量一步到位。
- 显式触发三件套补齐双开关（handoff/remove-deadcode-py/sweep 配 Claude+Codex 开关）：调查后用户选择不补，维持 Triggers 行现状。

## 验证策略（Verification Strategy）

### 基线证据（Baseline Evidence）

- `node scripts/check-plugin.mjs` 当前全 PASS（0.10.0，781fac4 之后干净树）。

### 自动检查（Automated Checks）

- check-plugin 扩展：①`skills-en` 目录集与 `skills` 完全同名同数；②en 树 SKILL.md frontmatter name 与目录名一致、description 非空；③相对链接检查循环覆盖 `skills-en`（en 树内自洽）；④stale token 扫描天然覆盖（现有逻辑扫全部 tracked .md）。

### Smoke / E2E 检查

- 目读抽验 `skills-en/brainstorm/SKILL.md`：协议 token 未译、术语与 zh 树对应。

### 负向 / 边界检查（Negative / Boundary Checks）

- 破坏试验：临时删 `skills-en` 一个目录或改错一个 name → check-plugin 必须红；还原后绿。

### 文档 / 状态检查（Documentation / State Checks）

- README 双语技能地图节存在、mermaid 可渲染、表格链接可达；install.md 语言选择节覆盖三条安装路径；work_index 024 行出链本 Spec。

### 完成前所需 fresh evidence

- 声明 ready 前重跑 `node scripts/check-plugin.mjs` 全 PASS + 独立审校结论写入 state Evidence。

## 能力缺口（Capability Gaps）

- 翻译语义质量无法脚本验证（自译自校 = generator/evaluator 未分离，lessons 已有此坑）→ 安排**独立只读子代理审校轮**：逐技能 en vs zh 对照，协议条款漂移即修，审校方式标注 independent。
- `harness-builder/tests/test_scripts.py` 引用 `skills/` 路径，不翻译不复制（测试只保中文树）。

## 成功标准（Success Criteria）

1. `skills-en/` 下 17 目录与 `skills/` 同名同数，全量文件齐（除 tests）。
2. check-plugin 新检查在位：正向绿、负向破坏试验红。
3. README 双语各含技能地图（mermaid 图 + 逐技能"干什么/怎么用/上下游"表，含四工具、三辅助、一纪律）。
4. install.md 含语言选择节（含 skills.sh 装中文树的如实说明）。
5. 独立审校一轮，无未修复的语义漂移。
6. 版本 0.11.0，中文 commit，任务 024 退休四步完整。

## 残余风险（Residual Risks）

- 两树长期漂移：缓解 = lint 闸门 + lessons 纪律（改 zh 必同步 en）。
- 英文用户经 skills.sh 的路径绕（需手动拷贝）：如实声明；未来可评估独立英文发行通道。
- 翻译腔/术语不一致：审校轮缓解，残余接受。

## Plan 交接（Plan Handoff）

- 当前切片 / Active slice: en 树骨架 + 管线先行——check-plugin 扩展 + 3 个文件量最大的代表技能（brainstorm / review / writing-for-agents）翻译并过闸门，验证整条流水线后再批量。
- 建议下一 skill / Suggested next skill: plan
- 计划提示 / Planning notes: 翻译执行建议用子代理并行（每技能一个，携统一术语表：lane=车道、recovery surface=恢复面、retire=退休、frontier=frontier 保留等）；协议 token 与路径不译。
- 建议里程碑 / Suggested milestones: M1 骨架+管线（含负向试验）；M2 其余 14 技能全量；M3 README 技能地图+install 语言选择+审校轮+版本 0.11.0+退休 024。
- 里程碑验收提示 / Per-milestone acceptance hints: M1=负向试验红且代表技能过闸；M2=17/17 齐+全绿；M3=审校零漂移+check-plugin 全 PASS+README/install 检查通过。
