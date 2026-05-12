# migrations/AGENTS.md

Database migrations are high risk.

Before editing:
- read database rules;
- identify backward compatibility impact;
- add or update migration tests when available.

Do not:
- rewrite existing applied migrations;
- run destructive migrations;
- change production database configuration without explicit approval.
