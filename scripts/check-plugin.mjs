#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const cwd = process.cwd();
const root = fs.existsSync(path.join(cwd, ".codex-plugin", "plugin.json"))
  ? cwd
  : path.resolve(cwd, "plugins/harness-workflow");
const packagedRoot = path.join(root, "plugins", "harness-workflow");
const fail = (message) => {
  console.error(`FAIL: ${message}`);
  process.exitCode = 1;
};
const pass = (message) => console.log(`PASS: ${message}`);
const info = (message) => console.log(`INFO: ${message}`);
const exists = (relativePath) => fs.existsSync(path.join(root, relativePath));
const packageExists = (relativePath) => fs.existsSync(path.join(packagedRoot, relativePath));
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");
const packageRead = (relativePath) => fs.readFileSync(path.join(packagedRoot, relativePath), "utf8");
const skillPath = (skill) => `skills/${skill}/SKILL.md`;
const readJson = (relativePath) => JSON.parse(read(relativePath));
const listFiles = (baseRoot, relativeDir) => {
  const absoluteDir = path.join(baseRoot, relativeDir);
  if (!fs.existsSync(absoluteDir)) return [];
  const out = [];
  const walk = (absoluteCurrent, relativeCurrent) => {
    for (const entry of fs.readdirSync(absoluteCurrent, { withFileTypes: true })) {
      const absoluteEntry = path.join(absoluteCurrent, entry.name);
      const relativeEntry = path.join(relativeCurrent, entry.name);
      if (entry.isDirectory()) walk(absoluteEntry, relativeEntry);
      else out.push(relativeEntry.replaceAll(path.sep, "/"));
    }
  };
  walk(absoluteDir, "");
  return out.sort();
};

if (!fs.existsSync(root)) {
  fail("plugin root is missing");
  process.exit(1);
}

try {
  const manifest = readJson(".codex-plugin/plugin.json");
  if (manifest.name !== "harness-workflow") fail("manifest name must be harness-workflow");
  if (manifest.skills !== "./skills/") fail("manifest skills path must be ./skills/");
  const capabilities = manifest.interface?.capabilities ?? [];
  const expectedCapabilities = ["Read", "Write"];
  if (JSON.stringify(capabilities) !== JSON.stringify(expectedCapabilities)) {
    fail("manifest capabilities must be exactly Read and Write");
  }
  const defaultPrompts = manifest.interface?.defaultPrompt ?? [];
  if (defaultPrompts.length > 3) fail("manifest defaultPrompt must have at most 3 prompts");
  for (const prompt of defaultPrompts) {
    if (prompt.length > 128) fail(`manifest defaultPrompt is too long: ${prompt}`);
  }
  const manifestText = JSON.stringify(manifest);
  for (const token of ["bootstrap", "state-contract", "resume", "save-session"]) {
    if (manifestText.includes(token)) {
      fail(`manifest must not expose removed active skill: ${token}`);
    }
  }
  pass("manifest parses and points at skills");
} catch (error) {
  fail(`manifest JSON is invalid: ${error.message}`);
}

try {
  const codex = readJson(".codex-plugin/plugin.json");
  const claude = readJson(".claude-plugin/plugin.json");
  const cursor = readJson(".cursor-plugin/plugin.json");
  if (codex.version !== claude.version || codex.version !== cursor.version) {
    fail(`public surface versions drifted: codex=${codex.version}, claude=${claude.version}, cursor=${cursor.version}`);
  } else {
    pass(`public surface versions match: ${codex.version}`);
  }
} catch (error) {
  fail(`public surface version check failed: ${error.message}`);
}

if (!exists(".agents/plugins/marketplace.json")) {
  fail("missing Codex marketplace manifest: .agents/plugins/marketplace.json");
} else {
  try {
    const marketplace = JSON.parse(read(".agents/plugins/marketplace.json"));
    if (marketplace.name !== "harness-workflow") fail("Codex marketplace name must be harness-workflow");
    const plugin = marketplace.plugins?.find((entry) => entry.name === "harness-workflow");
    if (!plugin) fail("Codex marketplace must expose harness-workflow");
    if (plugin?.source?.path !== "./plugins/harness-workflow") {
      fail("Codex marketplace source path must point at plugins/harness-workflow");
    }
    pass("Codex marketplace manifest parses");
  } catch (error) {
    fail(`Codex marketplace JSON is invalid: ${error.message}`);
  }
}

if (!fs.existsSync(packagedRoot)) {
  fail("missing packaged plugin root: plugins/harness-workflow");
} else {
  for (const file of [
    ".codex-plugin/plugin.json",
    ".claude-plugin/plugin.json",
    ".cursor-plugin/plugin.json",
  ]) {
    if (!packageExists(file)) fail(`packaged plugin missing ${file}`);
    else if (packageRead(file) !== read(file)) fail(`packaged plugin drifted from root file: ${file}`);
  }

  const rootSkillFiles = listFiles(root, "skills");
  const packagedSkillFiles = listFiles(packagedRoot, "skills");
  let packagedSkillDrift = false;
  if (JSON.stringify(rootSkillFiles) !== JSON.stringify(packagedSkillFiles)) {
    packagedSkillDrift = true;
    fail("packaged plugin skills have a different recursive file list from root skills");
  }
  for (const file of rootSkillFiles) {
    const relativePath = `skills/${file}`;
    if (!packageExists(relativePath)) continue;
    if (packageRead(relativePath) !== read(relativePath)) {
      packagedSkillDrift = true;
      fail(`packaged plugin skill support file drifted from root: ${relativePath}`);
    }
  }
  if (!packagedSkillDrift) pass("packaged plugin skills match root skills recursively");
}

if (exists(".mcp.json")) fail("plugin must not include default MCP config");
else pass("no default MCP config");
if (exists("hooks/hooks.json")) fail("plugin must not include default hooks");
else pass("no default hooks");
if (exists(".codex/config.toml")) fail("plugin must not include user or project Codex config");
else pass("no default Codex config");

const workflowSkills = [
  "harness-builder",
  "brainstorm",
  "plan",
  "implement",
  "diagnose",
  "review",
  "verify",
  "cleanup",
];
const helperSkills = ["find-skills"];
const activeSkills = [...workflowSkills, ...helperSkills];
const removedSkills = ["bootstrap", "state-contract", "resume", "save-session"];

for (const skill of activeSkills) {
  if (!exists(skillPath(skill))) fail(`missing skill ${skill}`);
  if (!packageExists(skillPath(skill))) fail(`packaged plugin missing skill ${skill}`);
  else if (packageRead(skillPath(skill)) !== read(skillPath(skill))) {
    fail(`packaged plugin skill drifted from root skill: ${skill}`);
  }
}
for (const skill of removedSkills) {
  if (exists(skillPath(skill))) fail(`removed skill still exposed: ${skill}`);
  if (packageExists(skillPath(skill))) fail(`removed skill still exposed in packaged plugin: ${skill}`);
}
if (exists("skills/harness-builder/references/legacy-bootstrap/SKILL.md")) {
  fail("legacy bootstrap reference must not be named SKILL.md; recursive skill scanners may expose it");
}
if (packageExists("skills/harness-builder/references/legacy-bootstrap/SKILL.md")) {
  fail("packaged legacy bootstrap reference must not be named SKILL.md");
}
if (!process.exitCode) pass("active skill set matches boundary model plus helper skills");

for (const skill of activeSkills) {
  if (!exists(skillPath(skill))) continue;
  const body = read(skillPath(skill));
  if (!body.startsWith("---")) fail(`${skill} missing YAML frontmatter`);
  if (!new RegExp(`name:\\s*${skill.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}`).test(body)) {
    fail(`${skill} frontmatter name mismatch`);
  }
  if (!/description:\s*/.test(body)) fail(`${skill} missing description`);
  if (!body.includes("## Recommended next skill")) fail(`${skill} missing Recommended next skill section`);
}
if (!process.exitCode) pass("skill frontmatter is valid");

const installDocPath = "docs/install/codex.md";
if (!exists(installDocPath)) {
  fail("missing Codex install documentation");
} else {
  const installDoc = read(installDocPath);
  const normalizedInstallDoc = installDoc.toLowerCase();
  const requiredDocTokens = [
    "global Codex plugin installation",
    ".agents/plugins/marketplace.json",
    "codex plugin marketplace add",
    "GitHub",
    "Personal Marketplace Manual Install",
    "harness-workflow",
    "harness-builder",
    "brainstorm",
    "plan",
    "implement",
    "diagnose",
    "review",
    "verify",
    "cleanup",
    "find-skills",
    "recognition",
    "update",
    "uninstall",
    "node scripts/check-plugin.mjs",
    "plugin/list",
    "skills/list",
    "PowerShell",
  ];
  for (const token of requiredDocTokens) {
    if (!normalizedInstallDoc.includes(token.toLowerCase())) fail(`Codex install doc missing token: ${token}`);
  }
  pass("Codex install documentation covers install, recognition, update, and verification");
}

const readme = read("README.md");
for (const token of [
  "YSAA1/harness-workflow",
  "docs/install/codex.md",
  "docs/integrations/autoresearch.md",
  "codex plugin marketplace add",
  "node scripts/check-plugin.mjs",
]) {
  if (!readme.includes(token)) fail(`README missing Codex install entry token: ${token}`);
}
if (!process.exitCode) pass("README exposes the Codex install entry");

const templateFiles = [
  "skills/brainstorm/templates/spec.md",
  "skills/brainstorm/templates/spec.zh-CN.md",
  "skills/plan/templates/task_plan.md",
  "skills/plan/templates/task_plan.zh-CN.md",
  "skills/plan/templates/progress.md",
  "skills/plan/templates/progress.zh-CN.md",
  "skills/plan/templates/findings.md",
  "skills/plan/templates/findings.zh-CN.md",
  "skills/plan/templates/README.md",
  "skills/harness-builder/templates/research_route/research_plan.md.j2",
  "skills/harness-builder/templates/research_route/evidence_log.md.j2",
  "skills/harness-builder/templates/research_route/iteration_protocol.md.j2",
  "skills/harness-builder/templates/research_route/research_manifest.yaml.j2",
];
for (const file of templateFiles) {
  if (!exists(file)) fail(`missing template ${file}`);
}
if (templateFiles.every(exists)) pass("planning and research-route templates are preserved");

const languageAdaptiveSkills = ["brainstorm", "plan", "harness-builder"];
for (const skill of languageAdaptiveSkills) {
  const source = read(skillPath(skill));
  for (const token of ["用户可见文本跟随用户语言", "协议 token", "协议稳定优先"]) {
    if (!source.includes(token)) fail(`${skill} missing language-adaptive contract token: ${token}`);
  }
}

const brainstormSpecTemplate = read("skills/brainstorm/templates/spec.md");
const brainstormZhSpecTemplate = read("skills/brainstorm/templates/spec.zh-CN.md");
for (const heading of [
  "Background",
  "Goals",
  "Non-goals",
  "Users / Callers",
  "Behavior Spec",
  "Constraints",
  "Chosen Approach",
  "Rejected Options",
  "Verification Strategy",
  "Capability Gaps",
  "Success Criteria",
  "Residual Risks",
  "Plan Handoff",
]) {
  const englishOnlyHeading = new RegExp(`^## ${heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "m");
  if (englishOnlyHeading.test(brainstormZhSpecTemplate)) {
    fail(`brainstorm zh-CN spec template has English-only heading: ${heading}`);
  }
}
for (const token of ["## Background", "## Goals", "## Non-goals", "## Verification Strategy", "## Success Criteria"]) {
  if (!brainstormSpecTemplate.includes(token)) fail(`brainstorm default spec template missing English heading token: ${token}`);
}
for (const token of ["## 背景", "## 目标", "## 非目标（Non-goals）", "## 验证策略（Verification Strategy）", "## 成功标准（Success Criteria）"]) {
  if (!brainstormZhSpecTemplate.includes(token)) fail(`brainstorm zh-CN spec template missing Chinese heading token: ${token}`);
}
for (const forbidden of ["## 背景", "## 目标", "## 验证策略（Verification Strategy）"]) {
  if (brainstormSpecTemplate.includes(forbidden)) fail(`brainstorm default spec template should not force Chinese heading: ${forbidden}`);
}

const clarificationCoverage = read("skills/brainstorm/references/clarification-coverage.md");
for (const token of [
  "澄清覆盖矩阵（Clarification Coverage）",
  "Chinese-user example",
  "Default English/non-Chinese output",
  "维度（Dimension）",
  "目的（Purpose）",
  "Clarification Coverage",
  "| Dimension | Status | Source / note |",
  "Coverage: <confirmed+waived>/<8> confirmed or waived; <N> inferred pending assumption batch",
  "已确认或豁免（confirmed or waived）",
  "待假设批次确认（inferred pending assumption batch）",
  "成功标准（Success criteria）",
  "验证策略（Verification strategy）",
  "能力缺口（Capability gaps）",
]) {
  if (!clarificationCoverage.includes(token)) fail(`brainstorm clarification coverage missing bilingual token: ${token}`);
}
for (const forbidden of [
  "Copy this into chat and update every clarification turn",
]) {
  if (clarificationCoverage.includes(forbidden)) {
    fail(`brainstorm clarification coverage still has English-first output token: ${forbidden}`);
  }
}

const planTaskTemplate = read("skills/plan/templates/task_plan.md");
const planZhTaskTemplate = read("skills/plan/templates/task_plan.zh-CN.md");
for (const token of [
  "## Objective",
  "## Scope Contract",
  "- Active slice:",
  "- Non-goals:",
  "- Success criteria:",
  "- Verification path status: `runnable | blocked`",
  "Acceptance criteria:",
  "Verification commands:",
  "Success definition:",
]) {
  if (!planTaskTemplate.includes(token)) fail(`plan default task template missing English/default token: ${token}`);
}
for (const token of [
  "当前切片（Active slice）",
  "非目标（Non-goals）",
  "成功标准（Success criteria）",
  "验证路径状态（Verification path status）",
  "验收标准（acceptance_criteria）",
  "验证命令（verification_commands）",
  "成功定义（success_definition）",
]) {
  if (!planZhTaskTemplate.includes(token)) fail(`plan zh-CN task template missing bilingual field token: ${token}`);
}
for (const forbidden of ["当前切片（Active slice）", "非目标（Non-goals）", "验收标准（acceptance_criteria）"]) {
  if (planTaskTemplate.includes(forbidden)) fail(`plan default task template should not force Chinese field: ${forbidden}`);
}
for (const forbidden of ["- Non-goals：", "Acceptance criteria：", "Verification commands：", "Success definition："]) {
  if (planZhTaskTemplate.includes(forbidden)) fail(`plan zh-CN task template still has English-first field: ${forbidden}`);
}
const planProgressTemplate = read("skills/plan/templates/progress.md");
const planZhProgressTemplate = read("skills/plan/templates/progress.zh-CN.md");
const planFindingsTemplate = read("skills/plan/templates/findings.md");
const planZhFindingsTemplate = read("skills/plan/templates/findings.zh-CN.md");
for (const token of ["# Progress Log", "## Milestone Commits", "## Test Results", "## Five-Question Recovery Check"]) {
  if (!planProgressTemplate.includes(token)) fail(`plan default progress template missing English/default token: ${token}`);
}
for (const token of ["# 进度日志", "## 里程碑提交记录", "## 测试结果", "## 五问恢复检查"]) {
  if (!planZhProgressTemplate.includes(token)) fail(`plan zh-CN progress template missing Chinese token: ${token}`);
}
for (const token of ["# Findings And Decisions", "## Requirements", "## Accepted Spec", "## Rejected Options / Dead Ends"]) {
  if (!planFindingsTemplate.includes(token)) fail(`plan default findings template missing English/default token: ${token}`);
}
for (const token of ["# 发现与决策", "## 需求", "## 已接受规格", "## 拒绝选项 / 死路"]) {
  if (!planZhFindingsTemplate.includes(token)) fail(`plan zh-CN findings template missing Chinese token: ${token}`);
}
for (const [label, source] of [
  ["progress", planProgressTemplate],
  ["findings", planFindingsTemplate],
]) {
  for (const forbidden of ["# 进度日志", "# 发现与决策", "## 需求", "## 测试结果"]) {
    if (source.includes(forbidden)) fail(`plan default ${label} template should not force Chinese token: ${forbidden}`);
  }
}

const harnessUserTemplates = [
  ["skills/harness-builder/templates/AGENTS.md.j2", "项目概览（Project overview）", "Project overview"],
  ["skills/harness-builder/templates/state.md.j2", "当前工作（Active work）", "Active work"],
  ["skills/harness-builder/templates/verification.md.j2", "快速检查（Fast check）", "Fast check"],
  ["skills/harness-builder/templates/project_context.md.j2", "项目上下文（Project Context）", "Project Context"],
  ["skills/harness-builder/templates/workflow.md.j2", "Agent 工作流（Agent Workflow）", "Agent Workflow"],
  ["skills/harness-builder/templates/progress.md.j2", "进度（Progress）", "Progress"],
  ["skills/harness-builder/templates/decisions.md.j2", "Harness 决策（Harness Decisions）", "Harness Decisions"],
  ["skills/harness-builder/templates/reports/verification_report.md.j2", "验证报告（Verification Report）", "Verification Report"],
  ["skills/harness-builder/templates/risk_register.md.j2", "风险登记表（Risk Register）", "Risk Register"],
  ["skills/harness-builder/templates/session_handoff.md.j2", "会话交接（Session Handoff）", "Session Handoff"],
  ["skills/harness-builder/templates/commit_convention.md.j2", "Commit 约定（Commit Convention）", "Commit Convention"],
];
for (const [file, zhTitle, enTitle] of harnessUserTemplates) {
  if (!exists(file)) fail(`missing harness user-facing template ${file}`);
  const source = read(file);
  if (!source.includes("lang_norm[:2] == 'zh'") || !source.includes("'中文' in lang_norm") || !source.includes("'chinese' in lang_norm")) {
    fail(`harness user-facing template lacks target language selector: ${file}`);
  }
  if (!source.includes(`'${zhTitle}' if zh else '${enTitle}'`)) {
    fail(`harness user-facing template lacks checked bilingual title ${zhTitle}: ${file}`);
  }
  for (const line of source.split(/\r?\n/)) {
    if (/^#{1,6}\s*[\u4e00-\u9fff]/.test(line)) {
      fail(`harness user-facing template has unconditional Chinese heading: ${file}: ${line}`);
    }
    if (line.trim() === "None recorded.") {
      fail(`harness user-facing template has unconditional English empty placeholder: ${file}`);
    }
  }
}
const commitConventionTemplate = read("skills/harness-builder/templates/commit_convention.md.j2");
for (const token of ["{% if zh %}", "harden harness-builder research closeout gate", "Research commits 可添加 trailers"]) {
  if (!commitConventionTemplate.includes(token)) {
    fail(`commit convention template missing localized example token: ${token}`);
  }
}
const harnessBuilderContract = read("skills/harness-builder/SKILL.md");
for (const forbidden of ["USER CHECKPOINT（", "HARNESS EVIDENCE（", "NEXT（"]) {
  if (harnessBuilderContract.includes(forbidden)) fail(`harness-builder protocol token line is not exact: ${forbidden}`);
}
for (const token of ["安装项目前，请先确认这个 Harness Recommendation Plan", "请回复：approve / change / stop。"]) {
  if (!harnessBuilderContract.includes(token)) fail(`harness-builder Chinese checkpoint example missing localized text: ${token}`);
}
if (harnessUserTemplates.every(([file]) => exists(file))) pass("core language-adaptive template checks passed");

const activeDocs = `${read(".codex-plugin/plugin.json")}\n${read("README.md")}\n${read("README.zh-CN.md")}\n${read("AGENTS.md")}\n${read("CONTEXT.md")}\n${read("docs/harness-method-contract.md")}\n${read("docs/integrations/autoresearch.md")}\n${read("scripts/generate-skill-flow-html.mjs")}`;
for (const token of [
  "C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9", "C10",
  "Harness Builder", "recovery surface", "three-file", "Spec", "Executable Plan",
  "Knowledge Cleanup", "Capability Recommendation", "AGENTS.md", "项目铁律", "fresh evidence",
  "Harness Recommendation Matrix",
  "Research Route", "autoresearch", "Evidence Loop", "Research Reset Policy",
]) {
  if (!activeDocs.includes(token)) fail(`docs missing boundary token: ${token}`);
}

const forbiddenActiveSkillPatterns = [
  /Use state-contract/i,
  /Use resume/i,
  /Use save-session/i,
  /Use bootstrap/i,
  /Next skill:\s*<bootstrap/i,
  /Next:\s*<[^>]*(save-session|resume|bootstrap)/i,
  /skills\/(state-contract|resume|save-session)\//i,
  /\.\.\/(state-contract|resume|save-session)\/SKILL\.md/i,
];
for (const pattern of forbiddenActiveSkillPatterns) {
  if (pattern.test(activeDocs)) fail(`active docs still route to removed or legacy skill: ${pattern}`);
}

if (exists(skillPath("harness-builder"))) {
  const harnessBuilder = read(skillPath("harness-builder"));
  for (const token of [
    "Harness Hypothesis",
    "project-level harness",
    "Harness Recommendation Mode",
    "Recommended flow",
    "Question gate",
    "Capability Recommendation pass",
    "automation_recommendation_guide.md",
    "Harness Recommendation Plan",
    "Verification design gate",
    "User checkpoint",
    "USER CHECKPOINT",
    "No reusable skill search needed",
    "No web research needed",
    "No install recommended",
    "approve / change / stop",
    "AGENTS.md",
    "Project iron laws",
    "Capability Recommendation",
    "$find-skills",
    "targeted web search",
    "recovery surface",
    "Research Route",
    "research_route_policy.md",
    "templates/research_route",
    "git reset --hard",
    "subagent",
    "anti-entropy",
    "Hot recovery docs are bounded indexes",
    "Status/check/selftest scripts are views/probes",
  ]) {
    if (!harnessBuilder.includes(token)) fail(`harness-builder missing token: ${token}`);
  }

  for (const token of ["three-file", "lightweight", "feature-list", "existing", "active_slice", "progress.md", "findings.md"]) {
    if (!harnessBuilder.includes(token)) fail(`recovery surface policy missing token: ${token}`);
  }
}

const hotTarget = fs.mkdtempSync(path.join(os.tmpdir(), "harness-hot-target-"));
try {
  fs.mkdirSync(path.join(hotTarget, "scripts/agent"), { recursive: true });
  fs.mkdirSync(path.join(hotTarget, ".harness"), { recursive: true });
  fs.writeFileSync(path.join(hotTarget, "AGENTS.md"), "# Test\n");
  fs.writeFileSync(path.join(hotTarget, "scripts/agent/check.sh"), "#!/usr/bin/env bash\ntrue\n");
  fs.writeFileSync(path.join(hotTarget, ".harness/manifest.yaml"), "version: 1\n");
  fs.writeFileSync(path.join(hotTarget, ".harness/decisions.md"), "# Decisions\n");
  fs.writeFileSync(path.join(hotTarget, ".harness/state.md"), Array.from({ length: 301 }, (_, i) => `line ${i}`).join("\n"));
  fs.writeFileSync(
    path.join(hotTarget, "scripts/agent/status.sh"),
    [
      "#!/usr/bin/env bash",
      "printf '%s\\n' active_slice",
      "printf '%s\\n' current_phase",
      "printf '%s\\n' evidence_log",
      "printf '%s\\n' probe inventory",
      "printf '%s\\n' current status",
    ].join("\n"),
  );
  const result = spawnSync("python3", ["-B", "scripts/validate_harness.py", "--target", hotTarget], {
    cwd: path.join(root, "skills/harness-builder"),
    encoding: "utf8",
  });
  const hotStdout = result.stdout || "";
  const hotStderr = result.stderr || result.error?.message || "";
  if (result.error) {
    fail(`target validator command failed: ${hotStderr}`);
  } else if (result.status === 0) {
    fail("target validator should reject hot recovery doc and status-script state mirror");
  } else if (!hotStdout.includes("hot recovery doc too large") || !hotStdout.includes("agent script appears to mirror recovery state")) {
    fail(`target validator did not report expected hot-surface issues: ${hotStdout || hotStderr}`);
  } else {
    pass("target anti-entropy validator catches hot surface bloat");
  }
} finally {
  fs.rmSync(hotTarget, { recursive: true, force: true });
}

const skillBundle = workflowSkills.map((skill) => (exists(skillPath(skill)) ? read(skillPath(skill)) : "")).join("\n");
for (const token of ["WIP=1", "fresh evidence", "Spec", "Executable Plan", "Knowledge Cleanup", "recovery surface"]) {
  if (!skillBundle.includes(token)) fail(`skills missing discipline token: ${token}`);
}

const brainstorm = read(skillPath("brainstorm"));
if (!/Spec/i.test(brainstorm) || /默认.*findings\.md/.test(brainstorm)) {
  fail("brainstorm must produce an independent Spec without default findings.md writes");
}
const plan = read(skillPath("plan"));
if (!/Executable Plan/i.test(plan) || /默认使用 three-file backend/.test(plan)) {
  fail("plan must produce an Executable Plan without default three-file identity");
}
for (const token of [
  "Verification path status",
  "Required capabilities",
  "Fallback evidence",
  "Final integration claim",
  "Next skill: <implement | diagnose | harness-builder | verify>",
  "final_integration_claim",
]) {
  if (!plan.includes(token)) fail(`plan contract missing verification-gate token: ${token}`);
}
const implement = read(skillPath("implement"));
for (const token of ["Ready claim: not made; route to verify", "implementation feedback", "ready claim 只能由 `verify` 证明"]) {
  if (!implement.includes(token)) fail(`implement contract missing ready-gate token: ${token}`);
}
if (/连续两次失败/.test(implement)) fail("implement must not use mechanical two-failure routing");
const review = read(skillPath("review"));
for (const token of ["verify` fast-path", "review 不声明 ready", "Evidence routing"]) {
  if (!review.includes(token)) fail(`review contract missing structural-review token: ${token}`);
}
if (/Pass and evidence is already fresh\s*\|\s*`cleanup`/.test(review)) {
  fail("review must not route pass directly to final cleanup");
}
const verify = read(skillPath("verify"));
for (const token of ["`verify` 是唯一 ready gate", "Verification record:", "claim_id", "covered_paths", "latest_change_ref", "skipped_high_value_checks", "unknowns", "ready: yes|no"]) {
  if (!verify.includes(token)) fail(`verify contract missing structured-evidence token: ${token}`);
}
const cleanup = read(skillPath("cleanup"));
if (!/Knowledge Cleanup/i.test(cleanup) || /save-session/.test(cleanup)) {
  fail("cleanup must center Knowledge Cleanup and not route to save-session");
}
const findSkills = read(skillPath("find-skills"));
for (const token of ["npx skills find", "npx skills add", "skills.sh", "Verify Quality Before Recommending"]) {
  if (!findSkills.includes(token)) fail(`find-skills helper missing token: ${token}`);
}

const flowReviewScript = "scripts/generate-skill-flow-html.mjs";
if (!exists(flowReviewScript)) fail("skill flow HTML generator is missing");
else {
  const flowReviewSource = read(flowReviewScript);
  if (/\["review",\s*"cleanup"\]/.test(flowReviewSource)) {
    fail("skill flow generator must not show review as direct final cleanup route");
  }
  if (!flowReviewSource.includes('["plan", "verify"]')) {
    fail("skill flow generator must show proof-only plan to verify route");
  }
  if (!flowReviewSource.includes('["知识漂移", ["review", "verify", "cleanup"]]')) {
    fail("skill flow generator must route knowledge drift through verify before cleanup");
  }
}

if (!process.exitCode) pass("contract coverage checks passed");

const runCodex = (args) => {
  if (process.platform === "win32") {
    return spawnSync(process.env.ComSpec ?? "cmd.exe", ["/d", "/s", "/c", `codex.cmd ${args.join(" ")}`], {
      encoding: "utf8",
    });
  }
  return spawnSync("codex", args, { encoding: "utf8" });
};

const codexVersion = runCodex(["--version"]);
if (codexVersion.status === 0) {
  info(`local Codex CLI detected: ${codexVersion.stdout.trim()}`);
  const marketplaceHelp = runCodex(["plugin", "marketplace", "add", "--help"]);
  if (marketplaceHelp.status === 0 && marketplaceHelp.stdout.includes("<SOURCE>")) {
    info("live install command surface available: codex plugin marketplace add <SOURCE>");
  } else {
    info("Codex CLI detected, but marketplace add help was not available; use docs/install/codex.md manual recognition steps");
  }
} else {
  info("Codex CLI not detected in this shell; use docs/install/codex.md manual recognition steps");
}
