# Subagent Orchestration

Subagents are optional gap reducers. They should not be spawned just because they are available.

Core rule: subagents read, research, or review. The main agent writes harness files.

Use solo mode for small repos. Use parallel_readonly for legacy/large/ML/RL/data projects with unclear verification or protected paths. Use review_before_install for production-sensitive projects, old projects, or installing hooks/MCP/subagents.

For every proposed subagent, state the gap it reduces, input, expected output, why main agent should not do it alone, and whether it is read-only.
