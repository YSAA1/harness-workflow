#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const cwd = process.cwd();
const root = fs.existsSync(path.join(cwd, "skills")) ? cwd : path.resolve(cwd, "plugins/harness-workflow");
const activeSkills = [
  "harness-builder",
  "brainstorm",
  "plan",
  "implement",
  "diagnose",
  "review",
  "verify",
  "cleanup",
];
const removedSkills = ["bootstrap", "state-contract", "resume", "save-session"];

let failed = false;
const fail = (message) => {
  failed = true;
  console.error(`FAIL: ${message}`);
};
const pass = (message) => console.log(`PASS: ${message}`);
const exists = (relativePath) => fs.existsSync(path.join(root, relativePath));
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");

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
  if (!exists(`skills/${skill}/SKILL.md`)) fail(`missing canonical skill: skills/${skill}/SKILL.md`);
  validateSkill("skills", skill);
  validateSkill(".claude/skills", skill);
}
for (const skill of removedSkills) {
  if (exists(`.claude/skills/${skill}/SKILL.md`)) fail(`removed skill exposed to Claude Code: ${skill}`);
}
if (!failed) pass("Claude Code project skill set exposes the 8 active workflow skills");

for (const skill of activeSkills) {
  const canonicalFiles = listFiles(`skills/${skill}`);
  const claudeFiles = new Set(listFiles(`.claude/skills/${skill}`));
  for (const file of canonicalFiles) {
    if (!claudeFiles.has(file)) fail(`Claude Code copy for ${skill} is missing ${file}`);
  }
}
if (!failed) pass("Claude Code project skills preserve canonical supporting files");

for (const dir of ["references", "templates", "scripts"]) {
  const canonicalCount = activeSkills.reduce((count, skill) => count + listFiles(`skills/${skill}/${dir}`).length, 0);
  const claudeCount = activeSkills.reduce((count, skill) => count + listFiles(`.claude/skills/${skill}/${dir}`).length, 0);
  if (canonicalCount !== claudeCount) fail(`${dir} file count mismatch: canonical=${canonicalCount}, claude=${claudeCount}`);
}
if (!failed) pass("references, templates, and scripts are mirrored");

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

const methodContract = exists("docs/harness-method-contract.md") ? read("docs/harness-method-contract.md") : "";
const claudeSkillBundle = activeSkills.map((skill) => exists(`.claude/skills/${skill}/SKILL.md`) ? read(`.claude/skills/${skill}/SKILL.md`) : "").join("\n");
for (const token of [
  "C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9", "C10",
  "recovery surface", "fresh evidence", "WIP=1", "Knowledge Cleanup", "Capability Discovery",
]) {
  if (!`${methodContract}\n${claudeSkillBundle}`.includes(token)) fail(`Claude Code line missing required discipline token: ${token}`);
}
if (!failed) pass("Claude Code line preserves Harness Method Contract discipline");

if (!exists("docs/install/claude-code.md")) {
  fail("missing docs/install/claude-code.md");
} else {
  const doc = read("docs/install/claude-code.md");
  for (const token of [
    ".claude/skills/",
    ".claude-plugin/plugin.json",
    "/harness-builder",
    "/harness-workflow:harness-builder",
    "%USERPROFILE%\\.claude",
    "更新",
    "卸载",
    "Codex",
    "Cursor",
  ]) {
    if (!doc.includes(token)) fail(`Claude install doc missing token: ${token}`);
  }
  if (!doc.includes("Claude Code 不读取 `.codex-plugin/plugin.json`")) {
    fail("Claude install doc must state that Claude Code does not read the Codex manifest");
  }
}
if (!failed) pass("Claude Code install documentation covers install, recognition, update, uninstall, and product differences");

process.exitCode = failed ? 1 : 0;
