#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const cwd = process.cwd();
const root = fs.existsSync(path.join(cwd, ".codex-plugin", "plugin.json"))
  ? cwd
  : path.resolve(cwd, "plugins/harness-workflow");
const fail = (message) => {
  console.error(`FAIL: ${message}`);
  process.exitCode = 1;
};
const pass = (message) => console.log(`PASS: ${message}`);
const info = (message) => console.log(`INFO: ${message}`);
const exists = (relativePath) => fs.existsSync(path.join(root, relativePath));
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");
const skillPath = (skill) => `skills/${skill}/SKILL.md`;
const readJson = (relativePath) => JSON.parse(read(relativePath));

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
    if (plugin?.source?.path !== "./") fail("Codex marketplace source path must point at repository root");
    pass("Codex marketplace manifest parses");
  } catch (error) {
    fail(`Codex marketplace JSON is invalid: ${error.message}`);
  }
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
}
for (const skill of removedSkills) {
  if (exists(skillPath(skill))) fail(`removed skill still exposed: ${skill}`);
}
if (exists("skills/harness-builder/references/legacy-bootstrap/SKILL.md")) {
  fail("legacy bootstrap reference must not be named SKILL.md; recursive skill scanners may expose it");
}
if (!exists("skills/harness-builder/references/legacy-bootstrap/bootstrap-legacy.md")) {
  fail("legacy bootstrap reference document is missing");
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

const activeDocs = `${read(".codex-plugin/plugin.json")}\n${read("README.md")}\n${read("README.zh-CN.md")}\n${read("AGENTS.md")}\n${read("CONTEXT.md")}\n${read("docs/harness-method-contract.md")}\n${read("docs/integrations/autoresearch.md")}\n${read("scripts/generate-skill-flow-html.mjs")}`;
for (const token of [
  "C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9", "C10",
  "Harness Builder", "recovery surface", "three-file", "Spec", "Executable Plan",
  "Knowledge Cleanup", "Capability Discovery", "AGENTS.md", "项目铁律", "fresh evidence",
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
    "AGENTS.md",
    "Project iron laws",
    "Capability Discovery",
    "$find-skills",
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
