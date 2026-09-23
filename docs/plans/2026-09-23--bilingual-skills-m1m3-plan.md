# Executable Plan - 17 技能全量双语（两套目录树）+ 安装语言选择 + README 技能地图

- Spec: `docs/specs/2026-09-23--bilingual-readme-invocation.md`（user-approved 2026-09-23）
- 状态: 执行中（M1）

## 工作项

### M1 管线先行（本批）

- [ ] `scripts/check-plugin.mjs` 扩展：`skills-en/` 存在时——①每个技能目录有合法 SKILL.md（frontmatter name 与目录一致、description 非空）；②en 树内 markdown 相对链接自洽（复用现有链接检查循环，把 `skills` 根扩为两树）；③en 目录集合必须是中文树的子集（等式检查留 M3 启用，避免 M1 中途态红）。
- [ ] 负向试验：en 树改错一个 name → 必须红；还原 → 绿。
- [ ] 三代表技能全量翻译（子代理并行）：`brainstorm`（SKILL+5 refs+2 templates）、`review`（SKILL+7 refs）、`writing-for-agents`（SKILL+5 refs）；`agents/*.yaml` 与英文原生文件（如 `templates/spec.md`、语言专用件 `spec.zh-CN.md`）原样复制不译。
- [ ] 验证：check-plugin 绿 + 抽读协议 token 未译。
- [ ] 中文 commit。

### M2 批量翻译（其余 14 技能）

- [ ] autoresearch / plan / implement / diagnose / ship / cleanup / sweep / tdd / harness-builder / find-skills / capability-recommender / remove-deadcode-py / research / handoff 全量翻译（分两批子代理并行；harness-builder 的 `tests/` 不复制）。
- [ ] check-plugin 绿。

### M3 收口

- [ ] 启用两树等式检查（同名同数 17/17）+ 负向试验（删目录必红）。
- [ ] README.md / README.zh-CN.md 各加「技能地图 / Skill Map」：mermaid 调用关系图 + 逐技能表（干什么/怎么用/上下游）；README.md 加英文树安装指路。
- [ ] `docs/install.md` 语言选择节（skills.sh 装中文树如实说明 + 英文树手动拷贝循环）。
- [ ] 独立只读子代理审校轮：逐技能 en vs zh 语义对照，漂移即修。
- [ ] 版本 0.10.0 → 0.11.0；push 一波（含 0.10.0 两 commit）+ 本机同步（含 skills-en）。
- [ ] 退休 024（翻行 → lessons 继承「改 zh 必同步 en」纪律 → 删本轨道 Spec/Plan（退休契约）→ state 同步）。

## 术语表（翻译子代理统一使用）

- 车道 → lane；恢复面 → recovery surface；退休 → retirement；翻行 → flip the row (out of active)；闭环 → closed loop
- 落盘 → persisted to disk；登记 → register；一手来源 → primary sources；后台跑腿 → background legwork
- 获批包 → approved hypothesis package；排除法三问 → three exclusion questions；对抗验证 → adversarial verification；诚实终态 → honest terminal states；可达性活判据 → reachability liveness criterion
- 协议 token 保留英文原样：BRAINSTORM/REVIEW/VERIFICATION/READY/SPEC/Gate/Frontier/Thin Spec
- 路径、文件名、`.harness` 字段名、`{{j2}}` 占位符不译；description 译成英文但保留中文触发词（括注），触发面两端通吃

## 风险与对策

- 两树漂移：M3 等式闸门 + lessons 纪律（改 zh 必同步 en）
- 翻译腔/术语漂移：统一术语表 + M3 独立审校轮（自译自校=generator/evaluator 未分离，lessons 有前科）
- skills.sh 装不了英文树：install.md 如实声明（Spec 约束）
