# Executable Plan - Adversarial Review Skill

> Status: verified
> Date: 2026-05-27
> Spec source: `docs/specs/2026-05-27--adversarial-review-skill.md`
> Planning surface: `docs/plans/2026-05-27--adversarial-review-skill-plan.md`

## Objective

把 `review` skill 升级为默认对抗式、隔离优先的结构评审协议：meaningful diff 必须尝试独立 reviewer，失败才 fallback，并用统一 reviewer prompt reference 支撑 subagent、`codex exec` 和 packet fallback。

## Scope Contract

- Active slice: 更新 `skills/review/SKILL.md` 和新增 `skills/review/references/adversarial-reviewer-prompt.md`，让 `review` 默认执行 adversarial isolated reviewer protocol。
- Non-goals:
  - 不重写 `brainstorm`、`verify` 或整个 workflow skill 顺序。
  - 不新增第九条 public workflow lane。
  - 不安装或修改全局 hooks、MCP、用户级配置或 marketplace。
  - 不让 `review` 修代码或声明 ready。
- Success criteria:
  - `review` 明确要求 meaningful diff 先尝试隔离 reviewer，失败才 fallback。
  - reviewer reference prompt 能被 subagent、`codex exec review`、`codex exec` packet 和 fallback reviewer 共同复用。
  - `review` 输出契约包含 isolated reviewer attempt、ordered reviewer attempts、final reviewer mechanism、fallback summary、adversarial hypotheses、defender evidence、verify handoff cases。
  - README / method contract / generated skill-flow 与新的 `review` 语义一致。
  - 真实 `codex exec` reviewer 和真实 subagent reviewer 都在最后一次相关修改后运行并留下可审查输出。
- Verification path:
  - Structure: `node scripts/check-plugin.mjs`
  - Install surfaces: `node scripts/check-claude-code-install.mjs`、`node scripts/check-cursor-install.mjs`、`node scripts/install-cursor.mjs --target . --dry-run`
  - Generated docs: `node scripts/generate-skill-flow-html.mjs` 后再跑 `node scripts/check-plugin.mjs`
  - Real isolated reviewers: `codex exec review --ephemeral --uncommitted` 或 `codex exec --ephemeral --sandbox read-only -C <repo> <review prompt>`；以及真实 read-only `reviewer` subagent
- Verification path status: `runnable`
- Required capabilities:
  - Node runtime for project scripts.
  - Codex CLI with `codex exec` / `codex exec review`.
  - Current session subagent tool with read-only `reviewer` role.
- Fallback evidence: runtime fallback is allowed in the final `review` protocol, but this implementation's acceptance does not allow packet-only fallback to replace real `codex exec` and real subagent reviewer evidence.
- Final integration claim: the updated `review` protocol, reviewer reference, docs, generated skill-flow, and real isolated reviewer verification all describe and prove the same adversarial review behavior.
- Project map: `AGENTS.md#项目地图`

## Current Item

Phase 4 - Final review, verify, and cleanup routing: `completed`

## Overall Success Criteria

- The changed workflow preserves the `review` / `verify` boundary: review remains structural and adversarial; verify remains the only ready gate.
- Meaningful diffs have an explicit context-isolation path before fallback.
- The reviewer prompt reference is specific enough for a professional independent reviewer and not merely a checklist.
- All project validation commands pass after the last related edit.
- Real `codex exec` reviewer and real subagent reviewer both run after the final meaningful diff exists.
- Commit units are only eligible after review has no Critical finding and verify PASS is recorded.

## Phases

### Phase 1 - Review protocol and reviewer prompt reference

Status: `completed`

Acceptance criteria:
- `skills/review/SKILL.md` defines adversarial review posture as default.
- `skills/review/SKILL.md` defines context isolation priority: subagent / independent reviewer, `codex exec review`, `codex exec` packet, packet fallback.
- meaningful diff handling requires attempting isolated reviewer first; tiny diff exceptions require a recorded reason.
- output contract includes isolated reviewer fields, adversarial hypotheses, defender evidence, findings, and verify handoff cases.
- `skills/review/references/adversarial-reviewer-prompt.md` exists and defines role, input packet, prohibited evidence, attacker pass, defender pass, findings, and handoff output.

Verification commands:
- `rg -n "adversarial|isolated|reviewer_mechanism|verify_handoff" skills/review/SKILL.md skills/review/references/adversarial-reviewer-prompt.md`
- `node scripts/check-plugin.mjs`

Success definition:
- A future agent reading only `review` and its new reference can run an isolated adversarial review without relying on this chat.

### Phase 2 - Documentation and generated skill-flow synchronization

Status: `completed`

Acceptance criteria:
- README skill map and method contract remain accurate; update them only where current text would misrepresent the new review behavior.
- Generated `docs/skill-flow-review/review.html` reflects the final `review` skill after regeneration.
- Cursor / Claude / Codex plugin checks still pass.
- No temporary task state is written into `AGENTS.md`.

Verification commands:
- `node scripts/generate-skill-flow-html.mjs`
- `node scripts/check-plugin.mjs`
- `node scripts/check-claude-code-install.mjs`
- `node scripts/check-cursor-install.mjs`
- `node scripts/install-cursor.mjs --target . --dry-run`

Success definition:
- All exposed plugin/install surfaces agree on the updated review contract.

### Phase 3 - Real isolated reviewer verification

Status: `completed`

Acceptance criteria:
- A real meaningful diff exists after Phase 1/2 changes.
- `codex exec review --ephemeral --uncommitted` is attempted against the final diff; if its built-in format cannot express the required fields, use `codex exec --ephemeral --sandbox read-only -C /home/ssy/桌面/harness-workflow <review packet prompt>` and record why.
- A real read-only `reviewer` subagent reviews the same final diff using the new reviewer reference.
- Both reviewer outputs are checked for attacker hypotheses, defender evidence, findings/no-finding rationale, and verify handoff cases.
- Any command/tool failure is recorded as a failure to satisfy this phase, not silently replaced by packet-only fallback.

Verification commands:
- `codex exec review --ephemeral --uncommitted`
- If needed: `codex exec --ephemeral --sandbox read-only -C /home/ssy/桌面/harness-workflow <review packet prompt>`
- real subagent invocation with `agent_type=reviewer`

Success definition:
- The implemented protocol is not only documented; it is exercised by both real isolated reviewer mechanisms required by the Spec.

### Phase 4 - Final review, verify, and cleanup routing

Status: `completed`

Acceptance criteria:
- A structural review of the final diff has no Critical finding.
- `verify` maps every success criterion to fresh evidence after the last related edit.
- Residual risks distinguish runtime fallback from implementation acceptance.
- Git status is checked and unrelated changes are not mixed in.

Verification commands:
- `git status --short`
- `node scripts/check-plugin.mjs`
- `node scripts/check-claude-code-install.mjs`
- `node scripts/check-cursor-install.mjs`
- `node scripts/install-cursor.mjs --target . --dry-run`

Success definition:
- The work is ready to route to `cleanup` only after fresh verification proves the final integration claim.

## Commit Units

| Commit unit | Phases | Scope | Preconditions | Message template |
| --- | --- | --- | --- | --- |
| M1 | Phase 1-2 | `review` skill protocol, reviewer reference, docs/generated sync | review no Critical + verify PASS for Phase 1-2 checks | `强化 review 对抗式隔离审查协议` |
| M2 | Phase 3-4 | real isolated reviewer evidence, final verification/cleanup updates if any | real `codex exec` reviewer evidence + real subagent reviewer evidence + verify PASS | `验证 review 隔离审查机制` |

## Known Risks / Blockers

- `codex exec review` may not expose the exact output contract required by this repo; fallback to plain `codex exec` with the reviewer reference is allowed for verification, but the attempt must be recorded.
- `codex exec` can be expensive because it loads project/user context; keep it tied to meaningful diff verification.
- Subagent availability is current-session dependent; for this implementation it is available and required for acceptance.
- Adversarial reviewer prompt may overproduce findings; implementation must distinguish Critical, Important, Minor, evidence gap, and verify handoff.
- Generated HTML may create broad diffs; only accept generated changes produced by `scripts/generate-skill-flow-html.mjs`.

## Decisions

| Decision | Rationale | Evidence / Source |
| --- | --- | --- |
| Keep this inside `review`, not a new workflow lane | The behavior is a stronger review posture, not a separate lifecycle activity | Spec rejected option |
| Use isolation-first with fallback | It preserves generator/evaluator separation without making all environments unusable | User confirmed: meaningful diff must try independent reviewer first, fallback allowed |
| Require real `codex exec` and subagent in acceptance | User explicitly rejected simulated smoke as sufficient | User instruction during brainstorm |
| Keep `verify` as the only ready gate | Harness Method Contract C6 | `docs/harness-method-contract.md` |

## Evidence Log

### 2026-05-27 Implementation pass

- Updated `skills/review/SKILL.md` with default adversarial posture, isolation priority, ordered `reviewer_attempts[]`, final reviewer mechanism, fallback summary, `git status --short` / untracked file packet requirements, and explicit `verify` boundary.
- Added `skills/review/references/adversarial-reviewer-prompt.md` with independent reviewer role, prohibited evidence, attacker hypotheses, defender evidence, findings with file or command evidence, and verify handoff cases.
- Synced root review skill and prompt into `plugins/harness-workflow/skills/review/` and `.cursor/skills/review/`.
- Updated `README.md` and `docs/harness-method-contract.md` to describe isolation-first adversarial review without making `review` a ready gate.
- Updated `scripts/generate-skill-flow-html.mjs` so English `Workflow`, `When to use`, `Do not use`, `Hard rules`, `Output contract`, and harness-builder preservation sections are extracted into generated HTML.
- Regenerated `docs/skill-flow-review/*.html`; focused evidence showed `harness-builder` now has `13 个流程步`, and `harness-builder.html` no longer renders `工件更新` as `未抽取到条目`.

### 2026-05-27 Reviewer findings and fixes

- First real `codex exec review --ephemeral --uncommitted` attempt failed because `--uncommitted` cannot be used with an inline prompt. The no-prompt retry ran and found two P2 issues: generated `harness-builder.html` had a `0 个流程步` / missing extraction regression, and fallback output fields lacked attempted command / failure summary.
- First real subagent reviewer (`019e67fe-98c0-7ad1-9e79-679f6ac39162`) found the same generated HTML/evidence issues.
- Fix: updated `scripts/generate-skill-flow-html.mjs` to extract English workflow sections, regenerated HTML, and added reviewer attempt command / failure summary fields.
- Second real `codex exec` packet reviewer returned `CONDITIONAL`: multi-surface protocol looked coherent, but `harness-builder.html` still had a missing `工件更新` extraction.
- Fix: added `Preservation rule for existing harness-builder assets` as an artifact/preservation section alias and regenerated HTML.
- Second real subagent reviewer (`019e6802-133a-7681-ae05-446837ed300b`) returned `BLOCK`: single reviewer mechanism fields could not fully represent multi-hop fallback chains.
- Fix: replaced single final-only fields with ordered `reviewer_attempts[]`, `final_reviewer_mechanism`, and `fallback_summary` in `review` and the reviewer prompt.
- Third real subagent reviewer (`019e6809-2553-71c0-8e0d-a229d32355c9`) returned `BLOCK`: prompt findings were weaker than the `review` skill output contract, and the review packet did not explicitly require untracked file coverage.
- Fix: updated `review` and the prompt to require `git status --short` or equivalent untracked file coverage, and to require Critical / Important findings to include file:line, command, or artifact evidence.

### 2026-05-27 Fresh command evidence after latest edits

- `node scripts/generate-skill-flow-html.mjs` -> PASS, generated 9 HTML files.
- `node scripts/check-plugin.mjs` -> PASS.
- `node scripts/check-claude-code-install.mjs` -> PASS.
- `node scripts/check-cursor-install.mjs` -> PASS.
- `node scripts/install-cursor.mjs --target . --dry-run` -> PASS / dry-run complete.
- Focused `rg` evidence confirms generated `review.html` includes `git status --short`, ordered reviewer attempts, and no `harness-builder` `0 个流程步` / `未抽取到条目` regression in the checked generated pages.

### 2026-05-27 Final isolated reviewer evidence

- Real `codex_exec_packet` reviewer `019e6822-72b3-7d63-baa1-ee1e94d558c5` returned `REVIEW: PASS` after Cursor rule, Spec, and evidence fixes.
- Real subagent reviewer `019e6822-7617-7da2-a60f-c49b8fa61826` returned `REVIEW: BLOCK` only because this latest reviewer output and Phase 3 status were not yet recorded in repo-local evidence. It found no remaining blocker in Spec coverage, Cursor rules, mirrors, generated HTML, or the review/verify boundary.
- Final reviewer evidence is recorded in `docs/reviews/2026-05-27--adversarial-review-final-evidence.md`.
- Phase 3 acceptance is considered satisfied for verification because both required mechanisms ran after the final behavior/protocol changes. Subsequent edits are evidence-only closeout updates to the plan and review evidence artifact.

### 2026-05-27 Final verify record

Claim: the `review` workflow now defaults to adversarial, isolation-first review for meaningful diffs, preserves the `review` / `verify` boundary, and keeps Codex / packaged plugin / Cursor surfaces consistent.

Success criteria mapping:

- Meaningful diff must attempt isolated reviewer before fallback: covered by `skills/review/SKILL.md`, `skills/review/references/adversarial-reviewer-prompt.md`, `rules/review.mdc`, `.cursor/rules/review.mdc`, and real reviewer evidence in `docs/reviews/2026-05-27--adversarial-review-final-evidence.md`.
- Reviewer packet includes untracked coverage and avoids implementer self-justification: covered by `git status --short` requirements in `skills/review/SKILL.md`, the prompt reference, Cursor rules, and Spec.
- Critical / Important findings require file, command, or artifact evidence: covered by `skills/review/SKILL.md`, prompt reference, and Spec.
- `review` remains structural and does not replace `verify`: covered by `skills/review/SKILL.md`, `README.md`, and `docs/harness-method-contract.md`.
- README / method contract / generated skill-flow / Cursor rules / mirrors are synchronized: covered by full structure checks and mirror checks.
- Real `codex exec` reviewer and real subagent reviewer ran after the final behavior/protocol changes: covered by `docs/reviews/2026-05-27--adversarial-review-final-evidence.md`.

Fresh verification commands:

- `node scripts/generate-skill-flow-html.mjs` -> PASS, generated 9 HTML files.
- `node scripts/check-plugin.mjs` -> PASS.
- `node scripts/check-claude-code-install.mjs` -> PASS.
- `node scripts/check-cursor-install.mjs` -> PASS.
- `node scripts/install-cursor.mjs --target . --dry-run` -> PASS.
- `git status --short --untracked-files=all` -> expected changed/new files only for this slice.

Ready verdict: PASS.

## Next Skill

- Next skill: `cleanup`
- Reason: verify PASS is recorded; remaining work is commit/status hygiene.
