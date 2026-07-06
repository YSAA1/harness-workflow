#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const cwd = process.cwd();
const root = fs.existsSync(path.join(cwd, ".codex-plugin", "plugin.json")) ? cwd : path.resolve(cwd, "plugins/harness-workflow");
const packagedRoot = path.join(root, "plugins", "harness-workflow");
let failed = false;
const fail = (message) => { failed = true; console.error(`FAIL: ${message}`); };
const pass = (message) => console.log(`PASS: ${message}`);
const exists = (relativePath) => fs.existsSync(path.join(root, relativePath));
const packageExists = (relativePath) => fs.existsSync(path.join(packagedRoot, relativePath));
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");
const packageRead = (relativePath) => fs.readFileSync(path.join(packagedRoot, relativePath), "utf8");
const readJson = (relativePath) => JSON.parse(read(relativePath));
const skillPath = (skill) => `skills/${skill}/SKILL.md`;
const workflowSkills = ["harness-builder", "brainstorm", "plan", "implement", "diagnose", "review", "verify", "cleanup"];
const helperSkills = ["find-skills", "capability-recommender", "agent-instructions-maintainer", "recovery-surface-builder"];
const activeSkills = [...workflowSkills, ...helperSkills];
const removedSkills = ["bootstrap", "state-contract", "resume", "save-session"];
const researchAssets = [
  "docs/integrations/autoresearch.md",
  "skills/harness-builder/references/research_route_policy.md",
  "skills/harness-builder/templates/research_route",
  "skills/harness-builder/templates/hooks/research_branch_push_guard.py.j2",
  "skills/harness-builder/templates/hooks/research_iteration_logger.py.j2",
];
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
  if (JSON.stringify(capabilities) !== JSON.stringify(["Read", "Write"])) fail("manifest capabilities must be exactly Read and Write");
  for (const prompt of manifest.interface?.defaultPrompt ?? []) {
    if (prompt.length > 128) fail(`manifest defaultPrompt is too long: ${prompt}`);
  }
  pass("Codex manifest parses and points at skills");
} catch (error) {
  fail(`manifest JSON is invalid: ${error.message}`);
}

try {
  const codex = readJson(".codex-plugin/plugin.json");
  const claude = readJson(".claude-plugin/plugin.json");
  const cursor = readJson(".cursor-plugin/plugin.json");
  if (codex.version !== claude.version || codex.version !== cursor.version) fail("public surface versions drifted");
  else pass(`public surface versions match: ${codex.version}`);
} catch (error) {
  fail(`public surface version check failed: ${error.message}`);
}

for (const file of [".agents/plugins/marketplace.json", ".claude-plugin/marketplace.json", ".cursor-plugin/marketplace.json"]) {
  if (!exists(file)) fail(`missing marketplace manifest: ${file}`);
  else {
    try { JSON.parse(read(file)); pass(`${file} parses`); }
    catch (error) { fail(`${file} JSON is invalid: ${error.message}`); }
  }
}

if (!fs.existsSync(packagedRoot)) {
  fail("missing packaged plugin root: plugins/harness-workflow");
} else {
  for (const file of [".codex-plugin/plugin.json", ".claude-plugin/plugin.json", ".cursor-plugin/plugin.json"]) {
    if (!packageExists(file)) fail(`packaged plugin missing ${file}`);
    else if (packageRead(file) !== read(file)) fail(`packaged plugin drifted from root file: ${file}`);
  }
  const rootSkillFiles = listFiles(root, "skills");
  const packagedSkillFiles = listFiles(packagedRoot, "skills");
  if (JSON.stringify(rootSkillFiles) !== JSON.stringify(packagedSkillFiles)) fail("packaged plugin skills have a different recursive file list from root skills");
  for (const file of rootSkillFiles) {
    const relativePath = `skills/${file}`;
    if (packageExists(relativePath) && packageRead(relativePath) !== read(relativePath)) fail(`packaged plugin skill file drifted: ${relativePath}`);
  }
  if (!failed) pass("packaged plugin mirrors root manifests and skills");
}

if (exists(".mcp.json")) fail("plugin must not include default MCP config");
if (exists("hooks/hooks.json")) fail("plugin must not include default hooks");
if (exists(".codex/config.toml")) fail("plugin must not include user or project Codex config");
if (!failed) pass("no default MCP/hooks/Codex config");

for (const skill of activeSkills) {
  if (!exists(skillPath(skill))) { fail(`missing skill ${skill}`); continue; }
  const body = read(skillPath(skill));
  if (!body.startsWith("---")) fail(`${skill} missing YAML frontmatter`);
  if (!new RegExp(`name:\\s*["']?${skill.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}["']?`, "m").test(body)) fail(`${skill} frontmatter name mismatch`);
  if (!/^description:\s*\S/m.test(body)) fail(`${skill} missing description`);
  if (!body.includes("## Recommended next skill")) fail(`${skill} missing Recommended next skill section`);
}
for (const skill of removedSkills) {
  if (exists(skillPath(skill))) fail(`removed skill still exposed: ${skill}`);
}
if (!failed) pass("active workflow and helper skill set is valid");

for (const asset of researchAssets) {
  if (exists(asset)) fail(`removed research asset still exists: ${asset}`);
  if (packageExists(asset)) fail(`removed research asset still exists in packaged plugin: ${asset}`);
}

const publicDocs = [
  ".codex-plugin/plugin.json",
  ".claude-plugin/plugin.json",
  ".cursor-plugin/plugin.json",
  "README.md",
  "README.zh-CN.md",
  "CONTEXT.md",
  "docs/harness-method-contract.md",
  "skills/harness-builder/SKILL.md",
].map((file) => (exists(file) ? read(file) : "")).join("\n");
for (const token of ["capability-recommender", "agent-instructions-maintainer", "recovery-surface-builder", "Helper Skill", "Capability Recommender", "Agent Instructions Maintainer", "Recovery Surface Builder", "C1", "C10", "fresh evidence", "Knowledge Cleanup"]) {
  if (!publicDocs.includes(token)) fail(`public docs missing helper/boundary token: ${token}`);
}
for (const token of ["autoresearch", "research_route", "Research Reset Policy", "Evidence Loop"]) {
  if (publicDocs.includes(token)) fail(`public docs still contain removed research token: ${token}`);
}
if (!failed) pass("public docs expose helper split and omit removed research gate tokens");

const readme = read("README.md");
for (const token of ["YSAA1/harness-workflow", "docs/install/codex.md", "codex plugin marketplace add", "node scripts/check-plugin.mjs", "capability-recommender", "agent-instructions-maintainer", "recovery-surface-builder"]) {
  if (!readme.includes(token)) fail(`README missing token: ${token}`);
}
const installDocs = ["docs/install/codex.md", "docs/install/claude-code.md", "docs/install/cursor.md"].map((file) => exists(file) ? read(file) : "").join("\n");
for (const skill of activeSkills) {
  if (!installDocs.includes(skill)) fail(`install docs missing skill: ${skill}`);
}

const templates = ["skills/brainstorm/templates/spec.md", "skills/brainstorm/templates/spec.zh-CN.md"];
for (const file of templates) if (!exists(file)) fail(`missing template ${file}`);

if (failed) process.exit(1);
pass("harness-workflow plugin check passed");