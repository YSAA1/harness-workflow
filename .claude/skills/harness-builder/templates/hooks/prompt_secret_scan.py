#!/usr/bin/env python3
import json
import re
import sys

payload = json.load(sys.stdin)
text = json.dumps(payload, ensure_ascii=False)

secret_patterns = [
    r"sk-[A-Za-z0-9_\-]{20,}",
    r"OPENAI_API_KEY\s*=",
    r"AWS_SECRET_ACCESS_KEY\s*=",
    r"BEGIN OPENSSH PRIVATE KEY",
    r"BEGIN RSA PRIVATE KEY",
    r"ghp_[A-Za-z0-9_]{20,}",
    r"github_pat_[A-Za-z0-9_]{20,}",
]

for pattern in secret_patterns:
    if re.search(pattern, text):
        print(json.dumps({
            "decision": "block",
            "reason": f"Prompt appears to contain a possible secret: {pattern}"
        }))
        sys.exit(0)

sys.exit(0)
