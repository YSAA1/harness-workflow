# Simplify Workflow Skill Boundaries

We decided to make workflow skills independent instead of routing everything through `state-contract`, three-file state, or a fixed `brainstorm -> plan -> bootstrap` sequence. `bootstrap` will become **Harness Builder**; `state-contract`, `resume`, and `save-session` will be removed as exposed skills, with their durable ideas migrated into Harness Builder recovery policy and Cleanup knowledge hygiene.

**Considered Options**

- Keep `state-contract`, `resume`, and `save-session` as independent skills.
- Rename `bootstrap` in prose only while keeping the old skill identity.
- Remove the extra workflow lanes and make state/recovery a project harness concern.

**Consequences**

- `brainstorm` produces a spec, not workflow state.
- `plan` produces an executable plan, not three files by default.
- `cleanup` focuses on preventing documentation and project knowledge rot.
- Three-file state remains a possible recovery backend, but not the conceptual dependency of every skill.
