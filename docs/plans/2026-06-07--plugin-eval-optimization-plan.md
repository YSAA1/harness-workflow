# Plugin Eval 优化计划

Date: 2026-06-07

Status: proposed

Planning surface: docs plan

Spec source: 用户要求“按照 Plugin Eval skill 给一份修改计划文档”；当前目标和验证策略已足够清楚，不单独创建 Spec。

## Objective

把 `harness-workflow` 从 Plugin Eval 的高风险状态推进到可发布、可验证、可持续优化的状态，同时保持 Harness Method Contract 的核心语义不变。

目标不是重写 workflow 方法论，而是修复 Plugin Eval 和仓库自检暴露的结构、包装、token 成本和可测性问题。

## Current Evidence

Plugin Eval target: `plugins/harness-workflow`

Fresh command evidence:

```text
node C:\Users\shash\.codex\plugins\cache\openai-curated\plugin-eval\3f0def1b\scripts\plugin-eval.js start plugins/harness-workflow --request "请给我一份修改计划文档" --format markdown
Result: recommended path = Evaluate Plugin; benchmark config present = no; usage log present = no

node C:\Users\shash\.codex\plugins\cache\openai-curated\plugin-eval\3f0def1b\scripts\plugin-eval.js analyze plugins/harness-workflow --format markdown
Result: Score 0/100, Grade F, Risk high, 6 fail, 15 warn, 2 info

node C:\Users\shash\.codex\plugins\cache\openai-curated\plugin-eval\3f0def1b\scripts\plugin-eval.js explain-budget plugins/harness-workflow --format markdown
Result: trigger_cost_tokens 564, invoke_cost_tokens 16496, deferred_cost_tokens 34593, total_tokens 51653

node scripts/check-plugin.mjs
Result: FAIL, packaged plugin skill drifted from root skill: brainstorm

node scripts/check-cursor-install.mjs
Result: FAIL, Cursor project-preview skill drifted: brainstorm/SKILL.md

node scripts/check-claude-code-install.mjs
Result: PASS

node scripts/install-cursor.mjs --target . --dry-run
Result: PASS
```

Known dirty worktree at plan time:

```text
M .gitignore
M skills/brainstorm/SKILL.md
?? .codex/
?? revise_plan.md
```

Do not fold unrelated dirty files into this plan unless the user explicitly approves.

## Active Slice

First active slice: restore local plugin/package consistency and then address Plugin Eval structural failures in commit-sized steps.

Only one implementation slice should be active at a time. The first implementation slice is **P1: repair brainstorm drift and package mirrors**.

## Non-goals

- Do not rename the eight active workflow lanes.
- Do not make `harness-builder` a mandatory pre-step for all tasks.
- Do not remove `find-skills`; it remains a helper, not the ninth workflow lane.
- Do not change the rule that `verify` is the only ready gate.
- Do not install hooks, MCP config, subagents, or user-level Codex config as part of this optimization.
- Do not rewrite unrelated README, deck, PRD, or generated artifacts unless a validation check requires it.

## Success Criteria

1. Repository structural checks pass:
   - `node scripts/check-plugin.mjs`
   - `node scripts/check-claude-code-install.mjs`
   - `node scripts/check-cursor-install.mjs`
   - `node scripts/install-cursor.mjs --target . --dry-run`
2. Plugin Eval manifest failures are gone for `plugins/harness-workflow`.
3. Plugin Eval budget failures are reduced or converted into documented, measured tradeoffs.
4. Skill trigger warnings are reduced by rewriting frontmatter descriptions into clear `Use when...` trigger sentences.
5. Any token slimming preserves the Harness Method Contract invariants in `docs/harness-method-contract.md`.
6. Any script refactor preserves behavior and adds at least a small local validation path for changed helpers.
7. Each milestone is committed with a short Chinese commit message after review + verify.

## Verification Path

Verification path status: runnable

Required commands:

```text
node scripts/check-plugin.mjs
node scripts/check-claude-code-install.mjs
node scripts/check-cursor-install.mjs
node scripts/install-cursor.mjs --target . --dry-run
node C:\Users\shash\.codex\plugins\cache\openai-curated\plugin-eval\3f0def1b\scripts\plugin-eval.js analyze plugins/harness-workflow --format markdown
node C:\Users\shash\.codex\plugins\cache\openai-curated\plugin-eval\3f0def1b\scripts\plugin-eval.js explain-budget plugins/harness-workflow --format markdown
git status --short
```

Optional commands after benchmark setup:

```text
node C:\Users\shash\.codex\plugins\cache\openai-curated\plugin-eval\3f0def1b\scripts\plugin-eval.js init-benchmark plugins/harness-workflow
node C:\Users\shash\.codex\plugins\cache\openai-curated\plugin-eval\3f0def1b\scripts\plugin-eval.js benchmark plugins/harness-workflow --dry-run
```

Fallback evidence: none currently needed. The core checks are local and runnable.

Final integration claim: the packaged `harness-workflow` plugin is structurally consistent across Codex, Claude Code, and Cursor surfaces, and Plugin Eval no longer reports avoidable manifest/package failures.

## Work Items

| ID | Status | Scope | Primary checks |
| --- | --- | --- | --- |
| P0 | done | Write this plan from Plugin Eval evidence | plan exists in `docs/plans/` |
| P1 | next | Repair `brainstorm` drift and regenerate mirrored plugin surfaces if needed | `check-plugin`, `check-cursor-install` |
| P2 | pending | Add missing Codex manifest metadata and legal docs if needed | Plugin Eval manifest checks, `check-plugin` |
| P3 | pending | Rewrite skill descriptions into strong trigger sentences | Plugin Eval skill description warnings |
| P4 | pending | Slim high-cost `SKILL.md` files without changing method semantics | Plugin Eval budget, contract checks |
| P5 | pending | Address Python helper warnings with minimal refactors/tests | Plugin Eval Python warnings, targeted helper checks |
| P6 | pending | Add benchmark starter scenarios and compare before/after | Plugin Eval benchmark dry-run/report |
| P7 | pending | Final review, verify, cleanup, and milestone commits | all required commands, clean relevant diff |

## Phase Details

### P1 - Repair Brainstorm Drift

Change scope:

- Remove accidental `plan` and `1` tokens from `skills/brainstorm/SKILL.md`.
- Sync canonical skill content to `plugins/harness-workflow/skills/brainstorm/SKILL.md`.
- Sync canonical skill content to `.cursor/skills/brainstorm/SKILL.md`, or run the Cursor adapter if that is the established update path.

Acceptance criteria:

- `skills/brainstorm/SKILL.md`, `plugins/harness-workflow/skills/brainstorm/SKILL.md`, and `.cursor/skills/brainstorm/SKILL.md` match.
- No unrelated dirty files are staged.
- No method semantics are changed beyond removing accidental text.

Verification commands:

```text
node scripts/check-plugin.mjs
node scripts/check-cursor-install.mjs
git diff -- skills/brainstorm/SKILL.md plugins/harness-workflow/skills/brainstorm/SKILL.md .cursor/skills/brainstorm/SKILL.md
```

Success definition: local package/Cursor drift failures disappear.

### P2 - Fix Manifest Metadata

Change scope:

- Add missing `author` to `.codex-plugin/plugin.json`.
- Add `interface.websiteURL`, `interface.privacyPolicyURL`, and `interface.termsOfServiceURL`.
- Mirror the manifest to `plugins/harness-workflow/.codex-plugin/plugin.json`.
- If no stable privacy or terms URL exists, add minimal static docs under `docs/legal/` and link to repository-relative GitHub URLs or documented public URLs.
- Keep `.claude-plugin/` and `.cursor-plugin/` versions aligned if any public metadata convention changes.

Acceptance criteria:

- Plugin Eval no longer reports:
  - `manifest-missing-author`
  - `interface-missing-websiteURL`
  - `interface-missing-privacyPolicyURL`
  - `interface-missing-termsOfServiceURL`
- `node scripts/check-plugin.mjs` still passes.

Verification commands:

```text
node scripts/check-plugin.mjs
node C:\Users\shash\.codex\plugins\cache\openai-curated\plugin-eval\3f0def1b\scripts\plugin-eval.js analyze plugins/harness-workflow --format markdown
```

Success definition: all avoidable Plugin Eval manifest failures are gone.

### P3 - Improve Trigger Descriptions

Change scope:

- Rewrite all active skill frontmatter descriptions to include clear English `Use when...` trigger language.
- Preserve Chinese explanations inside the body where useful.
- Keep descriptions concise enough not to increase trigger cost materially.
- Update packaged and Cursor mirrored skills consistently.

Acceptance criteria:

- Plugin Eval description-trigger warnings are reduced or eliminated.
- `name` still matches each skill directory.
- Each `SKILL.md` keeps YAML frontmatter and `## Recommended next skill`.

Verification commands:

```text
node scripts/check-plugin.mjs
node scripts/check-cursor-install.mjs
node C:\Users\shash\.codex\plugins\cache\openai-curated\plugin-eval\3f0def1b\scripts\plugin-eval.js analyze plugins/harness-workflow --format markdown
```

Success definition: trigger descriptions become clearer without breaking skill discovery or package mirrors.

### P4 - Reduce Token Budget

Change scope:

- Start with the largest invoke components:
  - `skills/harness-builder/SKILL.md` at about 5186 tokens.
  - `skills/plan/SKILL.md` at about 1846 tokens.
  - `skills/verify/SKILL.md` at about 1792 tokens.
  - `skills/find-skills/SKILL.md` at about 1666 tokens.
  - `skills/cleanup/SKILL.md` at about 1443 tokens.
- Keep each main `SKILL.md` focused on routing, mandatory gates, compact workflow, output contract, and references.
- Move detail into `references/` only when it is not needed at trigger or first-invoke time.
- Remove repeated global-method explanation if already covered by `docs/harness-method-contract.md`.

Acceptance criteria:

- `invoke_cost_tokens` decreases from the current 16496 estimate.
- `trigger_cost_tokens` does not increase from 564.
- Contract-critical phrases still pass `scripts/check-plugin.mjs`.
- Generated skill-flow HTML remains correct if `SKILL.md` structure changes.

Verification commands:

```text
node scripts/check-plugin.mjs
node scripts/generate-skill-flow-html.mjs
node scripts/check-plugin.mjs
node C:\Users\shash\.codex\plugins\cache\openai-curated\plugin-eval\3f0def1b\scripts\plugin-eval.js explain-budget plugins/harness-workflow --format markdown
node C:\Users\shash\.codex\plugins\cache\openai-curated\plugin-eval\3f0def1b\scripts\plugin-eval.js analyze plugins/harness-workflow --format markdown
```

Success definition: active budget is materially lower while method coverage checks still pass.

### P5 - Refactor Helper Script Warnings

Change scope:

- Inspect Plugin Eval Python warnings for packaged helper scripts.
- Prioritize high-complexity helpers such as `skills/harness-builder/scripts/scan_project.py` and `validate_harness.py`.
- Split complex functions into named helpers only where behavior stays obvious.
- Add minimal local tests or smoke commands if the repo has no Python test harness.

Acceptance criteria:

- Plugin Eval Python complexity and long-line warnings are reduced.
- Changed scripts still run in their intended local mode.
- No package manager or new framework is introduced unless required.

Verification commands:

```text
node C:\Users\shash\.codex\plugins\cache\openai-curated\plugin-eval\3f0def1b\scripts\plugin-eval.js analyze plugins/harness-workflow --format markdown
node scripts/check-plugin.mjs
```

Additional targeted commands should be chosen after reading each changed script.

Success definition: helper scripts are easier to inspect and still preserve current behavior.

### P6 - Add Benchmark Starter Scenarios

Change scope:

- Initialize `.plugin-eval/benchmark.json`.
- Add representative scenarios:
  - evaluate plugin health
  - fix a packaging drift
  - slim a skill without breaking contract checks
  - verify a ready claim
  - cleanup after a workflow change
- Keep benchmark data local and lightweight.

Acceptance criteria:

- Benchmark config exists and is documented.
- Dry-run succeeds.
- The plan records how to collect observed usage later.

Verification commands:

```text
node C:\Users\shash\.codex\plugins\cache\openai-curated\plugin-eval\3f0def1b\scripts\plugin-eval.js init-benchmark plugins/harness-workflow
node C:\Users\shash\.codex\plugins\cache\openai-curated\plugin-eval\3f0def1b\scripts\plugin-eval.js benchmark plugins/harness-workflow --dry-run
```

Success definition: future Plugin Eval reports can be checked against real scenario coverage, not static structure alone.

### P7 - Final Review, Verify, Cleanup

Change scope:

- Run structural review against changed manifests, skills, mirrors, scripts, docs, and generated files.
- Run fresh verification commands.
- Reconcile README or install docs only if user-visible metadata or commands changed.
- Keep `AGENTS.md` thin; do not write session state there.

Acceptance criteria:

- No Critical review findings.
- All required checks pass or have a clear blocker.
- Plugin Eval report shows improvements against the baseline.
- `git status --short` separates intentional optimization changes from pre-existing unrelated files.

Verification commands:

```text
node scripts/check-plugin.mjs
node scripts/check-claude-code-install.mjs
node scripts/check-cursor-install.mjs
node scripts/install-cursor.mjs --target . --dry-run
node C:\Users\shash\.codex\plugins\cache\openai-curated\plugin-eval\3f0def1b\scripts\plugin-eval.js analyze plugins/harness-workflow --format markdown
node C:\Users\shash\.codex\plugins\cache\openai-curated\plugin-eval\3f0def1b\scripts\plugin-eval.js explain-budget plugins/harness-workflow --format markdown
git status --short
```

Success definition: the plugin is ready for a milestone commit or follow-up PR with fresh evidence.

## Commit Units

| Commit unit | Scope | Includes phases | Pre-commit conditions | Suggested Chinese message |
| --- | --- | --- | --- | --- |
| CU1 | Restore package consistency | P1 | review no Critical + verify PASS | `修复 brainstorm skill 同步漂移` |
| CU2 | Manifest metadata | P2 | review no Critical + verify PASS | `补齐 Codex 插件元数据` |
| CU3 | Trigger descriptions | P3 | review no Critical + verify PASS | `优化 workflow skill 触发描述` |
| CU4 | Token slimming | P4 | review no Critical + verify PASS | `精简 workflow skill 主入口` |
| CU5 | Helper script quality | P5 | review no Critical + verify PASS | `降低 harness-builder 脚本复杂度` |
| CU6 | Plugin Eval benchmark | P6 | review no Critical + verify PASS | `添加插件评估基准场景` |
| CU7 | Final cleanup | P7 | verify PASS | `同步插件优化收尾文档` |

## Risks And Decisions

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Token slimming accidentally removes method guardrails | Agents may skip required gates | Keep `docs/harness-method-contract.md` as invariant source and run `check-plugin` after each slice |
| Mirrored surfaces drift again | Codex/Cursor package checks fail | Update canonical skills first, then sync mirrors in the same commit unit |
| Plugin Eval score remains low after manifest fixes | Static evaluator may still penalize budget | Add benchmark and observed usage path before over-optimizing copy |
| Legal URL metadata is unclear | Manifest fix may use unstable URLs | Prefer stable repository docs or public GitHub URLs |
| Existing dirty files obscure review | Accidental unrelated staging | Use `git diff -- <paths>` and stage only files in the current commit unit |

## Handoff

Next skill: `implement`

Reason: the first active slice is narrow, local, and has runnable verification: repair `brainstorm` drift and package mirrors.

Do not begin P2 until P1 has fresh verification evidence. Do not begin broad token slimming until manifest failures and package drift are resolved.
