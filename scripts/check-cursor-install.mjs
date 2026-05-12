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
  "verify",
  "cleanup",
];

const fail = (message) => {
  console.error(`FAIL: ${message}`);
  process.exitCode = 1;
};
const pass = (message) => console.log(`PASS: ${message}`);
const exists = (relativePath) => fs.existsSync(path.join(root, relativePath));
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");

if (!fs.existsSync(root)) {
  fail("plugin root is missing");
  process.exit(1);
}

const rulesDir = ".cursor/rules";
if (!exists(rulesDir)) fail("Cursor rules directory is missing");
else pass("Cursor rules directory exists");

const overview = `${rulesDir}/harness-workflow-overview.mdc`;
if (!exists(overview)) fail("Cursor overview rule is missing");

if (exists(rulesDir)) {
  const ruleFiles = fs.readdirSync(path.join(root, rulesDir)).filter((file) => file.endsWith(".mdc"));
  const expectedCount = activeWorkflows.length + 1;
  if (ruleFiles.length !== expectedCount) {
    fail(`Cursor rules should contain ${expectedCount} MDC files, found ${ruleFiles.length}`);
  }
}

for (const workflow of activeWorkflows) {
  const rulePath = `${rulesDir}/${workflow}.mdc`;
  const skillPath = `skills/${workflow}/SKILL.md`;

  if (!exists(rulePath)) {
    fail(`missing Cursor rule for ${workflow}`);
    continue;
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
  "Capability Discovery",
  "rules adapter",
  "three-file",
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
    ".cursor/rules",
    "project rules",
    "AGENTS.md",
    "rules adapter",
    "node scripts/check-cursor-install.mjs",
  ]) {
    const haystack = token === "AGENTS.md" ? doc : normalizedDoc;
    if (!haystack.includes(token)) fail(`Cursor install doc missing token: ${token}`);
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
    "Cursor Project Rules",
    "rules adapter",
    "docs/install/cursor.md",
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
console.log("1. Open this repository in Cursor.");
console.log("2. Open Cursor Settings > Rules or inspect active rules in the Agent sidebar.");
console.log("3. Confirm Harness Workflow overview and the eight workflow rules appear.");
console.log("4. Test prompt: Use Harness Workflow to plan a scoped implementation.");

if (!process.exitCode) pass("Cursor install workflow checks passed");
