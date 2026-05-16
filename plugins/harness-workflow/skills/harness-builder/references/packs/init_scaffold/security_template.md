# SECURITY.md Template

Use for `docs/SECURITY.md` only when the Static docs row selects security documentation because the repo has auth, secrets, sensitive data, production deployment, or external access.

## Exclusion rules

`docs/SECURITY.md` must not contain:

- actual secret values, API keys, or tokens;
- specific environment variable names used for secrets;
- internal infrastructure details such as IP addresses, internal hostnames, or ports;
- known unpatched vulnerability details;
- exact file paths where credentials are stored.

Use generic descriptions such as "database credentials are loaded from environment variables".
