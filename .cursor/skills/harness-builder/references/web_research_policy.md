# Web Research Policy

Use web research to update external facts, not to infer local project facts.

## Use web research for

- current Codex/Claude/Cursor configuration syntax;
- hooks, skills, subagents, MCP, plugin docs;
- official framework commands;
- user-requested repositories or articles;
- public skill examples;
- recently changed tools.

## Do not use web research for

- what files exist in the current repo;
- how current tests are configured;
- protected paths in this project;
- project-specific business rules.

## Source preference

1. Official docs
2. Primary repositories
3. Maintainer blog posts
4. High-quality community writeups
5. General blogs only for inspiration

## Recording

If research changes the harness plan, write a short note to `.harness/research_notes.md`:

- source;
- finding;
- adopted/rejected;
- reason.
