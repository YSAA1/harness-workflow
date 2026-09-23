---
name: research
description: "Lightweight single-shot research: a background agent does the legwork and reads primary sources, filing the findings with per-item citations into a single markdown file. Fits one-off lookups (doc/API facts, topic scoping, research errands); for open questions that need multi-round hypothesis verification, use autoresearch. Triggers: research (调研, 查证, 帮我查资料, 一次性调研)."
---

# Single-shot Research

One question per research run: background legwork, primary sources, artifact written to disk. No round loops, no adversarial hypothesis testing — that is `autoresearch`'s job.

## Workflow

1. Shape the user's request into one deliverable research question and confirm where the artifact lands: default `docs/research/YYYY-MM-DD--<topic>.md` (same directory and naming as autoresearch's no-recovery-surface logs); if the project already has a research-notes convention, follow it and state the landing spot.
2. Dispatch a background agent for the legwork (subagent or read-only delegation such as cli-delegate; if none is available, do it directly in this session): trace every finding back to **primary sources** (official docs, source code, specs, first-party APIs); do not trust second-hand retellings; record the source and retrieval time for each finding.
3. Main-session adjudication: delegated results are claims; verify key facts against their sources back in the main session before writing them to disk; findings that do not match their sources are honestly flagged as uncertain.
4. Write a single markdown file with an attribution line in the document header (`Research: <one-sentence question> | date | session/track`) — that line is its self-registration: when sweep finds zero references to it, it is treated as a self-contained deliverable and routed to human adjudication instead of auto-deletion; when a recovery surface exists, link it out from the Evidence line of this track's state.

## Boundaries

- One question, one answer; if the research surfaces an open question that needs multi-round verification → after user confirmation, route to `autoresearch` as a separate track.
- Read-only evidence gathering, no code changes; findings that need to land as changes → `plan` / `implement`.
- No task close-out (that belongs to `cleanup`).

## Recommended next skill

- Findings turn into changes: `plan`; when the scope is already clear, go straight to `implement`.
- The question escalates into open research: `autoresearch`.
- End: delivering the research document completes the run.
