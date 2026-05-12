# Subagent Orchestration

Subagents are optional gap reducers. They should not be spawned just because they are available.

## Core rule

Subagents read, research, or review. The main agent writes harness files.

This avoids conflicting edits to governance files.

## Orchestration modes

### solo

Use when:
- new/small project;
- few files;
- user wants minimal overhead;
- no subagent tool is available.

### parallel_readonly

Use when:
- existing or legacy project;
- many files;
- ML/RL/robotics/data project;
- hidden rules likely exist;
- verification commands are unknown;
- protected paths are unclear.

Recommended scouts:
- `repo_scout`
- `verification_scout`
- `risk_scout`
- `skill_scout`

### parallel_research

Use when:
- current external facts matter;
- user referenced docs/articles/repos;
- Codex/Claude/MCP/hook syntax may have changed;
- public skills should be searched.

Recommended scouts:
- `research_scout`
- `skill_scout`

### review_before_install

Use when:
- production-sensitive project;
- old project;
- installing hooks/MCP/subagents;
- Harness Plan may be over-engineered.

Recommended reviewer:
- `harness_plan_reviewer`
- plus domain reviewer if needed.

## Spawn decision

For every proposed subagent, state:

- gap it reduces;
- input it should inspect;
- expected output;
- why the main agent should not do it alone;
- whether it is read-only.

## Standard subagent output

Ask subagents to return:

```markdown
# Findings

# Evidence

# Risks

# Recommended harness components

# Rejected options

# Confidence
```

## Do not spawn when

- task is small and local;
- user explicitly asks to minimize cost/tokens;
- no clear information gap exists;
- subagent would duplicate the main agent's work;
- parallel writing would be required.
