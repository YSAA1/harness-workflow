#!/usr/bin/env node
import fs from "node:fs";
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
const skillSupportPath = (skill, relativePath) => `skills/${skill}/${relativePath}`;
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
    ".claude-plugin/marketplace.json",
    ".cursor-plugin/plugin.json",
    ".cursor-plugin/marketplace.json",
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
  if (!/^## (输出契约|输出格式|Output contract)\s*$/m.test(body)) {
    fail(`${skill} missing output contract section`);
  }
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
  "skills/plan/templates/task_plan.md",
  "skills/plan/templates/progress.md",
  "skills/plan/templates/findings.md",
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

const activeDocs = `${read(".codex-plugin/plugin.json")}\n${read("README.md")}\n${read("README.zh-CN.md")}\n${read("AGENTS.md")}\n${read("CONTEXT.md")}\n${read("docs/workflow-glossary.md")}\n${read("docs/harness-method-contract.md")}\n${read("docs/integrations/autoresearch.md")}\n${read("docs/adr/0001-simplify-workflow-skill-boundaries.md")}\n${read("docs/adr/0002-skill-design-philosophy.md")}\n${read("scripts/generate-skill-flow-html.mjs")}`;
for (const token of [
  "C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9", "C10",
  "Harness Builder", "recovery surface", "three-file", "Spec", "Executable Plan",
  "Knowledge Cleanup", "Capability Discovery", "AGENTS.md", "项目铁律", "fresh evidence",
  "Capability Shortlist",
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
  const harnessBuilder = [
    read(skillPath("harness-builder")),
    read(skillSupportPath("harness-builder", "references/execution-gates.md")),
    read(skillSupportPath("harness-builder", "references/workflow-protocol.md")),
    read(skillSupportPath("harness-builder", "references/capability_signal_policy.md")),
    read(skillSupportPath("harness-builder", "references/recovery_surface_policy.md")),
    read(skillSupportPath("harness-builder", "references/research_route_policy.md")),
  ].join("\n");
  for (const token of [
    "Harness Hypothesis",
    "project-level harness",
    "Mandatory execution gates",
    "Question gate",
    "Capability Discovery gate",
    "Capability Shortlist pass",
    "capability_signal_policy.md",
    "recommendation-only mode",
    "Verification design gate",
    "User checkpoint gate",
    "USER CHECKPOINT",
    "No reusable skill search needed",
    "No web research needed",
    "Reply approve / change / stop",
    "AGENTS.md",
    "Project iron laws",
    "Capability Discovery",
    "find-skills",
    "targeted web search",
    "recovery surface",
    "Research Route",
    "research_route_policy.md",
    "templates/research_route",
    "git reset --hard",
    "subagent",
    "anti-entropy",
  ]) {
    if (!harnessBuilder.includes(token)) fail(`harness-builder missing token: ${token}`);
  }

  for (const token of ["three-file", "lightweight", "feature-list", "existing", "active_slice", "progress.md", "findings.md"]) {
    if (!harnessBuilder.includes(token)) fail(`recovery surface policy missing token: ${token}`);
  }
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
const verify = [
  read(skillPath("verify")),
  read(skillSupportPath("verify", "references/verification-record-template.md")),
  read(skillSupportPath("verify", "references/unverified-claim-policy.md")),
].join("\n");
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
