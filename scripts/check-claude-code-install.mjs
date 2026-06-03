#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const cwd = process.cwd();
const root = fs.existsSync(path.join(cwd, "skills")) ? cwd : path.resolve(cwd, "plugins/harness-workflow");
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

let failed = false;
const fail = (message) => {
  failed = true;
  console.error(`FAIL: ${message}`);
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

const validateSkill = (baseDir, skill) => {
  const skillMd = `${baseDir}/${skill}/SKILL.md`;
  if (!exists(skillMd)) {
    fail(`missing Claude Code skill entry: ${skillMd}`);
    return;
  }

  const body = read(skillMd);
  if (!body.startsWith("---")) fail(`${skillMd} missing YAML frontmatter`);
  const frontmatter = body.match(/^---\r?\n([\s\S]*?)\r?\n---/m);
  if (!frontmatter) fail(`${skillMd} frontmatter is not closed`);
  if (!new RegExp(`name:\\s*["']?${skill.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}["']?`, "m").test(body)) {
    fail(`${skillMd} frontmatter name must match directory`);
  }
  if (!/^description:\s*\S/m.test(body)) fail(`${skillMd} missing description`);
  const description = frontmatter?.[1].split(/\r?\n/).find((line) => line.startsWith("description:"));
  if (description) {
    const value = description.replace(/^description:\s*/, "");
    const quoted = (value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"));
    if (!quoted && value.includes(": ")) {
      fail(`${skillMd} description contains an unquoted colon and may fail Claude Code YAML parsing`);
    }
  }
};

if (!fs.existsSync(root)) {
  fail("repository root is missing");
  process.exit(1);
}

for (const skill of activeSkills) {
  validateSkill("skills", skill);
}
for (const skill of removedSkills) {
  if (exists(`skills/${skill}/SKILL.md`)) fail(`removed skill exposed to Claude Code: ${skill}`);
}
if (exists(".claude/skills")) {
  fail("repository must not ship project-local .claude/skills as the primary Claude Code install surface");
}
if (!failed) pass("Claude Code global plugin skill set uses canonical workflow skills plus helpers");

for (const skill of activeSkills) {
  const files = listFiles(`skills/${skill}`);
  if (!files.includes("SKILL.md")) fail(`canonical skill ${skill} is missing SKILL.md`);
}
if (!failed) pass("Claude Code plugin skills preserve canonical supporting files");

if (!exists(".claude-plugin/plugin.json")) {
  fail("missing Claude Code plugin manifest: .claude-plugin/plugin.json");
} else {
  try {
    const manifest = JSON.parse(read(".claude-plugin/plugin.json"));
    if (manifest.name !== "harness-workflow") fail("Claude plugin manifest name must be harness-workflow");
    if (!manifest.description) fail("Claude plugin manifest missing description");
    pass("Claude Code plugin manifest parses");
  } catch (error) {
    fail(`Claude plugin manifest JSON is invalid: ${error.message}`);
  }
}

if (!exists(".claude-plugin/marketplace.json")) {
  fail("missing Claude Code marketplace manifest: .claude-plugin/marketplace.json");
} else {
  try {
    const marketplace = JSON.parse(read(".claude-plugin/marketplace.json"));
    const plugin = marketplace.plugins?.find((entry) => entry.name === "harness-workflow");
    if (marketplace.name !== "harness-workflow") fail("Claude marketplace name must be harness-workflow");
    if (Object.hasOwn(marketplace, "description")) {
      fail("Claude marketplace manifest must not use top-level description; Claude Code rejects this key");
    }
    if (!marketplace.metadata?.description) {
      fail("Claude marketplace manifest must include metadata.description");
    }
    if (!plugin) fail("Claude marketplace must expose harness-workflow");
    if (plugin && plugin.source !== "./") fail("Claude marketplace source must point at the repository root");
    pass("Claude Code marketplace manifest parses");
  } catch (error) {
    fail(`Claude marketplace JSON is invalid: ${error.message}`);
  }
}

const methodContract = exists("docs/harness-method-contract.md") ? read("docs/harness-method-contract.md") : "";
const skillBundle = workflowSkills.map((skill) => read(`skills/${skill}/SKILL.md`)).join("\n");
for (const token of [
  "C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9", "C10",
  "recovery surface", "fresh evidence", "WIP=1", "Knowledge Cleanup", "Capability Recommendation", "Harness Recommendation Matrix",
]) {
  if (!`${methodContract}\n${skillBundle}`.includes(token)) fail(`Claude Code line missing required discipline token: ${token}`);
}
if (!failed) pass("Claude Code line preserves Harness Method Contract discipline");

if (!exists("docs/install/claude-code.md")) {
  fail("missing docs/install/claude-code.md");
} else {
  const doc = read("docs/install/claude-code.md");
  for (const token of [
    "global Claude Code installation",
    "claude plugin marketplace add",
    "claude plugin install",
    ".claude-plugin/plugin.json",
    ".claude-plugin/marketplace.json",
    "~/.claude/skills/",
    "%USERPROFILE%\\.claude\\skills",
    "/harness-workflow:harness-builder",
    "/harness-workflow:find-skills",
    "/harness-builder",
    "Update",
    "Uninstall",
    "Codex",
    "Cursor",
  ]) {
    if (!doc.includes(token)) fail(`Claude install doc missing token: ${token}`);
  }
  if (!doc.includes("Claude Code does not read `.codex-plugin/plugin.json`")) {
    fail("Claude install doc must state that Claude Code does not read the Codex manifest");
  }
  if (/project-local\s+`?\.claude\/skills`?\s+install/i.test(doc) && !/not project-local/i.test(doc)) {
    fail("Claude install doc appears to present project-local .claude/skills as the install path");
  }
}
if (!failed) pass("Claude Code install documentation covers global install, recognition, update, uninstall, and fallback");

process.exitCode = failed ? 1 : 0;
