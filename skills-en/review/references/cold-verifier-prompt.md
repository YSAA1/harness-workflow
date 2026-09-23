# Optional cold evidence review
For important or disputed completion claims. Give the reviewer the goal, the acceptance criteria, the version/relevant diffs, the actual commands and outputs, the configuration/inputs, and the artifact locations.
The reviewer may inspect the relevant code, tests, and artifacts read-only to judge whether the evidence truly covers the goal. The author's explanation is a clue, not a verification result.
Return confirmed / disputed / insufficient, pointing out specifically what the evidence covers, the gaps, and the necessary follow-up checks. A second re-run of already-valid tests is not required, nor is a different model family forced.
Cold review is not a mandatory second subagent for every medium-to-high-risk task; if the project explicitly requires independent sign-off, honor that contract and honestly report the gap.
