# Install policy
First inspect the actual target runtime, canonical source, installed capabilities and user scope; do not install the full template set or a fixed eight-file bundle by default.
Repairing local files within the authorized scope may proceed directly; installing/enabling external capabilities requires prior matching authorization. Required is a recommendation level, not a permission. Read-only advice stays read-only; only new scope, material trade-offs or irreversible actions need a USER CHECKPOINT.
Update the canonical source with a minimal verifiable diff; when installation instructions are affected, sync `README.md` and `docs/install.md`. Before installing, prepare reviewable content and a recovery path, and preserve unrelated user changes.
Select only the necessary templates. Hooks, MCP and subagent definitions are not installed by default and must be verified against the target platform and the project contracts.
If the source is a remote directory and the current changes are not yet published, use a local install path supported by the target runtime; never claim that re-pulling the remote includes the local changes.
