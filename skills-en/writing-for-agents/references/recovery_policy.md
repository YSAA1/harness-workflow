# Recovery policy
At startup, read the entries and recovery state relevant to the current task, then check the necessary git/runtime facts. When state is missing, establish the current scope from an explicit user request; no need to halt over the absence of an active row.
Locate the authoritative record per task/track and keep other active tasks. Do not close other tasks on a repo-wide WIP=1 basis.
State is updated on phase progress, major decisions, blockers, or hand-offs; evidence stores references to actual commands and results, and a disk write per tool operation is not required.
Use the .harness work_index/state/lessons structure only when the harness backend is chosen (the minimal surface for a new task is created inline by `plan`); other backends reuse existing field positions.
Old logs may correct old state but must not override the user's current goal or permission boundaries.
