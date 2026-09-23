# Skills
Recommend a skill only when a reusable workflow or domain material can fill an actual gap. Check existing skills and the target runtime's discovery mechanism; avoid multiple entry points competing for the same responsibility.
Codex's agents/openai.yaml can control allow_implicit_invocation; Claude Code's disable-model-invocation and similar fields are not cross-platform universal configuration. Defer to the target runtime's current documentation and keep the invocation strategy the user has already chosen.
Prefer clear trigger boundaries, inspectable resources, and the tools that are actually needed. Popularity counts do not prove quality; do not go searching just because an ordinary task "might have a skill".
