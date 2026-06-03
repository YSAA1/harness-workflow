# Three-File Templates

These templates are canonical templates for the optional three-file recovery surface.

Source:

- Repository: `OthmanAdi/planning-with-files`
- Upstream path: `skills/planning-with-files-zh/templates`
- Imported: 2026-05-09
- License: MIT License, Copyright (c) 2026 Ahmad Adi

Local adaptation:

- `task_plan.md`, `progress.md`, and `findings.md` are English/default templates.
- `task_plan.zh-CN.md`, `progress.zh-CN.md`, and `findings.zh-CN.md` are Chinese templates.
- The task plan templates are adapted around active slice, commit units, verification commands, and success criteria.
- The progress templates are append-only evidence logs.
- The findings templates record accepted spec, rejected options, risks, references, and root cause.
- Upstream hooks, session catchup, attestation, and automation scripts are not included.

Responsibilities:

- `plan` uses these templates only when the selected planning surface is the three-file backend.
- Chinese users use the `*.zh-CN.md` templates; English or other non-Chinese users use the default templates and may translate human-facing labels as needed.
- `harness-builder` chooses or repairs the recovery surface; it does not maintain a second copy of these templates.
- Other skills update the selected recovery surface only when that surface requires it.
