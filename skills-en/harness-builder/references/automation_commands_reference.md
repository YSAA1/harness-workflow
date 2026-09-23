# Commands and CI
Prefer reusing commands already available in the project; confirm each command's shell, cwd, environment, inputs/outputs and exit code. Do not wrap another script layer just to unify names.
Recommend CI/headless automation only when a repeated-execution need is explicit, stating side effects, cost and how it will be verified. A one-off command is not authorization for standing automation.
Do not commit, push, install or create scheduled tasks by default. Platform configuration follows the current host tool and official documentation.
