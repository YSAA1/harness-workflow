#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const packDir = path.join(root, "evals", "plugin-eval", "metric-packs", "harness-builder-recommendation");
const manifestPath = path.join(packDir, "manifest.json");
const emitterPath = path.join(packDir, "emit-harness-builder-recommendation.mjs");
const scenarioDir = path.join(packDir, "scenarios");
const targetPath = path.join(root, "skills", "harness-builder");

const fail = (message) => {
  console.error(`FAIL: ${message}`);
  process.exitCode = 1;
};
const pass = (message) => console.log(`PASS: ${message}`);

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, "utf8"));

if (!fs.existsSync(manifestPath)) fail(`missing manifest: ${manifestPath}`);
if (!fs.existsSync(emitterPath)) fail(`missing emitter: ${emitterPath}`);
if (!fs.existsSync(scenarioDir)) fail(`missing scenarios dir: ${scenarioDir}`);

if (!process.exitCode) {
  const manifest = readJson(manifestPath);
  if (manifest.name !== "harness-builder-workbench-quality") fail("unexpected metric pack name");
  if (!Array.isArray(manifest.supportedTargetKinds) || !manifest.supportedTargetKinds.includes("skill")) {
    fail("manifest must support skill targets");
  }
  if (!Array.isArray(manifest.command) || manifest.command.length === 0) fail("manifest command is missing");
  pass("manifest validates");
}

const scenarioFiles = fs.existsSync(scenarioDir)
  ? fs.readdirSync(scenarioDir).filter((name) => name.endsWith(".json")).sort()
  : [];

if (scenarioFiles.length < 24) {
  fail(`expected at least 24 P1 scenarios, found ${scenarioFiles.length}`);
} else {
  pass(`scenario count validates (${scenarioFiles.length})`);
}

const scenarioIds = new Set();
for (const fileName of scenarioFiles) {
  const scenario = readJson(path.join(scenarioDir, fileName));
  for (const field of ["id", "kind", "user_prompt", "purpose", "required_groups", "failure_modes"]) {
    if (!(field in scenario)) fail(`${fileName} missing ${field}`);
  }
  if (scenario.kind !== "harness_builder_recommendation_scenario") fail(`${fileName} has invalid kind`);
  if (scenarioIds.has(scenario.id)) fail(`duplicate scenario id: ${scenario.id}`);
  scenarioIds.add(scenario.id);
  if (!Array.isArray(scenario.required_groups) || scenario.required_groups.length === 0) {
    fail(`${fileName} required_groups must be non-empty`);
  }
  if (!Array.isArray(scenario.failure_modes) || scenario.failure_modes.length === 0) {
    fail(`${fileName} failure_modes must be non-empty`);
  }
}

if (!process.exitCode) pass("scenario fixtures validate");

const result = spawnSync(process.execPath, [emitterPath, targetPath, "skill"], {
  cwd: root,
  encoding: "utf8",
});

if (result.status !== 0) {
  fail(`emitter exited ${result.status}: ${result.stderr || result.stdout}`);
} else {
  let payload;
  try {
    payload = JSON.parse(result.stdout);
  } catch (error) {
    fail(`emitter did not print JSON: ${error.message}`);
  }

  if (payload) {
    const checkIds = new Set();
    for (const check of payload.checks ?? []) {
      if (checkIds.has(check.id)) fail(`duplicate check id: ${check.id}`);
      checkIds.add(check.id);
      for (const field of ["id", "category", "severity", "status", "message", "evidence", "remediation"]) {
        if (!(field in check)) fail(`check ${check.id} missing ${field}`);
      }
    }
    const metricIds = new Set();
    for (const metric of payload.metrics ?? []) {
      if (metricIds.has(metric.id)) fail(`duplicate metric id: ${metric.id}`);
      metricIds.add(metric.id);
      for (const field of ["id", "category", "value", "unit", "band"]) {
        if (!(field in metric)) fail(`metric ${metric.id} missing ${field}`);
      }
    }

    const failedChecks = (payload.checks ?? []).filter((check) => check.status === "fail");
    if (failedChecks.length) fail(`emitter reported failing checks: ${failedChecks.map((check) => check.id).join(", ")}`);

    for (const requiredId of [
      "hb-boundary-task-vs-harness",
      "hb-recommendation-only-integrity",
      "hb-repo-signal-required",
      "hb-install-surface-and-approval",
      "hb-workbench-system-coverage",
      "hb-recovery-surface-discipline",
      "hb-verification-and-evidence-discipline",
      "hb-recommendation-contract-and-matrix-discipline",
      "hb-anti-entropy-and-cleanup-discipline",
      "hb-architecture-enforcement-discipline",
      "hb-subagent-orchestration-discipline",
      "hb-research-route-discipline",
      "hb-commands-ci-headless-discipline",
      "hb-language-and-output-contract",
      "hb-scenario-task-context-is-evidence-not-work-order",
      "hb-scenario-signal-bound-capability-recommendations",
      "hb-scenario-research-route-explicit-contract",
      "hb-scenario-architecture-boundary-with-baseline-ratchet",
      "hb-scenario-evidence-gate-before-questions",
      "hb-scenario-integrated-matrix-covers-core-rows",
      "hb-scenario-commands-ci-fallback-for-repeatable-workflows",
    ]) {
      if (!checkIds.has(requiredId)) fail(`missing required check id: ${requiredId}`);
    }

    for (const requiredId of [
      "hb_static_check_pass_rate",
      "hb_workbench_dimension_count",
      "hb_recovery_contract_count",
      "hb_verification_contract_count",
      "hb_entropy_contract_count",
      "hb_orchestration_contract_count",
      "hb_research_contract_count",
      "hb_matrix_contract_count",
      "hb_commands_ci_contract_count",
      "hb_p1_scenario_count",
      "hb_p1_scenario_contract_coverage_rate",
    ]) {
      if (!metricIds.has(requiredId)) fail(`missing required metric id: ${requiredId}`);
    }

    if ((payload.artifacts ?? []).filter((artifact) => artifact.id === "hb-evidence-map").length !== 1) {
      fail("expected exactly one hb-evidence-map artifact");
    }
  }
}

if (!process.exitCode) {
  pass("metric pack emitter validates");
}
