#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const sourcePath = path.join(root, "evals", "skillopt", "source.json");

const usage = () => {
  console.error("Usage: node scripts/run-skillopt-smoke.mjs [--checkout <dir>] [--python <bin>] [--out <dir>]");
  process.exit(2);
};

const parseArgs = (argv) => {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    if (key === "--checkout" || key === "--python" || key === "--out") {
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
    env: { ...process.env, ...(options.env ?? {}) },
  });
  return {
    ok: result.status === 0,
    status: result.status,
    stdout: (result.stdout ?? "").trim(),
    stderr: (result.stderr ?? "").trim(),
    error: result.error ? result.error.message : "",
  };
};

const mustRun = (command, args, options = {}) => {
  const result = run(command, args, options);
  if (!result.ok) {
    const output = [result.stdout, result.stderr, result.error].filter(Boolean).join("\n").trim();
    throw new Error(`${command} ${args.join(" ")} failed${output ? `:\n${output}` : ""}`);
  }
  return result.stdout;
};

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, "utf8"));
const resolveRepoPath = (value) => path.resolve(root, value);

const smokeBackendCode = `
from skillopt.model.backend_config import set_optimizer_backend, set_target_backend, get_optimizer_backend, get_target_backend
set_target_backend("codex_exec")
print("target_backend=" + get_target_backend())
try:
    set_optimizer_backend("codex_exec")
except ValueError as exc:
    print("optimizer_codex_exec=unsupported")
    print("optimizer_error=" + str(exc).split("\\n", 1)[0])
    set_optimizer_backend("openai_chat")
else:
    print("optimizer_codex_exec=supported")
print("optimizer_backend=" + get_optimizer_backend())
`;

const main = () => {
  const args = parseArgs(process.argv.slice(2));
  const source = readJson(sourcePath);
  const checkoutDir = resolveRepoPath(args.checkout ?? source.checkout_dir);
  const defaultPython = path.join(resolveRepoPath(source.venv_dir), "bin", "python");
  const pythonBin = args.python ?? (fs.existsSync(defaultPython) ? defaultPython : "python");
  const outDir = resolveRepoPath(args.out ?? path.join(".skillopt", "smoke", "latest"));

  if (!fs.existsSync(checkoutDir)) {
    throw new Error(`Missing SkillOpt checkout. Run: node scripts/prepare-skillopt.mjs`);
  }

  const actualCommit = mustRun("git", ["-C", checkoutDir, "rev-parse", "HEAD"]);
  if (actualCommit !== source.commit) {
    throw new Error(`SkillOpt checkout is ${actualCommit}, expected ${source.commit}`);
  }

  const backendProbe = run(pythonBin, ["-c", smokeBackendCode], { cwd: checkoutDir });
  if (!backendProbe.ok) {
    throw new Error(
      `SkillOpt import/backend probe failed. If dependencies are missing, run: node scripts/prepare-skillopt.mjs --install\n${backendProbe.stderr || backendProbe.stdout || backendProbe.error}`
    );
  }

  const trainHelp = run(pythonBin, ["scripts/train.py", "--help"], { cwd: checkoutDir });
  if (!trainHelp.ok) {
    throw new Error(`SkillOpt train entrypoint smoke failed:\n${trainHelp.stderr || trainHelp.stdout || trainHelp.error}`);
  }

  const summary = {
    schema_version: 1,
    generated_at: new Date().toISOString(),
    repo: source.repo,
    commit: source.commit,
    checkout: path.relative(root, checkoutDir),
    python: pythonBin,
    backend_probe: backendProbe.stdout.split("\n"),
    train_entrypoint_help: trainHelp.stdout.includes("SkillOpt: Executive Strategy for Self-Evolving Agent Skills"),
    no_api_key_note: source.capability_notes.no_api_key_path,
  };

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "summary.json"), `${JSON.stringify(summary, null, 2)}\n`, "utf8");
  console.log(`SkillOpt smoke passed: ${source.commit}`);
  console.log(`Summary: ${path.relative(root, path.join(outDir, "summary.json"))}`);
};

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
