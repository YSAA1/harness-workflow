# Third Party Notices

## Anthropic Claude Plugins Official

Portions of these helper skills are adapted from Anthropic's official Claude plugin examples:

- `skills/capability-recommender`, adapted from `claude-code-setup/skills/claude-automation-recommender`
- `skills/writing-for-agents/references/instructions-maintenance.md`, in part adapted from `claude-md-management/skills/claude-md-improver`

The source project is licensed under the Apache License 2.0. Local copies have been modified for harness-workflow.

See `licenses/Apache-2.0-Anthropic-Claude-Plugins.txt`.

## mattpocock/skills

- `skills/writing-for-agents` core writing reference and skill mechanics adapted from `mattpocock/skills` `writing-for-agents`; the English body in `references/writing-core.md` and `references/skill-mechanics.md` is kept verbatim from upstream revision `f054def`（2026-07-31）.
- `skills/tdd` and the test-driven rules in `skills/implement` distilled from `mattpocock/skills` `tdd`/`implement` (seams, red-green loop, tests and mocking guidance).
- Revision `b0618bc` (2026-10-08) adaptations, rewritten in our own words unless noted: `skills/diagnose` feedback-loop gate, minimisation, falsifiable hypotheses, tagged instrumentation and regression-test discipline, plus `references/feedback-loops.md`, from `diagnosing-bugs`; `skills/review` standards-source search and `references/smell-baseline.md` (Fowler smell list and its two binding rules) from `code-review`; `skills/ship` parallel mode and the `skills/plan` task-graph slicing rules (vertical slices, expand–contract) from `implement-spec` and `to-tickets`; the environment-improvement step in `skills/cleanup` from `retro`; the "yes accepts the recommendation" wording in `skills/brainstorm` from `grilling`; the scope bar and `docs/out-of-scope/` practice from the repository's `SCOPE.md` and `.out-of-scope/`; smaller wording adoptions in `implement` (restate a passed reference), `tdd` (catches/misses per seam), `handoff` (temp-dir resolution order), `review` (parallel foreground axes), and context pointers in `ship`/`autoresearch` (from `implement-spec`/`chief-of-staff`). All of the above apply equally to the English mirror under `skills-en/`.

The source project is licensed under the MIT License: https://github.com/mattpocock/skills

## code-yeongyu/oh-my-openagent

- `skills/remove-deadcode-py` 的协议思路（证据定罪、动态访问守卫、分批原子删除）受 `oh-my-openagent` 的 `remove-deadcode` skill 启发。
- 未包含任何上游文本或代码；所借鉴的方法本身亦是行业通用实践（见 vulture/knip 官方文档）。
- The source project uses the Sustainable Use License (non-open-source): https://github.com/code-yeongyu/oh-my-openagent — inspiration only, no content incorporated.
