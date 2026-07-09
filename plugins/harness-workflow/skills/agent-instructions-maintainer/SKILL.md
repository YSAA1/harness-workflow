---
name: agent-instructions-maintainer
description: "Use when durable agent instructions need audit or repair only: AGENTS.md, CLAUDE.md, .claude.md, .claude.local.md, canonical rules/*.mdc, or Cursor rule mirrors. For cross-surface workbench bootstrap or repair, use harness-builder."
tools: Read, Glob, Grep, Bash, Edit
---

# Agent Instructions Maintainer

Adapted from Anthropic official `claude-md-improver`. The main discovery, quality assessment, reporting, and targeted update workflow below are copied from the official skill, with harness-workflow notes added for `AGENTS.md`, `CLAUDE.md`, and Cursor rules.

Audit, evaluate, and improve durable agent instruction files across a codebase to ensure agents have optimal project context.

**This skill can write to durable agent instruction files.** After presenting a quality report and getting user approval, it updates CLAUDE.md, AGENTS.md, .claude.md, .claude.local.md, or Cursor rule files with targeted improvements.

## Harness Adaptation

- Apply the official CLAUDE.md quality model to `AGENTS.md`, `CLAUDE.md`, `.claude.md`, `.claude.local.md`, canonical `rules/*.mdc`, and generated `.cursor/rules/*.mdc` mirrors.
- Prefer the canonical project source when a generated mirror exists. In this repository, edit `rules/*.mdc` and regenerate/sync `.cursor/rules/*.mdc` instead of hand-editing the mirror.
- Keep durable instructions thin and stable; active task state belongs in the selected recovery surface.
- For recovery/state/progress/evidence surfaces, route to `recovery-surface-builder` instead of putting transient state in instructions.

## Workflow

### Phase 1: Discovery

Find all durable agent instruction files in the repository:

```bash
find . \( -name "CLAUDE.md" -o -name "AGENTS.md" -o -name ".claude.md" -o -name ".claude.local.md" -o -path "*/rules/*.mdc" -o -path "*/.cursor/rules/*.mdc" \) 2>/dev/null | head -50
```

**File Types & Locations:**

| Type | Location | Purpose |
|------|----------|---------|
| Codex root | `./AGENTS.md` | Primary project context for Codex-style agents (checked into git, shared with team) |
| Claude Code root | `./CLAUDE.md` | Primary project context for Claude Code (checked into git, shared with team) |
| Local overrides | `./.claude.local.md` | Personal/local settings (gitignored, not shared) |
| Global defaults | `~/.claude/CLAUDE.md` | User-wide defaults across all projects |
| Package-specific | `./packages/*/CLAUDE.md` | Module-level context in monorepos |
| Cursor canonical rules | `./rules/*.mdc` | Source rules that should be synced to Cursor preview surfaces |
| Cursor generated rules | `./.cursor/rules/*.mdc` | Generated or adapter-synced Cursor rules; patch the canonical source when one exists |
| Subdirectory | Any nested location | Feature/domain-specific context |

**Note:** Runtime discovery differs. Claude Code auto-discovers `CLAUDE.md`; Codex reads `AGENTS.md`; Cursor consumes `.cursor/rules/*.mdc` after adapter sync.

### Phase 2: Quality Assessment

For each durable instruction file, evaluate against quality criteria. See [references/quality-criteria.md](references/quality-criteria.md) for detailed rubrics.

**Quick Assessment Checklist:**

| Criterion | Weight | Check |
|-----------|--------|-------|
| Commands/workflows documented | High | Are build/test/deploy commands present? |
| Architecture clarity | High | Can an agent understand the codebase structure? |
| Non-obvious patterns | Medium | Are gotchas and quirks documented? |
| Conciseness | Medium | No verbose explanations or obvious info? |
| Currency | High | Does it reflect current codebase state? |
| Actionability | High | Are instructions executable, not vague? |

**Quality Scores:**
- **A (90-100)**: Comprehensive, current, actionable
- **B (70-89)**: Good coverage, minor gaps
- **C (50-69)**: Basic info, missing key sections
- **D (30-49)**: Sparse or outdated
- **F (0-29)**: Missing or severely outdated

### Phase 3: Quality Report Output

**ALWAYS output the quality report BEFORE making any updates.**

Format:

```
## Agent Instructions Quality Report

### Summary
- Files found: X
- Average score: X/100
- Files needing update: X

### File-by-File Assessment

#### 1. ./AGENTS.md (Project Root)
**Score: XX/100 (Grade: X)**

| Criterion | Score | Notes |
|-----------|-------|-------|
| Commands/workflows | X/20 | ... |
| Architecture clarity | X/20 | ... |
| Non-obvious patterns | X/15 | ... |
| Conciseness | X/15 | ... |
| Currency | X/15 | ... |
| Actionability | X/15 | ... |

**Issues:**
- [List specific problems]

**Recommended additions:**
- [List what should be added]

#### 2. ./packages/api/CLAUDE.md (Package-specific)
...
```

### Phase 4: Targeted Updates

After outputting the quality report, ask user for confirmation before updating.

**Update Guidelines (Critical):**

1. **Propose targeted additions only** - Focus on genuinely useful info:
   - Commands or workflows discovered during analysis
   - Gotchas or non-obvious patterns found in code
   - Package relationships that weren't clear
   - Testing approaches that work
   - Configuration quirks

2. **Keep it minimal** - Avoid:
   - Restating what's obvious from the code
   - Generic best practices already covered
   - One-off fixes unlikely to recur
   - Verbose explanations when a one-liner suffices

3. **Show diffs** - For each change, show:
   - Which durable instruction file to update
   - The specific addition (as a diff or quoted block)
   - Brief explanation of why this helps future sessions

**Diff Format:**

```markdown
### Update: ./AGENTS.md

**Why:** Build command was missing, causing confusion about how to run the project.

```diff
+ ## Quick Start
+
+ ```bash
+ npm install
+ npm run dev  # Start development server on port 3000
+ ```
```
```

### Phase 5: Apply Updates

After user approval, apply changes using the Edit tool. Preserve existing content structure.

## Templates

See [references/templates.md](references/templates.md) for durable instruction templates by project type.

## Common Issues to Flag

1. **Stale commands**: Build commands that no longer work
2. **Missing dependencies**: Required tools not mentioned
3. **Outdated architecture**: File structure that's changed
4. **Missing environment setup**: Required env vars or config
5. **Broken test commands**: Test scripts that have changed
6. **Undocumented gotchas**: Non-obvious patterns not captured

## User Tips to Share

When presenting recommendations, remind users:

- **Runtime shortcuts vary**: Claude Code supports `#` for incorporating learnings into `CLAUDE.md`; other runtimes may require explicit edits.
- **Keep it concise**: durable instructions should be human-readable; dense is better than verbose
- **Actionable commands**: All documented commands should be copy-paste ready
- **Use `.claude.local.md`**: For personal preferences not shared with team (add to `.gitignore`)
- **Global defaults**: Put user-wide preferences in `~/.claude/CLAUDE.md`

## What Makes Great Agent Instructions

**Key principles:**
- Concise and human-readable
- Actionable commands that can be copy-pasted
- Project-specific patterns, not generic advice
- Non-obvious gotchas and warnings

**Recommended sections** (use only what's relevant):
- Commands (build, test, dev, lint)
- Architecture (directory structure)
- Key Files (entry points, config)
- Code Style (project conventions)
- Environment (required vars, setup)
- Testing (commands, patterns)
- Gotchas (quirks, common mistakes)
- Workflow (when to do what)

## Recommended next skill

- Use `harness-builder` when this audit is one row in a broader workbench recommendation (controller synthesizes the matrix).
- Use `recovery-surface-builder` if the audit finds missing or broken state/progress/evidence/recovery artifacts.
- Use `capability-recommender` if the audit implies a new skill, hook, MCP server, subagent, plugin, script, or automation surface.
- Use `implement` after the user approves the concrete instruction patch.
