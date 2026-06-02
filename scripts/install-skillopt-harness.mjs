#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const source = JSON.parse(fs.readFileSync(path.join(root, "evals", "skillopt", "source.json"), "utf8"));
const checkout = path.resolve(root, source.checkout_dir);
const adapterSource = path.join(root, "evals", "skillopt", "harnessworkflow", "adapter.py");
const adapterDir = path.join(checkout, "skillopt", "envs", "harnessworkflow");
const adapterTarget = path.join(adapterDir, "adapter.py");
const initTarget = path.join(adapterDir, "__init__.py");
const trainPath = path.join(checkout, "scripts", "train.py");

const marker = "HarnessWorkflowAdapter";

if (!fs.existsSync(checkout)) {
  console.error("Missing SkillOpt checkout. Run: node scripts/prepare-skillopt.mjs");
  process.exit(1);
}

fs.mkdirSync(adapterDir, { recursive: true });
fs.copyFileSync(adapterSource, adapterTarget);
if (!fs.existsSync(initTarget)) {
  fs.writeFileSync(initTarget, "", "utf8");
}

let train = fs.readFileSync(trainPath, "utf8");
if (!train.includes(marker)) {
  const needle = `    try:\n        from skillopt.envs.searchqa.adapter import SearchQAAdapter\n        _ENV_REGISTRY["searchqa"] = SearchQAAdapter\n    except ImportError:\n        pass\n`;
  const insert = `${needle}    try:\n        from skillopt.envs.harnessworkflow.adapter import HarnessWorkflowAdapter\n        _ENV_REGISTRY["harnessworkflow"] = HarnessWorkflowAdapter\n    except ImportError:\n        pass\n`;
  if (!train.includes(needle)) {
    console.error("Could not patch SkillOpt scripts/train.py registry; expected searchqa registration block not found.");
    process.exit(1);
  }
  train = train.replace(needle, insert);
  fs.writeFileSync(trainPath, train, "utf8");
}

console.log(JSON.stringify({
  ok: true,
  checkout: path.relative(root, checkout),
  adapter: path.relative(root, adapterTarget),
  train_registry: "harnessworkflow",
}, null, 2));
