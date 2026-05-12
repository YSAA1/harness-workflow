---
name: data-leakage-audit
description: Audit ML data splits, labels, features, preprocessing, and evaluation for leakage. Use whenever the user changes dataset construction, labels, time windows, train/validation/test split, feature engineering, preprocessing, metrics, or evaluation code, even if they do not explicitly mention leakage.
---

# Data Leakage Audit

Check for invalid evaluation caused by future information, label-derived features, preprocessing leakage, or test-set contamination.

## Review checklist

1. Time leakage
   - future data used in features;
   - random split used where time split is required;
   - target window overlaps feature window.

2. Label leakage
   - label-derived columns in features;
   - post-outcome signals;
   - IDs that encode target.

3. Preprocessing leakage
   - scaler/encoder fit on full dataset;
   - imputation using global statistics;
   - feature selection before split.

4. Evaluation leakage
   - test set used for model selection;
   - early stopping on test set;
   - duplicated entities across train/test.

## Output

Report:

- risk;
- severity;
- affected files/functions;
- evidence;
- minimal fix;
- test to add.
