#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const usage = () => {
  console.error("Usage: node scripts/run-skillopt-eval.mjs --skill <name> --skill-file <path> [--suite canary] [--out <dir>]");
  process.exit(2);
};

const parseArgs = (argv) => {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    if (!key.startsWith("--")) usage();
    const name = key.slice(2);
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) usage();
    args[name] = value;
    index += 1;
  }
  return args;
};

const timestamp = () => new Date().toISOString().replace(/[:.]/g, "-");
const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, "utf8"));
const ensureDir = (dirPath) => fs.mkdirSync(dirPath, { recursive: true });
const normalize = (text) => text.replace(/\r\n/g, "\n");

const estimateTokens = (text) => Math.ceil(text.length / 4);

const extractFrontmatter = (text) => {
  const match = text.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const out = {};
  for (const line of match[1].split("\n")) {
    const pair = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!pair) continue;
    out[pair[1]] = pair[2].replace(/^["']|["']$/g, "");
  }
  return out;
};

const checkCase = (candidateText, testCase) => {
  const frontmatter = extractFrontmatter(candidateText);
  const checks = testCase.checks.map((check) => {
    const weight = check.weight ?? 1;
    let passed = false;
    let missing = [];
    let found = [];

    if (check.type === "contains_all") {
      missing = (check.tokens ?? []).filter((token) => !candidateText.includes(token));
      passed = missing.length === 0;
    } else if (check.type === "contains_any") {
      found = (check.tokens ?? []).filter((token) => candidateText.includes(token));
      passed = found.length > 0;
      if (!passed) missing = check.tokens ?? [];
    } else if (check.type === "not_contains_any") {
      found = (check.tokens ?? []).filter((token) => candidateText.includes(token));
      passed = found.length === 0;
    } else if (check.type === "frontmatter_name") {
      passed = frontmatter.name === check.value;
      if (!passed) missing = [`frontmatter name: ${check.value}`];
      found = frontmatter.name ? [`frontmatter name: ${frontmatter.name}`] : [];
    } else {
      throw new Error(`Unsupported check type: ${check.type}`);
    }

    return {
      id: check.id,
      type: check.type,
      hard: check.hard ?? false,
      weight,
      passed,
      score: passed ? weight : 0,
      maxScore: weight,
      missing,
      found,
      notes: check.notes ?? "",
    };
  });

  const score = checks.reduce((sum, check) => sum + check.score, 0);
  const maxScore = checks.reduce((sum, check) => sum + check.maxScore, 0);
  const hardFailures = checks.filter((check) => check.hard && !check.passed).map((check) => check.id);

  return {
    id: testCase.id,
    split: testCase.split,
    prompt: testCase.prompt,
    expected_behavior: testCase.expected_behavior ?? "",
    score,
    maxScore,
    passed: hardFailures.length === 0 && score === maxScore,
    hardFailures,
    checks,
  };
};

const writeReport = (summary, reportPath) => {
  const lines = [
    `# SkillOpt eval report - ${summary.skill}`,
    "",
    `- Suite: ${summary.suite}`,
    `- Skill file: ${summary.skillFile}`,
    `- Score: ${summary.totalScore}/${summary.maxScore}`,
    `- Pass rate: ${(summary.passRate * 100).toFixed(1)}%`,
    `- Hard failures: ${summary.hardFailures.length}`,
    `- Estimated skill tokens: ${summary.estimatedSkillTokens}`,
    "",
    "## Cases",
    "",
    "| Case | Split | Score | Hard failures |",
    "| --- | --- | ---: | --- |",
  ];

  for (const item of summary.cases) {
    lines.push(`| ${item.id} | ${item.split} | ${item.score}/${item.maxScore} | ${item.hardFailures.join(", ") || "none"} |`);
  }

  lines.push("", "## Failed checks", "");
  const failures = summary.cases.flatMap((item) =>
    item.checks
      .filter((check) => !check.passed)
      .map((check) => ({ caseId: item.id, ...check }))
  );

  if (failures.length === 0) {
    lines.push("No failed checks.");
  } else {
    for (const failure of failures) {
      lines.push(`- ${failure.caseId}/${failure.id}: missing=[${failure.missing.join("; ")}] found=[${failure.found.join("; ")}]`);
    }
  }

  fs.writeFileSync(reportPath, `${lines.join("\n")}\n`, "utf8");
};

const args = parseArgs(process.argv.slice(2));
const skill = args.skill;
const suite = args.suite ?? "canary";
const skillFile = args["skill-file"];

if (!skill || !skillFile) usage();

const suitePath = path.join(root, "evals", "skillopt", "cases", skill, `${suite}.json`);
if (!fs.existsSync(suitePath)) {
  console.error(`Missing eval suite: ${suitePath}`);
  process.exit(1);
}

const absoluteSkillFile = path.resolve(root, skillFile);
if (!fs.existsSync(absoluteSkillFile)) {
  console.error(`Missing skill file: ${skillFile}`);
  process.exit(1);
}

const runDir = args.out ? path.resolve(root, args.out) : path.join(root, "docs", "skillopt", "runs", timestamp());
const latestDir = path.join(root, "docs", "skillopt", "runs", "latest");
ensureDir(runDir);

const suiteData = readJson(suitePath);
if (suiteData.skill !== skill || suiteData.suite !== suite) {
  console.error(`Suite metadata mismatch: expected ${skill}/${suite}, got ${suiteData.skill}/${suiteData.suite}`);
  process.exit(1);
}

const candidateText = normalize(fs.readFileSync(absoluteSkillFile, "utf8"));
const results = suiteData.cases.map((testCase) => checkCase(candidateText, testCase));
const totalScore = results.reduce((sum, item) => sum + item.score, 0);
const maxScore = results.reduce((sum, item) => sum + item.maxScore, 0);
const hardFailures = results.flatMap((item) => item.hardFailures.map((checkId) => `${item.id}/${checkId}`));

const summary = {
  schema_version: 1,
  generated_at: new Date().toISOString(),
  skill,
  suite,
  suitePath: path.relative(root, suitePath),
  skillFile: path.relative(root, absoluteSkillFile),
  runDir: path.relative(root, runDir),
  totalScore,
  maxScore,
  passRate: maxScore === 0 ? 0 : totalScore / maxScore,
  hardFailures,
  estimatedSkillTokens: estimateTokens(candidateText),
  cases: results,
};

fs.writeFileSync(path.join(runDir, "summary.json"), `${JSON.stringify(summary, null, 2)}\n`, "utf8");
writeReport(summary, path.join(runDir, "report.md"));

if (!args.out) {
  fs.rmSync(latestDir, { recursive: true, force: true });
  fs.cpSync(runDir, latestDir, { recursive: true });
}

console.log(`SkillOpt eval complete: ${summary.totalScore}/${summary.maxScore}`);
console.log(`Summary: ${path.relative(root, path.join(runDir, "summary.json"))}`);
if (!args.out) console.log(`Latest: ${path.relative(root, path.join(latestDir, "summary.json"))}`);
