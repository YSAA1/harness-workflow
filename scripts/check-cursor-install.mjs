#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const cwd = process.cwd();
const root = fs.existsSync(path.join(cwd, ".codex-plugin", "plugin.json"))
  ? cwd
  : path.resolve(cwd, "plugins/harness-workflow");

const activeWorkflows = [
  "harness-builder",
  "brainstorm",
  "plan",
  "implement",
  "diagnose",
  "review",
  "cleanup",
];
const helperSkills = ["find-skills", "capability-recommender", "agent-instructions-maintainer", "recovery-surface-builder", "verify"];
const aliasRules = ["verify"]; // historical lane aliases kept as thin rules
const bundledSkills = [...activeWorkflows, ...helperSkills];

const fail = (message) => {
  console.error(`FAIL: ${message}`);
  process.exitCode = 1;
};
const pass = (message) => console.log(`PASS: ${message}`);
const exists = (relativePath) => fs.existsSync(path.join(root, relativePath));
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");
const isIgnoredSupportFile = (relativePath) => {
  const parts = relativePath.split("/");
  return parts.includes("__pycache__") || /\.(pyc|pyo|pyd)$/.test(relativePath);
};
const listFiles = (relativeDir) => {
  const absoluteDir = path.join(root, relativeDir);
  if (!fs.existsSync(absoluteDir)) return [];
  const out = [];
  const walk = (absoluteCurrent, relativeCurrent) => {
    for (const entry of fs.readdirSync(absoluteCurrent, { withFileTypes: true })) {
      const absoluteEntry = path.join(absoluteCurrent, entry.name);
      const relativeEntry = path.join(relativeCurrent, entry.name);
      const normalized = relativeEntry.replaceAll(path.sep, "/");
      if (isIgnoredSupportFile(normalized)) continue;
      if (entry.isDirectory()) walk(absoluteEntry, relativeEntry);
      else out.push(normalized);
    }
  };
  walk(absoluteDir, "");
  return out.sort();
};

if (!fs.existsSync(root)) {
  fail("plugin root is missing");
  process.exit(1);
}

for (const manifestPath of [".cursor-plugin/plugin.json", ".cursor-plugin/marketplace.json"]) {
  if (!exists(manifestPath)) {
    fail(`missing Cursor plugin manifest: ${manifestPath}`);
  } else {
    try {
      JSON.parse(read(manifestPath));
      pass(`Cursor manifest parses: ${manifestPath}`);
    } catch (error) {
      fail(`Cursor manifest JSON is invalid in ${manifestPath}: ${error.message}`);
    }
  }
}

if (exists(".cursor-plugin/plugin.json")) {
  const manifest = JSON.parse(read(".cursor-plugin/plugin.json"));
  if (manifest.name !== "harness-workflow") fail("Cursor plugin manifest name must be harness-workflow");
}
if (exists(".cursor-plugin/marketplace.json")) {
  const marketplace = JSON.parse(read(".cursor-plugin/marketplace.json"));
  const plugin = marketplace.plugins?.find((entry) => entry.name === "harness-workflow");
  if (marketplace.name !== "harness-workflow") fail("Cursor marketplace name must be harness-workflow");
  if (!plugin) fail("Cursor marketplace must expose harness-workflow");
}

const pluginRulesDir = "rules";
const rulesDir = ".cursor/rules";
const cursorSkillsDir = ".cursor/skills";
if (!exists(pluginRulesDir)) fail("Cursor plugin rules directory is missing");
else pass("Cursor plugin rules directory exists");
if (!exists(rulesDir)) fail("Cursor rules directory is missing");
else pass("Cursor rules directory exists");
if (!exists(cursorSkillsDir)) fail("Cursor project-preview skills directory is missing");
else pass("Cursor project-preview skills directory exists");

const overview = `${rulesDir}/harness-workflow-overview.mdc`;
if (!exists(overview)) fail("Cursor overview rule is missing");
if (!exists(`${pluginRulesDir}/harness-workflow-overview.mdc`)) fail("Cursor plugin overview rule is missing");

if (exists(rulesDir)) {
  const ruleFiles = fs.readdirSync(path.join(root, rulesDir)).filter((file) => file.endsWith(".mdc"));
  const expectedCount = activeWorkflows.length + 1 + aliasRules.length;
  if (ruleFiles.length !== expectedCount) {
    fail(`Cursor rules should contain ${expectedCount} MDC files, found ${ruleFiles.length}`);
  }
}
if (exists(pluginRulesDir)) {
  const pluginRuleFiles = fs.readdirSync(path.join(root, pluginRulesDir)).filter((file) => file.endsWith(".mdc"));
  const expectedCount = activeWorkflows.length + 1 + aliasRules.length;
  if (pluginRuleFiles.length !== expectedCount) {
    fail(`Cursor plugin rules should contain ${expectedCount} MDC files, found ${pluginRuleFiles.length}`);
  }
}

for (const alias of aliasRules) {
  const rulePath = `${rulesDir}/${alias}.mdc`;
  const pluginRulePath = `${pluginRulesDir}/${alias}.mdc`;
  if (!exists(rulePath)) fail(`missing Cursor alias rule for ${alias}`);
  if (!exists(pluginRulePath)) fail(`missing Cursor plugin alias rule for ${alias}`);
  if (read(rulePath) !== read(pluginRulePath)) fail(`Cursor plugin alias rule and project adapter rule drifted: ${alias}`);
}

for (const workflow of activeWorkflows) {
  const rulePath = `${rulesDir}/${workflow}.mdc`;
  const pluginRulePath = `${pluginRulesDir}/${workflow}.mdc`;
  const skillPath = `skills/${workflow}/SKILL.md`;

  if (!exists(rulePath)) {
    fail(`missing Cursor rule for ${workflow}`);
    continue;
  }
  if (!exists(pluginRulePath)) fail(`missing Cursor plugin rule for ${workflow}`);
  if (exists(pluginRulePath) && read(pluginRulePath) !== read(rulePath)) {
    fail(`Cursor plugin rule and project adapter rule drifted: ${workflow}`);
  }
  if (!exists(skillPath)) fail(`missing canonical skill for ${workflow}`);

  const body = read(rulePath);
  if (!body.startsWith("---")) fail(`${rulePath} missing MDC frontmatter`);
  if (!/description:\s*\S/.test(body)) fail(`${rulePath} missing description metadata`);
  if (!/alwaysApply:\s*(true|false)/.test(body)) fail(`${rulePath} missing alwaysApply metadata`);
  for (const section of [
    "When To Use",
    "Inputs",
    "Procedure",
    "Outputs",
    "Verification / Done Criteria",
    `skills/${workflow}/SKILL.md`,
  ]) {
    if (!body.includes(section)) fail(`${rulePath} missing section or canonical pointer: ${section}`);
  }
}
if (!process.exitCode) pass("Cursor rules cover all active workflows");

for (const skill of bundledSkills) {
  if (!exists(`skills/${skill}/SKILL.md`)) fail(`missing bundled skill for Cursor adapter: ${skill}`);
  if (!exists(`${cursorSkillsDir}/${skill}/SKILL.md`)) {
    fail(`missing Cursor project-preview skill: ${skill}`);
  } else if (read(`skills/${skill}/SKILL.md`) !== read(`${cursorSkillsDir}/${skill}/SKILL.md`)) {
    fail(`canonical skill and Cursor project-preview skill drifted: ${skill}`);
  }
}
if (!process.exitCode) pass("Cursor project-preview skills cover all bundled skills");

const canonicalSkillFiles = listFiles("skills");
const cursorSkillFiles = listFiles(cursorSkillsDir);
if (JSON.stringify(canonicalSkillFiles) !== JSON.stringify(cursorSkillFiles)) {
  fail("canonical skills and Cursor project-preview skills have different file lists");
} else {
  for (const file of canonicalSkillFiles) {
    if (read(`skills/${file}`) !== read(`${cursorSkillsDir}/${file}`)) {
      fail(`canonical skills and Cursor project-preview skills drifted: ${file}`);
    }
  }
  if (!process.exitCode) pass("Cursor project-preview skills match canonical skills recursively");
}

const installer = "scripts/install-cursor.mjs";
if (!exists(installer)) {
  fail("Cursor project adapter installer is missing");
} else {
  const installerBody = read(installer);
  for (const token of ["--target", "--dry-run", ".cursor", "rules", "skills", "find-skills"]) {
    if (!installerBody.includes(token)) fail(`Cursor installer missing token: ${token}`);
  }
  pass("Cursor project adapter installer exists");
}

const rulesBundle = exists(rulesDir)
  ? fs
      .readdirSync(path.join(root, rulesDir))
      .filter((file) => file.endsWith(".mdc"))
      .map((file) => read(`${rulesDir}/${file}`))
      .join("\n")
  : "";

for (const token of [
  "Spec",
  "Executable Plan",
  "fresh evidence",
  "Knowledge Cleanup",
  "recovery surface",
  "WIP=1",
  "Capability Recommendation",
  "Harness Recommendation Matrix",
  "rules adapter",
  ".harness",
]) {
  if (!rulesBundle.includes(token)) fail(`Cursor rules missing core token: ${token}`);
}

if (exists(".cursorrules")) fail("legacy .cursorrules must not be the main Cursor path");
else pass("legacy .cursorrules is absent");

const installDoc = "docs/install/cursor.md";
if (!exists(installDoc)) {
  fail("Cursor install doc is missing");
} else {
  const doc = read(installDoc);
  const normalizedDoc = doc.toLowerCase();
  for (const token of [
    ".cursor-plugin/plugin.json",
    "rules/",
    ".cursor/rules",
    ".cursor/skills",
    "find-skills",
    "project rules",
    "project adapter",
    "node scripts/install-cursor.mjs --target",
    "node scripts/check-cursor-install.mjs",
    "/add-plugin harness-workflow",
  ]) {
    if (!normalizedDoc.includes(token.toLowerCase())) fail(`Cursor install doc missing token: ${token}`);
  }
  for (const forbidden of [
    /Cursor\s+会安装\s+Codex plugin/i,
    /Cursor\s+will\s+install\s+the\s+Codex plugin/i,
    /Cursor\s+installs\s+the\s+Codex plugin/i,
  ]) {
    if (forbidden.test(doc)) {
      fail("Cursor install doc appears to claim Cursor installs the Codex plugin");
    }
  }
  if (/\.codex-plugin\/plugin\.json\s+.*(主路径|main path|runtime entry)/i.test(doc)) {
    fail("Cursor install doc appears to claim Cursor installs the Codex plugin");
  }
  pass("Cursor install doc states Project Rules path and limitations");
}

const readme = "README.md";
if (!exists(readme)) {
  fail("README is missing");
} else {
  const body = read(readme);
  for (const token of [
    "Cursor plugin",
    "project-local",
    "adapter installs `.cursor/rules/` and `.cursor/skills/`",
    "docs/install/cursor.md",
    "node scripts/install-cursor.mjs --target",
    "node scripts/check-cursor-install.mjs",
    "legacy `.cursorrules`",
  ]) {
    if (!body.includes(token)) fail(`README missing Cursor token: ${token}`);
  }
  if (/Cursor\s+会安装\s+Codex plugin/i.test(body)) {
    fail("README appears to claim Cursor installs the Codex plugin");
  }
  pass("README documents Cursor as a rules adapter");
}

console.log("");
console.log("Manual Cursor recognition check:");
console.log("1. For marketplace usage, install with /add-plugin harness-workflow and confirm the plugin appears.");
console.log("2. For project adapter usage, run node scripts/install-cursor.mjs --target . from the target project.");
console.log("3. Open the target project in Cursor and inspect active rules in Settings > Rules or the Agent sidebar.");
console.log("4. Confirm Harness Workflow overview, seven workflow rules, and .cursor/skills appear, including helper skills.");
console.log("5. Test prompt: Use Harness Workflow to plan a scoped implementation.");

if (!process.exitCode) pass("Cursor install workflow checks passed");
