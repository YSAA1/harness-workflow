# MCP
First confirm that the current tools/connectors cannot meet the specific service-access or documentation need, then consider adding an MCP. A library name or a database dependency only provides a lead for investigation.
Verify official sources, platform/transport compatibility, permission and credential acquisition, maintenance cost, existing overlapping capabilities, and a minimal read-only probe.
Codex, Claude Code, and Cursor have different configuration surfaces; do not treat .mcp.json or claude commands as a universal standard. Strip secrets before sharing configuration; do not commit credentials or enable write permissions by default.
Current commands and product availability are determined by official documentation and the local tooling, not by a fixed product catalog.
