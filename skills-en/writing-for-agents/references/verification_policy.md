# Verification entry
Prefer reusing real check commands that already exist and fit the target platform. Generate a script only when a unified entry is genuinely needed; on Windows, PowerShell, Python, or Node may be used — Bash is not mandatory.
Checks must actually execute the target behavior and propagate failure exit codes; merely echoing a plan cannot prove success. Long scripts and keywords are review signals, not automatic failures.
Structure/syntax checks only prove structure; behavioral claims need matching runtime evidence. Fresh evidence may be reused until the relevant code, environment, or input changes.
Check the corresponding .harness artifacts only when the harness backend is chosen; existing backends are not failed against a fixed directory list.
