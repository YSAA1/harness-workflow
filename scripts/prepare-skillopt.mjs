#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const sourcePath = path.join(root, "evals", "skillopt", "source.json");

const usage = () => {
  console.error("Usage: node scripts/prepare-skillopt.mjs [--check] [--install] [--checkout <dir>] [--python <bin>]");
  process.exit(2);
};

const parseArgs = (argv) => {
  const args = { check: false, install: false };
  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    if (key === "--check") {
      args.check = true;
      continue;
    }
    if (key === "--install") {
      args.install = true;
      continue;
    }
    if (key === "--checkout" || key === "--python") {
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) usage();
      args[key.slice(2)] = value;
      index += 1;
      continue;
    }
    usage();
  }
  return args;
};

const run = (command, args, options = {}) => {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? root,
    encoding: "utf8",
    stdio: options.stdio ?? "pipe",
    env: { ...process.env, ...(options.env ?? {}) },
  });
  if (result.error) {
    throw new Error(`${command} ${args.join(" ")} failed: ${result.error.message}`);
  }
  if (result.status !== 0) {
    const output = [result.stdout, result.stderr].filter(Boolean).join("\n").trim();
    throw new Error(`${command} ${args.join(" ")} failed${output ? `:\n${output}` : ""}`);
  }
  return (result.stdout ?? "").trim();
};

const exists = (filePath) => fs.existsSync(filePath);
const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, "utf8"));
const resolveRepoPath = (value) => path.resolve(root, value);

const pythonVersion = (pythonBin) => {
  const code = "import sys; print(f'{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}')";
  return run(pythonBin, ["-c", code]);
};

const ensureCheckout = (source, checkoutDir, checkOnly) => {
  if (!exists(checkoutDir)) {
    if (checkOnly) {
      throw new Error(`Missing SkillOpt checkout: ${path.relative(root, checkoutDir)}`);
    }
    fs.mkdirSync(path.dirname(checkoutDir), { recursive: true });
    run("git", ["clone", source.repo, checkoutDir], { stdio: "inherit" });
  }

  if (!checkOnly) {
    run("git", ["-C", checkoutDir, "fetch", "--depth", "1", "origin", source.commit], { stdio: "inherit" });
    run("git", ["-C", checkoutDir, "checkout", "--detach", source.commit], { stdio: "inherit" });
  }

  const actual = run("git", ["-C", checkoutDir, "rev-parse", "HEAD"]);
  if (actual !== source.commit) {
    throw new Error(`SkillOpt checkout is ${actual}, expected ${source.commit}`);
  }

  for (const relPath of ["pyproject.toml", "scripts/train.py", "skillopt/model/backend_config.py", "skillopt/model/codex_harness.py"]) {
    const required = path.join(checkoutDir, relPath);
    if (!exists(required)) throw new Error(`SkillOpt checkout is missing ${relPath}`);
  }
};

const ensureVenv = (source, checkoutDir, pythonBin, install) => {
  const venvDir = resolveRepoPath(source.venv_dir);
  const venvPython = path.join(venvDir, "bin", "python");
  if (!install) return { venvDir, venvPython, installed: exists(venvPython) };

  if (!exists(venvPython)) {
    fs.mkdirSync(path.dirname(venvDir), { recursive: true });
    run(pythonBin, ["-m", "venv", venvDir], { stdio: "inherit" });
  }

  run(venvPython, ["-m", "pip", "install", "--upgrade", "pip"], { stdio: "inherit" });
  run(venvPython, ["-m", "pip", "install", "-e", checkoutDir], { stdio: "inherit" });
  return { venvDir, venvPython, installed: true };
};

const main = () => {
  const args = parseArgs(process.argv.slice(2));
  const source = readJson(sourcePath);
  const checkoutDir = resolveRepoPath(args.checkout ?? source.checkout_dir);
  const pythonBin = args.python ?? "python";

  const version = pythonVersion(pythonBin);
  const [major, minor] = version.split(".").map(Number);
  if (major < 3 || (major === 3 && minor < 10)) {
    throw new Error(`Python ${version} is too old; SkillOpt requires ${source.python}`);
  }

  ensureCheckout(source, checkoutDir, args.check);
  const venv = ensureVenv(source, checkoutDir, pythonBin, args.install);

  const summary = {
    ok: true,
    repo: source.repo,
    commit: source.commit,
    checkout: path.relative(root, checkoutDir),
    python: version,
    venv: path.relative(root, venv.venvDir),
    venv_installed: venv.installed,
    check_only: args.check,
  };
  console.log(JSON.stringify(summary, null, 2));
};

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
