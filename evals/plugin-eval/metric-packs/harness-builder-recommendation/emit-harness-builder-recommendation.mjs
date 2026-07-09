#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const [targetPathArg, targetKindArg] = process.argv.slice(2);
const targetKind = targetKindArg || process.env.PLUGIN_EVAL_TARGET_KIND || "unknown";
const targetPath = path.resolve(process.cwd(), targetPathArg || process.env.PLUGIN_EVAL_TARGET || ".");
const targetName = path.basename(targetPath);
const repoRoot = path.resolve(targetPath, "..", "..");
const source = "metric-pack:harness-builder-workbench";

const rel = (filePath) => path.relative(targetPath, filePath).replaceAll(path.sep, "/");
const readText = (filePath) => (fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "");
const listScenarioFiles = () => fs.readdirSync(path.join(__dirname, "scenarios"))
  .filter((name) => name.endsWith(".json"))
  .sort()
  .map((name) => path.join(__dirname, "scenarios", name));

const fileMap = {
  skill: path.join(targetPath, "SKILL.md"),
  controller: path.join(targetPath, "references", "controller_discipline.md"),
  methodContract: path.join(repoRoot, "docs", "harness-method-contract.md"),
  guide: path.join(targetPath, "references", "automation_recommendation_guide.md"),
  install: path.join(targetPath, "references", "install_policy.md"),
  matrix: path.join(targetPath, "references", "recommendation_matrix_policy.md"),
  recovery: path.join(targetPath, "references", "recovery_surface_policy.md"),
  antiEntropy: path.join(targetPath, "references", "anti_entropy.md"),
  verification: path.join(targetPath, "references", "verification_policy.md"),
  subagentPolicy: path.join(targetPath, "references", "subagent_orchestration.md"),
  architecture: path.join(targetPath, "references", "architecture_enforcement_policy.md"),
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
    files: ["skill", "controller"],
    tokens: ["as **evidence**", "not as a work order"],
  },
  route_execution_to_next_skill: {
    id: "route_execution_to_next_skill",
    label: "route actual execution to another workflow skill",
    files: ["skill", "controller"],
    tokens: ["Route actual execution to `plan`, `implement`, or `diagnose`"],
  },
  recommendation_is_not_execution: {
    id: "recommendation_is_not_execution",
    label: "recommendation is not execution",
    files: ["skill", "controller"],
    tokens: ["Recommending or installing a capability is the deliverable", "using that capability to do the"],
  },
  read_only_recommendation_phase: {
    id: "read_only_recommendation_phase",
    label: "read-only recommendation phase",
    files: ["skill", "controller", "guide"],
    tokens: ["read-only", "do not write"],
  },
  approved_install_phase: {
    id: "approved_install_phase",
    label: "approved install phase",
    files: ["skill", "controller"],
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
    files: ["skill", "controller"],
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
    files: ["skill", "controller", "recovery"],
    tokens: ["Reconcile", "existing harness"],
  },
  keep_patch_archive_reject: {
    id: "keep_patch_archive_reject",
    label: "existing components are classified",
    files: ["skill", "controller"],
    tokens: ["keep/patch/archive/reject"],
  },
  no_second_recovery_surface: {
    id: "no_second_recovery_surface",
    label: "no second recovery surface",
    files: ["skill", "controller", "recovery"],
    tokens: ["Do not create a second recovery surface"],
  },
  hot_recovery_bounded_index: {
    id: "hot_recovery_bounded_index",
    label: "hot recovery docs are bounded indexes",
    files: ["skill", "recovery"],
    tokens: ["Hot recovery docs are bounded indexes", "not append-only reports"],
  },
  status_scripts_are_views: {
    id: "status_scripts_are_views",
    label: "status/check/selftest scripts are views",
    files: ["skill", "recovery"],
    tokens: ["Status/check/selftest scripts are views/probes", "not state stores"],
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
  harness_as_system: {
    id: "harness_as_system",
    label: "harness is a project system",
    file: "methodContract",
    tokens: ["Agent 质量来自项目周围的系统", "入口、规则、上下文、验证、恢复、能力、收尾纪律"],
  },
  repository_as_truth: {
    id: "repository_as_truth",
    label: "repository artifacts are truth",
    file: "methodContract",
    tokens: ["仓库工件是真相", "当前目标、范围、证据和风险"],
  },
  thin_instruction_surface: {
    id: "thin_instruction_surface",
    label: "AGENTS is a thin instruction surface",
    file: "methodContract",
    tokens: ["`AGENTS.md` 是薄入口", "它不是 changelog"],
  },
  workbench_contract: {
    id: "workbench_contract",
    label: "workbench contract before implementation",
    file: "methodContract",
    tokens: ["Harness Recommendation Contract 至少包含", "objective", "selected recovery surface"],
  },
  matrix_before_capability: {
    id: "matrix_before_capability",
    label: "matrix precedes capability choices",
    file: "methodContract",
    tokens: ["Harness Recommendation Plan 前必须有 Harness Recommendation Matrix", "recommendation gap"],
  },
  question_gate_routes_unclear_work: {
    id: "question_gate_routes_unclear_work",
    label: "unclear harness design asks or routes back",
    files: ["skill", "methodContract"],
    tokens: ["应先提问或回到 `brainstorm` / `plan`"],
  },
  question_gate_only_design_questions: {
    id: "question_gate_only_design_questions",
    label: "question gate asks only design-changing questions",
    files: ["skill", "controller"],
    tokens: ["Question gate", "Ask only questions that change harness design", "No user questions needed"],
  },
  evidence_gate_repo_scan: {
    id: "evidence_gate_repo_scan",
    label: "repo evidence is collected before questions or installation",
    files: ["skill", "controller"],
    tokens: ["Evidence gate", "Collect repo evidence before questions or installation", "Do not start by generating files"],
  },
  no_template_before_evidence: {
    id: "no_template_before_evidence",
    label: "no template generation before evidence-backed contract",
    file: "methodContract",
    tokens: ["不能从空泛意图直接生成模板", "证据支持的 Harness Recommendation Contract"],
  },
  evidence_backed_assumptions: {
    id: "evidence_backed_assumptions",
    label: "questions can be replaced by evidence-backed assumptions",
    files: ["skill", "controller"],
    tokens: ["No user questions needed", "evidence-backed assumptions"],
  },
  scoped_work_contract: {
    id: "scoped_work_contract",
    label: "scoped work contract",
    file: "methodContract",
    tokens: ["active slice 唯一", "success criteria 可证伪", "WIP=1"],
  },
  recommendation_contract_fields: {
    id: "recommendation_contract_fields",
    label: "recommendation contract has required fields",
    file: "methodContract",
    tokens: ["Harness Recommendation Contract 至少包含", "objective", "verification path", "source-of-truth priority"],
  },
  source_of_truth_priority: {
    id: "source_of_truth_priority",
    label: "source-of-truth priority protects brownfield state",
    file: "recovery",
    tokens: ["source-of-truth priority", "Do not merge an old active slice with a new request"],
  },
  integrated_matrix_required: {
    id: "integrated_matrix_required",
    label: "one integrated recommendation matrix is required",
    file: "matrix",
    tokens: ["one integrated recommendation matrix", "Do not create a separate profile lane"],
  },
  matrix_rows_cover_core_surfaces: {
    id: "matrix_rows_cover_core_surfaces",
    label: "matrix rows cover core workbench surfaces",
    file: "matrix",
    tokens: ["Recovery surface", "Verification entry", "Architecture boundaries", "Anti-entropy", "Dynamic context"],
  },
  capability_rows_split_by_category: {
    id: "capability_rows_split_by_category",
    label: "capability rows are split by category",
    file: "methodContract",
    tokens: ["skills、hooks、MCP、subagents、plugins、commands、CI/headless automation 和 external research 必须分行判断"],
  },
  dynamic_context_probe: {
    id: "dynamic_context_probe",
    label: "cheap dynamic context is probed at session start",
    files: ["skill", "controller"],
    tokens: ["Probe cheap dynamic context", "`git status`", "diagnostics", "CI if available"],
  },
  fresh_evidence_gate: {
    id: "fresh_evidence_gate",
    label: "verify owns ready proof",
    file: "methodContract",
    tokens: ["Ready claim 必须由 `verify`", "fresh evidence", "unknown 不能算 ready"],
  },
  artifact_freshness_contract: {
    id: "artifact_freshness_contract",
    label: "artifacts describe the same reality",
    file: "methodContract",
    tokens: ["代码、命令、README", "selected recovery surface", "生成物只能通过生成器更新"],
  },
  knowledge_cleanup_contract: {
    id: "knowledge_cleanup_contract",
    label: "knowledge cleanup lowers entropy",
    file: "methodContract",
    tokens: ["收尾不是简单说 done", "`AGENTS.md` 保持薄入口", "未解决 drift 记录为明确 follow-up"],
  },
  backend_decoupling_contract: {
    id: "backend_decoupling_contract",
    label: "workflow semantics are backend-decoupled",
    file: "methodContract",
    tokens: ["Workflow skills 依赖 recovery surface 的语义字段", "不依赖固定文件布局"],
  },
  language_adaptive_output: {
    id: "language_adaptive_output",
    label: "user language with stable protocol tokens",
    file: "skill",
    tokens: ["用户可见文本跟随用户语言", "协议稳定优先", "中文标签 + English token"],
  },
  recovery_field_model: {
    id: "recovery_field_model",
    label: "recovery surface exposes semantic fields",
    file: "recovery",
    tokens: ["Every durable recovery surface", "`active_slice`", "`success_criteria`", "`evidence_log`", "`decisions`"],
  },
  recovery_backend_selection: {
    id: "recovery_backend_selection",
    label: "recovery backend is selected by task shape",
    file: "recovery",
    tokens: ["`none`", "`lightweight`", "`harness`", "`existing`", "not a synonym for workflow state"],
  },
  recovery_drift_repair: {
    id: "recovery_drift_repair",
    label: "recovery drift is repaired through source priority",
    file: "recovery",
    tokens: ["recovery artifacts conflict with code or git state", "conflicting sources", "selected evidence log"],
  },
  dynamic_state_surface: {
    id: "dynamic_state_surface",
    label: "dynamic state stays out of AGENTS",
    files: ["skill", "controller"],
    tokens: ["Dynamic task state", "selected recovery surface", "not in `AGENTS.md`"],
  },
  verification_fast_local_safe: {
    id: "verification_fast_local_safe",
    label: "verification defaults are fast local safe",
    file: "verification",
    tokens: ["fast, local, and safe", "File existence alone is not enough"],
  },
  verification_phase_acceptance: {
    id: "verification_phase_acceptance",
    label: "phase acceptance requires evidence and risk",
    file: "verification",
    tokens: ["phase is complete only when", "approved artifact exists or was patched", "evidence location is stated", "residual risk"],
  },
  verification_agent_readable_failures: {
    id: "verification_agent_readable_failures",
    label: "verification failures are agent-readable",
    file: "verification",
    tokens: ["name failed file/command/layer", "governing docs", "blocker from residual risk"],
  },
  no_fresh_evidence_ready: {
    id: "no_fresh_evidence_ready",
    label: "no fresh evidence means no ready claim",
    files: ["skill", "controller"],
    tokens: ["No fresh evidence", "not ready"],
  },
  anti_entropy_warning_signs: {
    id: "anti_entropy_warning_signs",
    label: "anti-entropy warning signs are explicit",
    file: "antiEntropy",
    tokens: ["`AGENTS.md` keeps growing", "hot recovery docs grow as append-only reports", "multiple recovery surfaces claim to be current"],
  },
  anti_entropy_repair_moves: {
    id: "anti_entropy_repair_moves",
    label: "anti-entropy repair moves are explicit",
    file: "antiEntropy",
    tokens: ["Keep root instructions thin", "roll up hot recovery docs", "read-only GC/drift scans"],
  },
  anti_entropy_gc_readonly: {
    id: "anti_entropy_gc_readonly",
    label: "GC drift scans are read-only by default",
    file: "antiEntropy",
    tokens: ["Default scans must report only", "must not auto-fix or delete", "explicit user approval"],
  },
  component_failure_prevention: {
    id: "component_failure_prevention",
    label: "components justify the failure they prevent",
    file: "antiEntropy",
    tokens: ["cannot explain what failure it prevents", "remove or downgrade"],
  },
  architecture_discovery_first: {
    id: "architecture_discovery_first",
    label: "architecture enforcement starts with discovery",
    file: "architecture",
    tokens: ["detect language, framework, source roots", "inspect actual imports", "Never force a generic layer template"],
  },
  architecture_enforcement_ladder: {
    id: "architecture_enforcement_ladder",
    label: "architecture enforcement uses lowest effective level",
    file: "architecture",
    tokens: ["Describe", "Document", "Test", "Lint", "Hook", "lowest level"],
  },
  architecture_baseline_ratchet: {
    id: "architecture_baseline_ratchet",
    label: "architecture checks baseline and ratchet brownfield repos",
    file: "architecture",
    tokens: ["known violations", "project-local baseline", "new violations", "shrink over time"],
  },
  architecture_agent_readable_errors: {
    id: "architecture_agent_readable_errors",
    label: "architecture errors are agent-readable",
    file: "architecture",
    tokens: ["name the file, import, failed layer relation", "docs/architecture/LAYERS.md"],
  },
  subagent_gap_reducer: {
    id: "subagent_gap_reducer",
    label: "subagents reduce named gaps",
    file: "subagentPolicy",
    tokens: ["optional gap reducers", "not spawned because they exist"],
  },
  subagent_main_writes: {
    id: "subagent_main_writes",
    label: "main agent owns harness writes",
    file: "subagentPolicy",
    tokens: ["main agent writes harness files", "integrates results"],
  },
  subagent_parallel_readonly: {
    id: "subagent_parallel_readonly",
    label: "parallel subagents are read-only for large uncertain repos",
    file: "subagentPolicy",
    tokens: ["Parallel read-only", "large, legacy, or unfamiliar repos"],
  },
  subagent_fit_record: {
    id: "subagent_fit_record",
    label: "subagent proposals explain fit",
    file: "subagentPolicy",
    tokens: ["gap reduced", "expected output", "read-only yes/no"],
  },
  subagent_signal_mapping: {
    id: "subagent_signal_mapping",
    label: "subagent candidates map to repo signals",
    file: "subagentPolicy",
    tokens: ["Signal mapping", "Repo signal", "Candidate", "Default use"],
  },
  subagent_failure_mode_names: {
    id: "subagent_failure_mode_names",
    label: "subagents are named by failure mode",
    file: "subagentPolicy",
    tokens: ["Name by **failure mode**", "Avoid `senior-engineer`"],
  },
  subagent_not_for_immediate_blocker: {
    id: "subagent_not_for_immediate_blocker",
    label: "subagents do not take the immediate blocking implementation step",
    file: "subagentPolicy",
    tokens: ["Do not delegate the immediate blocking implementation step"],
  },
  subagent_required_only_when_needed: {
    id: "subagent_required_only_when_needed",
    label: "required subagents need explicit reason",
    file: "subagentPolicy",
    tokens: ["user explicitly requests delegation", "main agent alone"],
  },
  external_research_not_builtin: {
    id: "external_research_not_builtin",
    label: "external research governance is not built in",
    files: ["skill", "controller"],
    tokens: ["External research-governance wiring is intentionally outside this plugin", "Do not create research gates"],
  },
  research_task_not_harness_execution: {
    id: "research_task_not_harness_execution",
    label: "research tasks are not performed by harness-builder",
    files: ["skill", "controller"],
    tokens: ["feature, bug fix, or research task"],
  },
  external_research_fit_row: {
    id: "external_research_fit_row",
    label: "external research remains a capability-fit row",
    file: "matrix",
    tokens: ["External research fit", "research notes", "source list"],
  },
  commands_ci_repeatable_workflows: {
    id: "commands_ci_repeatable_workflows",
    label: "commands and CI are recommended for repeatable workflows",
    file: "commands",
    tokens: ["turn repeated harness workflows into explicit entry points", "repeatable checks", "CI gates"],
  },
  project_local_command_surface_first: {
    id: "project_local_command_surface_first",
    label: "project-local command surfaces come first",
    file: "commands",
    tokens: ["prefer project scripts", "`codex exec --json`"],
  },
  commands_ci_structured_fallback: {
    id: "commands_ci_structured_fallback",
    label: "commands and CI include structured evidence and fallback",
    file: "commands",
    tokens: ["structured report", "machine-readable gate evidence", "Fallback script works without the agent runtime"],
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
      metric("hb_p1_scenario_count", scenarios.length, "scenarios", bandForCount(scenarios.length, 18, 14, 10)),
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

function matchedGroupCount(groupIds) {
  return groupIds.filter((groupId) => matchGroup(groups[groupId]).matched).length;
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
    evaluateCheck({
      id: "hb-workbench-system-coverage",
      requiredGroupIds: [
        "harness_as_system",
        "repository_as_truth",
        "thin_instruction_surface",
        "workbench_contract",
        "matrix_before_capability",
      ],
      message: "Project-level workbench system coverage",
      failSeverity: "error",
      failStatus: "fail",
      remediation: ["Evaluate harness-builder as a workbench designer, not only as an install recommender."],
    }),
    evaluateCheck({
      id: "hb-recovery-surface-discipline",
      requiredGroupIds: [
        "recovery_field_model",
        "recovery_backend_selection",
        "recovery_drift_repair",
        "existing_harness_reconciliation",
        "no_second_recovery_surface",
        "hot_recovery_bounded_index",
        "status_scripts_are_views",
        "dynamic_state_surface",
      ],
      message: "Recovery surface field, backend, and drift discipline",
      failSeverity: "error",
      failStatus: "fail",
      remediation: ["Require semantic recovery fields, selected backend, brownfield reconciliation, and no second recovery surface."],
    }),
    evaluateCheck({
      id: "hb-scoped-work-boundary",
      requiredGroupIds: [
        "evidence_gate_repo_scan",
        "no_template_before_evidence",
        "scoped_work_contract",
        "question_gate_only_design_questions",
        "evidence_backed_assumptions",
        "question_gate_routes_unclear_work",
        "task_context_as_evidence",
        "route_execution_to_next_skill",
      ],
      message: "Scoped work and unclear-goal routing discipline",
      remediation: ["Keep one active slice, ask only harness-design questions, and route unclear product work to brainstorm/plan/implementation lanes."],
    }),
    evaluateCheck({
      id: "hb-recommendation-contract-and-matrix-discipline",
      requiredGroupIds: [
        "recommendation_contract_fields",
        "source_of_truth_priority",
        "integrated_matrix_required",
        "matrix_rows_cover_core_surfaces",
        "capability_rows_split_by_category",
        "dynamic_context_probe",
        "gap_binding_rule",
      ],
      message: "Harness recommendation contract and integrated matrix discipline",
      failSeverity: "error",
      failStatus: "fail",
      remediation: ["Require an evidence-backed contract, one integrated matrix, separate capability rows, source-of-truth priority, and dynamic context probes."],
    }),
    evaluateCheck({
      id: "hb-verification-and-evidence-discipline",
      requiredGroupIds: [
        "fresh_evidence_gate",
        "verification_fast_local_safe",
        "verification_phase_acceptance",
        "verification_agent_readable_failures",
        "no_fresh_evidence_ready",
      ],
      message: "Fresh evidence and verification gate discipline",
      failSeverity: "error",
      failStatus: "fail",
      remediation: ["Require fast/local/safe checks, phase evidence, agent-readable failures, and no ready claim without fresh evidence."],
    }),
    evaluateCheck({
      id: "hb-anti-entropy-and-cleanup-discipline",
      requiredGroupIds: [
        "artifact_freshness_contract",
        "knowledge_cleanup_contract",
        "anti_entropy_warning_signs",
        "anti_entropy_repair_moves",
        "anti_entropy_gc_readonly",
        "hot_recovery_bounded_index",
        "status_scripts_are_views",
        "component_failure_prevention",
      ],
      message: "Artifact freshness, anti-entropy, and cleanup discipline",
      remediation: ["Make harness-builder detect drift, keep AGENTS thin, prefer read-only scans, and record unresolved follow-ups."],
    }),
    evaluateCheck({
      id: "hb-architecture-enforcement-discipline",
      requiredGroupIds: [
        "architecture_discovery_first",
        "architecture_enforcement_ladder",
        "architecture_baseline_ratchet",
        "architecture_agent_readable_errors",
      ],
      message: "Architecture enforcement discovery and ratchet discipline",
      remediation: ["Start from repo discovery, choose the lowest enforceable level, baseline brownfield violations, and emit actionable failures."],
    }),
    evaluateCheck({
      id: "hb-subagent-orchestration-discipline",
      requiredGroupIds: [
        "subagent_gap_reducer",
        "subagent_main_writes",
        "subagent_parallel_readonly",
        "subagent_fit_record",
        "subagent_signal_mapping",
        "subagent_failure_mode_names",
        "subagent_not_for_immediate_blocker",
        "subagent_required_only_when_needed",
      ],
      message: "Subagent orchestration discipline",
      remediation: ["Treat subagents as signal-bound gap reducers, keep main-agent write ownership, and avoid delegating the immediate blocker."],
    }),
    evaluateCheck({
      id: "hb-external-research-boundary",
      requiredGroupIds: [
        "external_research_not_builtin",
        "research_task_not_harness_execution",
        "external_research_fit_row",
      ],
      message: "External research governance boundary",
      remediation: ["Keep external research governance outside harness-builder while allowing capability-fit recommendations for source-backed research needs."],
    }),
    evaluateCheck({
      id: "hb-commands-ci-headless-discipline",
      requiredGroupIds: [
        "commands_ci_repeatable_workflows",
        "project_local_command_surface_first",
        "commands_ci_structured_fallback",
        "install_surface_separate",
      ],
      message: "Commands, CI, and headless automation discipline",
      remediation: ["Prefer project-local scripts and structured headless evidence for repeatable workflows, with fallback when agent runtime support is unavailable."],
    }),
    evaluateCheck({
      id: "hb-language-and-output-contract",
      requiredGroupIds: ["language_adaptive_output", "no_empty_approval_checkpoint"],
      message: "Language-adaptive output with stable protocol tokens",
      remediation: ["Follow user-visible language while preserving stable protocol tokens and avoiding empty approval gates."],
    }),
    evaluateCheck({
      id: "hb-backend-decoupling-contract",
      requiredGroupIds: ["backend_decoupling_contract", "recovery_backend_selection"],
      message: "Backend-decoupled recovery contract",
      remediation: ["Evaluate semantic recovery fields instead of hard-binding all workflows to one file layout."],
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
      "hb-recovery-surface-discipline",
      "hb-verification-and-evidence-discipline",
    ].includes(evaluation.check.id) && evaluation.passed).length;

  const workbenchDimensionGroups = [
    "harness_as_system",
    "repository_as_truth",
    "thin_instruction_surface",
    "evidence_gate_repo_scan",
    "no_template_before_evidence",
    "workbench_contract",
    "recommendation_contract_fields",
    "matrix_before_capability",
    "integrated_matrix_required",
    "matrix_rows_cover_core_surfaces",
    "scoped_work_contract",
    "fresh_evidence_gate",
    "artifact_freshness_contract",
    "knowledge_cleanup_contract",
    "backend_decoupling_contract",
    "language_adaptive_output",
  ];
  const recoveryContractGroups = [
    "recovery_field_model",
    "recovery_backend_selection",
    "recovery_drift_repair",
    "existing_harness_reconciliation",
    "no_second_recovery_surface",
    "hot_recovery_bounded_index",
    "status_scripts_are_views",
    "dynamic_state_surface",
  ];
  const verificationContractGroups = [
    "fresh_evidence_gate",
    "verification_fast_local_safe",
    "verification_phase_acceptance",
    "verification_agent_readable_failures",
    "no_fresh_evidence_ready",
  ];
  const entropyContractGroups = [
    "artifact_freshness_contract",
    "knowledge_cleanup_contract",
    "anti_entropy_warning_signs",
    "anti_entropy_repair_moves",
    "anti_entropy_gc_readonly",
    "hot_recovery_bounded_index",
    "status_scripts_are_views",
    "component_failure_prevention",
  ];
  const orchestrationContractGroups = [
    "subagent_gap_reducer",
    "subagent_main_writes",
    "subagent_parallel_readonly",
    "subagent_fit_record",
    "subagent_signal_mapping",
    "subagent_failure_mode_names",
    "subagent_not_for_immediate_blocker",
    "subagent_required_only_when_needed",
  ];
  const externalResearchBoundaryGroups = [
    "external_research_not_builtin",
    "research_task_not_harness_execution",
    "external_research_fit_row",
  ];
  const matrixContractGroups = [
    "recommendation_contract_fields",
    "source_of_truth_priority",
    "integrated_matrix_required",
    "matrix_rows_cover_core_surfaces",
    "capability_rows_split_by_category",
    "dynamic_context_probe",
  ];
  const commandsContractGroups = [
    "commands_ci_repeatable_workflows",
    "project_local_command_surface_first",
    "commands_ci_structured_fallback",
    "install_surface_separate",
  ];

  const metrics = [
    metric("hb_static_check_pass_rate", Number(staticPassRate.toFixed(4)), "ratio", bandForRate(staticPassRate)),
    metric("hb_boundary_guardrail_hits", boundaryHits, "checks", bandForCount(boundaryHits, 7, 5, 4)),
    metric("hb_workbench_dimension_count", matchedGroupCount(workbenchDimensionGroups), "dimensions", bandForCount(matchedGroupCount(workbenchDimensionGroups), 14, 11, 8)),
    metric("hb_recovery_contract_count", matchedGroupCount(recoveryContractGroups), "groups", bandForCount(matchedGroupCount(recoveryContractGroups), 8, 6, 5)),
    metric("hb_verification_contract_count", matchedGroupCount(verificationContractGroups), "groups", bandForCount(matchedGroupCount(verificationContractGroups), 5, 4, 3)),
    metric("hb_entropy_contract_count", matchedGroupCount(entropyContractGroups), "groups", bandForCount(matchedGroupCount(entropyContractGroups), 8, 6, 5)),
    metric("hb_orchestration_contract_count", matchedGroupCount(orchestrationContractGroups), "groups", bandForCount(matchedGroupCount(orchestrationContractGroups), 8, 6, 4)),
    metric("hb_external_research_boundary_count", matchedGroupCount(externalResearchBoundaryGroups), "groups", bandForCount(matchedGroupCount(externalResearchBoundaryGroups), 3, 2, 1)),
    metric("hb_matrix_contract_count", matchedGroupCount(matrixContractGroups), "groups", bandForCount(matchedGroupCount(matrixContractGroups), 6, 5, 4)),
    metric("hb_commands_ci_contract_count", matchedGroupCount(commandsContractGroups), "groups", bandForCount(matchedGroupCount(commandsContractGroups), 4, 3, 2)),
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
        label: "Harness-builder workbench evidence map",
        description: "Matched and missing token groups for V0 static checks and P1 scenario fixtures.",
        data: evidenceMap,
        source,
      },
    ],
  }, null, 2));
}

main();
