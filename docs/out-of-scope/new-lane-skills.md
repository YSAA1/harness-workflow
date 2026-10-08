# 能由现有 lane 组合出的能力不新开 lane

**拒绝内容**：为某个新流程单独新增 workflow lane 技能，而该行为可以由现有 lane 的一个模式或一个步骤承载。

**理由**：每个 lane 的 description 常驻上下文、要求 README/安装面/双语指南/manifest/check 脚本全链同步，并增加用户要记住的入口数。行为能组合出来时，新 lane 只增加负载、不增加能力。

**替代做法**：作为现有 lane 的模式或步骤落地。已有实例：

- 任务图并行交付（上游 `implement-spec`）→ `ship` 并行模式＋`plan` 依赖边（任务 031）。
- 会话后环境改进复盘（上游 `retro`）→ `cleanup` lessons 步的环境改进（任务 031）。
- 独立 verify → `review` 的触发词别名（任务 012）。

确有独立触发词且需被其他技能调用的按需工具，按工具 skill 处理（见 `AGENTS.md` 铁律），仍需满足 [改动门槛](README.md#改动门槛)。

**来源**：本仓 `AGENTS.md` lane 清单铁律；上游 mattpocock/skills `.out-of-scope/new-skills.md` 同原则。
