#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, "..");
const activeSkills = [
  "harness-builder",
  "brainstorm",
  "plan",
  "implement",
  "diagnose",
  "review",
  "verify",
  "cleanup",
  "find-skills",
];

const args = process.argv.slice(2);
let target = process.cwd();
let dryRun = false;

for (let index = 0; index < args.length; index += 1) {
  const arg = args[index];
  if (arg === "--target") {
    const value = args[index + 1];
    if (!value) {
      console.error("FAIL: --target requires a path");
      process.exit(1);
    }
    target = value;
    index += 1;
  } else if (arg === "--dry-run") {
    dryRun = true;
  } else if (arg === "--help" || arg === "-h") {
    console.log("Usage: node scripts/install-cursor.mjs [--target TARGET_DIR] [--dry-run]");
    process.exit(0);
  } else {
    console.error(`FAIL: unknown argument ${arg}`);
    process.exit(1);
  }
}

const sourceRules = path.join(root, "rules");
const previewRules = path.join(root, ".cursor", "rules");
const sourceSkills = path.join(root, "skills");
const targetRoot = path.resolve(target);
const targetRules = path.join(targetRoot, ".cursor", "rules");
const targetSkills = path.join(targetRoot, ".cursor", "skills");

const fail = (message) => {
  console.error(`FAIL: ${message}`);
  process.exit(1);
};

if (!fs.existsSync(sourceRules)) fail(`missing source rules directory: ${sourceRules}`);
if (!fs.existsSync(previewRules)) fail(`missing project-preview rules directory: ${previewRules}`);
if (!fs.existsSync(sourceSkills)) fail(`missing source skills directory: ${sourceSkills}`);
if (!fs.existsSync(targetRoot)) fail(`target project does not exist: ${targetRoot}`);
if (!fs.statSync(targetRoot).isDirectory()) fail(`target is not a directory: ${targetRoot}`);

const copyFile = (from, to) => {
  const relativeToTarget = path.relative(targetRoot, to);
  if (dryRun) {
    console.log(`DRY-RUN copy ${path.relative(root, from)} -> ${relativeToTarget}`);
    return;
  }
  fs.mkdirSync(path.dirname(to), { recursive: true });
  const samePath = path.resolve(from).toLowerCase() === path.resolve(to).toLowerCase();
  if (!samePath) fs.copyFileSync(from, to);
  console.log(`copied ${relativeToTarget}`);
};

const copyDir = (fromDir, toDir) => {
  for (const entry of fs.readdirSync(fromDir, { withFileTypes: true })) {
    const from = path.join(fromDir, entry.name);
    const to = path.join(toDir, entry.name);
    if (entry.isDirectory()) {
      copyDir(from, to);
    } else {
      copyFile(from, to);
    }
  }
};

for (const file of fs.readdirSync(sourceRules).filter((name) => name.endsWith(".mdc")).sort()) {
  copyFile(path.join(sourceRules, file), path.join(targetRules, file));
}

for (const skill of activeSkills) {
  const source = path.join(sourceSkills, skill);
  if (!fs.existsSync(path.join(source, "SKILL.md"))) fail(`missing canonical skill: ${skill}`);
  copyDir(source, path.join(targetSkills, skill));
}

console.log(dryRun ? "Cursor adapter dry-run complete" : "Cursor adapter install complete");
console.log(`Target: ${targetRoot}`);
