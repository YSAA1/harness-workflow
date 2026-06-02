#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const source = JSON.parse(fs.readFileSync(path.join(root, "evals", "skillopt", "source.json"), "utf8"));

const usage = () => {
  console.error("Usage: node scripts/run-skillopt-train.mjs --skill <name> [--optimizer-model <model>] [--target-model <model>]");
  process.exit(2);
};

const parseArgs = (argv) => {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    if (key === "--skill" || key === "--optimizer-model" || key === "--target-model") {
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) usage();
      args[key.slice(2)] = value;
      index += 1;
      continue;
    }
    usage();
  }
  if (!args.skill) usage();
  return args;
};

const run = (command, args, options = {}) => {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? root,
    encoding: "utf8",
    stdio: options.stdio ?? "inherit",
    env: { ...process.env, ...(options.env ?? {}) },
  });
  if (result.error) {
    throw new Error(result.error.message);
  }
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed with exit code ${result.status}`);
  }
};

const main = () => {
  const args = parseArgs(process.argv.slice(2));
  const checkout = path.resolve(root, source.checkout_dir);
  const venvPython = path.resolve(root, source.venv_dir, "bin", "python");
  const python = fs.existsSync(venvPython) ? venvPython : "python";
  const skill = args.skill;
  const splitDir = path.join(root, "evals", "skillopt", "optimization", skill);
  const skillFile = path.join(root, "skills", skill, "SKILL.md");
  const outRoot = path.join(root, ".skillopt", "outputs", skill);
  const config = path.join(root, "evals", "skillopt", "harnessworkflow", "config.yaml");
  const optimizerModel = args["optimizer-model"] ?? process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6";
  const targetModel = args["target-model"] ?? optimizerModel;

  for (const required of [checkout, splitDir, skillFile, config]) {
    if (!fs.existsSync(required)) {
      throw new Error(`Missing required path: ${required}`);
    }
  }
  fs.rmSync(outRoot, { recursive: true, force: true });

  run("node", ["scripts/install-skillopt-harness.mjs"]);
  run(python, [
    "scripts/train.py",
    "--config", config,
    "--cfg-options",
    `env.split_dir=${splitDir}`,
    `env.skill_init=${skillFile}`,
    `env.out_root=${outRoot}`,
    `model.optimizer=${optimizerModel}`,
    `model.target=${targetModel}`,
    "model.optimizer_backend=claude_chat",
    "model.target_backend=claude_chat",
  ], { cwd: checkout });

  const bestSkill = path.join(outRoot, "best_skill.md");
  if (!fs.existsSync(bestSkill)) {
    throw new Error(`SkillOpt run did not produce ${bestSkill}`);
  }
  console.log(JSON.stringify({
    ok: true,
    skill,
    out_root: path.relative(root, outRoot),
    best_skill: path.relative(root, bestSkill),
  }, null, 2));
};

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
