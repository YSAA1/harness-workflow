#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const cwd = process.cwd();
const root = fs.existsSync(path.join(cwd, ".codex-plugin", "plugin.json"))
  ? cwd
  : path.resolve(cwd, "plugins/harness-workflow");
const fail = (message) => {
  console.error(`FAIL: ${message}`);
  process.exitCode = 1;
};
const pass = (message) => console.log(`PASS: ${message}`);
const exists = (relativePath) => fs.existsSync(path.join(root, relativePath));
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");
const skillPath = (skill) => `skills/${skill}/SKILL.md`;

if (!fs.existsSync(root)) {
  fail("plugin root is missing");
  process.exit(1);
}

try {
  const manifest = JSON.parse(read(".codex-plugin/plugin.json"));
  if (manifest.name !== "harness-workflow") fail("manifest name must be harness-workflow");
  if (manifest.skills !== "./skills/") fail("manifest skills path must be ./skills/");
  pass("manifest parses and points at skills");
} catch (error) {
  fail(`manifest JSON is invalid: ${error.message}`);
}

if (exists(".mcp.json")) fail("plugin must not include default MCP config");
else pass("no default MCP config");
if (exists("hooks/hooks.json")) fail("plugin must not include default hooks");
else pass("no default hooks");

const requiredSkills = [
  "bootstrap",
  "state-contract",
  "brainstorm",
  "plan",
  "implement",
  "diagnose",
  "review",
  "verify",
  "resume",
  "save-session",
  "cleanup",
];

for (const skill of requiredSkills) {
  if (!exists(skillPath(skill))) fail(`missing skill ${skill}`);
}
if (!process.exitCode) pass("required skills exist");

for (const skill of requiredSkills) {
  if (!exists(skillPath(skill))) continue;
  const body = read(skillPath(skill));
  if (!body.startsWith("---")) fail(`${skill} missing YAML frontmatter`);
  if (!new RegExp(`name:\\s*${skill.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}`).test(body)) {
    fail(`${skill} frontmatter name mismatch`);
  }
  if (!/description:\s*/.test(body)) fail(`${skill} missing description`);
}
if (!process.exitCode) pass("skill frontmatter is valid");

const templateFiles = [
  "skills/plan/templates/task_plan.md",
  "skills/plan/templates/progress.md",
  "skills/plan/templates/findings.md",
  "skills/plan/templates/README.md",
];
for (const file of templateFiles) {
  if (!exists(file)) fail(`missing template ${file}`);
}
if (templateFiles.every(exists)) pass("three-file templates are preserved");

const docs = `${read("README.md")}\n${read("docs/harness-method-contract.md")}`;
for (const token of [
  "C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9", "C10",
  "state-contract", "workflow state", "three-file", "bootstrap", "Harness Hypothesis",
  "AGENTS.md", "项目铁律", "fresh evidence", "Entropy control",
]) {
  if (!docs.includes(token)) fail(`docs missing contract token: ${token}`);
}

const bootstrap = read(skillPath("bootstrap"));
for (const token of [
  "Harness Hypothesis",
  "project-level harness",
  "AGENTS.md",
  "Project iron laws",
  "Find skills before creating skills",
  "subagent",
  "anti-entropy",
]) {
  if (!bootstrap.includes(token)) fail(`bootstrap replacement missing token: ${token}`);
}

const stateContract = read(skillPath("state-contract"));
for (const token of ["three-file", "lightweight", "feature-list", "existing", "active_slice", "progress.md", "findings.md"]) {
  if (!stateContract.includes(token)) fail(`state-contract missing token: ${token}`);
}

const skillBundle = requiredSkills.map((skill) => (exists(skillPath(skill)) ? read(skillPath(skill)) : "")).join("\n");
for (const token of ["WIP=1", "fresh evidence", "workflow state", "state-contract", "progress.md", "findings.md"]) {
  if (!skillBundle.includes(token)) fail(`skills missing discipline token: ${token}`);
}

const flowReviewScript = "scripts/generate-skill-flow-html.mjs";
if (!exists(flowReviewScript)) fail("skill flow HTML generator is missing");

if (!process.exitCode) pass("contract coverage checks passed");
