# Verification Gate Hardening Executable Plan

## Objective

把当前 `plan -> implement -> review -> verify -> cleanup` 路线收紧成更清楚的验收协议：验证路径必须在计划阶段定义，`implement` 和 `verify` 明确分离，`verify` 成为唯一 ready gate，并用结构化 evidence 证明每个 ready claim。

## Planning Surface

- Surface: `plan document`
- Artifact: `docs/prd/2026-05-18--verification-gate-hardening.md`
- Spec source:
  - 当前对话中确认的设计原则：验证必须前置定义，验证能力不能到最后才发现；实现和验证应分离。
  - Review artifact: `.review-artifacts/plan-implement-review-verify-gap-review.html`
  - Current source files: `skills/plan/SKILL.md`, `skills/implement/SKILL.md`, `skills/review/SKILL.md`, `skills/verify/SKILL.md`, `README.md`, `docs/harness-method-contract.md`

## Design Position

`implement` 可以运行局部检查，但它只能证明“当前实现步骤没有明显坏掉”。它不能声明 ready。

`verify` 是独立验收阶段。它要用 fresh context 读取计划中的 success criteria 和 verification path，重新收集证据，并把每条成功标准映射到当前命令、smoke、E2E、人工检查或明确的 unknown。

简化成一句话：

```text
implement builds the change; verify proves the claim.
```

## Active Slice

先把四个核心 skill 的 ready gate、验证前置、结构化证据和多阶段集成验收规则落成一致的文档计划；本计划不直接修改 skill 正文。

## Non-goals

- 不新增第九条 workflow lane。
- 不把所有任务强制变成 three-file backend。
- 不把 repo 改造成 YAML workflow runner、CI 平台或 agent orchestration daemon。
- 不默认安装 hooks、MCP、browser runner、external verifier 或用户级配置。
- 不让 `review` 变成第二个 `verify`。
- 不取消小任务轻路径；小任务仍可 `implement -> verify`。

## Success Criteria

- `verify` 被定义为唯一 ready gate；`review` pass 后不能直接正式 `cleanup`，只能进入 `verify` 或标注 `verify fast-path`。
- `plan` 阶段必须写清 verification path，并标注 `verification_path_status: runnable | blocked`。
- 如果 verification path blocked，默认先转 `harness-builder` 或记录替代证据决策，不能盲目进入 `implement`。
- `implement` 文档明确：局部测试可以跑，但不能声明 ready；稳定后进入 `review` 或低风险时进入 `verify`。
- `review` 文档明确：它检查 scope、spec、diff、docs、entropy、risk；fresh evidence sufficiency 和 ready judgement 归 `verify`。
- `verify` 输出包含最小结构化 schema，能绑定 claim、路径、最后改动、命令、跳过项和 unknown。
- 多阶段或多 commit unit 任务必须在 `plan` 中定义 `final_integration_claim`，最终 `verify` 不只验证局部 slice。
- README、method contract、skill-flow HTML 和 packaged/Cursor surfaces 与核心 skill 保持一致。

## Verification Path

Verification path status: `runnable`

Required capabilities:

- Node scripts already present in this repo.
- Markdown/source review via local file reads.
- No new MCP, hook, browser, or external service is required for this plan-only artifact.

Commands for the future implementation batch:

```bash
node scripts/check-plugin.mjs
node scripts/check-claude-code-install.mjs
node scripts/check-cursor-install.mjs
node scripts/install-cursor.mjs --target . --dry-run
node scripts/generate-skill-flow-html.mjs
node scripts/check-plugin.mjs
```

Targeted manual checks:

- Confirm `skills/plan/SKILL.md` output schema allows `verify` as next skill.
- Confirm `skills/review/SKILL.md` no longer routes pass directly to final cleanup.
- Confirm `skills/verify/SKILL.md` contains the structured claim evidence schema.
- Confirm `README.md` common routes still preserve tiny task path.
- Confirm generated `docs/skill-flow-review/{plan,implement,review,verify}.html` reflects the updated contracts.

## Work Items

### Phase 1 - Reconfirm Baseline And Write Set

Purpose:
确认当前 canonical edit surface、packaged plugin surface 和 Cursor preview surface，避免只改一处造成 drift。

Likely files:

- `skills/plan/SKILL.md`
- `skills/implement/SKILL.md`
- `skills/review/SKILL.md`
- `skills/verify/SKILL.md`
- `README.md`
- `README.zh-CN.md`
- `docs/harness-method-contract.md`
- `scripts/check-plugin.mjs`
- `scripts/generate-skill-flow-html.mjs` if extraction assumptions break
- `plugins/harness-workflow/**`
- `.cursor/skills/**`

Actions:

- Check `git status --short`.
- Re-read target skill files and current generated review pages.
- Confirm how this repo currently syncs root, packaged, and Cursor preview surfaces.

Acceptance:

- Write set is explicit.
- Existing untracked files are identified and not overwritten.
- No implementation starts until current source-of-truth surface is clear.

### Phase 2 - Make Verification Path A Plan-Time Contract

Purpose:
把“怎么证明做对”从最后一步提前到 `plan` 阶段。

Changes:

- Add `Verification path status: runnable | blocked`.
- Add `Required capabilities`.
- Add `Fallback evidence` when full verification is unavailable.
- Add `final_integration_claim` for multi-stage or multi-commit work.
- Update `plan` output schema so `Next skill` can be `implement | diagnose | harness-builder | verify`.

Acceptance:

- A plan cannot route to `implement` when the only meaningful verification path is blocked and no fallback has been accepted.
- Proof-only or release-readiness tasks can route directly from `plan` to `verify`.
- Multi-stage plans include a final integration claim.

### Phase 3 - Separate Implement From Ready Verification

Purpose:
Prevent implementation self-assessment from becoming acceptance.

Changes:

- Clarify that `implement` may run local checks as feedback, not as final ready proof.
- Keep low-risk path as `implement -> verify`, not `implement -> cleanup`.
- Replace the mechanical “two failures” wording with “one explicit hypothesis loop fails to explain the failure -> diagnose”.

Acceptance:

- `implement` output can say local checks passed.
- `implement` output cannot say the slice is ready unless it routes to `verify`.
- Failure routing is based on unexplained root cause, not just a raw retry count.

### Phase 4 - Narrow Review To Structural Review

Purpose:
Keep `review` valuable without letting it replace `verify`.

Changes:

- Define `review` as checking spec coverage, diff correctness, scope, docs drift, design risk, and entropy.
- Remove or reword any route that lets `review` pass directly to final cleanup.
- Introduce `verify fast-path`: when review sees already fresh evidence, route to `verify` with a short evidence recheck, not to cleanup.
- Clarify severity terms: `Important` is the blocking tier equivalent to `Major` in broader audit language.

Acceptance:

- `review` can say “no structural blockers”.
- `review` cannot be the final ready gate.
- `review` routes pass states to `verify`.

### Phase 5 - Structure Verification Evidence

Purpose:
Reduce fake confidence from free-text evidence.

Add minimum verification schema:

```text
Verification record:
  claim_id: <stable short id>
  claim: <ready claim>
  covered_paths:
    - <path or behavior surface>
  latest_change_ref: <git diff summary | commit | file timestamp basis>
  success_criteria:
    - criterion: <text>
      evidence: <command/smoke/manual signal>
      status: pass|fail|unknown
  commands:
    - command: <exact command>
      cwd: <path>
      result: pass|fail
      evidence_after_change: yes|no
  skipped_high_value_checks:
    - check: <name>
      reason: <why skipped>
      risk: <risk>
      fallback: <current substitute>
  unknowns:
    - <what remains unproven>
  ready: yes|no
```

Acceptance:

- `verify` can only output ready when all required criteria are pass.
- Unknown remains not ready.
- Skipped high-value checks must include risk and fallback.

### Phase 6 - Align Public Docs And Generated Review Surface

Purpose:
Make the user-facing README, method contract, and generated HTML say the same thing as the skill files.

Changes:

- Update README common routes if needed.
- Update `docs/harness-method-contract.md` C5/C6/C8 language for verification path status, final integration claim, and unique ready gate.
- Regenerate skill-flow HTML after SKILL changes.
- Extend `scripts/check-plugin.mjs` if cheap checks can catch route drift, such as `plan` output schema missing `verify` while recommended next includes it.

Acceptance:

- `node scripts/check-plugin.mjs` passes.
- Generated HTML reflects the updated four-skill contract.
- Public docs do not imply `review` can replace `verify`.

### Phase 7 - Sync Package Surfaces And Verify

Purpose:
Ensure all installable surfaces receive the same contract.

Actions:

- Sync root `skills/` to `plugins/harness-workflow/skills/`.
- Sync Cursor preview skill files if this repo still maintains `.cursor/skills/`.
- Run all default verification commands.
- Check `git status --short` and report unrelated pre-existing files separately.

Acceptance:

- Root, packaged, and Cursor preview surfaces are consistent.
- Verification commands pass or failures are diagnosed with concrete cause.

## Current Next Item

`Phase 1 - Reconfirm Baseline And Write Set`

Reason:
The change will touch public skill contracts and mirrored install surfaces. The first implementation step must verify current file truth before editing.

## Commit Units

1. `plan` contract: verification path status, output schema, final integration claim.
2. `implement/review/verify` contract split: implement feedback vs verify ready gate.
3. Structured verification evidence schema.
4. README / method contract / generated HTML alignment.
5. Packaged and Cursor surface sync plus verification evidence.

## Known Risks / Blockers

- Tightening `verify` too hard could make tiny tasks feel heavy. Mitigation: preserve `implement -> verify` fast path for small changes.
- Adding structure could bloat outputs. Mitigation: keep the schema minimal and claim-scoped.
- Sync drift across root, packaged plugin, and Cursor preview is likely if edits are made manually in only one surface.
- Some tasks genuinely cannot run full verification locally. Mitigation: require `blocked` status, fallback evidence, and capability recommendation instead of pretending ready.

## Handoff

- Next skill: `implement`
- Entry condition:
  - User approves this plan or asks to implement it.
  - Phase 1 reconfirms the write set and current git status.
  - No unrelated untracked file is overwritten.

