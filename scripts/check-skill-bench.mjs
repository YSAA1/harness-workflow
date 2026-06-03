#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const benchDir = path.join(root, "evals", "skillopt", "bench");
const schemaPath = path.join(benchDir, "schema.json");

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, "utf8"));
const schema = readJson(schemaPath);
const requiredTop = schema.required_top_level ?? [];
const requiredCase = schema.required_case_fields ?? [];
const allowedStatus = new Set(schema.allowed_review_status ?? []);
const allowedSplit = new Set(schema.allowed_split ?? []);

const files = fs
  .readdirSync(benchDir)
  .filter((name) => name.endsWith(".json") && name !== "schema.json")
  .sort();

let failures = 0;
let totalCases = 0;

const fail = (message) => {
  failures += 1;
  console.error(`FAIL: ${message}`);
};

for (const fileName of files) {
  const filePath = path.join(benchDir, fileName);
  const data = readJson(filePath);
  for (const field of requiredTop) {
    if (!(field in data)) fail(`${fileName} missing top-level field ${field}`);
  }
  if (!allowedStatus.has(data.review_status)) {
    fail(`${fileName} has invalid review_status ${data.review_status}`);
  }
  if (!Array.isArray(data.cases) || data.cases.length === 0) {
    fail(`${fileName} must contain at least one case`);
    continue;
  }
  const seenIds = new Set();
  for (const item of data.cases) {
    totalCases += 1;
    for (const field of requiredCase) {
      if (!(field in item)) fail(`${fileName}/${item.id ?? "<missing-id>"} missing case field ${field}`);
    }
    if (seenIds.has(item.id)) fail(`${fileName} duplicate case id ${item.id}`);
    seenIds.add(item.id);
    if (!allowedSplit.has(item.split)) fail(`${fileName}/${item.id} invalid split ${item.split}`);
    if (!Array.isArray(item.expected_behavior) || item.expected_behavior.length === 0) {
      fail(`${fileName}/${item.id} expected_behavior must be a non-empty array`);
    }
    if (!Array.isArray(item.prohibited_behavior) || item.prohibited_behavior.length === 0) {
      fail(`${fileName}/${item.id} prohibited_behavior must be a non-empty array`);
    }
    if (!Array.isArray(item.scoring) || item.scoring.length === 0) {
      fail(`${fileName}/${item.id} scoring must be a non-empty array`);
    }
    if (!Array.isArray(item.failure_modes) || item.failure_modes.length === 0) {
      fail(`${fileName}/${item.id} failure_modes must be a non-empty array`);
    }
  }
  console.log(`PASS: ${fileName} ${data.cases.length} draft cases`);
}

if (failures > 0) {
  console.error(`Skill bench validation failed: ${failures} issue(s)`);
  process.exit(1);
}

console.log(`PASS: skill bench review pool validates (${files.length} skills, ${totalCases} cases)`);
