# Subagents
Delegate only work with clear boundaries that can advance independently and that saves time or improves review quality. Provide as input the goal, relevant files/evidence, permissions, and the expected result; independent review is read-only by default.
The model follows the user's or host's configuration; do not hard-code sonnet or a specific model family. File count is not a threshold for enabling subagents; ordinary tasks need no multi-agent setup.
When subagent tooling is missing, continue with the tasks that can be completed independently, and state honestly how independent the review is. Contracts where the project explicitly requires independent review must still be met.
Persistent configuration is created only when the user needs to reuse the automation; do not write project configuration for a one-off delegation.
