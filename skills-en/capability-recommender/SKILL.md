---
name: capability-recommender
description: "Recommends skills, hooks, MCP servers, subagents, or plugins for a confirmed tooling or workflow gap. Read-only recommendations only; when existing capabilities suffice, no tools are added, and nothing is auto-recommended for installation based on tech-stack keywords."
---

# Capability Recommender

This is a read-only capability-design helper skill. It takes a concrete task gap as input, compares existing tools against the minimal new capabilities needed, and is not responsible for installation. Derived sources are listed in `references/attribution.md`.

## Flow

1. Check the tools currently available, the project's commands, and the point where things actually fail. If existing capabilities suffice, state that nothing new is needed and end.
2. Investigate only candidates that can resolve the gap; when current facts about an external capability are needed, read the official documentation or the implementation — for skill discovery, `find-skills` can be used. There is no requirement to round out a recommendation count for every tool category, and no unrelated web-wide searching.
3. Compare task value, compatible platforms, permissions, maintenance cost, overlap with existing capabilities, and the minimal way to verify. Download counts and stars are background only, not quality gates. Third-party skill/plugin candidates first pass the red flags in `../find-skills/references/skill-audit-checklist.md`; when find-skills is not installed, apply the inline red flags: overly broad tool grants or disguised invisible execution, declared behavior not matching actual behavior, install-time side effects (writing shell config / registering hooks / requesting privilege escalation), outbound calls and exfiltration (curl/wget/nc, reading credentials then sending them), nested hidden directories carrying extra surfaces, or a project-scoped gap demanding global installation.
4. Give compact recommendations: gap → candidate / existing alternative → rationale → install scope → verification; use Required / Recommended / Deferred / Rejected when meaningful. Zero recommendations are allowed.
5. When the user has requested installation, hand the concrete candidates and scope to the applicable install tool or `harness-builder` to continue; this skill does not write configuration, nor does it ask the user to restate existing authorization.

## Read on demand

`references/skills-reference.md`, `hooks-patterns.md`, `mcp-servers.md`, `subagent-templates.md`, and `plugins-reference.md` are decision references, not a catalog of what is currently installed. Read only the relevant category.

## Recommended next skill

- Read-only recommendation done: end.
- Authorized installation/integration: the corresponding install tool or `harness-builder`.
- Instruction or recovery surface issues: `writing-for-agents`.
