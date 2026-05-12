#!/usr/bin/env python3
import json
import re
import sys

payload = json.load(sys.stdin)
tool_input = payload.get("tool_input") or {}
text = json.dumps(tool_input, ensure_ascii=False)

blocked_patterns = [
    r"\brm\s+-rf\b",
    r"\bgit\s+reset\s+--hard\b",
    r"\bgit\s+clean\s+-fdx\b",
    r"\bchmod\s+-R\b",
    r"\bchown\s+-R\b",
    r"(^|/)data/raw/",
    r"(^|/)checkpoints/",
    r"(^|/)runs/",
    r"(^|/)outputs/",
    r"(^|/)\.env(\.|$)?",
    r"BEGIN OPENSSH PRIVATE KEY",
    r"BEGIN RSA PRIVATE KEY",
    r"OPENAI_API_KEY",
    r"AWS_SECRET_ACCESS_KEY",
]

for pattern in blocked_patterns:
    if re.search(pattern, text, flags=re.IGNORECASE):
        print(json.dumps({
            "hookSpecificOutput": {
                "hookEventName": "PreToolUse",
                "permissionDecision": "deny",
                "permissionDecisionReason": f"Blocked by project safety policy: {pattern}"
            }
        }))
        sys.exit(0)

sys.exit(0)
