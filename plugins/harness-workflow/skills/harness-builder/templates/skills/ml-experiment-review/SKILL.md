---
name: ml-experiment-review
description: Review ML experiment changes for reproducibility, metric validity, config hygiene, tiny-run verification, and honest reporting. Use when the user creates or modifies training scripts, evaluation scripts, experiment configs, metrics, logging, model selection, or experiment reports.
---

# ML Experiment Review

Focus on whether an experiment can be reproduced, validated, and interpreted honestly.

## Check

- seed handling;
- config-driven hyperparameters;
- train/eval separation;
- metric definition;
- baseline comparison;
- tiny dry-run or smoke test;
- output directory hygiene;
- no claims from synthetic/tiny data;
- artifact naming and versioning.

## Output

- findings by severity;
- missing tests;
- suggested minimal fixes;
- whether the experiment is ready to run seriously.
