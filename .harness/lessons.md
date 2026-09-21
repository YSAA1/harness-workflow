# Lessons

项目已踩过的坑与非显然经验。每条 = 触发 → 坑 → 正确做法（→ 追溯）。条目失效即删，不设历史归档；无触发条件的通用感悟不收。

## 环境与工具

- 同步文件后做逐字节校验：本机 shell 的 `cp` 曾被覆盖成只 unset proxy 的空操作函数，拷贝静默失败——用 `install`、`rsync` 或 `command cp` 并 diff 复核（2026-06-25）。
- 沙箱跑 Python 测试遇 Temp 权限失败：先确认是沙箱限制而非测试缺陷，提权重跑一次再下结论（2026-07-06）。
- Claude/Codex/Grok 都会同时读自身 skills 目录与共享 `~/.agents/skills`：技能只装共享面一份，Claude 侧用符号链接，避免双份加载与版本漂移（2026-09-15）。
- Grok 内置 bundled 技能与本插件 `implement`/`review` 同名：在 Grok 里用全名（如 "use the harness-workflow implement skill"）消歧（2026-09-15）。

## 提交纪律

- `git add -A` 会把未跟踪的用户草稿扫进提交并推送：显式 add 路径，提交前必看 `git status`（2026-09-15 ed40e3a 事故，a61fa88 修复）。

## 验证与评审

- 自己写检查脚本自己过 = generator/evaluator 未分离：跨面/合同级改动必派独立只读 subagent 复核（2026-09-15 两次实证：skillopt 残留命令、stale 扫描白名单过窄恰好互相掩盖）。
- 状态一致性检查要双向枚举：登记矛盾（行 active vs state complete）与未登记（行在而 state 缺）都是漂移，单向检查留盲区（2026-09-21 lint 补 state 未登记检查）。
- 验证脚本会退化成"历史快照断言机"（600+ 行硬编码 run_id/测试计数/字段镜像）：断言动态属性，不镜像状态字面值（2026-06-25 check.sh 协议加固的由来）。
- reviewer subagent 300s 超时不等于结论失效：packet fallback 自审并如实标注审查方式降级（2026-06-29）。
- 循环式协议的重开/停止条件由执行者自评会被双向架空——既可每轮自我论证「新证据」永续，也可窄假设一轮假收敛：判定条件须落成第三者可复核物证（预测-观察对照、本轮前日志未载、合取收紧）（2026-09-21 Grok 对抗审查实证，autoresearch 证据门修订）。

## Skill 协议设计

- 多轮循环协议的轮内产物直接落轨道日志，不逐轮另开 Spec：逐轮 Spec 会把 brainstorm 的 gate 仪式拖进研究循环，第三方用户第 0 轮就被面试卡住（2026-09-21 Grok 对抗审查实证，autoresearch 改假设入日志）。

## 恢复面设计

- 多文件恢复面在单人流里会沉积：最小集 = work_index + state；recovery_policy 并入 AGENTS.md，progress/decisions 由 state Evidence 行、work_index 行与 git 历史替代（2026-09-15 收敛；先例是 2026-06-24 D-001 统一 `.harness/`）。
- 文档生命周期治理三层各司其职：退休契约 push（锚定状态翻转事件）+ 一致性 lint verify（hard fail）+ sweep pull（低频对账兜底）；全仓清理塞进 cleanup 会破坏任务原子性，归档目录是第二块墓地（2026-09-21 任务 020 落地；反面教材＝批 017 一次性手工大扫除留成片死指针）。
- 实现演进必须回写 user-approved Spec 对应条款：只改实现不回写，合同文本落后成假证据（2026-09-21 sweep 三档纳入 complete-未退休并回写 Spec 六档措辞）。
