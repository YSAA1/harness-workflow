# Hooks
Recommend a hook only when a repeated, well-defined, and mechanically verifiable behavior is worth automating. The existence of a file or the choice of a language does not by itself mean a hook is needed.
Reuse existing formatters/CI; avoid triggering a full lint/typecheck on every edit or automatically modifying unrelated files. Be explicit about the match scope, runtime, failure behavior, how to disable it, and the minimal probe.
Example hooks are not a security boundary. Lockfiles may be updated normally by the package manager; credential configuration follows host permissions and user authorization, and is not mechanically blocked from all writes.
Do not install by default; verify the event schema across runtimes.
