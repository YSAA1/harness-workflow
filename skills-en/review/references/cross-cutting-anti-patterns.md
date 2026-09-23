# Cross-cutting anti-patterns
- Treating the current implementation/logs as the permission or goal contract: facts can only prove the status quo; they cannot authorize actions or rewrite requirements.
- Duplicate gates: review already covers structure and evidence review, and verify is only an alias; do not serially run another protocol.
- Premature completion: passing local checks cannot replace required overall acceptance; unknown does not count as pass.
- Duplicate verification: reuse checks that still apply; do not re-run because the skill changed or a commit happened.
- Authority drift: each lane keeps a single execution entry point; independent lanes are not a conflict.
- Over-cleaning: fix only the drift caused by this task; do not delete files of unknown ownership or files needed for acceptance.
- Instruction maintenance: narrow AGENTS/CLAUDE/rules or recovery-surface repairs go through writing-for-agents, syncing existing recovery entry points when necessary; do not default to a full workbench overhaul.
