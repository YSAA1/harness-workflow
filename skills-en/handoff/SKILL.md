---
name: handoff
description: "Compact the current session into a handoff document so a brand-new session or another agent can take over losslessly. Use when the session is ending but the work is unfinished, when switching sessions/agents to continue, or when assigning a directed task to the next session. Triggers: handoff (交接, 会话交接, 换会话, 移交)."
disable-model-invocation: true
argument-hint: "What will the next session be used for?"
---

# Session Handoff

Write a handoff artifact so a new agent with zero context can keep going. Handoff is an explicit action: do not hand off on your own initiative unless the user asks.

## Workflow

1. If the user passed an argument, tailor the handoff to it (the next session's focus); if not, write from the natural continuation point of the current work.
2. Layered landing spots:
   - Project has a recovery surface: write the continuation point into the Next line of this track's state first, and key status and evidence into the Evidence line (durable, recoverable); attach a full handoff document only when complete context is truly needed.
   - No recovery surface: write the handoff document to the OS temp directory (kept out of the repo to avoid creating orphan files) and tell the user the path explicitly.
3. Content discipline:
   - Include a "Suggested skills" section: which skills the next agent should invoke, called out by name.
   - Do not restate existing artifacts (Spec/plan/ADR/issue/commit/diff) — referencing their paths is enough.
   - Sanitize: secrets, passcodes, and personally identifiable information are never written.
4. Deliver: tell the user where the handoff artifact is and how the next session should use it (with a recovery surface, read via the session entry; without one, feed the document to the new session as its opening).

## Recommended next skill

- New session: with a recovery surface, resume via the `AGENTS.md` session entry; without one, open with the handoff document.
- The handoff exposes a workbench gap: `harness-builder`.
