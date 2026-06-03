#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const benchDir = path.join(root, "evals", "skillopt", "bench");
const docsPath = path.join(root, "docs", "skillopt", "bench-review.md");
const schemaPath = path.join(benchDir, "schema.json");
const templatePath = path.join(benchDir, "templates", "skill-bench-session.json");
const sessionsDir = path.join(benchDir, "sessions");

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, "utf8"));
const schema = readJson(schemaPath);
const requiredTop = schema.required_top_level ?? [];
const requiredDiscussion = schema.required_discussion_fields ?? [];
const requiredRequirement = schema.required_requirement_fields ?? [];
const requiredCase = schema.required_case_fields ?? [];
const allowedSessionStatus = new Set(schema.allowed_session_status ?? []);
const allowedCaseStatus = new Set(schema.allowed_case_review_status ?? []);
const allowedSplit = new Set(schema.allowed_split ?? []);

let failures = 0;
let totalSessions = 0;
let totalCases = 0;

const fail = (message) => {
  failures += 1;
  console.error(`FAIL: ${message}`);
};

const validateSession = (fileName, data) => {
  for (const field of requiredTop) {
    if (!(field in data)) fail(`${fileName} missing top-level field ${field}`);
  }
  if (!allowedSessionStatus.has(data.session_status)) {
    fail(`${fileName} has invalid session_status ${data.session_status}`);
  }
  for (const field of requiredDiscussion) {
    if (!(field in (data.discussion ?? {}))) fail(`${fileName} missing discussion field ${field}`);
  }
  if (!Array.isArray(data.target_requirements) || data.target_requirements.length === 0) {
    fail(`${fileName} must contain at least one target requirement`);
  } else {
    for (const item of data.target_requirements) {
      for (const field of requiredRequirement) {
        if (!(field in item)) fail(`${fileName}/${item.id ?? "<missing-req>"} missing requirement field ${field}`);
      }
    }
  }
  if (!Array.isArray(data.candidate_cases) || data.candidate_cases.length === 0) {
    fail(`${fileName} must contain at least one candidate case`);
    return;
  }
  const seenIds = new Set();
  for (const item of data.candidate_cases) {
    totalCases += 1;
    for (const field of requiredCase) {
      if (!(field in item)) fail(`${fileName}/${item.id ?? "<missing-id>"} missing case field ${field}`);
    }
    if (seenIds.has(item.id)) fail(`${fileName} duplicate case id ${item.id}`);
    seenIds.add(item.id);
    if (!allowedCaseStatus.has(item.review_status)) fail(`${fileName}/${item.id} invalid review_status ${item.review_status}`);
    if (!Array.isArray(item.expected_behavior) || item.expected_behavior.length === 0) {
      fail(`${fileName}/${item.id} expected_behavior must be a non-empty array`);
    }
    if (!Array.isArray(item.prohibited_behavior) || item.prohibited_behavior.length === 0) {
      fail(`${fileName}/${item.id} prohibited_behavior must be a non-empty array`);
    }
    if (!Array.isArray(item.scoring_rubric) || item.scoring_rubric.length === 0) {
      fail(`${fileName}/${item.id} scoring_rubric must be a non-empty array`);
    }
    if (!Array.isArray(item.failure_modes) || item.failure_modes.length === 0) {
      fail(`${fileName}/${item.id} failure_modes must be a non-empty array`);
    }
  }
  const splitPlan = data.split_plan ?? {};
  for (const split of ["train", "val", "test"]) {
    if (!Array.isArray(splitPlan[split])) fail(`${fileName} split_plan.${split} must be an array`);
    for (const caseId of splitPlan[split] ?? []) {
      if (!seenIds.has(caseId)) fail(`${fileName} split_plan.${split} references unknown case ${caseId}`);
    }
  }
  for (const split of Object.keys(splitPlan)) {
    if (["status", "train", "val", "test", "notes"].includes(split)) continue;
    if (!allowedSplit.has(split)) fail(`${fileName} split_plan contains unsupported split ${split}`);
  }
};

if (!fs.existsSync(docsPath)) fail("missing docs/skillopt/bench-review.md");
if (!fs.existsSync(templatePath)) fail("missing bench session template");

if (fs.existsSync(templatePath)) {
  validateSession("templates/skill-bench-session.json", readJson(templatePath));
  console.log("PASS: bench session template validates");
}

const sessionFiles = fs.existsSync(sessionsDir)
  ? fs.readdirSync(sessionsDir).filter((name) => name.endsWith(".json")).sort()
  : [];

for (const fileName of sessionFiles) {
  totalSessions += 1;
  validateSession(`sessions/${fileName}`, readJson(path.join(sessionsDir, fileName)));
  console.log(`PASS: sessions/${fileName} validates`);
}

if (failures > 0) {
  console.error(`Skill bench validation failed: ${failures} issue(s)`);
  process.exit(1);
}

console.log(`PASS: skill bench protocol validates (${totalSessions} session(s), ${totalCases} candidate case template/item(s))`);
