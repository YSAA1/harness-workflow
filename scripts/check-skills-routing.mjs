#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const cwd = process.cwd();
const root = fs.existsSync(path.join(cwd, ".codex-plugin", "plugin.json"))
  ? cwd
  : path.resolve(cwd, "plugins/harness-workflow");

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
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");
const exists = (relativePath) => fs.existsSync(path.join(root, relativePath));
const skillPath = (skill) => `skills/${skill}/SKILL.md`;

function splitCells(line) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function parseTables(markdown) {
  const lines = markdown.split(/\r?\n/);
  const tables = [];
  for (let index = 0; index < lines.length - 1; index += 1) {
    if (!lines[index].trim().startsWith("|")) continue;
    if (!/^\|\s*:?-{3,}/.test(lines[index + 1].trim())) continue;

    const headers = splitCells(lines[index]);
    const rows = [];
    index += 2;
    while (index < lines.length && lines[index].trim().startsWith("|")) {
      const cells = splitCells(lines[index]);
      const row = {};
      headers.forEach((header, cellIndex) => {
        row[header] = cells[cellIndex] ?? "";
      });
      rows.push(row);
      index += 1;
    }
    tables.push({ headers, rows });
  }
  return tables;
}

function getTable(markdown, requiredHeaders, label) {
  const table = parseTables(markdown).find((candidate) =>
    requiredHeaders.every((header) => candidate.headers.includes(header)),
  );
  if (!table) fail(`${label} missing table with headers: ${requiredHeaders.join(", ")}`);
  return table ?? { rows: [] };
}

function cleanSkill(value) {
  return value.replaceAll("`", "").trim();
}

function skillList(value) {
  return value
    .split(",")
    .map(cleanSkill)
    .filter(Boolean)
    .filter((skill) => !["none", "n/a"].includes(skill.toLowerCase()));
}

function assertKnownSkill(skill, context) {
  if (removedSkills.includes(skill)) fail(`${context} references removed skill: ${skill}`);
  else if (!activeSkills.includes(skill)) fail(`${context} references unknown skill: ${skill}`);
}

function outputSection(markdown) {
  const match = markdown.match(/^## (输出契约|输出格式|Output contract)\s*$/m);
  if (!match || match.index === undefined) return "";
  const rest = markdown.slice(match.index + match[0].length);
  const next = rest.search(/^## /m);
  return (next === -1 ? rest : rest.slice(0, next)).trim();
}

function checkSkillFiles() {
  for (const skill of activeSkills) {
    const relative = skillPath(skill);
    if (!exists(relative)) {
      fail(`missing active skill: ${relative}`);
      continue;
    }

    const body = read(relative);
    if (!new RegExp(`^name:\\s*${skill.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}\\s*$`, "m").test(body)) {
      fail(`${skill} frontmatter name mismatch`);
    }
    if (!/^## (路由快照|Routing Snapshot)\s*$/m.test(body)) fail(`${skill} missing routing snapshot`);
    for (const token of ["Use when", "Do not use when", "Route to"]) {
      if (!body.includes(token)) fail(`${skill} routing snapshot missing ${token}`);
    }
    if (!outputSection(body)) fail(`${skill} missing output contract section`);

    const references = [...body.matchAll(/`(references\/[^`]+\.md)`/g)].map((match) => match[1]);
    for (const ref of references) {
      const target = `skills/${skill}/${ref}`;
      if (!exists(target)) fail(`${skill} references missing file: ${ref}`);
    }
  }
}

function checkRoutingCases() {
  const markdown = read("docs/skill-evals/routing-cases.md");
  const table = getTable(markdown, ["ID", "Situation", "Expected skill", "Not expected"], "routing-cases");
  if (table.rows.length < 20 || table.rows.length > 30) {
    fail(`routing-cases should contain 20-30 cases; found ${table.rows.length}`);
  }

  const ids = new Set();
  const covered = new Set();
  for (const row of table.rows) {
    if (!row.ID) fail("routing case missing ID");
    if (ids.has(row.ID)) fail(`duplicate routing case ID: ${row.ID}`);
    ids.add(row.ID);

    const expected = cleanSkill(row["Expected skill"]);
    assertKnownSkill(expected, `${row.ID} expected skill`);
    covered.add(expected);

    for (const forbidden of skillList(row["Not expected"])) {
      assertKnownSkill(forbidden, `${row.ID} not expected`);
      if (forbidden === expected) fail(`${row.ID} expected skill also listed as not expected: ${expected}`);
    }
  }

  for (const skill of activeSkills) {
    if (!covered.has(skill)) fail(`routing-cases do not cover expected skill: ${skill}`);
  }
}

function checkNegativeCases() {
  const markdown = read("docs/skill-evals/negative-cases.md");
  const table = getTable(markdown, ["ID", "Prompt", "Expected skill", "Forbidden skill", "Guard"], "negative-cases");
  if (table.rows.length < 8) fail(`negative-cases should contain at least 8 cases; found ${table.rows.length}`);

  for (const row of table.rows) {
    const expected = cleanSkill(row["Expected skill"]);
    assertKnownSkill(expected, `${row.ID} expected skill`);
    for (const forbidden of skillList(row["Forbidden skill"])) {
      assertKnownSkill(forbidden, `${row.ID} forbidden skill`);
      if (forbidden === expected) fail(`${row.ID} expected skill also forbidden: ${expected}`);
    }
    if (!row.Guard) fail(`${row.ID} missing guard explanation`);
  }
}

function checkOutputContracts() {
  const markdown = read("docs/skill-evals/output-contract-cases.md");
  const table = getTable(markdown, ["Skill", "Expected status prefix", "Required fields"], "output-contract-cases");
  const rowsBySkill = new Map(table.rows.map((row) => [cleanSkill(row.Skill), row]));

  for (const skill of activeSkills) {
    const row = rowsBySkill.get(skill);
    if (!row) {
      fail(`output-contract-cases missing skill: ${skill}`);
      continue;
    }

    const contract = outputSection(read(skillPath(skill)));
    const prefix = cleanSkill(row["Expected status prefix"]);
    if (!contract.includes(prefix)) fail(`${skill} output contract missing status prefix: ${prefix}`);
    for (const field of row["Required fields"].split(";").map((item) => item.trim()).filter(Boolean)) {
      if (!contract.includes(field)) fail(`${skill} output contract missing field: ${field}`);
    }
  }
}

function checkRoutingDocument() {
  const routing = read("docs/skill-routing.md");
  for (const skill of activeSkills) {
    if (!routing.includes(`\`${skill}\``)) fail(`docs/skill-routing.md missing skill token: ${skill}`);
  }
  for (const removed of removedSkills) {
    if (routing.includes(removed)) fail(`docs/skill-routing.md references removed skill: ${removed}`);
  }
}

for (const file of [
  "docs/skill-evals/routing-cases.md",
  "docs/skill-evals/negative-cases.md",
  "docs/skill-evals/output-contract-cases.md",
]) {
  if (!exists(file)) fail(`missing eval doc: ${file}`);
}

checkSkillFiles();
checkRoutingCases();
checkNegativeCases();
checkOutputContracts();
checkRoutingDocument();

if (!failed) {
  pass("skill routing evals and output contracts are consistent");
} else {
  process.exitCode = 1;
}
