#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
let failed = false;
const fail = (message) => { failed = true; console.error(`FAIL: ${message}`); };
const pass = (message) => console.log(`PASS: ${message}`);
const exists = (relativePath) => fs.existsSync(path.join(root, relativePath));
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");
const readJson = (relativePath) => JSON.parse(read(relativePath));
const workflowSkills = ["harness-builder", "brainstorm", "plan", "implement", "diagnose", "review", "ship", "cleanup"];
const helperSkills = ["find-skills", "capability-recommender", "agent-instructions-maintainer", "recovery-surface-builder"];
const activeSkills = [...workflowSkills, ...helperSkills];
const removedSkills = ["bootstrap", "state-contract", "resume", "save-session", "verify"];
const staleSurfaces = [".codex-plugin", ".cursor-plugin", ".cursor", "rules", "plugins", ".agents/plugins", "docs/install"];
const staleTokens = [
  "codex plugin marketplace add",
  "install-cursor.mjs",
  "check-cursor-install.mjs",
  "check-claude-code-install.mjs",
  "docs/install/codex.md",
];
const listFiles = (relativeDir) => {
  const absoluteDir = path.join(root, relativeDir);
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

if (!exists("skills") || !exists("AGENTS.md")) {
  fail("repo root is missing skills/ or AGENTS.md");
  process.exit(1);
}

const dirs = fs.readdirSync(path.join(root, "skills"), { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();
if (JSON.stringify(dirs) !== JSON.stringify([...activeSkills].sort())) {
  fail(`skill set mismatch, found: ${dirs.join(", ")}`);
} else {
  pass("skill set is exactly the 8 workflow lanes plus 4 helpers");
}

for (const skill of activeSkills) {
  const file = `skills/${skill}/SKILL.md`;
  if (!exists(file)) { fail(`missing skill ${skill}`); continue; }
  const body = read(file);
  if (!body.startsWith("---")) fail(`${skill} missing YAML frontmatter`);
  if (!new RegExp(`name:\\s*["']?${skill.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}["']?`, "m").test(body)) fail(`${skill} frontmatter name mismatch`);
  const description = body.match(/^description:\s*(.+)$/m)?.[1] ?? "";
  if (description.replace(/^["']|["']$/g, "").length < 10) fail(`${skill} missing usable description`);
}
for (const skill of removedSkills) {
  if (exists(`skills/${skill}/SKILL.md`)) fail(`removed skill still exposed: ${skill}`);
}
if (!failed) pass("SKILL.md frontmatter, names and descriptions are valid");

// Relative markdown links inside skills must resolve from their own file.
for (const file of listFiles("skills").filter((file) => file.endsWith(".md"))) {
  const absolute = path.join(root, "skills", file);
  const body = fs.readFileSync(absolute, "utf8");
  for (const match of body.matchAll(/\[[^\]\n]*\]\(([^\s)]+)\)/g)) {
    const target = match[1];
    if (/^(?:[a-z]+:|#|\/)/i.test(target) || target.includes("{{")) continue;
    const local = target.split("#")[0];
    if (local && !fs.existsSync(path.resolve(path.dirname(absolute), local))) {
      fail(`broken skill reference: skills/${file} -> ${target}`);
    }
  }
}

for (const surface of staleSurfaces) {
  if (exists(surface)) fail(`stale install surface still exists: ${surface}`);
}
if (!failed) pass("no stale three-platform plugin surfaces or mirrors");

if (exists(".mcp.json")) fail("repo must not include default MCP config");
if (exists("hooks/hooks.json")) fail("repo must not include default hooks");
if (!failed) pass("no default MCP or hooks config");

try {
  const plugin = readJson(".claude-plugin/plugin.json");
  if (plugin.name !== "harness-workflow") fail("claude plugin name must be harness-workflow");
  if (!/^\d+\.\d+\.\d+$/.test(plugin.version)) fail(`claude plugin version must be plain semver: ${plugin.version}`);
  const market = readJson(".claude-plugin/marketplace.json");
  if (market.plugins?.[0]?.source !== "./") fail("marketplace plugin source must be ./ (repo root)");
  if (!failed) pass("Claude Code plugin manifest and marketplace parse");
} catch (error) {
  fail(`Claude Code plugin manifest check failed: ${error.message}`);
}

const publicDocs = [
  "README.md",
  "README.zh-CN.md",
  "CONTEXT.md",
  "docs/harness-method-contract.md",
  "skills/harness-builder/SKILL.md",
].map((file) => (exists(file) ? read(file) : "")).join("\n");
for (const token of ["capability-recommender", "agent-instructions-maintainer", "recovery-surface-builder", "Helper Skill", "Capability Recommender", "Agent Instructions Maintainer", "Recovery Surface Builder", "C1", "C10", "fresh evidence", "Knowledge Cleanup"]) {
  if (!publicDocs.includes(token)) fail(`public docs missing helper/boundary token: ${token}`);
}
if (!failed) pass("public docs expose helper split and method tokens");

if (!exists("docs/install.md")) {
  fail("missing docs/install.md");
} else {
  const installDoc = read("docs/install.md");
  for (const token of ["npx skills", "YSAA1/harness-workflow"]) {
    if (!installDoc.includes(token)) fail(`docs/install.md missing token: ${token}`);
  }
  for (const skill of activeSkills) {
    if (!installDoc.includes(skill)) fail(`docs/install.md missing skill: ${skill}`);
  }
  if (!failed) pass("install doc covers skills.sh command and full skill list");
}

for (const file of ["README.md", "README.zh-CN.md", "AGENTS.md", "docs/install.md"]) {
  if (!exists(file)) { fail(`missing public file: ${file}`); continue; }
  const body = read(file);
  for (const token of staleTokens) {
    if (body.includes(token)) fail(`${file} still contains stale token: ${token}`);
  }
}
for (const token of ["npx skills", "YSAA1/harness-workflow", "docs/install.md", "node scripts/check-plugin.mjs"]) {
  if (!read("README.md").includes(token)) fail(`README.md missing token: ${token}`);
  if (!read("README.zh-CN.md").includes(token)) fail(`README.zh-CN.md missing token: ${token}`);
}
if (!failed) pass("READMEs point at the skills.sh install surface");

const templates = ["skills/brainstorm/templates/spec.md", "skills/brainstorm/templates/spec.zh-CN.md"];
for (const file of templates) if (!exists(file)) fail(`missing template ${file}`);

if (failed) process.exit(1);
pass("harness-workflow structure check passed");
