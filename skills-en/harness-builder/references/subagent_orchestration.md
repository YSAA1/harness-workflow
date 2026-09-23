# Subagent orchestration
Independent, well-bounded investigations or reviews may run in parallel when they add value and the tools are available. State the task, inputs, outputs, permissions and integration responsibility; reviews are read-only by default.
Do not force per-file subagents, hard-code model families, or dismiss all verifiable work because a tool is unavailable. Independent reviews explicitly required by the project must still be completed or flagged as a gap.
A single delegation does not require generating persistent subagent configurations or manifests; record them only when the user asks for reusable configuration.
The main agent integrates conclusions, protects the shared work tree, and avoids multiple agents editing the same file at the same time.
Subagent parallelism suits research and review-type read-only tasks; for tightly coupled editing, isolate working directories with git worktrees instead of having multiple agents write to the same tree.
Persistent parallel lanes can use cli-delegate's `--worktree-name` (run/resume continues the same lane); when it is not installed, fall back to plain git worktrees.
