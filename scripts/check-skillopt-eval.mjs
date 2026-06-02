#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const usage = () => {
  console.error("Usage: node scripts/check-skillopt-eval.mjs <summary.json> [--baseline <summary.json>] [--min-pass-rate 1] [--min-improvement 0]");
  process.exit(2);
};

const parseArgs = (argv) => {
  if (argv.length < 1 || argv[0].startsWith("--")) usage();
  const args = { summary: argv[0] };
  for (let index = 1; index < argv.length; index += 1) {
    const key = argv[index];
    if (!key.startsWith("--")) usage();
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) usage();
    args[key.slice(2)] = value;
    index += 1;
  }
  return args;
};

const readSummary = (summaryPath) => {
  if (!fs.existsSync(summaryPath)) {
    console.error(`Missing summary: ${summaryPath}`);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(summaryPath, "utf8"));
};

const args = parseArgs(process.argv.slice(2));
const summaryPath = path.resolve(process.cwd(), args.summary);
const summary = readSummary(summaryPath);
const minPassRate = Number(args["min-pass-rate"] ?? 1);
const minImprovement = Number(args["min-improvement"] ?? 0);
let failed = false;

const fail = (message) => {
  failed = true;
  console.error(`FAIL: ${message}`);
};
const pass = (message) => console.log(`PASS: ${message}`);

if (!Number.isFinite(minPassRate) || minPassRate < 0 || minPassRate > 1) {
  fail(`invalid --min-pass-rate: ${args["min-pass-rate"]}`);
}

if (summary.hardFailures?.length) {
  fail(`hard failures: ${summary.hardFailures.join(", ")}`);
}

if (summary.passRate < minPassRate) {
  fail(`pass rate ${summary.passRate.toFixed(4)} below required ${minPassRate}`);
}

if (args.baseline) {
  const baseline = readSummary(path.resolve(process.cwd(), args.baseline));
  const improvement = summary.totalScore - baseline.totalScore;
  if (improvement < minImprovement) {
    fail(`score improvement ${improvement} below required ${minImprovement}`);
  } else {
    pass(`score improvement ${improvement} meets required ${minImprovement}`);
  }
}

if (!failed) {
  pass(`SkillOpt eval passed: ${summary.skill}/${summary.suite} ${summary.totalScore}/${summary.maxScore}`);
}

process.exit(failed ? 1 : 0);
