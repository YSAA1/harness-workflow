#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const [targetPathArg, targetKindArg] = process.argv.slice(2);
const targetKind = targetKindArg || process.env.PLUGIN_EVAL_TARGET_KIND || "unknown";
const targetPath = path.resolve(process.cwd(), targetPathArg || process.env.PLUGIN_EVAL_TARGET || ".");
const targetName = path.basename(targetPath);
const source = "metric-pack:harness-builder-recommendation";

const rel = (filePath) => path.relative(targetPath, filePath).replaceAll(path.sep, "/");
const readText = (filePath) => (fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "");
const listScenarioFiles = () => fs.readdirSync(path.join(__dirname, "scenarios"))
  .filter((name) => name.endsWith(".json"))
  .sort()
  .map((name) => path.join(__dirname, "scenarios", name));

const fileMap = {
  skill: path.join(targetPath, "SKILL.md"),
  guide: path.join(targetPath, "references", "automation_recommendation_guide.md"),
  install: path.join(targetPath, "references", "install_policy.md"),
  matrix: path.join(targetPath, "references", "recommendation_matrix_policy.md"),
  mcp: path.join(targetPath, "references", "automation_mcp_servers.md"),
  hooks: path.join(targetPath, "references", "automation_hooks_patterns.md"),
  subagents: path.join(targetPath, "references", "automation_subagent_templates.md"),
  skills: path.join(targetPath, "references", "automation_skills_reference.md"),
  plugins: path.join(targetPath, "references", "automation_plugins_reference.md"),
  commands: path.join(targetPath, "references", "automation_commands_reference.md"),
  evals: path.join(targetPath, "evals", "evals.json"),
};

const files = Object.fromEntries(
  Object.entries(fileMap).map(([key, filePath]) => [
    key,
    {
      path: filePath,
      relPath: rel(filePath),
      exists: fs.existsSync(filePath),
      text: readText(filePath),
    },
  ]),
);

const lower = (value) => value.toLowerCase();
const includesToken = (text, token) => lower(text).includes(lower(token));

function refsForToken(file, token, limit = 2) {
  const refs = [];
  const lines = file.text.split(/\r?\n/);
  for (let index = 0; index < lines.length; index += 1) {
    if (includesToken(lines[index], token)) {
      refs.push(`${file.relPath}:${index + 1}`);
      if (refs.length >= limit) break;
    }
  }
  return refs;
}

function matchGroup(group) {
  const keys = group.files || [group.file];
  const matchedFiles = [];
  const lineRefs = [];
  for (const key of keys) {
    const file = files[key];
    if (!file?.exists) continue;
    const matched = group.tokens.every((token) => includesToken(file.text, token));
    if (!matched) continue;
    matchedFiles.push(key);
    for (const token of group.tokens) {
      lineRefs.push(...refsForToken(file, token));
    }
  }
  return {
    id: group.id,
    label: group.label,
    matched: matchedFiles.length > 0,
    matchedFiles,
    lineRefs: [...new Set(lineRefs)],
    missingTokens: matchedFiles.length > 0 ? [] : group.tokens,
  };
}

const groups = {
  task_context_as_evidence: {
    id: "task_context_as_evidence",
    label: "task context is harness evidence",
    file: "skill",
    tokens: ["treat that context as **evidence**", "not as a work order"],
  },
  route_execution_to_next_skill: {
    id: "route_execution_to_next_skill",
    label: "route actual execution to another workflow skill",
    file: "skill",
    tokens: ["route to `plan`, `implement`, or `diagnose`"],
  },
  recommendation_is_not_execution: {
    id: "recommendation_is_not_execution",
    label: "recommendation is not execution",
    file: "skill",
    tokens: ["recommending or installing a capability is the deliverable", "using that capability to do the work is not"],
  },
  read_only_recommendation_phase: {
    id: "read_only_recommendation_phase",
    label: "read-only recommendation phase",
    files: ["skill", "guide"],
    tokens: ["read-only", "do not write"],
  },
  approved_install_phase: {
    id: "approved_install_phase",
    label: "approved install phase",
    file: "skill",
    tokens: ["Approved install phase", "USER CHECKPOINT"],
  },
  candidate_record_fields: {
    id: "candidate_record_fields",
    label: "candidate record has actionable fields",
    file: "guide",
    tokens: ["repo_signal", "install_surface", "approval_needed", "fallback", "verification_probe", "priority", "classification"],
  },
  gap_binding_rule: {
    id: "gap_binding_rule",
    label: "candidate binds to one recommendation row",
    files: ["skill", "matrix"],
    tokens: ["bind", "one recommendation row"],
  },
  repo_signal_required: {
    id: "repo_signal_required",
    label: "repo signal required",
    file: "guide",
    tokens: ["repo_signal", "local evidence"],
  },
  verification_probe_required: {
    id: "verification_probe_required",
    label: "verification probe required",
    file: "guide",
    tokens: ["verification_probe", "cheap command or observation"],
  },
  fallback_required: {
    id: "fallback_required",
    label: "fallback required",
    file: "guide",
    tokens: ["fallback", "manual workflow"],
  },
  top_k_default: {
    id: "top_k_default",
    label: "top-k recommendation discipline",
    file: "guide",
    tokens: ["top 1-2 recommendations", "3-5 recommendations"],
  },
  irrelevant_category_defer: {
    id: "irrelevant_category_defer",
    label: "irrelevant categories are deferred",
    file: "guide",
    tokens: ["Skip categories with no meaningful repo signal", "Deferred"],
  },
  skip_categories_without_signal: {
    id: "skip_categories_without_signal",
    label: "skip categories without repo signal",
    file: "guide",
    tokens: ["Skip categories with no meaningful repo signal", "clear defer/reject reason"],
  },
  reject_or_defer_unbound_candidate: {
    id: "reject_or_defer_unbound_candidate",
    label: "unbound candidates are rejected or deferred",
    file: "matrix",
    tokens: ["If a candidate cannot name the failure it prevents", "reject or defer it"],
  },
  no_empty_approval_checkpoint: {
    id: "no_empty_approval_checkpoint",
    label: "no approval checkpoint for empty plans",
    file: "skill",
    tokens: ["No install recommended", "no action to approve"],
  },
  install_surface_separate: {
    id: "install_surface_separate",
    label: "install surface separate from candidate",
    file: "install",
    tokens: ["Recommendations must name the surface separately from the candidate"],
  },
  approval_levels: {
    id: "approval_levels",
    label: "approval levels are explicit",
    file: "install",
    tokens: ["No approval", "USER CHECKPOINT", "Explicit user approval"],
  },
  project_local_default: {
    id: "project_local_default",
    label: "project-local supplements are recommended when signaled",
    files: ["install", "matrix"],
    tokens: ["Project-local", "concrete repo signal", "Recommended"],
  },
  high_risk_explicit_approval: {
    id: "high_risk_explicit_approval",
    label: "high risk installs need explicit approval",
    file: "install",
    tokens: ["credential-bearing", "write-capable", "explicit approval"],
  },
  plugin_recommendation_not_install: {
    id: "plugin_recommendation_not_install",
    label: "plugin recommendation does not imply installation",
    file: "plugins",
    tokens: ["Plugin recommendation does not imply installation", "Marketplace/cache changes need explicit approval"],
  },
  existing_harness_reconciliation: {
    id: "existing_harness_reconciliation",
    label: "existing harness is reconciled before adding",
    file: "skill",
    tokens: ["Reconcile", "existing harness"],
  },
  keep_patch_archive_reject: {
    id: "keep_patch_archive_reject",
    label: "existing components are classified",
    file: "skill",
    tokens: ["keep/patch/archive/reject"],
  },
  no_second_recovery_surface: {
    id: "no_second_recovery_surface",
    label: "no second recovery surface",
    file: "skill",
    tokens: ["Do not create a second recovery surface"],
  },
  reuse_existing_before_add: {
    id: "reuse_existing_before_add",
    label: "reuse existing mechanisms before adding",
    files: ["install", "matrix"],
    tokens: ["Prefer patching", "creating parallel"],
  },
  external_research_escalation: {
    id: "external_research_escalation",
    label: "targeted external research when references are not enough",
    files: ["skill", "guide", "mcp", "hooks", "skills", "plugins", "commands"],
    tokens: ["targeted web search", "official docs"],
  },
};

function checkPayload({ id, severity, status, message, matched, missing, lineRefs, remediation }) {
  return {
    id,
    category: "custom",
    severity,
    status,
    message,
    evidence: [
      ...(matched.length ? [`matched: ${matched.join(", ")}`] : []),
      ...(missing.length ? [`missing: ${missing.join(", ")}`] : []),
      ...lineRefs.slice(0, 10),
    ],
    remediation,
    source,
  };
}

function evaluateCheck({ id, requiredGroupIds, message, failSeverity = "warning", failStatus = "warn", remediation = [] }) {
  const results = requiredGroupIds.map((groupId) => matchGroup(groups[groupId]));
  const missing = results.filter((result) => !result.matched).map((result) => result.id);
  const matched = results.filter((result) => result.matched).map((result) => result.id);
  const lineRefs = results.flatMap((result) => result.lineRefs);
  const passed = missing.length === 0;
  return {
    check: checkPayload({
      id,
      severity: passed ? "info" : failSeverity,
      status: passed ? "pass" : failStatus,
      message: passed ? `${message} is covered.` : `${message} is incomplete.`,
      matched,
      missing,
      lineRefs,
      remediation,
    }),
    results,
    passed,
  };
}

function metric(id, value, unit, band) {
  return {
    id,
    category: "custom",
    value,
    unit,
    band,
    source,
  };
}

function bandForCount(value, good, moderate, weak) {
  if (value >= good) return "good";
  if (value >= moderate) return "moderate";
  if (value >= weak) return "weak";
  return "missing";
}

function bandForRate(value) {
  if (value >= 0.99) return "good";
  if (value >= 0.8) return "moderate";
  if (value >= 0.6) return "weak";
  return "missing";
}

function loadScenarios() {
  return listScenarioFiles().map((filePath) => ({
    filePath,
    relPath: path.relative(__dirname, filePath).replaceAll(path.sep, "/"),
    data: JSON.parse(fs.readFileSync(filePath, "utf8")),
  }));
}

function evaluateScenarios() {
  const scenarios = loadScenarios();
  const checks = [];
  const scenarioResults = [];
  let matchedRequiredGroups = 0;
  let totalRequiredGroups = 0;

  for (const scenario of scenarios) {
    const requiredGroupIds = scenario.data.required_groups || [];
    const evaluation = evaluateCheck({
      id: `hb-scenario-${scenario.data.id}`,
      requiredGroupIds,
      message: `P1 scenario ${scenario.data.id}`,
      failSeverity: "error",
      failStatus: "fail",
      remediation: [`Update harness-builder recommendation contracts for ${scenario.data.id}.`],
    });
    checks.push(evaluation.check);
    totalRequiredGroups += requiredGroupIds.length;
    matchedRequiredGroups += evaluation.results.filter((result) => result.matched).length;
    scenarioResults.push({
      id: scenario.data.id,
      file: scenario.relPath,
      purpose: scenario.data.purpose,
      passed: evaluation.passed,
      matched_groups: evaluation.results.filter((result) => result.matched).map((result) => result.id),
      missing_groups: evaluation.results.filter((result) => !result.matched).map((result) => result.id),
    });
  }

  const coverageRate = totalRequiredGroups === 0 ? 0 : matchedRequiredGroups / totalRequiredGroups;
  return {
    checks,
    scenarioResults,
    metrics: [
      metric("hb_p1_scenario_count", scenarios.length, "scenarios", bandForCount(scenarios.length, 5, 4, 3)),
      metric("hb_p1_scenario_contract_coverage_rate", Number(coverageRate.toFixed(4)), "ratio", bandForRate(coverageRate)),
    ],
  };
}

function capabilityCategoryCount() {
  const categoryFiles = ["mcp", "hooks", "subagents", "skills", "plugins", "commands"];
  return categoryFiles.filter((key) => files[key]?.exists).length;
}

function candidateFieldCount() {
  const fieldTokens = ["repo_signal", "candidate", "why", "install_surface", "approval_needed", "fallback", "verification_probe", "priority", "classification"];
  return fieldTokens.filter((token) => includesToken(files.guide.text, token)).length;
}

function projectLocalDefaultCount() {
  const pairs = [
    ["skills", "Project-local skills"],
    ["hooks", "Project-local, fast"],
    ["mcp", "Project-local read-only MCP"],
    ["subagents", "Project-local, read-only subagents"],
  ];
  return pairs.filter(([key, token]) => files[key]?.exists && includesToken(files[key].text, token)).length;
}

function approvalBoundaryCount() {
  return ["No approval", "USER CHECKPOINT", "Explicit user approval"]
    .filter((token) => includesToken(files.install.text, token)).length;
}

function main() {
  if (targetKind !== "skill" || targetName !== "harness-builder") {
    console.log(JSON.stringify({
      checks: [
        checkPayload({
          id: "hb-pack-target-unsupported",
          severity: "info",
          status: "info",
          message: "Harness-builder recommendation metric pack only evaluates the harness-builder skill.",
          matched: [],
          missing: [],
          lineRefs: [targetPath],
          remediation: ["Run this metric pack against skills/harness-builder."],
        }),
      ],
      metrics: [],
      artifacts: [],
    }, null, 2));
    return;
  }

  const staticEvaluations = [
    evaluateCheck({
      id: "hb-boundary-task-vs-harness",
      requiredGroupIds: ["task_context_as_evidence", "recommendation_is_not_execution", "route_execution_to_next_skill"],
      message: "Task context versus harness deliverable boundary",
      failSeverity: "error",
      failStatus: "fail",
      remediation: ["Make the skill treat supplied task context as harness-design evidence and route execution elsewhere."],
    }),
    evaluateCheck({
      id: "hb-recommendation-only-integrity",
      requiredGroupIds: ["read_only_recommendation_phase", "approved_install_phase"],
      message: "Recommendation-only before approval discipline",
      failSeverity: "error",
      failStatus: "fail",
      remediation: ["Keep recommendation read-only until USER CHECKPOINT approval."],
    }),
    evaluateCheck({
      id: "hb-repo-signal-required",
      requiredGroupIds: ["repo_signal_required", "candidate_record_fields"],
      message: "Repo-signal-bound candidate discipline",
      remediation: ["Require every candidate to cite local repo evidence."],
    }),
    evaluateCheck({
      id: "hb-one-primary-gap-binding",
      requiredGroupIds: ["gap_binding_rule", "reject_or_defer_unbound_candidate"],
      message: "One primary recommendation gap binding",
      remediation: ["Bind each capability to exactly one recommendation row or reject/defer it."],
    }),
    evaluateCheck({
      id: "hb-top-k-category-discipline",
      requiredGroupIds: ["top_k_default", "irrelevant_category_defer"],
      message: "Top-k category discipline",
      remediation: ["Default to the top 1-2 relevant recommendations and skip/defer irrelevant categories."],
    }),
    evaluateCheck({
      id: "hb-irrelevant-category-deferred",
      requiredGroupIds: ["skip_categories_without_signal", "reject_or_defer_unbound_candidate"],
      message: "Irrelevant category defer/reject discipline",
      remediation: ["Record defer/reject reasons when repo signal is absent."],
    }),
    evaluateCheck({
      id: "hb-install-surface-and-approval",
      requiredGroupIds: ["install_surface_separate", "approval_levels", "high_risk_explicit_approval"],
      message: "Install surface and approval precision",
      failSeverity: "error",
      failStatus: "fail",
      remediation: ["Separate candidate, install surface, approval boundary, and risk class."],
    }),
    evaluateCheck({
      id: "hb-verification-probe-required",
      requiredGroupIds: ["verification_probe_required", "fallback_required"],
      message: "Fallback and verification probe requirement",
      remediation: ["Require a fallback and cheap verification probe for every actionable candidate."],
    }),
    evaluateCheck({
      id: "hb-external-research-escalation",
      requiredGroupIds: ["external_research_escalation"],
      message: "External research escalation for non-catalog cases",
      remediation: ["Require targeted web search or local official docs when local references are insufficient."],
    }),
    evaluateCheck({
      id: "hb-no-empty-approval-checkpoint",
      requiredGroupIds: ["no_empty_approval_checkpoint"],
      message: "No USER CHECKPOINT for no-op recommendation plans",
      failSeverity: "error",
      failStatus: "fail",
      remediation: ["Say No install recommended when there is no concrete install, patch, archive, or config action."],
    }),
  ];

  const p1 = evaluateScenarios();
  const staticChecks = staticEvaluations.map((evaluation) => evaluation.check);
  const allChecks = [...staticChecks, ...p1.checks];
  const staticPassRate = staticEvaluations.filter((evaluation) => evaluation.passed).length / staticEvaluations.length;
  const boundaryHits = staticEvaluations
    .filter((evaluation) => [
      "hb-boundary-task-vs-harness",
      "hb-recommendation-only-integrity",
      "hb-one-primary-gap-binding",
      "hb-install-surface-and-approval",
      "hb-no-empty-approval-checkpoint",
    ].includes(evaluation.check.id) && evaluation.passed).length;

  const metrics = [
    metric("hb_static_check_pass_rate", Number(staticPassRate.toFixed(4)), "ratio", bandForRate(staticPassRate)),
    metric("hb_boundary_guardrail_hits", boundaryHits, "checks", bandForCount(boundaryHits, 5, 4, 3)),
    metric("hb_capability_category_count", capabilityCategoryCount(), "categories", bandForCount(capabilityCategoryCount(), 6, 5, 4)),
    metric("hb_candidate_field_count", candidateFieldCount(), "fields", bandForCount(candidateFieldCount(), 8, 6, 4)),
    metric("hb_project_local_default_count", projectLocalDefaultCount(), "surfaces", bandForCount(projectLocalDefaultCount(), 4, 3, 2)),
    metric("hb_approval_boundary_count", approvalBoundaryCount(), "levels", bandForCount(approvalBoundaryCount(), 3, 2, 1)),
    ...p1.metrics,
  ];

  const evidenceMap = {
    target: targetPath,
    static_checks: staticEvaluations.map((evaluation) => ({
      id: evaluation.check.id,
      matched_groups: evaluation.results.filter((result) => result.matched).map((result) => result.id),
      missing_groups: evaluation.results.filter((result) => !result.matched).map((result) => result.id),
      line_refs: [...new Set(evaluation.results.flatMap((result) => result.lineRefs))],
    })),
    scenarios: p1.scenarioResults,
  };

  console.log(JSON.stringify({
    checks: allChecks,
    metrics,
    artifacts: [
      {
        id: "hb-evidence-map",
        type: "custom",
        label: "Harness-builder recommendation evidence map",
        description: "Matched and missing token groups for V0 static checks and P1 scenario fixtures.",
        data: evidenceMap,
        source,
      },
    ],
  }, null, 2));
}

main();
