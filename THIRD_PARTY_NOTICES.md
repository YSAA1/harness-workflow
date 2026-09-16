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

The source project is licensed under the MIT License: https://github.com/mattpocock/skills

## code-yeongyu/oh-my-openagent

- `skills/remove-deadcode-py` 的协议思路（证据定罪、动态访问守卫、分批原子删除）受 `oh-my-openagent` 的 `remove-deadcode` skill 启发。
- 未包含任何上游文本或代码；所借鉴的方法本身亦是行业通用实践（见 vulture/knip 官方文档）。
- The source project uses the Sustainable Use License (non-open-source): https://github.com/code-yeongyu/oh-my-openagent — inspiration only, no content incorporated.
