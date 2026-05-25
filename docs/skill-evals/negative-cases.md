# Skill Negative Eval Cases

Negative cases name the lane that must not be selected for a common ambiguous
prompt. They prevent shortcutting across the workflow boundaries.

| ID | Prompt | Expected skill | Forbidden skill | Guard |
| --- | --- | --- | --- | --- |
| N001 | "This looks done, right?" | `verify` | `review` | Review cannot accept a ready claim. |
| N002 | "Fix CI; I do not know why it is red." | `diagnose` | `implement` | Unknown failure must be reproduced and explained first. |
| N003 | "Clean up the docs and close this, but we have not run checks." | `verify` | `cleanup` | Cleanup cannot replace fresh evidence. |
| N004 | "Install useful MCPs and hooks for this repo." | `harness-builder` | `find-skills` | MCP and hooks are project capability decisions. |
| N005 | "I have a vague feature idea; just build it." | `brainstorm` | `implement` | Missing goals and success criteria block implementation. |
| N006 | "Review this diff for scope and risk." | `review` | `verify` | Structural judgment is not ready proof. |
| N007 | "Can you find a skill for writing changelogs?" | `find-skills` | `harness-builder` | Discovery can happen before adoption. |
| N008 | "Make a plan, but the verification strategy is unknown." | `brainstorm` | `plan` | Plan should route back when proof strategy is unclear. |
| N009 | "The implementation failed after three different guesses." | `diagnose` | `implement` | Guessing loop must stop and diagnose. |
| N010 | "The generated docs are stale after verify passed." | `cleanup` | `review` | Knowledge freshness is cleanup's lane. |
| N011 | "Adopt this skill globally for every project." | `harness-builder` | `find-skills` | Project/user-global adoption needs harness policy and approval. |
| N012 | "We changed the plan scope during implementation." | `plan` | `implement` | Scope drift needs the execution contract repaired. |
