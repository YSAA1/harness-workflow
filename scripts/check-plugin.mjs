#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const root = process.cwd();
let failed = false;
const fail = (message) => { failed = true; console.error(`FAIL: ${message}`); };
const pass = (message) => console.log(`PASS: ${message}`);
const exists = (relativePath) => fs.existsSync(path.join(root, relativePath));
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");
const readJson = (relativePath) => JSON.parse(read(relativePath));
const workflowSkills = ["harness-builder", "brainstorm", "plan", "implement", "diagnose", "review", "ship", "cleanup"];
const helperSkills = ["find-skills", "capability-recommender", "writing-for-agents"];
const disciplineSkills = ["tdd"];
const toolSkills = ["remove-deadcode-py", "sweep"];
const activeSkills = [...workflowSkills, ...helperSkills, ...disciplineSkills, ...toolSkills];
const removedSkills = ["bootstrap", "state-contract", "resume", "save-session", "verify", "agent-instructions-maintainer", "recovery-surface-builder"];
const staleSurfaces = [".codex-plugin", ".cursor-plugin", ".cursor", "rules", "plugins", ".agents/plugins", "docs/install"];
const staleTokens = [
  "codex plugin marketplace add",
  "install-cursor.mjs",
  "check-cursor-install.mjs",
  "check-claude-code-install.mjs",
  "docs/install/codex.md",
  "agent-instructions-maintainer",
  "recovery-surface-builder",
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
  pass(`skill set is exactly the 8 workflow lanes plus ${helperSkills.length} helpers, ${disciplineSkills.length} discipline skill(s) and ${toolSkills.length} tool skill(s)`);
}

const escapeRegExp = (text) => text.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
for (const skill of activeSkills) {
  const file = `skills/${skill}/SKILL.md`;
  if (!exists(file)) { fail(`missing skill ${skill}`); continue; }
  const body = read(file);
  const frontmatter = body.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatter) { fail(`${skill} missing YAML frontmatter`); continue; }
  if (!new RegExp(`^name:\\s*["']?${escapeRegExp(skill)}["']?\\s*$`, "m").test(frontmatter[1])) fail(`${skill} frontmatter name mismatch`);
  const description = frontmatter[1].match(/^description:\s*(.+)$/m)?.[1] ?? "";
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
  if (market.plugins?.[0]?.name !== plugin.name) fail("marketplace plugin name must match plugin.json name");
  if (market.plugins?.[0]?.description !== plugin.description || market.metadata?.description !== plugin.description) {
    fail("marketplace descriptions (metadata and plugin entry) must match plugin.json description");
  }
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
for (const token of ["capability-recommender", "writing-for-agents", "Helper Skill", "Capability Recommender", "Writing for Agents", "C1", "C10", "fresh evidence", "Knowledge Cleanup"]) {
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

// Stale-token scan covers every tracked live .md; historical evidence dirs are exempt.
const historicalPrefixes = [".harness/"];
let trackedFiles = [];
try {
  trackedFiles = execSync("git ls-files", { cwd: root, encoding: "utf8" }).split("\n").filter(Boolean);
} catch {
  trackedFiles = [];
}
const liveMarkdown = (trackedFiles.length ? trackedFiles : listFiles(".")).filter(
  (file) => file.endsWith(".md")
    && !historicalPrefixes.some((prefix) => file.startsWith(prefix))
    && !file.split("/")[0].startsWith("."),
);
for (const file of liveMarkdown) {
  if (!exists(file)) continue;
  const body = read(file);
  for (const token of staleTokens) {
    if (body.includes(token)) fail(`${file} still contains stale token: ${token}`);
  }
}
if (!failed) pass(`no stale install tokens across ${liveMarkdown.length} live markdown files`);

for (const file of ["README.md", "README.zh-CN.md"]) {
  if (!exists(file)) { fail(`missing public file: ${file}`); continue; }
  const body = read(file);
  if (body.includes("|`n") || body.includes("`n|")) fail(`${file} contains escaped newline residue inside Markdown tables`);
  for (const token of ["npx skills", "YSAA1/harness-workflow", "docs/install.md", "node scripts/check-plugin.mjs"]) {
    if (!body.includes(token)) fail(`${file} missing token: ${token}`);
  }
}
if (!failed) pass("READMEs point at the skills.sh install surface");

const templates = ["skills/brainstorm/templates/spec.md", "skills/brainstorm/templates/spec.zh-CN.md"];
for (const file of templates) if (!exists(file)) fail(`missing template ${file}`);

// Recovery-surface consistency: state.md vs its work_index row (matched by primary artifact),
// plus docs/plans & docs/specs reachability from the root set (.harness/ files + AGENTS.md + READMEs).
{
  const stripTicks = (text) => text.trim().replace(/^`+|`+$/g, "").trim();
  const stateBody = exists(".harness/state.md") ? read(".harness/state.md") : "";
  const stateStatus = stateBody.match(/^Status:\s*(\S+)/m)?.[1] ?? "";
  const stateArtifact = stripTicks(stateBody.match(/^Primary artifact:\s*(.+)$/m)?.[1] ?? "");
  const indexBody = exists(".harness/work_index.md") ? read(".harness/work_index.md") : "";
  if (stateStatus && stateArtifact && indexBody) {
    let registered = false;
    for (const line of indexBody.split("\n")) {
      const cells = line.split("|").map((cell) => cell.trim());
      if (cells.length < 6 || !/^\d+$/.test(cells[1]) || stripTicks(cells[4]) !== stateArtifact) continue;
      registered = true;
      const rowStatus = cells[3];
      const retired = (status) => status === "complete" || status === "abandoned";
      const consistent = rowStatus === stateStatus || (retired(stateStatus) && retired(rowStatus));
      if (!consistent) {
        fail(`recovery surface contradiction: state.md Status=${stateStatus} but work_index row ${cells[1]} is ${rowStatus} (${stateArtifact})`);
      }
    }
    if (!registered) fail(`recovery surface drift: state.md primary artifact ${stateArtifact} is not registered in any work_index row`);
  }
  // Active/blocked rows must point at an existing primary artifact: on the filesystem
  // or inside any registered worktree (registered-tree presence counts as existence).
  if (indexBody) {
    let worktreeRoots = [];
    try {
      worktreeRoots = execSync("git worktree list --porcelain", { cwd: root, encoding: "utf8" })
        .split("\n")
        .filter((line) => line.startsWith("worktree "))
        .map((line) => line.slice("worktree ".length));
    } catch {
      worktreeRoots = [];
    }
    for (const line of indexBody.split("\n")) {
      const cells = line.split("|").map((cell) => cell.trim());
      if (cells.length < 6 || !/^\d+$/.test(cells[1])) continue;
      const rowStatus = cells[3];
      if (rowStatus !== "active" && rowStatus !== "blocked") continue;
      const artifact = stripTicks(cells[4]);
      if (!artifact || artifact.startsWith("（")) continue;
      const present = exists(artifact) || worktreeRoots.some((wt) => fs.existsSync(path.join(wt, artifact)));
      if (!present) {
        fail(`recovery surface contradiction: work_index row ${cells[1]} is ${rowStatus} but primary artifact ${artifact} exists neither in the tree nor in a registered worktree`);
      }
    }
  }
  const rootCorpus = [...listFiles(".harness").map((file) => `.harness/${file}`), "AGENTS.md", "README.md", "README.zh-CN.md"]
    .filter((file) => exists(file))
    .map((file) => read(file))
    .join("\n");
  // Reachability is plain substring matching: a basename occurrence anywhere in the root set counts as
  // a reference (bare filename references must not be flagged as orphans), which also covers exact paths.
  for (const dir of ["docs/plans", "docs/specs"]) {
    for (const file of listFiles(dir)) {
      if (!rootCorpus.includes(file)) {
        fail(`recovery surface orphan: ${dir}/${file} is referenced (exact path or basename) by no .harness/ state file, AGENTS.md or README`);
      }
    }
  }
  if (!failed) pass("recovery surface is consistent: state.md matches its registered work_index row, active/blocked primary artifacts exist, and docs/plans, docs/specs have no orphans");
}

if (failed) process.exit(1);
pass("harness-workflow structure check passed");
