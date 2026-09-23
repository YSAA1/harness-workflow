# Cleanup scope
Clean up only scratch created by this task that no longer serves a purpose. Untracked, unlinked, or containing "temp" in the name — none of these alone proves deletable.
Same for code leftovers: dead code, unused imports/dependencies, and orphan scripts require reference evidence before deletion; after deleting, run targeted checks to confirm behavior is unchanged.
Keep experiment acceptance, reproduction, source, and recovery artifacts; when ownership is unknown, keep first and explain.
Fix the command, interface, or state documentation affected this time. Zero modification is fine when there is no drift; a blocked handoff must accurately preserve the failure and the next steps, without waiting for ready.
Historical cleanup beyond this task is recorded as a follow-up item and not executed automatically; when the user explicitly requests repo-wide Python dead-code cleanup, route to `remove-deadcode-py`; repo-wide reconciliation/inventory routes to `sweep`.
