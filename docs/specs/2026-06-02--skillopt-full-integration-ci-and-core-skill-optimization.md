# Spec - SkillOpt full integration, CI, and core skill optimization

> Status: user-approved
> Owner: user / agent
> Date: 2026-06-02
> Source request: 用户要求在当前分支内完整接入 `microsoft/SkillOpt` 项目，本机跑真实 skill 优化，GitHub CI 跑无 secret 门禁，并优化 `harness-builder / brainstorm / plan / implement` 四个正式 workflow skills。

## Background

第一阶段已经完成本地 deterministic skill eval MVP：`plan` skill 有 canary cases、runner、checker 和候选对比报告。当前痛点仍然存在：skill 改动后需要人工触发验证，且还没有把 `microsoft/SkillOpt` 本体接进来做真实优化。

这一版要把本地判卷器升级成正式工作流：GitHub PR 自动跑无 secret 门禁，本机使用 SkillOpt 本体跑真实优化，优化结果经过 eval 和人工审查后再 transplant 到正式 `SKILL.md`。

## Goals

- 完整接入 `microsoft/SkillOpt` 本体，而不是用自写优化器替代。
- 在本仓库存放 SkillOpt adapter、config、split data、run scripts 和报告入口。
- GitHub CI 真实运行无 secret 门禁，覆盖 SkillOpt adapter smoke、deterministic skill eval 和项目结构检查。
- 本机跑真实 SkillOpt online optimization，优先尝试 Codex CLI no-API-key 路径。
- 扩充 eval 覆盖到 `harness-builder / brainstorm / plan / implement`。
- 对四个正式 `skills/*/SKILL.md` 做受控优化改动，并通过本地和 GitHub Actions 证据证明。

## Non-goals

- 不 vendoring 全量 SkillOpt 源码到本仓库。
- 不让 GitHub CI 跑在线优化、消耗 API secret 或调用付费模型。
- 不自动 merge PR。
- 不让 SkillOpt 输出无审查地覆盖正式 `SKILL.md`。
- 不优化 `review / verify / cleanup / find-skills`。
- 不新增用户级 hooks、MCP 或全局配置。

## Users / Callers

- 用户：通过本地脚本触发 SkillOpt 优化、查看结果，并决定是否接受 skill 改动。
- 未来 agent：通过文档、plan 和脚本恢复优化流程。
- GitHub PR workflow：自动跑无 secret 门禁，阻止 skill 或插件结构回归。

## Behavior Spec

### Happy Path

- 用户或 agent 在分支内运行本地 SkillOpt 集成脚本。
- 脚本按固定 commit clone 或更新 `microsoft/SkillOpt` 到外部工作目录。
- 本仓库 adapter/config/split data 被复制或挂载到 SkillOpt 本体运行环境。
- 本机 SkillOpt run 产出 `best_skill.md`、`history.json`、`runtime_state.json` 或等价训练产物。
- 产物先进入本地 eval gate；通过后由 agent 人工审查并最小 transplant 到正式 `skills/<skill>/SKILL.md`。
- PR 打开后，GitHub CI 跑无 secret 检查并给出真实 Actions 结果。

### Edge Cases

- 如果 SkillOpt 当前版本不能用 `codex_exec` 作为 optimizer backend，记录为能力缺口；本机优化需要 API backend 或本地 vLLM/Qwen。
- 如果 Codex CLI 未登录或不可用，SkillOpt online optimization 不声明完成；CI 仍可跑无 secret 门禁。
- 如果真实训练成本或时间过高，允许把本机 online run 缩到最小 smoke，但必须仍调用 SkillOpt 本体训练入口。
- 如果 SkillOpt 输出没有优于 baseline，不 transplant 到正式 `SKILL.md`。
- 如果 GitHub Actions 失败，必须诊断失败原因；不能用本地绿灯替代真实 CI 证据。

### Interfaces / State

- `third_party/skillopt/` 或脚本声明的外部 clone 位置：固定 SkillOpt commit，不提交全量源码。
- `skillopt/` 或 `evals/skillopt/` 下的 adapter/config/split data：本仓库维护的集成面。
- `scripts/*skillopt*.mjs` / `scripts/*skillopt*.sh`：本地运行、CI smoke、结果检查入口。
- `.github/workflows/*.yml`：GitHub CI 无 secret 门禁。
- `docs/integrations/skillopt.md`：使用说明和安全边界。
- `docs/skillopt/runs/`：本地运行产物，默认不入库，必要时只提交紧凑报告。
- `skills/harness-builder/SKILL.md`、`skills/brainstorm/SKILL.md`、`skills/plan/SKILL.md`、`skills/implement/SKILL.md`：正式优化对象。

## Constraints

- 分支内进行，允许 push、开 PR、触发 GitHub Actions。
- CI 不使用 API secret，不跑在线优化。
- 本机可以跑在线 SkillOpt 优化。
- 优先尝试只依赖已登录 Codex CLI 的 no-API-key path。
- 不影响 SkillOpt 本体完整功能使用；接入方式不能把本仓库变成 SkillOpt fork。
- 关键里程碑使用中文 commit。
- 改 `SKILL.md` 后必须重新生成 skill flow HTML 并跑项目验证。

## Chosen Approach

使用 pinned external clone 接入 `microsoft/SkillOpt` 本体。本仓库只维护 benchmark adapter、config、split data、run scripts、CI workflow 和报告/文档。在线优化只在本机跑；GitHub CI 只跑无 secret 的 adapter/import/smoke、deterministic eval 和项目结构检查。SkillOpt 输出必须经过 eval gate 和人工审查后，才最小 transplant 到正式 `SKILL.md`。

## Rejected Options

- 自写 SkillOpt-like optimizer：不满足用户要求的“完整接入 SkillOpt 项目本体”。
- vendoring 全量 SkillOpt 源码：会让 plugin 仓库膨胀，并引入上游维护负担。
- GitHub CI 跑在线优化：需要 secret，存在成本和 PR 安全风险。
- SkillOpt 输出自动覆盖正式 skill：会绕过人工审查和项目验证，不符合受控自进化边界。

## Verification Strategy

### Baseline Evidence

- 当前 deterministic runner 对 `skills/plan/SKILL.md` 已可跑。
- 当前项目默认验证命令已通过。
- 需要重新确认 SkillOpt 当前代码是否支持 `codex_exec` optimizer no-API-key path。

### Automated Checks

- `node scripts/run-skillopt-eval.mjs --skill <skill> --skill-file skills/<skill>/SKILL.md --suite canary`
- `node scripts/check-skillopt-eval.mjs docs/skillopt/runs/latest/summary.json`
- `node scripts/check-plugin.mjs`
- `node scripts/check-claude-code-install.mjs`
- `node scripts/check-cursor-install.mjs`
- `node scripts/install-cursor.mjs --target . --dry-run`
- `node scripts/generate-skill-flow-html.mjs`

### Smoke / E2E Checks

- 本机 clone/pin SkillOpt 后跑 import 或 CLI smoke。
- 本机跑最小 SkillOpt train/eval smoke，产出真实 SkillOpt run artifacts。
- push 分支并开 PR，等待 GitHub Actions 真实 run。

### Negative / Boundary Checks

- CI workflow 不读取或要求 API secret。
- CI 不跑在线 optimization 命令。
- 如果 candidate 低于 baseline，checker 应失败或阻止 transplant。
- 本地 run artifacts 不污染 git tracked files。

### Documentation / State Checks

- `docs/integrations/skillopt.md` 与真实命令一致。
- `docs/plans/` 记录 active slice、验证路径和 evidence。
- 改动不写入 `AGENTS.md` 的临时状态。

### Fresh Evidence Required Before Completion

- 本地 SkillOpt 本体 smoke / run 证据。
- 四个 skill 的 deterministic eval 证据。
- 默认项目验证命令证据。
- GitHub Actions 真实 run URL / 状态证据。
- `git status --short --branch` 干净或只剩明确未提交产物。

## Capability Gaps

- SkillOpt 当前版本是否支持 `codex_exec` 作为 optimizer backend，需要读代码和本机 smoke 确认。
- 如果 no-API-key path 不成立，需要本机 API backend 或本地 vLLM/Qwen 服务。
- GitHub push / PR / Actions 需要远端权限，用户已允许。
- 真正训练可能耗时或花费较高，第一版允许最小真实 SkillOpt smoke，但不能用自写优化器替代。

## Success Criteria

- 本仓库有固定 SkillOpt clone/pin 机制和本地运行入口。
- 本机能调用 SkillOpt 本体完成最小真实 run，并产出 SkillOpt artifacts。
- GitHub CI 真实跑通无 secret 门禁。
- eval 覆盖 `harness-builder / brainstorm / plan / implement`。
- 四个正式 `SKILL.md` 有针对性优化改动，并通过 eval、项目检查和生成物同步。
- 分支已 push，PR 已开，GitHub Actions 绿灯。

## Residual Risks

- SkillOpt no-API-key Codex CLI optimizer path 可能不可用；需要在实现早期确认并记录 fallback。
- 四个 skill 同时优化有过拟合 eval wording 的风险；通过人工 review、hard gates 和项目检查缓解。
- GitHub Actions 结果可能受远端权限或环境限制影响；若失败，进入 diagnose 而不是跳过。

## Plan Handoff

- Active slice: 先完成 SkillOpt 本体接入和 CI 无 secret 门禁，再扩 eval 和优化四个 skill。
- Suggested next skill: plan
- Planning notes: 先验证 SkillOpt 能力，再设计 adapter 和 CI；不要先大改 `SKILL.md`。
- Suggested milestones: Spec/plan；SkillOpt pin + smoke；CI gate；eval expansion；local optimization + transplant；verification + PR。
- Per-milestone acceptance hints: 每个 milestone 都需要对应命令证据和中文 commit；最终必须包含真实 GitHub Actions 证据。
